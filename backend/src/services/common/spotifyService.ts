import type { PlaylistData, SpotifyTrack } from '../../types/index.js';

/**
 * Service class for Spotify Web API integration
 * Handles playlist fetching, URL parsing, and authentication
 */
export class SpotifyService {
  private clientId: string;
  private clientSecret: string;

  constructor() {
    this.clientId = process.env.SPOTIFY_CLIENT_ID || '';
    this.clientSecret = process.env.SPOTIFY_CLIENT_SECRET || '';

    if (!this.clientId || !this.clientSecret) {
      throw new Error(
        'Missing Spotify credentials: SPOTIFY_CLIENT_ID and SPOTIFY_CLIENT_SECRET required'
      );
    }
  }

  /**
   * Extract playlist ID from various Spotify URL formats
   * @param url - Spotify playlist URL
   * @returns Playlist ID or null if invalid
   */
  extractPlaylistId(url: string): string | null {
    // Handle different Spotify URL formats including query parameters and international URLs
    const patterns = [
      // Standard web URLs with optional query parameters
      /open\.spotify\.com\/playlist\/([a-zA-Z0-9_-]+)(?:\?.*)?$/,
      // International URLs (e.g., intl-en)
      /open\.spotify\.com\/intl-[a-z]{2}\/playlist\/([a-zA-Z0-9_-]+)(?:\?.*)?$/,
      // Spotify URI format
      /spotify:playlist:([a-zA-Z0-9_-]+)$/,
      // Mobile app URLs
      /spotify\.com\/playlist\/([a-zA-Z0-9_-]+)(?:\?.*)?$/,
    ];

    for (const pattern of patterns) {
      const match = url.match(pattern);
      if (match && match[1]) return match[1];
    }

    return null;
  }

  /**
   * Get Spotify access token using client credentials flow
   * @returns Access token string
   */
  private async getAccessToken(): Promise<string> {
    const credentials = Buffer.from(`${this.clientId}:${this.clientSecret}`).toString('base64');

    const response = await fetch('https://accounts.spotify.com/api/token', {
      method: 'POST',
      headers: {
        Authorization: `Basic ${credentials}`,
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: 'grant_type=client_credentials',
    });

    if (!response.ok) {
      throw new Error(`Spotify auth failed: ${response.status}`);
    }

    const data = (await response.json()) as { access_token: string };
    return data.access_token;
  }

  /**
   * Fetch complete playlist data from Spotify Web API
   * @param playlistId - Spotify playlist ID
   * @returns Complete playlist data with tracks
   */
  async fetchPlaylistData(playlistId: string): Promise<PlaylistData> {
    const startTime = Date.now();
    const accessToken = await this.getAccessToken();

    // Fetch playlist metadata and tracks in parallel
    const [playlistResponse, tracksResponse] = await Promise.all([
      fetch(
        `https://api.spotify.com/v1/playlists/${playlistId}?fields=name,description,public,owner.display_name,tracks.total`,
        {
          headers: { Authorization: `Bearer ${accessToken}` },
        }
      ),
      fetch(
        `https://api.spotify.com/v1/playlists/${playlistId}/tracks?fields=items(track(name,artists(name),album(name,release_date),popularity,duration_ms,explicit))&limit=50`,
        {
          headers: { Authorization: `Bearer ${accessToken}` },
        }
      ),
    ]);

    if (!playlistResponse.ok) {
      if (playlistResponse.status === 404) {
        throw new Error('Playlist not found or private');
      }
      throw new Error(`Spotify API error: ${playlistResponse.status}`);
    }

    const playlist = (await playlistResponse.json()) as any;
    const tracks = (await tracksResponse.json()) as any;

    const apiDuration = Date.now() - startTime;

    // Debug logging for playlist owner information
    console.log('Spotify API playlist owner data:', {
      owner_object: playlist.owner,
      display_name: playlist.owner?.display_name,
      owner_id: playlist.owner?.id,
      owner_type: playlist.owner?.type,
    });

    return {
      name: playlist.name || 'Untitled Playlist',
      description: playlist.description || '',
      owner: playlist.owner?.display_name || 'Unknown',
      trackCount: playlist.tracks?.total || tracks.items.length,
      tracks: tracks.items.map(
        (item: any): SpotifyTrack => ({
          name: item.track.name,
          artists: item.track.artists?.map((artist: any) => artist.name) || [],
          album: item.track.album?.name || '',
          releaseDate: item.track.album?.release_date || '',
          popularity: item.track.popularity || 0,
          duration: item.track.duration_ms || 0,
          explicit: item.track.explicit || false,
        })
      ),
      apiDuration,
    };
  }

  /**
   * Validate Spotify playlist URL and extract ID
   * @param url - URL to validate
   * @returns Object with validation result and playlist ID
   */
  validatePlaylistUrl(url: string): {
    isValid: boolean;
    playlistId: string | null;
    error?: string;
  } {
    if (!url || typeof url !== 'string') {
      return {
        isValid: false,
        playlistId: null,
        error: "Eh, where's your playlist URL lah?",
      };
    }

    const playlistId = this.extractPlaylistId(url);

    if (!playlistId) {
      return {
        isValid: false,
        playlistId: null,
        error:
          "Eh, that's not a proper Spotify playlist URL lah! Should be like: https://open.spotify.com/playlist/...",
      };
    }

    return {
      isValid: true,
      playlistId,
    };
  }
}
