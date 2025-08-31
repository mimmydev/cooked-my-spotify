import type { APIGatewayProxyHandler } from 'aws-lambda';
import { RoastStorageService } from '../services/rds/roastService.js';
import {
  createSuccessResponse,
  createErrorResponse,
  createCorsResponse,
  logRequest,
} from '../utils/response.js';

// Initialize service
const roastStorageService = new RoastStorageService();

export const handler: APIGatewayProxyHandler = async (event) => {
  logRequest(event, 'Get roast list');

  // Handle CORS preflight
  if (event.httpMethod === 'OPTIONS') {
    return createCorsResponse();
  }

  try {
    // Parse query parameters for pagination
    const queryParams = event.queryStringParameters || {};
    const page = parseInt(queryParams.page || '1', 10);
    const limit = parseInt(queryParams.limit || '10', 10);

    // Validate pagination parameters
    if (page < 1 || limit < 1 || limit > 50) {
      return createErrorResponse(
        'Invalid pagination parameters. Page must be >= 1, limit must be 1-50.',
        400
      );
    }

    // Get roasts from database using existing method
    const result = await roastStorageService.getPublicRoastFeed(page, limit);

    console.log(`Retrieved ${result.roasts.length} roasts from database`);

    // Debug logging for user display names in retrieved roasts
    result.roasts.forEach((roast, index) => {
      console.log(`Roast ${index + 1} user_display_name:`, {
        roast_id: roast.roast_id,
        user_display_name: roast.user_display_name,
        playlist_name: roast.playlist_metadata?.name,
        fallback_will_be_used: !roast.user_display_name,
      });
    });

    return createSuccessResponse({
      roasts: result.roasts.map((roast) => ({
        roast_id: roast.roast_id,
        roast_text: roast.roast_text,
        created_at: roast.generated_at,
        user_display_name: roast.user_display_name || 'Anonymous',
        playlist_name: roast.playlist_metadata?.name || 'Unknown Playlist',
        track_count: roast.playlist_metadata?.track_count || 0,
        playlist_spotify_id: roast.playlist_spotify_id,
        likes_count: 0, // Will be implemented later
        shares_count: 0, // Will be implemented later
      })),
      pagination: {
        page,
        limit,
        total: result.total_count,
        totalPages: Math.ceil(result.total_count / limit),
        hasNext: page * limit < result.total_count,
        hasPrev: page > 1,
      },
    });
  } catch (error: any) {
    console.error('Error getting roast list:', error);

    return createErrorResponse(
      'Failed to retrieve roasts',
      500,
      process.env.NODE_ENV === 'dev' ? error.message : undefined
    );
  }
};
