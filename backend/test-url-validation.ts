// test-url-validation.ts - Test URL validation with your specific playlists
import { SpotifyService } from './src/services/spotifyService.js';

async function testUrlValidation() {
  console.log('🧪 Testing URL validation with your specific playlists...\n');

  // Your test URLs
  const testUrls = [
    'https://open.spotify.com/playlist/1msGShlus0e8yBqG9CBzi9?si=8ce6936629864275',
    'https://open.spotify.com/playlist/5WkA989Md0sF9YpoAj4tZz',
    // Additional test cases
    'https://open.spotify.com/playlist/37i9dQZF1DX0XUsuxWHRQd',
    'https://open.spotify.com/intl-en/playlist/37i9dQZF1DX0XUsuxWHRQd',
    'spotify:playlist:37i9dQZF1DX0XUsuxWHRQd',
    'https://invalid-url.com',
    'https://open.spotify.com/track/4iV5W9uYEdYUVa79Axb7Rh', // Track URL (should fail)
  ];

  try {
    const spotifyService = new SpotifyService();

    for (const url of testUrls) {
      console.log(`🔗 Testing: ${url}`);

      const result = spotifyService.validatePlaylistUrl(url);

      if (result.isValid) {
        console.log(`✅ Valid! Playlist ID: ${result.playlistId}`);
      } else {
        console.log(`❌ Invalid: ${result.error}`);
      }
      console.log('');
    }

    console.log('🎯 Testing playlist fetching with your URLs...\n');

    // Test actual playlist fetching with your URLs
    const yourUrls = [
      'https://open.spotify.com/playlist/1msGShlus0e8yBqG9CBzi9?si=8ce6936629864275',
      'https://open.spotify.com/playlist/5WkA989Md0sF9YpoAj4tZz',
    ];

    for (const url of yourUrls) {
      console.log(`🎵 Fetching playlist: ${url}`);

      const validation = spotifyService.validatePlaylistUrl(url);
      if (validation.isValid && validation.playlistId) {
        try {
          const playlistData = await spotifyService.fetchPlaylistData(validation.playlistId);
          console.log(
            `✅ Success! "${playlistData.name}" by ${playlistData.owner} (${playlistData.trackCount} tracks)`
          );

          // Show first few tracks
          if (playlistData.tracks.length > 0) {
            console.log('🎧 Sample tracks:');
            playlistData.tracks.slice(0, 3).forEach((track, i) => {
              console.log(`   ${i + 1}. "${track.name}" by ${track.artists.join(', ')}`);
            });
          }
        } catch (error: any) {
          console.log(`❌ Fetch failed: ${error.message}`);
        }
      } else {
        console.log(`❌ URL validation failed: ${validation.error}`);
      }
      console.log('');
    }
  } catch (error: any) {
    console.error('❌ Service initialization failed:', error.message);
    console.log(
      '\n💡 Make sure you have SPOTIFY_CLIENT_ID and SPOTIFY_CLIENT_SECRET in your .env file'
    );
  }

  console.log('✅ URL validation testing complete!');
}

// Run the test
testUrlValidation().catch(console.error);
