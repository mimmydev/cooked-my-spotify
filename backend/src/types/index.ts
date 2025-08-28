export interface RoastRequest {
  playlistInfo: string;
}

export interface RoastResponse {
  success: boolean;
  roast?: string;
  error?: string;
}

export interface APIGatewayResponse {
  statusCode: number;
  headers: {
    'Content-Type': string;
    'Access-Control-Allow-Origin': string;
    'Access-Control-Allow-Headers': string;
    'Access-Control-Allow-Methods': string;
  };
  body: string;
}

export interface SpotifyTrack {
  name: string;
  artists: string[];
  album: string;
  releaseDate: string;
  popularity: number;
  duration: number;
  explicit: boolean;
}

export interface PlaylistData {
  name: string;
  description: string;
  owner: string;
  trackCount: number;
  tracks: SpotifyTrack[];
  apiDuration: number;
}

export interface MusicAnalysis {
  playlistName: string;
  trackCount: number;
  avgPopularity: number;
  localMusicCount: number;
  explicitCount: number;
  uniqueArtists: number;
  topArtist: string | null;
  isVeryMainstream: boolean;
  sameArtistSpam: boolean;
  zeroLocalMusic: boolean;
  sampleTracks: string;
}

// Database-related interfaces

// DynamoDB Rate Limiting
export interface IRateLimitEntry {
  ip_address: string;
  request_timestamp: number;
  expiration_time: number;
}

export interface IRateLimitResult {
  allowed: boolean;
  remaining: number;
}

// RDS Roast Storage
export interface IRoast {
  roast_id: string;
  playlist_spotify_id: string;
  user_ip_address: string;
  user_display_name?: string;
  roast_text: string;
  generated_at: Date;
  playlist_metadata: IPlaylistMetadata;
  is_public: boolean;
}

export interface IPlaylistMetadata {
  name: string;
  description: string;
  owner: string;
  track_count: number;
  avg_popularity: number;
  local_music_count: number;
  explicit_count: number;
  unique_artists: number;
  top_artist: string | null;
  is_very_mainstream: boolean;
  cultural_diversity: string;
  roasting_angles: string[];
}

// Service Response Types
export interface IRoastStorageResult {
  success: boolean;
  roast_id?: string;
  error?: string;
}

export interface IPublicRoastFeed {
  roasts: IRoast[];
  total_count: number;
  page: number;
  limit: number;
}
