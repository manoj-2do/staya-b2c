/**
 * Auth feature — client-side service.
 * Login only when localStorage empty; refresh on 401 with retry limit.
 */

import type { AuthTokenResponse } from "../types";
import { loginAction } from "@/backend/auth/loginAction";
import { refreshAction } from "@/backend/auth/refreshAction";

/** localStorage key for access_token + refresh_token (uid) */
const AUTH_STORAGE_KEY = "uid";

/** Max refresh attempts when API returns 401 before throwing */
export const REFRESH_RETRY_LIMIT = 3;

export function getStoredAuth(): AuthTokenResponse | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(AUTH_STORAGE_KEY);
    if (!raw) return null;
    return JSON.parse(raw) as AuthTokenResponse;
  } catch {
    return null;
  }
}

export function clearStoredAuth(): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.removeItem(AUTH_STORAGE_KEY);
  } catch {
    // ignore
  }
}

export function setStoredAuth(data: AuthTokenResponse): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(data));
  } catch {
    // ignore
  }
}

export interface LoginResult {
  success: true;
  data: AuthTokenResponse;
}

export interface LoginError {
  success: false;
  error: string;
  details?: unknown;
}

export type LoginResponse = LoginResult | LoginError;

export interface RefreshResult {
  success: true;
  data: AuthTokenResponse;
}

export interface RefreshError {
  success: false;
  error: string;
  details?: unknown;
}

export type RefreshResponse = RefreshResult | RefreshError;

/**
 * Returns tokens from localStorage if present; only calls backend when refresh_token is not in localStorage.
 */
export async function login(): Promise<LoginResponse> {
  const stored = getStoredAuth();
  const hasRefreshToken =
    stored?.refresh_token && typeof stored.refresh_token === "string";

  if (stored && hasRefreshToken) {
    if (typeof window !== "undefined") {
      console.log("[FE] auth → tokens in localStorage, skipping backend call");
    }
    return { success: true, data: stored };
  }

  if (typeof window !== "undefined") {
    console.log(
      "[FE] auth request → no refresh_token in localStorage, calling loginAction (BE)"
    );
  }
  const result = await loginAction();

  if (typeof window !== "undefined") {
    console.log(
      "[FE] auth response →",
      result.ok ? "ok, saving to localStorage (uid)" : "error",
      result.ok ? "" : result
    );
  }

  if (!result.ok) {
    return {
      success: false,
      error: result.error,
      details: result.details,
    };
  }

  const tokens = result.data as AuthTokenResponse;
  setStoredAuth(tokens);
  return { success: true, data: tokens };
}

/**
 * Refresh tokens using refresh_token. On success updates localStorage and returns new tokens.
 */
export async function refreshTokens(): Promise<RefreshResponse> {
  const stored = getStoredAuth();
  const rt = stored?.refresh_token;
  if (!rt || typeof rt !== "string") {
    return { success: false, error: "No refresh_token in storage" };
  }
  if (typeof window !== "undefined") {
    console.log("[FE] refresh request → calling refreshAction (BE)");
  }
  const result = await refreshAction(rt);
  if (typeof window !== "undefined") {
    console.log(
      "[FE] refresh response →",
      result.ok ? "ok" : "error",
      result.ok ? "" : result
    );
  }
  if (!result.ok) {
    return { success: false, error: result.error, details: result.details };
  }
  const tokens = result.data as AuthTokenResponse;
  setStoredAuth(tokens);
  return { success: true, data: tokens };
}

/**
 * Fetch with auth: adds Authorization header and on 401 tries refresh (up to REFRESH_RETRY_LIMIT), then retries request.
 * Use for calling APIs that require the access token.
 */
export async function fetchWithAuth(
  url: string,
  options: RequestInit = {},
  onTokensUpdated?: (tokens: AuthTokenResponse) => void
): Promise<Response> {
  const stored = getStoredAuth();
  const accessToken = stored?.access_token;
  const headers = new Headers(options.headers);
  if (accessToken && typeof accessToken === "string") {
    headers.set("Authorization", `Bearer ${accessToken}`);
  }

  let lastResponse: Response | null = null;
  let refreshAttempts = 0;

  const doRequest = (): Promise<Response> => {
    return fetch(url, { ...options, headers });
  };

  while (refreshAttempts <= REFRESH_RETRY_LIMIT) {
    lastResponse = await doRequest();

    if (lastResponse.status !== 401) {
      return lastResponse;
    }

    refreshAttempts++;
    if (refreshAttempts > REFRESH_RETRY_LIMIT) {
      if (typeof window !== "undefined") {
        console.log(
          "[FE] fetchWithAuth: 401 after max refresh retries",
          REFRESH_RETRY_LIMIT
        );
      }
      return lastResponse;
    }

    const refreshResult = await refreshTokens();
    if (!refreshResult.success) {
      if (typeof window !== "undefined") {
        console.log("[FE] fetchWithAuth: refresh failed", refreshResult.error);
      }
      return lastResponse;
    }

    const tokens = refreshResult.data;
    onTokensUpdated?.(tokens);
    if (tokens.access_token) {
      headers.set("Authorization", `Bearer ${tokens.access_token}`);
    }
  }

  return lastResponse!;
}
