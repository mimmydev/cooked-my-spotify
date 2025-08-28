// test-roast.ts - Test the complete Malaysian roasting API
async function testRoastAPI() {
  const testPlaylists = [
    'https://open.spotify.com/playlist/1msGShlus0e8yBqG9CBzi9?si=8ce6936629864275',
    'https://open.spotify.com/playlist/5WkA989Md0sF9YpoAj4tZz',
  ];

  console.log('🧪 Testing Malaysian Roasting API...\n');

  for (const playlistUrl of testPlaylists) {
    console.log(`🎧 Testing playlist: ${playlistUrl}`);
    console.log('⏳ Generating roast...');

    try {
      const response = await fetch('http://localhost:3000/dev/api/roast', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          playlist_url: playlistUrl,
        }),
      });

      const result = await response.json();

      if (result.success) {
        console.log('\n🎉 SUCCESS! Roast generated:');
        console.log('📝 Playlist:', result.roast.playlist_name);
        console.log('🔢 Track count:', result.roast.track_count);
        console.log('🔥 Roast:', result.roast.roast_text);
        console.log('\n📊 Insights:');
        console.log('- Popularity:', result.insights.avgPopularity + '/100');
        console.log('- Local music:', result.insights.localMusicCount, 'tracks');
        console.log('- Top artist:', result.insights.topArtist);
        console.log('- Cultural diversity:', result.insights.culturalDiversity);
        console.log('- Mainstream?', result.insights.isMainstream ? 'Yes' : 'No');
        if (result.insights.roastingAngles?.length > 0) {
          console.log('- Roasting angles:', result.insights.roastingAngles.join(', '));
        }
      } else {
        console.log('❌ Error:', result.message);
        console.log('Details:', result);
      }
    } catch (error: any) {
      console.error('❌ Request failed:', error.message);
    }

    console.log('────────────────────────────────────────────────────────────\n');
  }

  // Test error cases
  console.log('🧪 Testing error cases...\n');

  // Test invalid URL
  console.log('🎧 Testing invalid URL...');
  try {
    const response = await fetch('http://localhost:3000/dev/api/roast', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        playlist_url: 'https://invalid-url.com',
      }),
    });

    const result = await response.json();
    console.log('Response:', result.message);
  } catch (error: any) {
    console.error('❌ Request failed:', error.message);
  }

  console.log('────────────────────────────────────────────────────────────\n');

  // Test missing URL
  console.log('🎧 Testing missing URL...');
  try {
    const response = await fetch('http://localhost:3000/dev/api/roast', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({}),
    });

    const result = await response.json();
    console.log('Response:', result.message);
  } catch (error: any) {
    console.error('❌ Request failed:', error.message);
  }

  console.log('────────────────────────────────────────────────────────────\n');
  console.log('✅ Testing complete!');
}

// Run the test
testRoastAPI().catch(console.error);
