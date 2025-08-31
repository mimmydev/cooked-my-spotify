import type { RoastResponse, RoastListResponse } from '~/types/playlist';

interface ApiError {
  message: string;
  status: number;
  details?: any;
}

export const useApi = () => {
  const config = useRuntimeConfig();
  const apiBaseUrl =
    config.public.apiBaseUrl || 'https://6ar978foa6.execute-api.ap-southeast-1.amazonaws.com/api';

  // Generic API call wrapper with error handling
  const apiCall = async <T>(
    endpoint: string,
    options: {
      method?: 'GET' | 'POST' | 'PUT' | 'DELETE';
      body?: any;
      query?: Record<string, any>;
    } = {}
  ): Promise<T> => {
    try {
      const url = `${apiBaseUrl}${endpoint}`;

      const fetchOptions: any = {
        method: options.method || 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      };

      if (options.body) {
        fetchOptions.body = JSON.stringify(options.body);
      }

      if (options.query) {
        const searchParams = new URLSearchParams();
        Object.entries(options.query).forEach(([key, value]) => {
          if (value !== undefined && value !== null) {
            searchParams.append(key, String(value));
          }
        });
        const queryString = searchParams.toString();
        if (queryString) {
          fetchOptions.query = options.query;
        }
      }

      const response = await $fetch<T>(url, fetchOptions);
      return response;
    } catch (error: any) {
      console.error('API call failed:', error);

      // Handle different types of errors
      if (error.status) {
        throw new Error(
          `API Error (${error.status}): ${error.data?.message || error.message || 'Unknown error'}`
        );
      }

      if (error.message) {
        throw new Error(`Network Error: ${error.message}`);
      }

      throw new Error('An unexpected error occurred');
    }
  };

  // Generate roast from Spotify playlist URL
  const generateRoast = async (playlistUrl: string): Promise<RoastResponse> => {
    return await apiCall<RoastResponse>('/roast', {
      method: 'POST',
      body: { playlist_url: playlistUrl },
    });
  };

  // Get list of roasts with pagination
  const getRoasts = async (page: number = 1, limit: number = 10): Promise<RoastListResponse> => {
    return await apiCall<RoastListResponse>('/roasts', {
      method: 'GET',
      query: { page, limit },
    });
  };

  return {
    generateRoast,
    getRoasts,
    apiCall,
  };
};
