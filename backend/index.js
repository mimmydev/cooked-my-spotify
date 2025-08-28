import express from 'express';
import cors from 'cors';
import { parseSpotifyUrl } from './services/spotifyService.js';
import { generateMalaysianRoast } from './services/bedrockService.js';
import { checkRateLimit } from './services/rateLimitService.js';

const app = express();
app.use(cors());
app.use(express.json());

//** Mock database for demo
const roasts = [];

app.post('/api/roast', async (req, res) => {
  try {
    const { playlist_url } = req.body;
    
    //** Rate limiting check (mock)
    const rateLimit = checkRateLimit(req.ip);
    if (!rateLimit.allowed) {
      return res.status(429).json({
        error: 'Rate limit exceeded',
        message: 'Wah, quota habis for today lah! Come back tomorrow 😅',
        rateLimitInfo: rateLimit
      });
    }
    
    //** Parse Spotify URL
    const playlistInfo = parseSpotifyUrl(playlist_url);
    if (!playlistInfo.isValid) {
      return res.status(400).json({
        error: 'Invalid Spotify URL',
        message: 'Please provide a valid Spotify playlist URL lah!'
      });
    }
    
    //** Generate roast (mock)
    const roastText = await generateMalaysianRoast(playlistInfo);
    
    //** Save to mock database
    const newRoast = {
      id: Date.now().toString(),
      playlist_url,
      roast_text: roastText,
      created_at: new Date(),
      playlist_id: playlistInfo.playlistId
    };
    
    roasts.unshift(newRoast);
    
    res.json({
      roast: newRoast,
      rateLimitInfo: { remaining: 9, resetTime: new Date(Date.now() + 24*60*60*1000) }
    });
    
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({
      error: 'Internal server error',
      message: 'Sorry lah, system tengah having issues!'
    });
  }
});

app.get('/api/roasts', (req, res) => {
  res.json({ roasts: roasts.slice(0, 10) });
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Backend running on http://localhost:${PORT}`);
});