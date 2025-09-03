# Project Brief: Roast My Spotify

## Core Purpose

A full-stack Malaysian playlist roasting application that uses AI to analyze Spotify playlists and generate hilarious roasts with authentic Malaysian cultural humor.

## Key Requirements

### Functional Requirements

- **AI-Powered Roasting**: Use Claude 3 Haiku to generate Malaysian-style humor with local slang ("lah", "wah", "alamak", "paiseh")
- **Spotify Integration**: Fetch real playlist data via Spotify Web API
- **Duplicate Prevention**: Prevent roasting the same playlist multiple times
- **Rate Limiting**: 10 requests per day per IP address using DynamoDB
- **Persistent Storage**: Store roasts in RDS MySQL database
- **Public Feed**: Paginated display of all generated roasts
- **Responsive UI**: Clean, modern interface with Malaysian flag theming

### Technical Requirements

- **Full TypeScript**: Type safety throughout frontend and backend
- **Serverless Backend**: AWS Lambda with TypeScript
- **Modern Frontend**: Nuxt 3 with Vue 3 Composition API
- **Component Library**: shadcn-vue for consistent UI
- **Database Layer**: DynamoDB for rate limiting + RDS MySQL for roast storage
- **AI Integration**: AWS Bedrock (Claude 3 Haiku)

### Cultural Requirements

- **Malaysian Identity**: Authentic Malaysian slang and cultural references
- **Visual Theme**: Malaysian flag colors (red, blue, yellow)
- **Local Music Recognition**: Detect and highlight Malaysian artists
- **Cultural Humor**: AI trained on Malaysian comedy patterns

## Success Criteria

1. Generate culturally authentic Malaysian roasts
2. Handle 10+ requests per day per user without issues
3. Prevent duplicate playlist submissions
4. Display public roast feed with pagination
5. Maintain responsive design across all devices
6. Achieve sub-3 second response times for roast generation

## Target Users

- Malaysian Spotify users looking for entertainment
- Music enthusiasts who enjoy cultural humor
- Social media users seeking shareable content
- Anyone curious about AI-generated comedy

## Project Scope

**In Scope:**

- Spotify playlist analysis and roasting
- Malaysian cultural humor generation
- Rate limiting and duplicate prevention
- Public roast feed
- Mobile-responsive design

**Out of Scope:**

- User accounts/authentication
- Playlist editing/modification
- Music streaming functionality
- Non-Malaysian cultural variants
- Real-time chat/social features
