-- Malaysian Spotify Roasting API - Enhanced Database Schema
-- This script creates the complete database structure for the roasting API
-- Optimized for AWS RDS MySQL 8.0 Free Tier (db.t3.micro)

-- Create database (if not exists)
CREATE DATABASE IF NOT EXISTS roast_spotify;
USE roast_spotify;

-- ===== PRIMARY ROASTS TABLE =====
-- Stores AI-generated roasts with rich playlist metadata
CREATE TABLE IF NOT EXISTS roasts (
    roast_id VARCHAR(36) PRIMARY KEY,
    playlist_spotify_id VARCHAR(255) NOT NULL,
    user_ip_address VARCHAR(45),
    user_display_name VARCHAR(255),
    roast_text TEXT NOT NULL,
    generated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    share_url VARCHAR(255) UNIQUE,
    likes_count INT DEFAULT 0,
    shares_count INT DEFAULT 0,
    is_public BOOLEAN DEFAULT TRUE,
    is_flagged BOOLEAN DEFAULT FALSE,
    
    -- Performance indexes optimized for Free Tier
    INDEX idx_generated_public (generated_at DESC, is_public),
    INDEX idx_playlist_id (playlist_spotify_id),
    INDEX idx_user_ip (user_ip_address),
    INDEX idx_user_display_name (user_display_name),
    UNIQUE INDEX idx_share_url (share_url)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ===== PLAYLIST METADATA TABLE =====
-- Separate table for rich playlist analysis data
CREATE TABLE IF NOT EXISTS playlist_metadata (
    playlist_metadata_id VARCHAR(36) PRIMARY KEY,
    playlist_spotify_id VARCHAR(255) NOT NULL,
    
    -- Core playlist info
    playlist_name VARCHAR(500),
    playlist_description TEXT,
    playlist_owner VARCHAR(255),
    
    -- Quantitative metrics
    popularity_score DECIMAL(5,2),
    cultural_diversity_metric DECIMAL(5,2),
    artist_count INT,
    track_count INT,
    local_music_count INT,
    explicit_count INT,
    
    -- Analysis results
    top_artist VARCHAR(255),
    genre_distribution JSON,
    artist_analysis JSON,
    roasting_angles JSON,
    
    -- Metadata
    metadata_fetched_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    
    -- Performance indexes
    INDEX idx_playlist_spotify_id (playlist_spotify_id),
    INDEX idx_popularity (popularity_score),
    INDEX idx_track_count (track_count),
    INDEX idx_metadata_fetched (metadata_fetched_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ===== ROAST ANALYTICS TABLE =====
-- Track roast performance and engagement
CREATE TABLE IF NOT EXISTS roast_analytics (
    analytics_id VARCHAR(36) PRIMARY KEY,
    roast_id VARCHAR(36) NOT NULL,
    
    -- Engagement metrics
    view_count INT DEFAULT 0,
    share_count INT DEFAULT 0,
    like_count INT DEFAULT 0,
    
    -- Performance tracking
    generation_time_ms INT,
    spotify_api_calls INT DEFAULT 0,
    bedrock_tokens_used INT DEFAULT 0,
    
    -- Geographic data
    user_country VARCHAR(2),
    user_region VARCHAR(100),
    
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    -- Foreign key and indexes
    FOREIGN KEY (roast_id) REFERENCES roasts(roast_id) ON DELETE CASCADE,
    INDEX idx_roast_id (roast_id),
    INDEX idx_created_at (created_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ===== JSON FIELD EXAMPLES =====
-- Example genre_distribution JSON structure:
-- {
--   "pop": 45.2,
--   "rock": 23.1,
--   "hip-hop": 15.7,
--   "electronic": 10.3,
--   "indie": 5.7
-- }

-- Example artist_analysis JSON structure:
-- {
--   "mainstream_score": 8.5,
--   "diversity_score": 6.2,
--   "repeat_artists": ["Taylor Swift", "Ed Sheeran"],
--   "unique_artists_ratio": 0.75,
--   "top_genres": ["pop", "indie-pop"],
--   "cultural_mix": "Western-dominated"
-- }

-- Example roasting_angles JSON structure:
-- [
--   "mainstream",
--   "repetitive_artists", 
--   "basic_taste",
--   "no_local_music",
--   "too_much_explicit"
-- ]

-- ===== PERFORMANCE OPTIMIZATIONS FOR FREE TIER =====
-- Create functional indexes on JSON fields (MySQL 8.0+)
ALTER TABLE playlist_metadata 
ADD INDEX idx_playlist_name ((JSON_UNQUOTE(JSON_EXTRACT(playlist_name, '$'))));

ALTER TABLE playlist_metadata 
ADD INDEX idx_top_artist ((JSON_UNQUOTE(JSON_EXTRACT(artist_analysis, '$.top_artists[0]'))));

-- ===== SAMPLE QUERIES FOR TESTING =====
-- Get recent public roasts with metadata
-- SELECT r.roast_id, r.roast_text, r.generated_at, pm.playlist_name, pm.artist_count
-- FROM roasts r 
-- LEFT JOIN playlist_metadata pm ON r.playlist_spotify_id = pm.playlist_spotify_id
-- WHERE r.is_public = true 
-- ORDER BY r.generated_at DESC 
-- LIMIT 10;

-- Get roast analytics summary
-- SELECT r.roast_id, r.generated_at, ra.view_count, ra.like_count, ra.generation_time_ms
-- FROM roasts r
-- LEFT JOIN roast_analytics ra ON r.roast_id = ra.roast_id
-- WHERE r.generated_at >= DATE_SUB(NOW(), INTERVAL 7 DAY)
-- ORDER BY ra.view_count DESC;

-- Find popular playlists by track count
-- SELECT playlist_name, track_count, artist_count, popularity_score
-- FROM playlist_metadata 
-- WHERE track_count > 50 
-- ORDER BY popularity_score DESC;

-- Malaysian music analysis
-- SELECT COUNT(*) as total_roasts,
--        AVG(pm.local_music_count) as avg_local_tracks,
--        AVG(pm.cultural_diversity_metric) as avg_diversity
-- FROM roasts r
-- JOIN playlist_metadata pm ON r.playlist_spotify_id = pm.playlist_spotify_id
-- WHERE r.generated_at >= DATE_SUB(NOW(), INTERVAL 30 DAY);

-- ===== DATABASE MAINTENANCE =====
-- Clean up old analytics data (run monthly)
-- DELETE FROM roast_analytics 
-- WHERE created_at < DATE_SUB(NOW(), INTERVAL 6 MONTH);

-- Update roast engagement counts
-- UPDATE roasts r 
-- SET likes_count = (
--     SELECT COALESCE(SUM(like_count), 0) 
--     FROM roast_analytics ra 
--     WHERE ra.roast_id = r.roast_id
-- );

-- ===== FREE TIER MONITORING QUERIES =====
-- Check database size (should stay under limits)
-- SELECT 
--     table_name,
--     ROUND(((data_length + index_length) / 1024 / 1024), 2) AS 'Size (MB)'
-- FROM information_schema.tables 
-- WHERE table_schema = 'roast_spotify'
-- ORDER BY (data_length + index_length) DESC;

-- Monitor connection usage
-- SHOW PROCESSLIST;

-- Check slow queries
-- SELECT * FROM mysql.slow_log ORDER BY start_time DESC LIMIT 10;
