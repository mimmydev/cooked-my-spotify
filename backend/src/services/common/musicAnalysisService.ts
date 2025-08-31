import type { PlaylistData, MusicAnalysis } from '../../types/index.js';

/**
 * Service class for analyzing music taste and generating roasting insights
 * Handles playlist analysis for Malaysian cultural context
 */
export class MusicAnalysisService {
  /**
   * Analyze playlist data for roasting insights
   * @param playlistData - Complete playlist data from Spotify
   * @returns Music analysis with roasting angles
   */
  analyzeForRoasting(playlistData: PlaylistData): MusicAnalysis {
    const { tracks, name, trackCount } = playlistData;

    if (!tracks || tracks.length === 0) {
      throw new Error('No tracks found in playlist');
    }

    // Calculate average popularity (0-100 scale)
    const avgPopularity = Math.round(
      tracks.reduce((sum, track) => sum + track.popularity, 0) / tracks.length
    );

    // Detect Malaysian/SEA artists (basic keyword matching)
    const localMusicKeywords = [
      'malaysia',
      'malaysian',
      'kl',
      'kuala lumpur',
      'penang',
      'yuna',
      'siti nurhaliza',
      'sheila on 7',
      'agnez mo',
      'raisa',
      'afgan',
      'isyana sarasvati',
      'tulus',
      'jakarta',
      'bandung',
      'singapore',
      'thai',
      'thailand',
      'indonesia',
      'indonesian',
    ];

    const localMusicCount = tracks.filter((track) =>
      track.artists.some((artist) =>
        localMusicKeywords.some((keyword) => artist.toLowerCase().includes(keyword))
      )
    ).length;

    // Count explicit content
    const explicitCount = tracks.filter((track) => track.explicit).length;

    // Artist diversity analysis
    const artistCounts: Record<string, number> = {};
    tracks.forEach((track) => {
      track.artists.forEach((artist) => {
        artistCounts[artist] = (artistCounts[artist] || 0) + 1;
      });
    });

    const uniqueArtists = Object.keys(artistCounts).length;
    const topArtistEntry = Object.entries(artistCounts).sort(([, a], [, b]) => b - a)[0];
    const topArtist = topArtistEntry ? `${topArtistEntry[0]} (${topArtistEntry[1]} songs)` : null;

    // Roasting insights
    const isVeryMainstream = avgPopularity > 85;
    const sameArtistSpam = Boolean(topArtistEntry && topArtistEntry[1] > 5);
    const zeroLocalMusic = localMusicCount === 0;

    return {
      playlistName: name,
      trackCount,
      avgPopularity,
      localMusicCount,
      explicitCount,
      uniqueArtists,
      topArtist,
      isVeryMainstream,
      sameArtistSpam,
      zeroLocalMusic,
      sampleTracks: tracks
        .slice(0, 3)
        .map((t) => `"${t.name}" by ${t.artists.join(', ')}`)
        .join(', '),
    };
  }

  /**
   * Generate roasting angles based on analysis
   * @param analysis - Music analysis data
   * @returns Array of roasting angles
   */
  generateRoastingAngles(analysis: MusicAnalysis): string[] {
    const roastingAngles: string[] = [];

    if (analysis.isVeryMainstream) {
      roastingAngles.push(`Super mainstream taste (${analysis.avgPopularity}/100 popularity)`);
    }

    if (analysis.zeroLocalMusic) {
      roastingAngles.push("Zero Malaysian artists (where's your cultural pride?)");
    }

    if (analysis.sameArtistSpam) {
      roastingAngles.push(`${analysis.topArtist} - variety much?`);
    }

    if (analysis.explicitCount > analysis.trackCount * 0.7) {
      roastingAngles.push(`${analysis.explicitCount} explicit songs - parents will be shocked`);
    }

    if (analysis.uniqueArtists < analysis.trackCount * 0.3) {
      roastingAngles.push('Very limited artist variety - stuck in a loop much?');
    }

    if (analysis.trackCount < 10) {
      roastingAngles.push('Playlist shorter than KL traffic jam - where are the songs?');
    }

    if (analysis.trackCount > 100) {
      roastingAngles.push('Playlist longer than North-South Highway - who has time for this?');
    }

    return roastingAngles;
  }

  /**
   * Get cultural diversity assessment
   * @param analysis - Music analysis data
   * @returns Cultural diversity rating
   */
  getCulturalDiversity(analysis: MusicAnalysis): string {
    if (analysis.localMusicCount === 0) {
      return 'Western-only';
    } else if (analysis.localMusicCount < analysis.trackCount * 0.1) {
      return 'Minimal local representation';
    } else if (analysis.localMusicCount < analysis.trackCount * 0.3) {
      return 'Some local flavor';
    } else {
      return 'Good cultural mix';
    }
  }

  /**
   * Generate intelligent fallback roast based on analysis
   * @param analysis - Music analysis data
   * @returns Fallback roast message
   */
  generateFallbackRoast(analysis: MusicAnalysis): string {
    const fallbacks = [
      `Aiyo "${analysis.playlistName}" with ${analysis.trackCount} songs so ${
        analysis.isVeryMainstream ? 'mainstream' : 'mixed'
      } lah! ${analysis.zeroLocalMusic ? 'Zero local artists some more' : 'At least got some Malaysian vibes'} 😅`,
      `Wah your playlist ${
        analysis.sameArtistSpam
          ? `got ${analysis.topArtist?.split('(')[0]} on repeat`
          : 'quite variety ah'
      } - ${analysis.isVeryMainstream ? 'very predictable' : 'not bad'} taste lah!`,
      `"${analysis.playlistName}" screams ${
        analysis.avgPopularity > 90 ? 'Top 40 radio station' : 'Spotify Discover Weekly'
      } vibes - ${analysis.localMusicCount > 0 ? 'saved by local music!' : 'so Western centric!'} 🎵`,
    ];

    return (
      fallbacks[Math.floor(Math.random() * fallbacks.length)] || 'Wah, cannot generate roast lah!'
    );
  }
}
