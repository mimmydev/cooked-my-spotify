import { executeQuery } from './connection.js';
import type { IPlaylistMetadata } from '../../types/index.js';

export interface IDuplicateCheckResult {
  isDuplicate: boolean;
  duplicateInfo?: {
    playlist_name: string;
    original_roast_date: string;
    roast_id?: string;
  };
}

export class PlaylistMetadataService {
  private readonly isEnabled: boolean;

  constructor() {
    // Environment-based configuration
    this.isEnabled = process.env.ROAST_STORAGE_ENABLED === 'true';
    console.log(`🔍 Playlist Metadata Service: ${this.isEnabled ? 'ENABLED' : 'DISABLED'}`);
  }

  /**
   * Check for duplicate playlists by name OR Spotify playlist ID
   * @param playlistName - The playlist name to check
   * @param spotifyPlaylistId - The Spotify playlist ID to check
   * @returns Promise<IDuplicateCheckResult>
   */
  async checkForDuplicate(
    playlistName: string,
    spotifyPlaylistId: string
  ): Promise<IDuplicateCheckResult> {
    // Development mode bypass
    if (!this.isEnabled) {
      console.log('🔍 Dev mode: Skipping duplicate check');
      return { isDuplicate: false };
    }

    try {
      console.log(`🔍 Checking for duplicates: "${playlistName}" | ID: ${spotifyPlaylistId}`);

      // Check for duplicates in both roasts table and playlist_metadata table
      // We check roasts table since that's where current data is stored
      const duplicateQuery = `
        SELECT 
          roast_id,
          playlist_spotify_id,
          generated_at,
          playlist_metadata
        FROM roasts 
        WHERE 
          playlist_spotify_id = ? 
          OR JSON_UNQUOTE(JSON_EXTRACT(playlist_metadata, '$.name')) = ?
        ORDER BY generated_at DESC 
        LIMIT 1
      `;

      const results = await executeQuery(duplicateQuery, [spotifyPlaylistId, playlistName]);

      if (results.length > 0) {
        const duplicate = results[0];
        let playlistMetadata;

        try {
          // Parse playlist metadata to get the name
          if (typeof duplicate.playlist_metadata === 'string') {
            playlistMetadata = JSON.parse(duplicate.playlist_metadata);
          } else {
            playlistMetadata = duplicate.playlist_metadata;
          }
        } catch (error) {
          console.error('Failed to parse playlist metadata for duplicate check:', error);
          playlistMetadata = { name: 'Unknown Playlist' };
        }

        console.log(`❌ Duplicate found: ${duplicate.roast_id}`);

        return {
          isDuplicate: true,
          duplicateInfo: {
            playlist_name: playlistMetadata.name || 'Unknown Playlist',
            original_roast_date: duplicate.generated_at,
            roast_id: duplicate.roast_id,
          },
        };
      }

      console.log('✅ No duplicates found');
      return { isDuplicate: false };
    } catch (error: any) {
      console.error('❌ Failed to check for duplicates:', error);
      // In case of error, allow the request to proceed (fail-safe approach)
      return { isDuplicate: false };
    }
  }

  /**
   * Save playlist metadata to the dedicated playlist_metadata table
   * @param playlistMetadata - Metadata to save
   * @param spotifyPlaylistId - Spotify playlist ID
   * @returns Promise<boolean>
   */
  async savePlaylistMetadata(
    playlistMetadata: IPlaylistMetadata,
    spotifyPlaylistId: string
  ): Promise<boolean> {
    // Development mode bypass
    if (!this.isEnabled) {
      console.log('💾 Dev mode: Skipping playlist metadata storage');
      return true;
    }

    try {
      // First check if metadata already exists for this playlist
      const existingQuery = `
        SELECT playlist_metadata_id 
        FROM playlist_metadata 
        WHERE playlist_spotify_id = ?
      `;

      const existing = await executeQuery(existingQuery, [spotifyPlaylistId]);

      if (existing.length > 0) {
        console.log(`📝 Updating existing playlist metadata for: ${spotifyPlaylistId}`);

        // Update existing record
        const updateQuery = `
          UPDATE playlist_metadata SET
            playlist_name = ?,
            playlist_description = ?,
            playlist_owner = ?,
            artist_count = ?,
            track_count = ?,
            popularity_score = ?,
            local_music_count = ?,
            explicit_count = ?,
            top_artist = ?,
            metadata_fetched_at = CURRENT_TIMESTAMP
          WHERE playlist_spotify_id = ?
        `;

        const updateParams = [
          playlistMetadata.name,
          playlistMetadata.description,
          playlistMetadata.owner,
          playlistMetadata.unique_artists,
          playlistMetadata.track_count,
          playlistMetadata.avg_popularity,
          playlistMetadata.local_music_count,
          playlistMetadata.explicit_count,
          playlistMetadata.top_artist,
          spotifyPlaylistId,
        ];

        await executeQuery(updateQuery, updateParams);
      } else {
        console.log(`📝 Creating new playlist metadata for: ${spotifyPlaylistId}`);

        // Insert new record
        const insertQuery = `
          INSERT INTO playlist_metadata (
            playlist_metadata_id,
            playlist_spotify_id,
            playlist_name,
            playlist_description,
            playlist_owner,
            artist_count,
            track_count,
            popularity_score,
            local_music_count,
            explicit_count,
            top_artist,
            metadata_fetched_at
          ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, CURRENT_TIMESTAMP)
        `;

        const insertParams = [
          `pm_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`, // Generate unique ID
          spotifyPlaylistId,
          playlistMetadata.name,
          playlistMetadata.description,
          playlistMetadata.owner,
          playlistMetadata.unique_artists,
          playlistMetadata.track_count,
          playlistMetadata.avg_popularity,
          playlistMetadata.local_music_count,
          playlistMetadata.explicit_count,
          playlistMetadata.top_artist,
        ];

        await executeQuery(insertQuery, insertParams);
      }

      console.log('✅ Playlist metadata saved successfully');
      return true;
    } catch (error: any) {
      console.error('❌ Failed to save playlist metadata:', error);
      return false;
    }
  }

  /**
   * Get playlist metadata by Spotify ID
   * @param spotifyPlaylistId - Spotify playlist ID
   * @returns Promise<IPlaylistMetadata | null>
   */
  async getPlaylistMetadata(spotifyPlaylistId: string): Promise<IPlaylistMetadata | null> {
    if (!this.isEnabled) {
      return null;
    }

    try {
      const query = `
        SELECT * FROM playlist_metadata 
        WHERE playlist_spotify_id = ?
        ORDER BY metadata_fetched_at DESC 
        LIMIT 1
      `;

      const results = await executeQuery(query, [spotifyPlaylistId]);

      if (results.length === 0) {
        return null;
      }

      const row = results[0];
      return {
        name: row.playlist_name,
        description: row.playlist_description || '',
        owner: row.playlist_owner,
        track_count: row.track_count,
        avg_popularity: row.popularity_score,
        local_music_count: row.local_music_count,
        explicit_count: row.explicit_count,
        unique_artists: row.artist_count,
        top_artist: row.top_artist,
        is_very_mainstream: row.popularity_score > 70, // Calculate based on popularity
        cultural_diversity: 'Mixed', // This would need more complex calculation
        roasting_angles: ['mainstream'], // This would need more complex calculation
      };
    } catch (error: any) {
      console.error('❌ Failed to get playlist metadata:', error);
      return null;
    }
  }
}
