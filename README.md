# Merdeka Day Spotify Playlist App

A single-page Vue 3 application celebrating Malaysia's Independence Day with Spotify playlist submissions and display.

## Features

- **Animated Header**: "Merdeka Day" tagline with smooth underline animation
- **Playlist Submission**: Enhanced input form with loading states and validation
- **Playlist Table**: Clean table display with status indicators and responsive design
- **Malaysian Theme**: Cultural styling with Malaysia's flag colors
- **TypeScript Support**: Full type safety throughout the application
- **Responsive Design**: Works seamlessly on desktop, tablet, and mobile

## Tech Stack

- **Vue 3** with Composition API
- **Nuxt 3** framework
- **TypeScript** for type safety
- **shadcn-vue** component library
- **Tailwind CSS** for styling
- **Malaysian-themed** design elements

## Project Structure

```
frontend/
├── app/
│   └── app.vue                 # Main application layout
├── components/
│   ├── AnimatedTagline.vue     # Header with animated "Merdeka Day" text
│   ├── PlaylistInput.vue       # Enhanced playlist submission form
│   ├── PlaylistTable.vue       # Table display for submitted playlists
│   └── ui/                     # shadcn-vue components
├── composables/
│   └── useSpotifyRoast.ts      # API integration logic
├── types/
│   └── playlist.ts             # TypeScript interfaces
└── assets/css/
    └── main.css                # Malaysian-themed styling
```

## Setup Instructions

### Prerequisites

- Node.js 18+ or Bun
- Git

### Installation

1. **Clone the repository**

   ```bash
   git clone <repository-url>
   cd cooked-my-spotify
   ```

2. **Navigate to frontend directory**

   ```bash
   cd frontend
   ```

3. **Install dependencies**

   ```bash
   # Using npm
   npm install

   # Using bun (recommended)
   bun install
   ```

4. **Start development server**

   ```bash
   # Using npm
   npm run dev

   # Using bun
   bun run dev
   ```

5. **Open in browser**
   Navigate to `http://localhost:3000`

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

## API Integration

The app includes a composable (`useSpotifyRoast`) that handles:

- Playlist submission to backend API
- Fetching existing playlists
- Error handling and loading states
- Data transformation between backend and frontend formats

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

---

🇲🇾 **Selamat Hari Merdeka!** 🇲🇾
