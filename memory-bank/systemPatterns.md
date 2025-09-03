# System Patterns: Roast My Spotify

## Architecture Overview

### Serverless Pattern

- **AWS Lambda Functions**: Individual handlers for specific operations
- **Event-Driven**: API Gateway triggers Lambda executions
- **Stateless Design**: No server state management required
- **Auto-Scaling**: AWS handles scaling based on demand

### Service Layer Pattern

```typescript
// Service instantiation in handlers
const spotifyService = new SpotifyService();
const bedrockService = new BedrockService();
const analysisService = new MusicAnalysisService();
const rateLimitService = new RateLimitService();
const roastStorageService = new RoastStorageService();
const playlistMetadataService = new PlaylistMetadataService();
```

### Dependency Structure

- **Handlers** → **Services** → **External APIs/Databases**
- Clean separation of concerns
- Each service handles specific domain logic
- Services are stateless and independently testable

## Key Design Patterns

### 1. Service-Oriented Architecture (SOA)

- **SpotifyService**: Handles Spotify Web API integration
- **BedrockService**: Manages AWS Bedrock AI interactions
- **MusicAnalysisService**: Analyzes playlist data for roasting insights
- **RateLimitService**: DynamoDB-based rate limiting
- **RoastStorageService**: RDS MySQL roast persistence
- **PlaylistMetadataService**: Duplicate detection and metadata management

### 2. Error Handling Pattern

```typescript
// Malaysian-themed error messages
const malaysianErrors = {
  missingUrl: 'Eh, this one not Spotify playlist URL lah!',
  invalidUrl: 'Playlist not found or private lah!',
  duplicatePlaylist: 'Duplicate playlist submission detected',
  generalError: 'Something went wrong on our side',
};

// Graceful degradation with fallbacks
try {
  roastText = await bedrockService.generateMalaysianRoastFromAnalysis(analysis);
} catch (error) {
  roastText = analysisService.generateFallbackRoast(analysis);
}
```

### 3. Rate Limiting Pattern

- **Check-then-increment approach**: Validate limits before processing
- **IP-based tracking**: Uses client IP for rate limiting
- **DynamoDB storage**: Fast read/write for rate limit counters
- **Graceful failure**: Non-blocking rate limit operations

### 4. Duplicate Prevention Pattern

```typescript
// Name-based duplicate detection
const duplicateCheck = await playlistMetadataService.checkForDuplicate(
  playlistData.name,
  playlistId
);

// Fail-safe approach
if (duplicateCheck.isDuplicate) {
  return createErrorResponse(malaysianErrors.duplicatePlaylist, 409);
}
```

### 5. Data Persistence Strategy

- **Dual Database Pattern**: DynamoDB + RDS MySQL
- **DynamoDB**: Fast rate limiting and temporary data
- **RDS MySQL**: Persistent roast storage with relationships
- **Non-blocking storage**: Request succeeds even if storage fails

## Component Architecture

### Frontend Component Structure

```
components/
├── AnimatedTagline.vue     # Header with Malaysian flag animation
├── PlaylistInput.vue       # URL input with validation
├── PlaylistTable.vue       # Roast results display
└── ui/                     # shadcn-vue component library
    ├── button/
    ├── card/
    ├── dialog/
    ├── input/
    └── table/
```

### Backend Service Structure

```
services/
├── common/
│   ├── spotifyService.ts       # Spotify Web API integration
│   ├── bedrockService.ts       # AWS Bedrock AI service
│   └── musicAnalysisService.ts # Music taste analysis
├── dynamodb/
│   └── rateLimitService.ts     # Rate limiting with DynamoDB
└── rds/
    ├── roastService.ts         # Roast storage in MySQL
    └── playlistMetadataService.ts # Duplicate detection
```

## Data Flow Patterns

### 1. Roast Generation Flow

```
User Input → URL Validation → Rate Limit Check →
Spotify API → Music Analysis → Duplicate Check →
AI Generation → Storage → Response
```

### 2. Error Propagation Flow

```
Service Error → Categorization → Malaysian Error Message →
HTTP Status Code → Client Response
```

### 3. Fallback Mechanism Flow

```
Primary AI Service → Failure Detection →
Fallback Roast Generator → Success Response
```

## Integration Patterns

### 1. Spotify API Integration

- **Client Credentials Flow**: App-level authentication
- **Error Categorization**: Specific handling for not found, private, auth errors
- **Data Transformation**: Raw Spotify data → Analysis-ready format

### 2. AWS Bedrock Integration

- **Prompt Engineering**: Malaysian cultural context in prompts
- **Error Handling**: Graceful fallback to deterministic roasts
- **Cost Optimization**: Efficient prompt design

### 3. Database Integration Patterns

```typescript
// DynamoDB Pattern
const rateCheck = await rateLimitService.checkDailyLimit(clientIp);

// RDS Pattern
const storageResult = await roastStorageService.saveRoast({
  playlistSpotifyId: playlistId,
  userIpAddress: clientIp,
  roastText: roastText,
  playlistMetadata: playlistMetadata,
});
```

## Security Patterns

### 1. Input Validation Pattern

- URL validation before processing
- Request body parsing with error handling
- IP address extraction for rate limiting

### 2. Environment Configuration Pattern

```typescript
// Feature flags
ROAST_STORAGE_ENABLED = true;
RATE_LIMITING_ENABLED = true;

// Service configuration
const rateLimitPerDay = parseInt(process.env.RATE_LIMIT_PER_DAY || '10', 10);
```

### 3. CORS Handling Pattern

```typescript
// Preflight request handling
if (event.httpMethod === 'OPTIONS') {
  return createCorsResponse();
}
```

## Performance Patterns

### 1. Response Time Optimization

- **Early validation**: Check rate limits before heavy processing
- **Parallel processing**: Independent service calls where possible
- **Caching strategy**: DynamoDB for frequently accessed rate limit data

### 2. Error Recovery Patterns

- **Fail-fast**: Early return on validation errors
- **Graceful degradation**: Fallback roasts when AI fails
- **Non-blocking operations**: Storage failures don't break requests

### 3. Resource Management

- **Connection pooling**: MySQL connections managed per Lambda
- **Service instantiation**: Per-request service instances
- **Memory optimization**: Minimal state retention

## Cultural Localization Patterns

### 1. Language Integration

- Malaysian slang embedded in error messages
- Cultural context in AI prompts
- Local artist recognition in analysis

### 2. Theme Consistency

- Malaysian flag colors throughout UI
- Cultural references in roasting logic
- Respectful but playful humor tone

## Testing Patterns

### 1. Service Testing

```bash
bun run test:roast    # End-to-end roast testing
bun run db:test       # Database connection testing
```

### 2. Environment Testing

- Local development with serverless offline
- Staging environment for integration testing
- Production deployment with monitoring

## Monitoring & Logging Patterns

### 1. Request Logging

```typescript
logRequest(event, 'Roast generation');
console.log('Processing playlist:', playlistId);
```

### 2. Error Tracking

- Detailed error categorization
- Service-specific error handling
- CloudWatch integration for production monitoring

### 3. Performance Monitoring

- Request timing logs
- Service response time tracking
- Rate limit usage monitoring

## Future Architecture Considerations

### 1. Scalability Patterns

- Redis for distributed rate limiting
- CDN integration for static assets
- Database read replicas for high availability

### 2. Observability Patterns

- Structured logging with correlation IDs
- Distributed tracing across services
- Custom metrics for business KPIs

### 3. Reliability Patterns

- Circuit breaker for external API calls
- Retry mechanisms with exponential backoff
- Health checks for service dependencies
