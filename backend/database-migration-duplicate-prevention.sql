-- Migration: Add duplicate prevention for playlist submissions
-- This migration adds constraints and indexes to prevent duplicate playlist roasts

USE roast_spotify;

-- Step 1: Add unique constraint on playlist_spotify_id to prevent exact duplicates
-- Note: This will fail if there are existing duplicates, so we handle that first

-- Check for existing duplicates and remove them (keeping the most recent)
DELETE r1 FROM roasts r1
INNER JOIN roasts r2 
WHERE r1.playlist_spotify_id = r2.playlist_spotify_id 
  AND r1.generated_at < r2.generated_at;

-- Now add the unique constraint
ALTER TABLE roasts 
ADD CONSTRAINT uk_playlist_spotify_id UNIQUE (playlist_spotify_id);

-- Step 2: Add a new column for tracking when a playlist can be re-roasted
ALTER TABLE roasts 
ADD COLUMN next_roast_allowed_at DATETIME DEFAULT NULL AFTER generated_at;

-- Step 3: Create index for efficient duplicate checking
CREATE INDEX idx_playlist_next_roast ON roasts (playlist_spotify_id, next_roast_allowed_at);

-- Step 4: Update existing records to allow re-roasting after 24 hours
UPDATE roasts 
SET next_roast_allowed_at = DATE_ADD(generated_at, INTERVAL 24 HOUR)
WHERE next_roast_allowed_at IS NULL;

-- Step 5: Add a view for easy duplicate checking
CREATE OR REPLACE VIEW active_playlist_roasts AS
SELECT 
    roast_id,
    playlist_spotify_id,
    user_ip_address,
    roast_text,
    generated_at,
    next_roast_allowed_at,
    CASE 
        WHEN next_roast_allowed_at IS NULL OR NOW() >= next_roast_allowed_at 
        THEN 'AVAILABLE' 
        ELSE 'COOLDOWN' 
    END as roast_status,
    CASE 
        WHEN next_roast_allowed_at IS NOT NULL AND NOW() < next_roast_allowed_at
        THEN TIMESTAMPDIFF(SECOND, NOW(), next_roast_allowed_at)
        ELSE 0
    END as cooldown_seconds_remaining
FROM roasts 
WHERE is_public = true;

-- Verification queries (for testing)
-- SELECT COUNT(*) as total_roasts FROM roasts;
-- SELECT COUNT(*) as available_for_reroast FROM active_playlist_roasts WHERE roast_status = 'AVAILABLE';
-- SELECT COUNT(*) as in_cooldown FROM active_playlist_roasts WHERE roast_status = 'COOLDOWN';
