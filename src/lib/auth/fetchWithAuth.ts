/**
 * Fetch wrapper that adds Authorization header and handles token refresh.
 */

import { getAccessToken, setAccessToken, ensureAccessToken } from "./authToken";

const HEADER_NEW_TOKEN = "x-new-access-token";

export interface FetchWithAuthOptions extends RequestInit {
  skipAuth?: boolean;
}

export async function fetchWithAuth(
  url: string | URL,
  options: FetchWithAuthOptions = {}
): Promise<Response> {
  const { skipAuth = false, headers: optHeaders = {}, ...rest } = options;

  let token: string | null = null;
  if (!skipAuth) {
    token = await ensureAccessToken();
  }

  const headers = new Headers(optHeaders);
  if (token) {
    headers.set("Authorization", `Bearer ${token}`);
  }

  const res = await fetch(url, { ...rest, headers });

  const newToken = res.headers.get(HEADER_NEW_TOKEN);
  if (newToken) {
    setAccessToken(newToken);
  }

  return res;
}
