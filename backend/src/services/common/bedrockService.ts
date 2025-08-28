import { BedrockRuntimeClient, InvokeModelCommand } from '@aws-sdk/client-bedrock-runtime';
import type { MusicAnalysis } from '../../types/index.js';

/**
 * Service class for AWS Bedrock integration
 * Handles Malaysian roast generation using Claude 3 Haiku
 */
export class BedrockService {
  private bedrock: BedrockRuntimeClient;

  constructor() {
    this.bedrock = new BedrockRuntimeClient({
      region: process.env?.AWS_REGION || 'ap-southeast-1',
    });
  }

  /**
   * Generate a Malaysian-style roast based on music analysis
   * @param analysis - Music taste analysis data
   * @returns Promise<string> - Generated roast text
   */
  async generateMalaysianRoastFromAnalysis(analysis: MusicAnalysis): Promise<string> {
    // Build roasting angles based on real data
    const roastingAngles: string[] = [];

    if (analysis.isVeryMainstream) {
      roastingAngles.push(`Super mainstream taste (${analysis.avgPopularity}/100 popularity)`);
    }

    if (analysis.zeroLocalMusic) {
      roastingAngles.push("Zero Malaysian artists (where's your cultural pride?)");
    }

    if (analysis.sameArtistSpam) {
      roastingAngles.push(`${analysis.topArtist} - variety much?`);
    }

    if (analysis.explicitCount > analysis.trackCount * 0.7) {
      roastingAngles.push(`${analysis.explicitCount} explicit songs - parents will be shocked`);
    }

    // Enhanced brutal Malaysian roast prompt
    const prompt = `Eh bro, you're a Malaysian kaki who damn savage yet brutal at roasting friends' music taste. No mercy one, but still can laugh together after. Your job is to absolutely DESTROY this playlist with facts, not generic insults.

VICTIM'S ACTUAL PLAYLIST DATA:
- "${analysis.playlistName}" (${analysis.trackCount} tracks)
- Music taste level: ${analysis.avgPopularity}/100 popularity  
- Top artist: ${analysis.topArtist}
- Local representation: ${analysis.localMusicCount} Malaysian/SEA artists
- Explicit tracks: ${analysis.explicitCount}
- Variety: ${analysis.uniqueArtists}/${analysis.trackCount} unique artists
- Sample tracks: ${analysis.sampleTracks}

REAL AMMUNITION TO USE:
${roastingAngles.map((angle) => `- ${angle}`).join('\n')}

HOW TO ROAST LIKE REAL MALAYSIAN FRIEND:
- Use natural rojak: "lah", "wei", "walao eh", "apa doh", "bodoh", "gila", "siot", "wutdaheckkk"
- Cultural burns: kopitiam uncle music taste, pasar malam speaker vibes, taxi driver radio, lift music, mamak late night playlist
- Hit them where it hurts: basic taste, no identity, follow crowd, boring AF
- Reference real Malaysian things: MRT rides, 1Utama mall, Pavilion, mamak stall, Gr*b driver playlist, 
- Under 180 characters - this going on Instagram story

SAVAGE EXAMPLES (study these burns):
- "Bro your playlist same taste as every KL mall background music - basic gila lah wkwkaaka 😂"  
- "47 songs zero Yuna/SonaOne/ Faizal Tahir? You Malaysian or not wei? IC mana IC? Mau check 🤣"
- "Walao 'Study Music' but 90% explicit content - studying what subject? Advanced Swearing ah? 💀"
- "Sedih gila kenapa jiwang betul ni? sapa sakiti kau ni? ? please PM to my developer"
- "Your music taste flatter than mamak roti canai at 3am bro, no flavor one! 🥞"
- "Top 40 hits only? Your Spotify algorithm thinks you're elevator music leh! 😴"

NOW ABSOLUTELY MURDER THIS PLAYLIST (but make people laugh):`;

    try {
      const params = {
        modelId: 'anthropic.claude-3-haiku-20240307-v1:0',
        contentType: 'application/json',
        accept: 'application/json',
        body: JSON.stringify({
          anthropic_version: 'bedrock-2023-05-31',
          max_tokens: 200,
          messages: [
            {
              role: 'user',
              content: prompt,
            },
          ],
          temperature: 0.9,
        }),
      };

      const command = new InvokeModelCommand(params);
      const response = await this.bedrock.send(command);
      const responseBody = JSON.parse(new TextDecoder().decode(response.body));

      return responseBody.content?.[0]?.text?.trim() || 'Wah, AI cannot think of roast lah!';
    } catch (error) {
      console.error('Bedrock error:', error);

      // Enhanced savage fallbacks based on actual data
      const fallbacks = [
        `Walao "${analysis.playlistName}" with ${analysis.trackCount} songs but ${analysis.zeroLocalMusic ? 'zero Malaysian artists? IC fake mungkin?' : 'k lah at least got some local flavor'} ${analysis.isVeryMainstream ? 'Still basic AF though!' : ''} 😂`,
        `Bro your "${analysis.playlistName}" playlist ${analysis.sameArtistSpam ? `got ${analysis.topArtist?.split('(')[0]} on repeat - variety allergic ah?` : 'quite mixed lah'} ${analysis.avgPopularity > 90 ? 'But so mainstream until mamak uncle also know!' : ''} 🤣`,
        `"${analysis.playlistName}" screams ${analysis.avgPopularity > 90 ? 'KL mall background music' : 'trying to be hipster'} vibes - ${analysis.localMusicCount === 0 ? 'forgot you Malaysian or not wei?' : 'saved by local music!'} 🎵`,
        `Aiyo ${analysis.trackCount} songs and ${analysis.explicitCount > analysis.trackCount * 0.5 ? `${analysis.explicitCount} explicit tracks? Parents gonna faint lah!` : 'quite clean playlist'} ${analysis.isVeryMainstream ? 'But taste flatter than roti canai!' : ''} 💀`,
        `Your "${analysis.playlistName}" more predictable than ${analysis.isVeryMainstream ? 'KLCC traffic jam during 5pm' : 'Grab surge pricing'} lah! ${analysis.zeroLocalMusic ? 'Zero local pride some more!' : ''} 🚇`,
      ];

      return (
        fallbacks[Math.floor(Math.random() * fallbacks.length)] || 'Wah, cannot generate roast lah!'
      );
    }
  }

  /**
   * Simple roast generation for testing (accepts string input)
   * @param playlistInfo - Simple playlist description string
   * @returns Promise<string> - Generated roast text
   */
  async generateMalaysianRoast(playlistInfo: string): Promise<string> {
    const simplePrompt = `Damn la bro, you're the most brutal yet savage Malaysian friend who roasts music taste until crying. No filter, straight savage but still funny.

TARGET: "${playlistInfo}"

MALAYSIAN ROAST STYLE:
- Natural rojak language: "lah", "wei", "walao", "gila", "palui", "siot", "aih, "bruh"
- Cultural burns: mamak music, pasar malam speakers, lift music, mall background music,
- Real Malaysian references: MRT, kopitiam, 1Utama, Pavilion, Gr*b rides, A*rAsia
- Under 180 characters for IG story
- Brutal but hilarious, not mean

FIRE EXAMPLES:
- "This playlist basic until mamak uncle also shake head lah! 😂"
- "Music taste more boring than waiting for LRT during peak hour wei! 🚇"
- "Your Spotify thinks you're background music at dentist clinic ah? 🦷"

DESTROY THIS PLAYLIST NOW:`;

    try {
      const params = {
        modelId: 'anthropic.claude-3-haiku-20240307-v1:0',
        contentType: 'application/json',
        accept: 'application/json',
        body: JSON.stringify({
          anthropic_version: 'bedrock-2023-05-31',
          max_tokens: 200,
          messages: [
            {
              role: 'user',
              content: simplePrompt,
            },
          ],
          temperature: 0.9,
        }),
      };

      const command = new InvokeModelCommand(params);
      const response = await this.bedrock.send(command);
      const responseBody = JSON.parse(new TextDecoder().decode(response.body));

      return responseBody.content?.[0]?.text?.trim() || 'Wah, AI cannot think of roast lah!';
    } catch (error) {
      console.error('Bedrock error:', error);

      // Enhanced savage fallbacks for string input
      const fallbacks = [
        `Walao "${playlistInfo}" - basic until kopitiam uncle also cringe lah! 😂`,
        `Aiyo this playlist screams "I got no personality" vibes wei! 🤡`,
        `"${playlistInfo}" - sounds like every Grab driver's default playlist! 🚗`,
        `Your music taste more predictable than KL jam during 5pm bro! 🚇`,
        `This playlist so boring, even lift music got more character lah! 🛗`,
      ];

      return (
        fallbacks[Math.floor(Math.random() * fallbacks.length)] || 'Wah, cannot generate roast lah!'
      );
    }
  }
}
