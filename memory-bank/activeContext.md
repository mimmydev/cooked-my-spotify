# Active Context: Roast My Spotify

## Current Work Focus

### Recently Initialized

- **Memory Bank Setup**: Just completed initial memory bank structure
- **Documentation State**: All core memory bank files created and populated
- **Project Understanding**: Full context established for future development

### Current Development State

The project appears to be in a mature development state with a complete full-stack implementation:

- ✅ **Backend Implementation**: Complete serverless backend with AWS Lambda
- ✅ **Frontend Implementation**: Nuxt 3 Vue.js application with shadcn-vue components
- ✅ **Database Layer**: Dual database setup (DynamoDB + RDS MySQL)
- ✅ **AI Integration**: AWS Bedrock with Claude 3 Haiku
- ✅ **Core Features**: Roast generation, rate limiting, duplicate prevention

## Recent Changes & Insights

### Key Implementation Patterns Discovered

1. **Dual Database Strategy**: Smart use of DynamoDB for speed + MySQL for persistence
2. **Cultural Authenticity**: Deep integration of Malaysian humor and cultural context
3. **Resilient Architecture**: Multiple fallback mechanisms and graceful error handling
4. **Service-Oriented Design**: Clean separation of concerns across services

### Technical Decisions Made

- **Bun as Package Manager**: Modern runtime choice for both frontend and backend
- **TypeScript Throughout**: Full type safety across the stack
- **Serverless Framework**: AWS Lambda deployment with serverless.yml
- **shadcn-vue Components**: Consistent UI component library
- **Tailwind CSS**: Utility-first styling with Malaysian theme colors

## Active Development Areas

### Frontend Components (Currently Open Tabs)

- `DialogContent.vue` - Part of shadcn-vue dialog system
- `PlaylistInput.vue` - Main URL input component
- `AnimatedTagline.vue` - Malaysian-themed header animation
- `PlaylistTable.vue` - Roast results display table
- `app.vue` - Main application layout

### Backend Services (Currently Open Tabs)

- `generateRoast.ts` - Main roast generation handler
- `getRoastList.ts` - Public roast feed handler
- `bedrockService.ts` - AWS Bedrock AI integration
- `spotifyService.ts` - Spotify Web API integration
- `roastService.ts` - RDS MySQL roast storage
- `rateLimitService.ts` - DynamoDB rate limiting

### Configuration Files (Currently Open Tabs)

- `nuxt.config.ts` - Nuxt 3 configuration
- `.env` - Environment variables for backend
- Various package.json files for dependencies

## Next Steps & Priorities

### Immediate Actions

1. **Memory Bank Completion**: Finish creating remaining memory bank files
2. **Project Status Assessment**: Determine current deployment state
3. **Testing Verification**: Confirm all services are working correctly
4. **Documentation Review**: Ensure all technical documentation is current

### Potential Development Areas

Based on TODO comments found in code:

1. **Race Condition Fix**: Rate limiting check-then-increment approach needs improvement
2. **User Display Name**: Currently storing playlist owner instead of actual user
3. **Duplicate Detection Enhancement**: Name-based only, could implement fuzzy matching
4. **Configuration Improvements**: Hardcoded values should be configurable
5. **Enhanced Error Logging**: More detailed logging for debugging

### Feature Considerations

1. **Mobile Optimization**: Ensure full mobile responsiveness
2. **Performance Monitoring**: Add detailed performance tracking
3. **Analytics Integration**: User behavior and usage analytics
4. **Social Sharing**: Enhanced sharing features for roasts

## Important Patterns & Preferences

### Code Style Preferences

- **TypeScript Strict Mode**: Full type safety required
- **ES Modules**: Using import/export syntax throughout
- **Async/Await**: Preferred over .then() chains
- **Error-First Approach**: Check for errors before processing
- **Malaysian Cultural Integration**: All user-facing text should include Malaysian context

### Architecture Preferences

- **Service Layer Pattern**: Keep business logic in dedicated services
- **Graceful Degradation**: Always provide fallbacks for external service failures
- **Non-Blocking Operations**: Storage and analytics shouldn't break user experience
- **Environment-Based Configuration**: Use environment variables for all configuration

### UI/UX Patterns

- **Malaysian Theme**: Red, blue, yellow colors from Malaysian flag
- **Responsive Design**: Mobile-first approach
- **Loading States**: Clear feedback during processing
- **Cultural Authenticity**: Genuine Malaysian humor, not forced

## Project Insights & Learnings

### Technical Achievements

- Successfully integrated multiple AWS services (Lambda, Bedrock, DynamoDB, RDS)
- Created culturally authentic AI system with fallback mechanisms
- Implemented sophisticated rate limiting and duplicate prevention
- Built modern, responsive frontend with excellent component architecture

### Cultural Innovation

- First Malaysian-focused AI music roasting platform
- Authentic integration of local slang and cultural references
- Respectful but playful approach to cultural humor
- Recognition and celebration of Malaysian artists

### Development Insights

- Dual database strategy provides best of both worlds (speed + persistence)
- Serverless architecture scales well for variable traffic
- TypeScript across stack significantly improves maintainability
- Comprehensive error handling creates reliable user experience

## Active Configuration

### Environment Setup

- **Node.js**: Version 18+ required
- **Package Manager**: Bun preferred, npm fallback
- **AWS Region**: ap-southeast-1 (Singapore)
- **Development Mode**: Serverless offline for local testing

### Key Environment Variables

```env
SPOTIFY_CLIENT_ID=your_spotify_client_id
SPOTIFY_CLIENT_SECRET=your_spotify_client_secret
AWS_REGION=ap-southeast-1
ROAST_STORAGE_ENABLED=true
RATE_LIMITING_ENABLED=true
```

### Active Scripts

- `bun run dev` - Start both frontend and backend
- `bun run test:roast` - Test roast generation
- `bun run deploy:dev` - Deploy to development environment
- `bun run build` - Build for production
