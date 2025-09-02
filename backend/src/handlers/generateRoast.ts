import type { APIGatewayProxyHandler } from 'aws-lambda';
import { SpotifyService } from '../services/common/spotifyService.js';
import { BedrockService } from '../services/common/bedrockService.js';
import { MusicAnalysisService } from '../services/common/musicAnalysisService.js';
import { RateLimitService } from '../services/dynamodb/rateLimitService.js';
import { RoastStorageService } from '../services/rds/roastService.js';
import { PlaylistMetadataService } from '../services/rds/playlistMetadataService.js';
import {
  createSuccessResponse,
  createErrorResponse,
  createCorsResponse,
  logRequest,
  malaysianErrors,
} from '../utils/response.js';

// Initialize services
const spotifyService = new SpotifyService();
const bedrockService = new BedrockService();
const analysisService = new MusicAnalysisService();
const rateLimitService = new RateLimitService();
const roastStorageService = new RoastStorageService();
const playlistMetadataService = new PlaylistMetadataService();

// 🎯 MAIN LAMBDA HANDLER
export const handler: APIGatewayProxyHandler = async (event) => {
  logRequest(event, 'Roast generation');

  // Handle CORS preflight
  if (event.httpMethod === 'OPTIONS') {
    return createCorsResponse();
  }

  try {
    // Get client IP for rate limiting
    const clientIp =
      event.requestContext?.identity?.sourceIp ||
      event.headers?.['x-forwarded-for']?.split(',')[0] ||
      event.headers?.['x-real-ip'] ||
      'unknown';

    // Check rate limit BEFORE processing
    // TODO: This check-then-increment approach might have race conditions in high concurrency
    // Consider implementing atomic operations or Redis-based rate limiting for better accuracy
    const rateCheck = await rateLimitService.checkDailyLimit(clientIp);
    if (!rateCheck.allowed) {
      return createErrorResponse(
        `Rate limit exceeded. You can make ${process.env.RATE_LIMIT_PER_DAY || 10} requests per day. Try again tomorrow.`,
        429,
        { remaining: rateCheck.remaining }
      );
    }

    // Parse request body
    const body = JSON.parse(event.body || '{}');
    const { playlist_url } = body;

    if (!playlist_url) {
      return createErrorResponse(malaysianErrors.missingUrl, 400);
    }

    // Validate Spotify URL and extract playlist ID
    const validation = spotifyService.validatePlaylistUrl(playlist_url);
    if (!validation.isValid) {
      return createErrorResponse(validation.error || malaysianErrors.invalidUrl, 400);
    }

    const playlistId = validation.playlistId!;
    console.log('Processing playlist:', playlistId);

    // First, we need to fetch basic playlist info to get the name for duplicate checking
    let playlistData;
    try {
      playlistData = await spotifyService.fetchPlaylistData(playlistId);
      console.log(`Fetched: "${playlistData.name}" (${playlistData.trackCount} tracks)`);
    } catch (error: any) {
      console.error('Spotify fetch error:', error.message);
      // TODO: Consider adding more detailed logging for debugging playlist fetch failures

      if (error.message.includes('not found') || error.message.includes('private')) {
        return createErrorResponse(malaysianErrors.playlistNotFound, 404);
      }

      if (error.message.includes('auth failed')) {
        return createErrorResponse(malaysianErrors.spotifyError, 503);
      }

      throw error;
    }

    // 🔍 CHECK FOR DUPLICATES (after getting playlist name but before processing)
    // TODO: Current duplicate detection only checks by name, but what about playlists with same tracks?
    // Should implement fuzzy matching or track-based hashing for better duplicate detection
    try {
      const duplicateCheck = await playlistMetadataService.checkForDuplicate(
        playlistData.name,
        playlistId
      );

      if (duplicateCheck.isDuplicate && duplicateCheck.duplicateInfo) {
        console.log(`❌ Duplicate playlist detected: "${playlistData.name}"`);

        // Format the original roast date for user-friendly display
        const originalDate = new Date(duplicateCheck.duplicateInfo.original_roast_date);
        const formattedDate = originalDate.toLocaleDateString('en-US', {
          year: 'numeric',
          month: 'long',
          day: 'numeric',
          hour: '2-digit',
          minute: '2-digit',
        });

        return createErrorResponse(
          malaysianErrors.duplicatePlaylist,
          409, // HTTP 409 Conflict
          {
            duplicate_detected: true,
            playlist_name: duplicateCheck.duplicateInfo.playlist_name,
            original_roast_date: formattedDate,
            message: 'Duplicate playlist submission detected',
            suggestion: "Try submitting a different playlist that hasn't been roasted before",
          }
        );
      }

      console.log('✅ No duplicates found, proceeding with roast generation');
    } catch (error: any) {
      console.error('⚠️ Duplicate check failed, proceeding anyway:', error);
      // Continue with processing if duplicate check fails (fail-safe approach)
    }

    // Analyze music taste for roasting
    const analysis = analysisService.analyzeForRoasting(playlistData);
    console.log('Analysis:', {
      avgPopularity: analysis.avgPopularity,
      localMusic: analysis.localMusicCount,
      topArtist: analysis.topArtist,
    });

    // Generate AI roast using Bedrock
    let roastText;
    try {
      roastText = await bedrockService.generateMalaysianRoastFromAnalysis(analysis);
      console.log('Roast generated:', roastText);
    } catch (error: any) {
      console.error('Bedrock error:', error);

      // Use intelligent fallback based on analysis
      roastText = analysisService.generateFallbackRoast(analysis);
      console.log('Using fallback roast:', roastText);
    }

    // Store roast in database (after successful generation)
    try {
      const playlistMetadata = roastStorageService.createPlaylistMetadata(
        analysis,
        playlistData.name,
        playlistData.owner,
        playlistData.description
      );

      const storageResult = await roastStorageService.saveRoast({
        playlistSpotifyId: playlistId,
        userIpAddress: clientIp,
        userDisplayName: playlistData.owner, // TODO: This is storing playlist owner, not the actual user who submitted
        // Need to figure out how to get the actual user's display name from the request
        roastText: roastText,
        playlistMetadata: playlistMetadata,
      });

      if (storageResult.success) {
        console.log(`✅ Roast stored with ID: ${storageResult.roast_id}`);
      }
    } catch (error: any) {
      console.error('Failed to store roast:', error);
      // Don't fail the request if storage fails
    }

    // Increment rate limit usage (after successful roast generation and storage)
    try {
      await rateLimitService.incrementUsage(clientIp);
    } catch (error: any) {
      console.error('Failed to increment rate limit usage:', error);
      // Don't fail the request if rate limit increment fails
    }

    // Get updated rate limit info for response
    let remainingRequests = rateCheck.remaining - 1;
    try {
      const updatedRateCheck = await rateLimitService.checkDailyLimit(clientIp);
      remainingRequests = updatedRateCheck.remaining;
    } catch (error: any) {
      console.error('Failed to get updated rate limit:', error);
    }

    // Return success response with roast and insights
    return createSuccessResponse({
      roast: {
        playlist_name: playlistData.name,
        track_count: playlistData.trackCount,
        roast_text: roastText,
        created_at: new Date().toISOString(),
      },
      insights: {
        avgPopularity: analysis.avgPopularity,
        localMusicCount: analysis.localMusicCount,
        topArtist: analysis.topArtist,
        isMainstream: analysis.isVeryMainstream,
        culturalDiversity: analysisService.getCulturalDiversity(analysis),
        roastingAngles: analysisService.generateRoastingAngles(analysis),
      },
      rate_limit: {
        remaining: remainingRequests,
        limit: parseInt(process.env.RATE_LIMIT_PER_DAY || '10', 10), // TODO: This is hardcoded, should be configurable
      },
    });
  } catch (error: any) {
    console.error('Lambda execution error:', error);

    // Handle specific error types with better categorization
    if (error.message?.includes('Missing Spotify credentials')) {
      return createErrorResponse('Spotify configuration error', 503, {
        hint: 'Check SPOTIFY_CLIENT_ID and SPOTIFY_CLIENT_SECRET environment variables',
      });
    }

    if (error.message?.includes('ThrottlingException') || error.name === 'ThrottlingException') {
      return createErrorResponse(malaysianErrors.throttled, 429);
    }

    // Handle network/timeout errors
    if (
      error.code === 'ECONNREFUSED' ||
      error.code === 'ETIMEDOUT' ||
      error.message?.includes('timeout')
    ) {
      return createErrorResponse('Service temporarily unavailable', 503, {
        retry_after: 30,
      });
    }

    // Handle validation errors
    if (error.message?.includes('validation') || error.message?.includes('invalid')) {
      return createErrorResponse('Invalid request data', 400);
    }

    return createErrorResponse(malaysianErrors.generalError, 500);
  }
};
