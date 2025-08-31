# Database Layer Implementation

This document describes the hybrid database architecture implemented for the Malaysian Spotify Roasting API.

## Architecture Overview

The system uses a **hybrid database approach**:

1. **DynamoDB** - Rate limiting (fast, scalable)
2. **RDS MySQL** - Roast storage (relational, queryable)

Both services include **environment-based toggles** for seamless development.

## 🔧 Development vs Production Behavior

### Development Mode (Current Default)

- **Rate Limiting**: Always returns `{ allowed: true, remaining: 999 }`
- **Storage**: Logs operations but doesn't actually save to database
- **Console Output**:
  - `🔧 Dev mode: Bypassing rate limit check`
  - `💾 Dev mode: Skipping roast storage`

### Production Mode (When Enabled)

- **Rate Limiting**: Enforces 10 requests per IP per day via DynamoDB
- **Storage**: Saves roasts to RDS MySQL with full metadata
- **Full Database Operations**: All services active

## 🚀 Quick Start

### 1. Environment Configuration

Update `.env` file:

```env
# Toggle database features
RATE_LIMITING_ENABLED=false  # Set to 'true' for production
ROAST_STORAGE_ENABLED=false  # Set to 'true' when RDS ready

# Rate limiting settings
RATE_LIMIT_PER_DAY=10

# RDS Configuration (update when ready)
RDS_HOST=your-rds-endpoint.amazonaws.com
RDS_USER=admin
RDS_PASSWORD=your-rds-password
RDS_DATABASE=roast_spotify
RDS_PORT=3306
```

### 2. Deploy DynamoDB Table

```bash
cd backend
bun run deploy:dev  # Creates DynamoDB table automatically
```

### 3. Set Up RDS (When Ready)

1. Create RDS MySQL instance in AWS
2. Run the schema: `mysql < database-schema.sql`
3. Update `.env` with real RDS credentials
4. Set `ROAST_STORAGE_ENABLED=true`

## 📊 Database Services

### DynamoDB Rate Limiting Service

**File**: `src/services/dynamodb/rateLimitService.ts`

**Features**:

- Environment-based bypass for development
- 10 requests per IP per day limit
- Automatic TTL cleanup (24 hours)
- Graceful fallbacks on errors

**Usage**:

```typescript
const rateLimitService = new RateLimitService();

// Check if IP can make request
const check = await rateLimitService.checkDailyLimit(clientIp);
if (!check.allowed) {
  // Return 429 error
}

// Increment usage after successful request
await rateLimitService.incrementUsage(clientIp);
```

### RDS Roast Storage Service

**File**: `src/services/rds/roastService.ts`

**Features**:

- Environment-based bypass for development
- Rich metadata storage (JSON)
- Public roast feed with pagination
- Individual roast retrieval

**Usage**:

```typescript
const roastStorageService = new RoastStorageService();

// Save roast
const result = await roastStorageService.saveRoast({
  playlistSpotifyId: 'playlist_id',
  userIpAddress: 'client_ip',
  roastText: 'Your playlist is...',
  playlistMetadata: metadata,
});

// Get public feed
const feed = await roastStorageService.getPublicRoastFeed(1, 10);
```

## 🏗️ Infrastructure

### DynamoDB Table: `daily-roast-limits`

**Schema**:

- **Partition Key**: `ip_address` (String)
- **Sort Key**: `request_timestamp` (Number)
- **TTL**: `expiration_time` (24 hours)
- **Billing**: Pay-per-request (free tier friendly)

**Access Pattern**:

```
Query: ip_address = "1.2.3.4" AND request_timestamp > (now - 24h)
Count items to check if < 10
```

### RDS MySQL Table: `roasts`

**Schema**:

```sql
CREATE TABLE roasts (
    roast_id VARCHAR(36) PRIMARY KEY,
    playlist_spotify_id VARCHAR(255),
    user_ip_address VARCHAR(45),
    roast_text TEXT,
    generated_at DATETIME,
    playlist_metadata JSON,
    is_public BOOLEAN DEFAULT TRUE
);
```

**Metadata Structure**:

```json
{
  "name": "My Playlist",
  "owner": "spotify_user",
  "track_count": 25,
  "avg_popularity": 75,
  "local_music_count": 3,
  "top_artist": "Taylor Swift",
  "is_very_mainstream": true,
  "cultural_diversity": "Mixed",
  "roasting_angles": ["mainstream", "repetitive"]
}
```

## 🔄 Integration Flow

The database layer is integrated into `generateRoast` handler:

1. **Rate Check** (before processing)

   ```typescript
   const rateCheck = await rateLimitService.checkDailyLimit(clientIp);
   if (!rateCheck.allowed) return 429;
   ```

2. **Existing Roasting Logic** (unchanged)
   - Spotify API calls
   - Music analysis
   - AI roast generation

3. **Storage** (after successful roast)

   ```typescript
   await roastStorageService.saveRoast(roastData);
   await rateLimitService.incrementUsage(clientIp);
   ```

4. **Response** (includes rate limit info)
   ```json
   {
     "roast": { ... },
     "insights": { ... },
     "rate_limit": {
       "remaining": 9,
       "limit": 10
     }
   }
   ```

## 🧪 Testing

### Development Testing

```bash
# Test with current bypassed mode
curl -X POST http://localhost:3000/api/roast \
  -H "Content-Type: application/json" \
  -d '{"playlist_url": "https://open.spotify.com/playlist/..."}'

# Should see bypass messages in logs
```

### Production Testing

1. Set `RATE_LIMITING_ENABLED=true`
2. Make 11 requests from same IP
3. 11th request should return 429

## 🔒 Security & Best Practices

### Rate Limiting

- IP-based (handles proxies via X-Forwarded-For)
- Graceful degradation on DynamoDB failures
- Non-blocking errors (doesn't break roasting)

### Data Storage

- IP addresses stored for rate limiting only
- Public roasts by default (privacy-conscious)
- Rich metadata for future analytics

### Error Handling

- Database failures don't break core functionality
- Comprehensive logging for debugging
- Idempotent operations

## 📈 Monitoring

### Key Metrics to Watch

- DynamoDB read/write units
- RDS connection pool usage
- Rate limit hit rates
- Storage success rates

### Logs to Monitor

- `🔧 Dev mode: Bypassing...` (development)
- `✅ Rate limit usage incremented` (production)
- `💾 Roast stored with ID: ...` (production)
- Error logs for database failures

## 🚀 Production Deployment

### Phase 1: DynamoDB Rate Limiting

1. Deploy with current settings
2. Test in development
3. Set `RATE_LIMITING_ENABLED=true` for production
4. Monitor rate limiting effectiveness

### Phase 2: RDS Storage

1. Create RDS MySQL instance
2. Run database schema
3. Update environment variables
4. Set `ROAST_STORAGE_ENABLED=true`
5. Monitor storage operations

## 🔧 Troubleshooting

### Common Issues

**DynamoDB Access Denied**:

- Check IAM permissions in `serverless.yml`
- Verify table exists in correct region

**RDS Connection Failed**:

- Check security groups (Lambda needs access)
- Verify credentials in `.env`
- Check VPC configuration if using private subnets

**Rate Limiting Not Working**:

- Verify `RATE_LIMITING_ENABLED=true`
- Check DynamoDB table exists
- Monitor CloudWatch logs for errors

### Debug Commands

```bash
# Check TypeScript compilation
bun run build

# Test local development
bun run dev

# Deploy and check resources
bun run deploy:dev
```

## 📝 Future Enhancements

### Potential Improvements

1. **Analytics Dashboard** - Query stored roasts for insights
2. **User Accounts** - Replace IP-based limiting with user accounts
3. **Roast Sharing** - Public URLs for individual roasts
4. **Advanced Rate Limiting** - Different limits for different endpoints
5. **Caching Layer** - Redis for frequently accessed roasts

### Scaling Considerations

- DynamoDB auto-scales with demand
- RDS can be upgraded to larger instances
- Connection pooling optimized for Lambda
- Consider read replicas for high query loads
