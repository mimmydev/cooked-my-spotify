# Technical Context: Roast My Spotify

## Technology Stack Overview

### Frontend Technologies

- **Framework**: Nuxt 3 (Vue 3 with SSR/SSG capabilities)
- **Language**: TypeScript with strict type checking
- **Styling**: Tailwind CSS with custom Malaysian-themed colors
- **UI Components**: shadcn-vue component library
- **State Management**: Pinia for reactive state
- **Build Tool**: Vite (built into Nuxt 3)
- **Package Manager**: Bun (primary), npm fallback
- **Node Version**: 18+ required

### Backend Technologies

- **Runtime**: Node.js 22.x on AWS Lambda
- **Language**: TypeScript with ES modules
- **Framework**: Serverless Framework
- **API**: REST endpoints via AWS Lambda
- **AI Service**: AWS Bedrock (Claude 3 Haiku)
- **Authentication**: Spotify Client Credentials flow
- **Database**: Dual setup - DynamoDB + RDS MySQL
- **Package Manager**: Bun

### AWS Services

- **Compute**: AWS Lambda (serverless functions)
- **AI**: AWS Bedrock (Claude 3 Haiku model)
- **Database**:
  - DynamoDB (rate limiting, fast access)
  - RDS MySQL (persistent roast storage)
- **Region**: ap-southeast-1 (Singapore)

### Development Tools

- **Monorepo**: Turborepo with workspaces
- **Code Quality**:
  - ESLint with TypeScript rules
  - Prettier for code formatting
  - Oxlint for additional linting
  - Commitlint for conventional commits
- **Git Hooks**: Husky with lint-staged
- **Local Development**: Serverless Offline

## Dependencies

### Frontend Core Dependencies

```json
{
  "@pinia/nuxt": "^0.11.2",
  "@tanstack/vue-table": "^8.21.3",
  "@vueuse/core": "^13.8.0",
  "class-variance-authority": "^0.7.1",
  "clsx": "^2.1.1",
  "lucide-vue-next": "^0.542.0",
  "nuxt": "^4.0.3",
  "pinia": "^3.0.3",
  "reka-ui": "^2.5.0",
  "shadcn-nuxt": "2.2.0",
  "tailwind-merge": "^3.3.1",
  "tailwindcss": "^3.4.0",
  "vue": "^3.5.20"
}
```

### Backend Core Dependencies

```json
{
  "@aws-sdk/client-bedrock-runtime": "^3.0.0",
  "@aws-sdk/client-cloudwatch": "^3.0.0",
  "@aws-sdk/client-dynamodb": "^3.0.0",
  "@aws-sdk/client-rds": "^3.0.0",
  "@aws-sdk/lib-dynamodb": "^3.0.0",
  "dotenv": "^16.0.0",
  "mysql2": "^3.6.0",
  "uuid": "^10.0.0"
}
```

## Development Setup

### Prerequisites

- Node.js 18+ or Bun runtime
- AWS CLI configured with appropriate permissions
- Spotify Developer Account (Client ID/Secret)
- MySQL for local development (optional)

### Environment Variables

```env
# Spotify API
SPOTIFY_CLIENT_ID=your_spotify_client_id
SPOTIFY_CLIENT_SECRET=your_spotify_client_secret

# AWS Configuration
AWS_REGION=ap-southeast-1

# Database (local development)
RDS_HOST=localhost
RDS_USER=root
RDS_PASSWORD=your_password
RDS_DATABASE=roast_spotify
RDS_PORT=3306

# Feature Flags
ROAST_STORAGE_ENABLED=true
RATE_LIMITING_ENABLED=true
```

### Local Development Commands

```bash
# Frontend
cd frontend
bun install
bun run dev  # Runs on http://localhost:3000

# Backend
cd backend
bun install
bun run dev  # Serverless offline on http://localhost:3001

# Root level (uses Turborepo)
bun run dev  # Starts both frontend and backend
```

### Deployment Commands

```bash
# Backend deployment
cd backend
bun run deploy:dev    # Development environment
bun run deploy        # Production environment
bun run deploy:full   # Includes database initialization

# Frontend deployment
cd frontend
bun run build         # Static site generation
bun run generate      # Pre-rendered static files
```

## Technical Constraints

### AWS Limits

- Lambda timeout: 30 seconds max
- DynamoDB read/write capacity in free tier
- RDS t3.micro instance limitations
- Bedrock API rate limits and costs

### Performance Targets

- Roast generation: < 3 seconds end-to-end
- API response time: < 1 second for data fetching
- Frontend initial load: < 2 seconds
- Mobile responsiveness: All breakpoints

### Security Considerations

- No authentication required (anonymous usage)
- Rate limiting prevents abuse (10 requests/day per IP)
- Environment variables for sensitive data
- CORS properly configured for frontend domain
- Input validation on all endpoints

## Integration Points

### Spotify Web API

- Client Credentials flow for app-level access
- Playlist data fetching via REST API
- Track metadata and popularity scores
- Artist information and genres

### AWS Bedrock Integration

- Claude 3 Haiku model for text generation
- Malaysian cultural context in prompts
- Fallback error handling for AI failures
- Cost optimization through prompt engineering

### Database Architecture

- **DynamoDB**: Fast rate limiting lookups
- **RDS MySQL**: Persistent roast storage with relationships
- **Dual Database Strategy**: Speed + persistence

## Monitoring and Debugging

### Available Scripts

- `test:roast` - Test roast generation locally
- `db:init` - Initialize database schema
- `db:monitor` - Monitor AWS free tier usage
- `db:test` - Test database connections

### Logging Strategy

- Console logging for development
- AWS CloudWatch for production monitoring
- Error tracking for AI service failures
- Performance monitoring for response times

## Future Technical Considerations

- CDN integration for static assets
- Database connection pooling optimization
- Caching strategies for repeated playlist requests
- Mobile app development (React Native)
- Analytics integration for usage tracking
