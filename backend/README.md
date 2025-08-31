# 🔥 Roast My Spotify - Malaysian Roasting API

A serverless Malaysian playlist roasting API built with AWS Lambda, Bedrock (Claude 3 Haiku), and Spotify Web API. This API analyzes Spotify playlists and generates hilarious Malaysian-style roasts with cultural humor.

## 🏗️ Architecture

```
backend/
├── src/
│   ├── handlers/
│   │   └── generateRoast.ts          # Main Lambda handler (POST /api/roast)
│   ├── services/
│   │   ├── spotifyService.ts         # Spotify Web API integration
│   │   ├── bedrockService.ts         # AWS Bedrock AI roasting
│   │   └── musicAnalysisService.ts   # Music taste analysis engine
│   ├── utils/
│   │   └── response.ts               # API response utilities
│   └── types/
│       └── index.ts                  # TypeScript interfaces
├── test-roast.ts                     # Full API endpoint testing
├── test-services.ts                  # Individual service testing
├── package.json                      # Dependencies and scripts
├── serverless.yml                    # Serverless Framework config
└── tsconfig.json                     # TypeScript configuration
```

## 🚀 Features

### ✅ Phase 1 (Current) - AI Integration

- **Real Spotify Integration**: Fetches actual playlist data via Spotify Web API
- **Advanced Music Analysis**: Popularity scores, artist diversity, local music detection
- **Malaysian Cultural AI**: Claude 3 Haiku with Malaysian slang and cultural references
- **Intelligent Fallbacks**: Smart error handling with Malaysian humor
- **Clean Architecture**: Service-based design with proper separation of concerns

### 🎯 API Endpoint

**POST** `/api/roast`

**Request:**

```json
{
  "playlist_url": "https://open.spotify.com/playlist/37i9dQZF1DX0XUsuxWHRQd"
}
```

**Response:**

```json
{
  "success": true,
  "roast": {
    "playlist_name": "Today's Top Hits",
    "track_count": 50,
    "roast_text": "Wah your playlist got 50 songs all Top 40 hits - your music taste flatter than roti canai lah! 😅",
    "created_at": "2024-01-01T00:00:00.000Z"
  },
  "insights": {
    "avgPopularity": 92,
    "localMusicCount": 0,
    "topArtist": "Taylor Swift (5 songs)",
    "isMainstream": true,
    "culturalDiversity": "Western-only",
    "roastingAngles": [
      "Super mainstream taste (92/100 popularity)",
      "Zero Malaysian artists (where's your cultural pride?)"
    ]
  }
}
```

## 🛠️ Setup & Installation

### Prerequisites

- Node.js 22.x
- Bun (package manager)
- AWS CLI configured
- Spotify Developer Account

### 1. Install Dependencies

```bash
cd backend
bun install
```

### 2. Environment Variables

Create `.env` file:

```env
SPOTIFY_CLIENT_ID=your_spotify_client_id
SPOTIFY_CLIENT_SECRET=your_spotify_client_secret
AWS_REGION=ap-southeast-1
```

### 3. Build TypeScript

```bash
bun run build
```

### 4. Test Services Locally

```bash
# Test individual services
bun run test-services.ts

# Test full API (requires serverless offline)
bun run test:roast
```

## 🧪 Development & Testing

### Local Development

```bash
# Start serverless offline
bun run dev

# Test API endpoint
bun run test:roast
```

### Service Testing

```bash
# Test individual services
bun run test-services.ts
```

### Build & Deploy

```bash
# Build TypeScript
bun run build

# Deploy to AWS
bun run deploy:dev  # Development
bun run deploy      # Production
```

## 🎵 Malaysian Roasting Features

### Cultural Intelligence

- **Local Artist Detection**: Recognizes Malaysian/SEA artists (Yuna, Siti Nurhaliza, etc.)
- **Malaysian Slang**: Natural use of "lah", "wah", "aiyah", "alamak", "paiseh"
- **Cultural References**: Mamak culture, KL traffic, pasar malam, Grab rides, TikTok

### Music Analysis Engine

- **Popularity Analysis**: 0-100 scale mainstream detection
- **Artist Diversity**: Variety vs. repetition analysis
- **Cultural Representation**: Local vs. Western music balance
- **Content Analysis**: Explicit content detection
- **Roasting Angles**: Smart insight generation for targeted humor

### AI Roasting Styles

```
Examples:
- "Wah your playlist got 5x Taylor Swift but zero Yuna? Forgot you're Malaysian ah? 😅"
- "47 songs all Top 40 hits - your music taste flatter than roti canai lah!"
- "'Study Vibes' playlist with 80% explicit content? What subject you studying wor? 🤔"
```

## 🔧 Technical Stack

- **Runtime**: Node.js 22.x with ES Modules
- **Language**: TypeScript 5.x (strict mode)
- **Framework**: Serverless Framework 4.x
- **AI**: AWS Bedrock (Claude 3 Haiku)
- **Music API**: Spotify Web API
- **Bundler**: esbuild via serverless-esbuild
- **Package Manager**: Bun

## 📊 Service Classes

### SpotifyService

- URL validation and playlist ID extraction
- Spotify Web API authentication (Client Credentials)
- Playlist metadata and track fetching
- Error handling for private/missing playlists

### BedrockService

- AWS Bedrock integration with Claude 3 Haiku
- Malaysian cultural prompt engineering
- Intelligent fallback roasting
- Temperature and token optimization

### MusicAnalysisService

- Playlist analysis for roasting insights
- Cultural diversity assessment
- Roasting angle generation
- Fallback roast creation

### Response Utilities

- Standardized API responses
- CORS handling
- Malaysian error messages
- Request logging

## 🚦 Error Handling

### Malaysian Error Messages

- **Invalid URL**: "Eh, this one not Spotify playlist URL lah!"
- **Missing URL**: "Eh, where's your playlist URL lah?"
- **Playlist Not Found**: "Playlist not found or private lah!"
- **AI Error**: "AI tak boleh roast your playlist right now. Try again later!"
- **General Error**: "Alamak! Something went wrong while roasting your playlist!"

### HTTP Status Codes

- `200`: Success with roast
- `400`: Invalid request (bad URL, missing data)
- `404`: Playlist not found or private
- `429`: Rate limiting (too many requests)
- `500`: Internal server error
- `503`: Service unavailable (Spotify/Bedrock issues)

## 🔐 Security & Configuration

### IAM Permissions

```yaml
iamRoleStatements:
  - Effect: Allow
    Action:
      - bedrock:InvokeModel
    Resource: '*'
```

### Environment Variables

- `SPOTIFY_CLIENT_ID`: Spotify app client ID
- `SPOTIFY_CLIENT_SECRET`: Spotify app client secret
- `AWS_REGION`: AWS region (ap-southeast-1)
- `NODE_ENV`: Environment (dev/prod)

## 📈 Performance

- **Lambda Timeout**: 30 seconds
- **Memory**: 256 MB
- **Cold Start**: ~2-3 seconds
- **Warm Request**: ~1-2 seconds
- **Spotify API**: ~500-1000ms
- **Bedrock AI**: ~1-3 seconds

## 🎯 Future Enhancements (Phase 2 & 3)

### Phase 2 - Database Integration

- Store roasts in DynamoDB
- Public roast feed (GET /api/roasts)
- Roast sharing and reactions

### Phase 3 - Advanced Features

- Rate limiting and caching
- User authentication
- Playlist comparison roasts
- Social media integration

## 🤝 Contributing

1. Fork the repository
2. Create feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open Pull Request

## 📝 License

This project is licensed under the MIT License.

---

**Built with ❤️ and Malaysian humor by the Roast My Spotify team**
