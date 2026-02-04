/**
 * Auth feature — types for TravClan token response.
 * Shape should match what TravClan auth API returns.
 */

export interface AuthTokenResponse {
  access_token?: string;
  refresh_token?: string;
  token_type?: string;
  expires_in?: number;
  [key: string]: unknown;
}

export interface AuthApiError {
  error: string;
  message?: string;
  details?: unknown;
}
