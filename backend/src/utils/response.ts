/**
 * Utility functions for API responses
 * Handles CORS, error formatting, and standardized responses
 */

export interface APIResponse {
  statusCode: number;
  headers: Record<string, string>;
  body: string;
}

/**
 * Standard CORS headers for API responses
 */
export const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'Content-Type',
  'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
  'Content-Type': 'application/json',
};

/**
 * Create a successful API response
 * @param data - Response data
 * @param statusCode - HTTP status code (default: 200)
 * @returns Formatted API response
 */
export function createSuccessResponse(data: any, statusCode: number = 200): APIResponse {
  return {
    statusCode,
    headers: corsHeaders,
    body: JSON.stringify({
      success: true,
      ...data,
    }),
  };
}

/**
 * Create an error API response with Malaysian humor
 * @param error - Error message
 * @param statusCode - HTTP status code (default: 500)
 * @param details - Additional error details
 * @returns Formatted error response
 */
export function createErrorResponse(
  error: string,
  statusCode: number = 500,
  details?: any
): APIResponse {
  const malaysianErrorMessages: Record<number, string> = {
    400: 'Eh, your request got problem...Anyway do not ping the developer she is lazy',
    404: 'what you looking bro?',
    429: 'Plzzzz rileks T_T',
    500: 'System down ig, dev skill issue boleh cuba next time la (dont)',
  };

  const message = malaysianErrorMessages[statusCode] || 'whopsie.. i guess its time to stop dawg';

  return {
    statusCode,
    headers: corsHeaders,
    body: JSON.stringify({
      success: false,
      error,
      message,
      ...(details && { details }),
    }),
  };
}

/**
 * Create CORS preflight response
 * @returns CORS preflight response
 */
export function createCorsResponse(): APIResponse {
  return {
    statusCode: 200,
    headers: corsHeaders,
    body: '',
  };
}

/**
 * Malaysian-style error messages for common scenarios
 */
export const malaysianErrors = {
  invalidUrl: 'Adoiii not valid URL la check properly?',
  missingUrl: 'Aik mana URL you want me to roast?',
  playlistNotFound:
    "Either your laylist not found or private lah! So make sure it's public and link is correct so I can roast",
  aiError: 'AI tak boleh roast your playlist right now. Try again next time!',
  generalError: 'Alamak! Something went wrong while roasting your playlist!',
  spotifyError: 'Mmmm spotify API got problem I think? Try again later (please go home)',
  throttled: 'Aih, slow down a bit boleh ka too many roasts already. Sabarrr',
  duplicatePlaylist:
    'Eh this playlist already kena roast already la! Submit fresh playlist can or not?',
};

/**
 * Log request details for debugging
 * @param event - Lambda event object
 * @param action - Action being performed
 */
export function logRequest(event: any, action: string): void {
  console.log(`${action} request received:`, {
    method: event.httpMethod,
    path: event.path,
    ip: event.requestContext?.identity?.sourceIp,
    userAgent: event.headers?.['User-Agent'],
    timestamp: new Date().toISOString(),
  });
}
