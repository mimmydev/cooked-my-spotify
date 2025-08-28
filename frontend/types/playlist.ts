export interface Playlist {
  id: string;
  name: string;
  creator: string;
  trackCount: number;
  dateAdded: Date;
  status: 'Active' | 'Processing' | 'Error';
  url: string;
  roastText?: string;
}

export interface PlaylistSubmission {
  url: string;
  timestamp: Date;
}

export interface RoastInsights {
  avgPopularity: number;
  localMusicCount: number;
  topArtist: string;
  isMainstream: boolean;
  culturalDiversity: number;
  roastingAngles: string[];
}

export interface RoastResponse {
  roast: {
    playlist_name: string;
    track_count: number;
    roast_text: string;
    created_at: string;
  };
  insights: RoastInsights;
  rate_limit: {
    remaining: number;
    limit: number;
  };
}

export interface RoastListResponse {
  roasts: {
    roast_id: string;
    roast_text: string;
    created_at: string;
    user_display_name: string;
    playlist_name: string;
    track_count: number;
    playlist_spotify_id: string;
    likes_count: number;
    shares_count: number;
  }[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
}
