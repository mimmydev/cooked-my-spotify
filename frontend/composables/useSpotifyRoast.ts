import { ref, computed } from 'vue';
import type { Playlist, RoastResponse, RoastListResponse } from '~/types/playlist';
import { useApi } from './useApi';

export const useSpotifyRoast = () => {
  const { generateRoast: apiGenerateRoast, getRoasts: apiGetRoasts } = useApi();

  // Reactive state
  const roasts = ref<any[]>([]);
  const isLoading = ref(false);
  const error = ref<string | null>(null);
  const rateLimitInfo = ref({ remaining: 10, limit: 10 });

  // Computed properties
  const hasRoasts = computed(() => roasts.value.length > 0);
  const isRateLimited = computed(() => rateLimitInfo.value.remaining <= 0);

  // Clear error state
  const clearError = () => {
    error.value = null;
  };

  // Validate Spotify playlist URL
  const validateSpotifyUrl = (url: string): boolean => {
    const spotifyPlaylistRegex = /^https:\/\/open\.spotify\.com\/playlist\/[a-zA-Z0-9]+(\?.*)?$/;
    return spotifyPlaylistRegex.test(url);
  };

  // Generate roast from Spotify playlist URL
  const generateRoast = async (playlistUrl: string): Promise<void> => {
    if (!validateSpotifyUrl(playlistUrl)) {
      error.value = 'Please enter a valid Spotify playlist URL';
      return;
    }

    if (isRateLimited.value) {
      error.value = `Rate limit exceeded. You have ${rateLimitInfo.value.remaining} requests remaining.`;
      return;
    }

    isLoading.value = true;
    error.value = null;

    try {
      const response: RoastResponse = await apiGenerateRoast(playlistUrl);

      // Update rate limit info
      rateLimitInfo.value = response.rate_limit;

      // Add new roast to the beginning of the list
      const newRoast = {
        roast_id: `temp-${Date.now()}`, // Temporary ID until we refresh the list
        roast_text: response.roast.roast_text,
        created_at: response.roast.created_at,
        user_display_name: 'You',
        playlist_name: response.roast.playlist_name,
        track_count: response.roast.track_count,
        likes_count: 0,
        shares_count: 0,
      };

      roasts.value.unshift(newRoast);

      // Optionally refresh the full list to get the actual roast ID
      // await fetchRoasts();
    } catch (err: any) {
      console.error('Error generating roast:', err);
      error.value = err.message || 'Failed to generate roast. Please try again.';
    } finally {
      isLoading.value = false;
    }
  };

  // Fetch roasts list with pagination
  const fetchRoasts = async (page: number = 1, limit: number = 10): Promise<void> => {
    isLoading.value = true;
    error.value = null;

    try {
      const response: RoastListResponse = await apiGetRoasts(page, limit);

      if (page === 1) {
        // Replace the list for first page
        roasts.value = response.roasts;
      } else {
        // Append for pagination
        roasts.value.push(...response.roasts);
      }
    } catch (err: any) {
      console.error('Error fetching roasts:', err);
      error.value = err.message || 'Failed to load roasts. Please try again.';
    } finally {
      isLoading.value = false;
    }
  };

  // Convert backend roast data to frontend Playlist format
  const convertToPlaylist = (roast: any): Playlist => {
    return {
      id: roast.roast_id,
      name: roast.playlist_name,
      creator: roast.user_display_name || 'Anonymous',
      trackCount: roast.track_count,
      dateAdded: new Date(roast.created_at),
      status: 'Active' as const,
      url: roast.playlist_spotify_id
        ? `https://open.spotify.com/playlist/${roast.playlist_spotify_id}`
        : '',
      roastText: roast.roast_text,
    };
  };

  // Get playlists in the format expected by the table component
  const playlists = computed(() => {
    return roasts.value.map(convertToPlaylist);
  });

  // Add mock playlist for testing (can be removed in production)
  const addMockPlaylist = (url: string) => {
    const mockRoast = {
      roast_id: `mock-${Date.now()}`,
      roast_text: 'Wah, your playlist screams "Honda City but make it sound like BMW" vibes lah!',
      created_at: new Date().toISOString(),
      user_display_name: 'You',
      playlist_name: 'My Awesome Playlist',
      track_count: Math.floor(Math.random() * 50) + 10,
      likes_count: 0,
      shares_count: 0,
    };

    roasts.value.unshift(mockRoast);
  };

  return {
    // State
    roasts,
    isLoading,
    error,
    rateLimitInfo,

    // Computed
    hasRoasts,
    isRateLimited,
    playlists,

    // Methods
    generateRoast,
    fetchRoasts,
    clearError,
    validateSpotifyUrl,
    convertToPlaylist,
    addMockPlaylist, // For testing
  };
};
