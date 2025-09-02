import { v4 as uuidv4 } from 'uuid';
import { executeQuery } from './connection.js';
import type {
  IRoast,
  IPlaylistMetadata,
  IRoastStorageResult,
  IPublicRoastFeed,
  MusicAnalysis,
} from '../../types/index.js';

export class RoastStorageService {
  private readonly isEnabled: boolean;
  private tablesInitialized: boolean = false;

  constructor() {
    // Environment-based configuration
    this.isEnabled = process.env.ROAST_STORAGE_ENABLED === 'true';
    console.log(`💾 Roast Storage Service: ${this.isEnabled ? 'ENABLED' : 'DISABLED'}`);
  }

  /**
   * Initialize database tables if they don't exist
   */
  private async initializeTables(): Promise<void> {
    if (!this.isEnabled || this.tablesInitialized) {
      return;
    }

    try {
      console.log('🔧 Initializing database tables...');

      // Create roasts table
      const createRoastsTable = `
        CREATE TABLE IF NOT EXISTS roasts (
          roast_id VARCHAR(36) PRIMARY KEY,
          playlist_spotify_id VARCHAR(255) NOT NULL,
          user_ip_address VARCHAR(45),
          user_display_name VARCHAR(255),
          roast_text TEXT NOT NULL,
          generated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
          playlist_metadata JSON,
          is_public BOOLEAN DEFAULT TRUE,
          INDEX idx_generated_public (generated_at DESC, is_public),
          INDEX idx_playlist_id (playlist_spotify_id)
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
      `;

      await executeQuery(createRoastsTable);
      console.log('✅ Roasts table ready');

      this.tablesInitialized = true;
    } catch (error: any) {
      console.error('❌ Failed to initialize tables:', error);
      // Don't throw - allow service to continue with degraded functionality
    }
  }

  /**
   * Save a roast to the database
   * @param roastData - Roast data to save
   * @returns Promise<IRoastStorageResult>
   */
  async saveRoast(roastData: {
    playlistSpotifyId: string;
    userIpAddress: string;
    userDisplayName?: string;
    roastText: string;
    playlistMetadata: IPlaylistMetadata;
  }): Promise<IRoastStorageResult> {
    // Development mode bypass
    if (!this.isEnabled) {
      console.log('💾 Dev mode: Skipping roast storage');
      return { success: true, roast_id: 'dev-mode-id' };
    }

    try {
      // Initialize tables if needed
      await this.initializeTables();

      const roastId = uuidv4();
      const now = new Date();

      const query = `
        INSERT INTO roasts (
          roast_id, 
          playlist_spotify_id, 
          user_ip_address, 
          user_display_name,
          roast_text, 
          generated_at, 
          playlist_metadata, 
          is_public
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)
      `;

      const params = [
        roastId,
        roastData.playlistSpotifyId,
        roastData.userIpAddress,
        roastData.userDisplayName || null,
        roastData.roastText,
        now,
        JSON.stringify(roastData.playlistMetadata),
        true, // Default to public
      ];

      // Debug logging for user display name storage
      console.log('Storing roast with user display name:', {
        roast_id: roastId,
        user_display_name: roastData.userDisplayName,
        playlist_spotify_id: roastData.playlistSpotifyId,
        playlist_name: roastData.playlistMetadata?.name,
      });

      await executeQuery(query, params);

      console.log(`✅ Roast saved successfully: ${roastId}`);
      return { success: true, roast_id: roastId };
    } catch (error: any) {
      console.error('Failed to save roast:', error);
      return { success: false, error: error.message };
    }
  }

  /**
   * Get public roast feed with pagination
   * @param page - Page number (1-based)
   * @param limit - Number of roasts per page
   * @returns Promise<IPublicRoastFeed>
   */
  async getPublicRoastFeed(page: number = 1, limit: number = 10): Promise<IPublicRoastFeed> {
    // Development mode bypass
    if (!this.isEnabled) {
      console.log('💾 Dev mode: Returning empty roast feed');
      return { roasts: [], total_count: 0, page, limit };
    }

    try {
      // Initialize tables if needed
      await this.initializeTables();

      const offset = Math.floor((page - 1) * limit);

      // Get total count
      const countQuery = 'SELECT COUNT(*) as total FROM roasts WHERE is_public = true';
      const countResult = await executeQuery(countQuery);
      const totalCount = countResult[0]?.total || 0;

      // Get roasts with pagination
      // TODO: Test this pagination implementation to ensure it works correctly with large datasets
      const query = `
        SELECT
          roast_id,
          playlist_spotify_id,
          user_ip_address,
          user_display_name,
          roast_text,
          generated_at,
          playlist_metadata,
          is_public
        FROM roasts
        WHERE is_public = true
        ORDER BY generated_at DESC
        LIMIT ? OFFSET ?
      `;

      const roasts = await executeQuery(query, [limit, offset]);

      // Transform results
      const transformedRoasts: IRoast[] = roasts.map((row: any) => {
        let playlistMetadata;
        try {
          // Handle both string and object cases
          if (typeof row.playlist_metadata === 'string') {
            playlistMetadata = JSON.parse(row.playlist_metadata);
          } else if (typeof row.playlist_metadata === 'object') {
            playlistMetadata = row.playlist_metadata;
          } else {
            playlistMetadata = {};
          }
        } catch (error) {
          console.error('Failed to parse playlist_metadata:', error);
          playlistMetadata = {};
        }

        return {
          roast_id: row.roast_id,
          playlist_spotify_id: row.playlist_spotify_id,
          user_ip_address: row.user_ip_address,
          user_display_name: row.user_display_name,
          roast_text: row.roast_text,
          generated_at: row.generated_at,
          playlist_metadata: playlistMetadata,
          is_public: row.is_public,
        };
      });

      console.log(`📖 Retrieved ${transformedRoasts.length} roasts (page ${page})`);

      return {
        roasts: transformedRoasts,
        total_count: totalCount,
        page,
        limit,
      };
    } catch (error: any) {
      console.error('Failed to get roast feed:', error);
      return { roasts: [], total_count: 0, page, limit };
    }
  }

  /**
   * Get a specific roast by ID
   * @param roastId - Roast ID to retrieve
   * @returns Promise<IRoast | null>
   */
  async getRoastById(roastId: string): Promise<IRoast | null> {
    // Development mode bypass
    if (!this.isEnabled) {
      console.log('💾 Dev mode: Returning null for roast lookup');
      return null;
    }

    try {
      const query = `
        SELECT 
          roast_id,
          playlist_spotify_id,
          user_ip_address,
          roast_text,
          generated_at,
          playlist_metadata,
          is_public
        FROM roasts 
        WHERE roast_id = ? AND is_public = true
      `;

      const results = await executeQuery(query, [roastId]);

      if (results.length === 0) {
        return null;
      }

      const row = results[0];
      return {
        roast_id: row.roast_id,
        playlist_spotify_id: row.playlist_spotify_id,
        user_ip_address: row.user_ip_address,
        roast_text: row.roast_text,
        generated_at: row.generated_at,
        playlist_metadata: JSON.parse(row.playlist_metadata),
        is_public: row.is_public,
      };
    } catch (error: any) {
      console.error('Failed to get roast by ID:', error);
      return null;
    }
  }

  /**
   * Helper method to create playlist metadata from music analysis
   * @param analysis - Music analysis data
   * @param playlistName - Playlist name
   * @param playlistOwner - Playlist owner
   * @param description - Playlist description
   * @returns IPlaylistMetadata
   */
  createPlaylistMetadata(
    analysis: MusicAnalysis,
    playlistName: string,
    playlistOwner: string,
    description: string = ''
  ): IPlaylistMetadata {
    return {
      name: playlistName,
      description,
      owner: playlistOwner,
      track_count: analysis.trackCount,
      avg_popularity: analysis.avgPopularity,
      local_music_count: analysis.localMusicCount,
      explicit_count: analysis.explicitCount,
      unique_artists: analysis.uniqueArtists,
      top_artist: analysis.topArtist,
      is_very_mainstream: analysis.isVeryMainstream,
      cultural_diversity: 'Mixed', // This would be calculated from analysis
      roasting_angles: ['mainstream', 'repetitive'], // This would be derived from analysis
    };
  }
}
