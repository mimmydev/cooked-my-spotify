/**
 * Test script to verify user_display_name is being properly stored and retrieved
 * Run this to test the fix for the "Anonymous" issue
 */

import { SpotifyService } from './src/services/common/spotifyService.js';
import { RoastStorageService } from './src/services/rds/roastService.js';
import { MusicAnalysisService } from './src/services/common/musicAnalysisService.js';

// Test playlist URLs - replace with actual Spotify playlist URLs
const TEST_PLAYLIST_URLS = [
  'https://open.spotify.com/playlist/37i9dQZF1DXcBWIGoYBM5M', // Today's Top Hits
  'https://open.spotify.com/playlist/37i9dQZF1DX0XUsuxWHRQd', // RapCaviar
];

async function testUserDisplayNameFix() {
  console.log('🧪 Testing user_display_name fix...\n');

  const spotifyService = new SpotifyService();
  const roastStorageService = new RoastStorageService();
  const analysisService = new MusicAnalysisService();

  for (const playlistUrl of TEST_PLAYLIST_URLS) {
    try {
      console.log(`\n📋 Testing playlist: ${playlistUrl}`);

      // Step 1: Validate URL and extract playlist ID
      const validation = spotifyService.validatePlaylistUrl(playlistUrl);
      if (!validation.isValid) {
        console.log(`❌ Invalid URL: ${validation.error}`);
        continue;
      }

      const playlistId = validation.playlistId!;
      console.log(`✅ Playlist ID: ${playlistId}`);

      // Step 2: Fetch playlist data from Spotify
      console.log('🎵 Fetching playlist data from Spotify...');
      const playlistData = await spotifyService.fetchPlaylistData(playlistId);

      console.log(`📊 Playlist Info:
        - Name: ${playlistData.name}
        - Owner: ${playlistData.owner}
        - Track Count: ${playlistData.trackCount}`);

      // Step 3: Analyze playlist for roasting
      const analysis = analysisService.analyzeForRoasting(playlistData);

      // Step 4: Create playlist metadata
      const playlistMetadata = roastStorageService.createPlaylistMetadata(
        analysis,
        playlistData.name,
        playlistData.owner,
        playlistData.description
      );

      // Step 5: Test saving roast with user display name
      console.log('💾 Testing roast storage...');
      const storageResult = await roastStorageService.saveRoast({
        playlistSpotifyId: playlistId,
        userIpAddress: '127.0.0.1',
        userDisplayName: playlistData.owner, // This should now be passed correctly
        roastText: `Test roast for ${playlistData.name}`,
        playlistMetadata: playlistMetadata,
      });

      if (storageResult.success) {
        console.log(`✅ Roast stored with ID: ${storageResult.roast_id}`);

        // Step 6: Test retrieving roasts to verify user_display_name
        console.log('📖 Testing roast retrieval...');
        const roastFeed = await roastStorageService.getPublicRoastFeed(1, 5);

        const savedRoast = roastFeed.roasts.find((r) => r.roast_id === storageResult.roast_id);
        if (savedRoast) {
          console.log(`✅ Retrieved roast:
            - ID: ${savedRoast.roast_id}
            - User Display Name: ${savedRoast.user_display_name}
            - Playlist Name: ${savedRoast.playlist_metadata?.name}
            - Will show as Anonymous: ${!savedRoast.user_display_name ? 'YES ❌' : 'NO ✅'}`);
        } else {
          console.log('❌ Could not find saved roast in feed');
        }
      } else {
        console.log(`❌ Failed to store roast: ${storageResult.error}`);
      }
    } catch (error: any) {
      console.error(`❌ Error testing playlist ${playlistUrl}:`, error.message);
    }
  }

  console.log('\n🏁 Test completed!');
}

// Run the test
testUserDisplayNameFix().catch(console.error);
