# WARP.md

This file provides guidance to WARP (warp.dev) when working with code in this repository.

## Project Overview

**Roast My Spotify** is a full-stack web application that generates Malaysian-style roasts of Spotify playlists. The project consists of a Nuxt.js frontend and a Node.js/Express backend in a monorepo structure managed with Turbo and Bun.

## Architecture

### Monorepo Structure

- **Root**: Workspace configuration with shared dev tools (Prettier, OXLint, Husky, Commitlint)
- **Frontend** (`/frontend`): Nuxt.js 4.x app with Vue 3, TailwindCSS, and Shadcn/ui components
- **Backend** (`/backend`): Express.js API server with mock services for Spotify parsing and roast generation

### Key Technologies

- **Package Manager**: Bun (required, enforced via preinstall scripts)
- **Frontend**: Nuxt.js 4.x, Vue 3, TailwindCSS, Reka UI, Shadcn/Nuxt
- **Backend**: Node.js, Express.js with CORS
- **Dev Tools**: Turbo (monorepo), Prettier, OXLint, Husky, lint-staged
- **API Testing**: Bruno (HTTP client) with test collection in `/RoastMySpotify/`

## Development Commands

### Root Level (Monorepo)

```bash
# Install all dependencies across workspace
bun install

# Start all services in development mode
bun run dev

# Build all packages
bun run build

# Type checking across all packages
bun run check-types

# Linting with OXLint
bun run check

# Format all code with Prettier
bun run format

# Check formatting without fixing
bun run format:check

# Start specific services
bun run dev:web        # Frontend only (port 3000)
bun run dev:server     # Backend only (port 3001)
```

### Frontend Specific

```bash
# From frontend/ directory
bun run dev            # Development server
bun run build          # Production build
bun run generate       # Static site generation
bun run preview        # Preview production build
```

### Backend Specific

```bash
# From backend/ directory
bun run dev            # Start Express server
```

### Testing & Quality

```bash
# API testing with Bruno
# Open Bruno and load the collection from /RoastMySpotify/
```

## Code Architecture

### Frontend Architecture (`/frontend`)

- **Framework**: Nuxt.js 4.x with auto-imports and file-based routing
- **Component System**:
  - Shadcn/ui components in `/components/ui/` (auto-configured)
  - Custom components: `RoastForm.vue`, `RoastDisplay.vue`, `RoastFeed.vue`
- **State Management**: Vue 3 Composition API with `ref()` for local state
- **Styling**: TailwindCSS with custom animations (`tw-animate-css`)
- **Type Safety**: TypeScript with custom types in `/types/index.ts`
- **Composables**: Custom hooks in `/composables/` (currently empty `useApi.ts`)

### Backend Architecture (`/backend`)

- **API Structure**: RESTful endpoints under `/api/` prefix
- **Service Layer**: Modular services in `/services/`:
  - `spotifyService.js`: URL parsing and validation
  - `bedrockService.js`: Mock roast generation with Malaysian phrases
  - `rateLimitService.js`: In-memory rate limiting (10 requests/day per IP)
- **Data Storage**: In-memory arrays for development (no database)

### API Endpoints

- `POST /api/roast`: Generate roast from Spotify playlist URL
- `GET /api/roasts`: Retrieve recent roasts (last 10)

## Development Notes

### Bun Requirements

- Node.js version: >=22.0.0
- Bun version: >=1.0.0
- Other package managers are blocked via preinstall scripts
- Use `bun` for all package management and script execution

### Known Technical Debt

The codebase contains intentional improvement areas marked in comments:

- Frontend form validation is basic and could be enhanced
- No real-time API integration (currently mocked)
- Memory management issues with unlimited roast storage
- Missing error boundaries and accessibility features
- No cleanup of ongoing requests on component unmount

### Service Integration Points

- Spotify playlist URL parsing (currently regex-based)
- Roast generation service (mock implementation ready for AI integration)
- Rate limiting service (in-memory, ready for Redis/database)

### Git Hooks & Code Quality

- Husky manages pre-commit hooks
- lint-staged runs Prettier and OXLint on staged files
- Commitlint enforces conventional commit messages
- All JavaScript/TypeScript files are linted and formatted automatically

## Common Tasks

### Adding New Components

Frontend components should follow the established pattern with Shadcn/ui base components. Place custom components in `/frontend/components/` and import them in Vue files.

### API Development

Backend services follow the pattern in `/backend/services/`. Each service exports specific functions and handles its own error states. The main Express app in `index.js` coordinates between services.

### Styling

Use TailwindCSS utilities with the configured Shadcn theme. Custom animations are available via `tw-animate-css`. Component styling follows Shadcn conventions.
