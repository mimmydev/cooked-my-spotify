# 🔥 Roast My Spotify - Malaysian AI Playlist Roasting

A full-stack Malaysian playlist roasting application that uses AI to analyze Spotify playlists and generate hilarious roasts with authentic Malaysian cultural humor. Built with Vue 3 frontend and serverless AWS Lambda backend featuring Claude 3 Haiku AI integration.

## ✨ Features

### 🎵 AI-Powered Malaysian Roasting

- **Cultural AI Humor**: Claude 3 Haiku trained on Malaysian slang ("lah", "wah", "alamak", "paiseh")
- **Smart Music Analysis**: Popularity scores, artist diversity, local Malaysian artist detection
- **Intelligent Fallbacks**: Graceful error handling with Malaysian humor when AI fails
- **Real-time Roasting**: Instant playlist analysis and roast generation

### 🎯 Core Functionality

- **Spotify Integration**: Real playlist data fetching via Spotify Web API
- **Duplicate Detection**: Prevents roasting the same playlist multiple times
- **Rate Limiting**: DynamoDB-powered rate limiting (10 requests/day per IP)
- **Roast Storage**: RDS MySQL database for persistent roast storage
- **Public Roast Feed**: Paginated feed of all generated roasts
- **Responsive UI**: Clean, modern interface with Malaysian flag theming

### 🏗️ Technical Features

- **Serverless Backend**: AWS Lambda with TypeScript
- **AI Integration**: AWS Bedrock (Claude 3 Haiku)
- **Database Layer**: DynamoDB + RDS MySQL
- **TypeScript**: Full type safety throughout
- **Modern Frontend**: Nuxt 3 with Vue 3 Composition API
- **Component Library**: shadcn-vue for consistent UI

## 🛠️ Tech Stack

### Frontend

- **Vue 3** with Composition API
- **Nuxt 3** framework
- **TypeScript** for type safety
- **shadcn-vue** component library
- **Tailwind CSS** for styling
- **Malaysian-themed** design elements

### Backend

- **AWS Lambda** (Node.js 22.x)
- **TypeScript** with strict mode
- **Serverless Framework** for deployment
- **AWS Bedrock** (Claude 3 Haiku)
- **Spotify Web API** integration
- **DynamoDB** for rate limiting
- **RDS MySQL** for roast storage

## 🏗️ Project Structure

```
├── frontend/                          # Nuxt 3 Vue.js Application
│   ├── app/
│   │   └── app.vue                   # Main application layout
│   ├── components/
│   │   ├── AnimatedTagline.vue       # Header with Malaysian flag animation
│   │   ├── PlaylistInput.vue         # AI roast submission form
│   │   ├── PlaylistTable.vue         # Roast results table display
│   │   └── ui/                       # shadcn-vue component library
│   ├── composables/
│   │   └── useSpotifyRoast.ts        # API integration for AI roasting
│   ├── types/
│   │   └── playlist.ts               # TypeScript interfaces
│   └── assets/css/
│       └── main.css                  # Malaysian-themed styling
│
├── backend/                           # Serverless AWS Lambda Backend
│   ├── src/
│   │   ├── handlers/
│   │   │   ├── generateRoast.ts      # Main roast generation handler
│   │   │   └── getRoastList.ts       # Public roast feed handler
│   │   ├── services/
│   │   │   ├── common/
│   │   │   │   ├── spotifyService.ts     # Spotify Web API integration
│   │   │   │   ├── bedrockService.ts     # AWS Bedrock AI integration
│   │   │   │   └── musicAnalysisService.ts # Music taste analysis engine
│   │   │   ├── dynamodb/
│   │   │   │   ├── dynamoClient.ts       # DynamoDB client setup
│   │   │   │   └── rateLimitService.ts   # Rate limiting (10/day per IP)
│   │   │   └── rds/
│   │   │       ├── connection.ts         # MySQL connection pool
│   │   │       ├── roastService.ts       # Roast storage & retrieval
│   │   │       └── playlistMetadataService.ts # Duplicate detection
│   │   ├── types/
│   │   │   └── index.ts              # Shared TypeScript interfaces
│   │   └── utils/
│   │       └── response.ts           # API response utilities
│   ├── test-*.ts                     # Comprehensive test files
│   ├── serverless.yml                # AWS deployment configuration
│   ├── package.json                  # Backend dependencies
│   └── README.md                     # Backend-specific documentation
│
└── root-files/                       # Project configuration
    ├── package.json                  # Monorepo package management
    ├── bun.lock                      # Bun package lock
    ├── commitlint.config.js          # Conventional commit linting
    └── README.md                     # This file
```

## 🚀 Quick Start

### Prerequisites

- **Frontend**: Node.js 18+ or Bun
- **Backend**: Node.js 22.x, Bun, AWS CLI configured
- **External**: Spotify Developer Account, AWS Account
- Git

### Frontend Setup

1. **Clone and navigate**

   ```bash
   git clone <repository-url>
   cd roast-my-spotify/frontend
   ```

2. **Install dependencies**

   ```bash
   # Using bun (recommended)
   bun install

   # Or using npm
   npm install
   ```

3. **Start development server**

   ```bash
   # Using bun
   bun run dev

   # Or using npm
   npm run dev
   ```

4. **Open in browser**
   Navigate to `http://localhost:3000`

### Backend Setup

1. **Navigate to backend directory**

   ```bash
   cd ../backend
   ```

2. **Install dependencies**

   ```bash
   bun install
   ```

3. **Environment Configuration**

   Create `.env` file:

   ```env
   # Spotify API
   SPOTIFY_CLIENT_ID=your_spotify_client_id
   SPOTIFY_CLIENT_SECRET=your_spotify_client_secret

   # AWS Configuration
   AWS_REGION=ap-southeast-1

   # Database (for local development)
   RDS_HOST=localhost
   RDS_USER=root
   RDS_PASSWORD=your_password
   RDS_DATABASE=roast_spotify
   RDS_PORT=3306

   # Feature Flags
   ROAST_STORAGE_ENABLED=true
   RATE_LIMITING_ENABLED=true
   ```

4. **Local Development**

   ```bash
   # Start serverless offline
   bun run dev

   # Test API endpoints
   bun run test:roast
   ```

5. **AWS Deployment**

   ```bash
   # Build and deploy
   bun run deploy:dev  # Development
   bun run deploy      # Production
   ```

### Database Setup

For local development with MySQL:

```bash
# Create database
mysql -u root -p
CREATE DATABASE roast_spotify;

# Run schema
mysql -u root -p roast_spotify < database-schema.sql
```

## Component Details

### AnimatedTagline Component

- Displays "Merdeka Day" with smooth fade-in animation
- Animated underline effect using Malaysian flag colors
- Responsive typography scaling

### PlaylistInput Component

- Large, prominent input field for Spotify playlist URLs
- Real-time URL validation
- Loading states with Malaysian-themed spinner
- Success/error feedback with proper styling
- Keyboard accessibility (Enter to submit)

### PlaylistTable Component

- Uses shadcn-vue Table components
- Columns: Playlist Name, Creator, Track Count, Date Added, Status
- Hover effects and smooth interactions
- Responsive design with proper mobile handling
- Click to open playlist in new tab
- Status indicators with color coding

## 🔌 API Documentation

### Backend Endpoints

#### POST `/api/roast` - Generate AI Roast

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
  },
  "rate_limit": {
    "remaining": 9,
    "limit": 10
  }
}
```

#### GET `/api/roasts` - Get Public Roast Feed

**Query Parameters:**

- `page` (optional): Page number (default: 1)
- `limit` (optional): Items per page (default: 10)

**Response:**

```json
{
  "roasts": [
    {
      "roast_id": "uuid",
      "playlist_spotify_id": "37i9dQZF1DX0XUsuxWHRQd",
      "user_ip_address": "192.168.1.1",
      "user_display_name": "Anonymous",
      "roast_text": "Your playlist got more Taylor Swift than local artists lah!",
      "generated_at": "2024-01-01T00:00:00.000Z",
      "playlist_metadata": {
        "name": "Today's Top Hits",
        "owner": "spotify",
        "track_count": 50,
        "avg_popularity": 92
      },
      "is_public": true
    }
  ],
  "total_count": 150,
  "page": 1,
  "limit": 10
}
```

### Error Responses

**400 Bad Request:**

```json
{
  "success": false,
  "error": "Eh, this one not Spotify playlist URL lah!",
  "code": "INVALID_URL"
}
```

**404 Not Found:**

```json
{
  "success": false,
  "error": "Playlist not found or private lah!",
  "code": "PLAYLIST_NOT_FOUND"
}
```

**429 Rate Limited:**

```json
{
  "success": false,
  "error": "Rate limit exceeded. You can make 10 requests per day. Try again tomorrow.",
  "code": "RATE_LIMIT_EXCEEDED",
  "remaining": 0
}
```

**409 Conflict (Duplicate):**

```json
{
  "success": false,
  "error": "Duplicate playlist submission detected",
  "code": "DUPLICATE_PLAYLIST",
  "duplicate_detected": true,
  "playlist_name": "Today's Top Hits",
  "original_roast_date": "Dec 25, 2024, 2:30:00 PM"
}
```

### Frontend API Integration

The app includes a composable (`useSpotifyRoast`) that handles:

- Playlist submission to backend API
- Fetching existing playlists with pagination
- Error handling and loading states
- Data transformation between backend and frontend formats
- Rate limiting feedback

## Styling

- **Malaysian Theme**: Uses Malaysia's flag colors (red, blue, yellow)
- **Dark Mode**: Full dark mode support
- **Responsive**: Mobile-first design approach
- **Modern**: Clean, SaaS-style interface
- **Animations**: Smooth transitions and loading states

## Development

### Adding New Components

1. Create component in `components/` directory
2. Add TypeScript interfaces in `types/` if needed
3. Import and use in `app.vue` or other components

### Styling Guidelines

- Use Tailwind CSS classes
- Leverage Malaysian color variables for theming
- Ensure dark mode compatibility
- Test responsive behavior

### API Integration

The `useSpotifyRoast` composable provides:

- `generateRoast(url)` - Submit new playlist
- `fetchRoasts(page, limit)` - Get existing playlists
- `isLoading`, `error`, `roasts` - Reactive state

## Browser Support

- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

MIT License - see LICENSE file for details
