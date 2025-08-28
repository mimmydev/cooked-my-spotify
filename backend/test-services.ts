// test-services.ts - Test individual services locally
import { SpotifyService } from './src/services/spotifyService.js';
import { BedrockService } from './src/services/bedrockService.js';
import { MusicAnalysisService } from './src/services/musicAnalysisService.js';

async function testServices() {
  console.log('🧪 Testing individual services...\n');

  // Test Spotify URL validation
  console.log('1️⃣ Testing Spotify URL validation...');
  const spotifyService = new SpotifyService();

  const validUrl = 'https://open.spotify.com/playlist/1msGShlus0e8yBqG9CBzi9';
  const invalidUrl = 'https://invalid-url.com';

  const validResult = spotifyService.validatePlaylistUrl(validUrl);
  const invalidResult = spotifyService.validatePlaylistUrl(invalidUrl);

  console.log('✅ Valid URL:', validResult);
  console.log('❌ Invalid URL:', invalidResult);
  console.log();

  // Test Bedrock service with simple roast
  console.log('2️⃣ Testing Bedrock service...');
  try {
    const bedrockService = new BedrockService();
    const simpleRoast = await bedrockService.generateMalaysianRoast(
      'Taylor Swift playlist on repeat'
    );
    console.log('🔥 Simple roast:', simpleRoast);
  } catch (error: any) {
    console.log('❌ Bedrock error (using fallback):', error.message);
  }
  console.log();

  // Test Music Analysis service with mock data
  console.log('3️⃣ Testing Music Analysis service...');
  const analysisService = new MusicAnalysisService();

  const mockPlaylistData = {
    name: 'Test Playlist',
    description: 'A test playlist',
    owner: 'Test User',
    trackCount: 10,
    tracks: [
      {
        name: 'Song 1',
        artists: ['Taylor Swift'],
        album: 'Album 1',
        releaseDate: '2023-01-01',
        popularity: 95,
        duration: 180000,
        explicit: false,
      },
      {
        name: 'Song 2',
        artists: ['Yuna'],
        album: 'Album 2',
        releaseDate: '2023-02-01',
        popularity: 70,
        duration: 200000,
        explicit: false,
      },
      {
        name: 'Song 3',
        artists: ['Taylor Swift'],
        album: 'Album 3',
        releaseDate: '2023-03-01',
        popularity: 90,
        duration: 190000,
        explicit: true,
      },
    ],
    apiDuration: 1000,
  };

  const analysis = analysisService.analyzeForRoasting(mockPlaylistData);
  console.log('📊 Analysis result:', {
    playlistName: analysis.playlistName,
    avgPopularity: analysis.avgPopularity,
    localMusicCount: analysis.localMusicCount,
    topArtist: analysis.topArtist,
    isVeryMainstream: analysis.isVeryMainstream,
  });

  const roastingAngles = analysisService.generateRoastingAngles(analysis);
  console.log('🎯 Roasting angles:', roastingAngles);

  const culturalDiversity = analysisService.getCulturalDiversity(analysis);
  console.log('🌍 Cultural diversity:', culturalDiversity);

  const fallbackRoast = analysisService.generateFallbackRoast(analysis);
  console.log('🔥 Fallback roast:', fallbackRoast);

  console.log('\n✅ Service testing complete!');
}

// Run the test
testServices().catch(console.error);
