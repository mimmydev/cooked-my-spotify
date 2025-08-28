export interface RoastData {
  id: string;
  playlist_url: string;
  roast_text: string;
  created_at: string;
  roast_length: number;
}

export interface RateLimitInfo {
  remaining: number;
  resetTime: string | null;
}

export interface ApiResponse {
  success: boolean;
  data?: any;
  error?: string;
  rateLimitInfo?: RateLimitInfo;
}