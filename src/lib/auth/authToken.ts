/**
 * Client auth token — access token in localStorage. Server holds refresh token.
 */

const STORAGE_KEY = "staya:access_token";

export function getAccessToken(): string | null {
  if (typeof window === "undefined") return null;
  try {
    return localStorage.getItem(STORAGE_KEY);
  } catch {
    return null;
  }
}

export function setAccessToken(token: string): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(STORAGE_KEY, token);
  } catch {
    // ignore
  }
}

export function clearAccessToken(): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch {
    // ignore
  }
}

export async function ensureAccessToken(): Promise<string | null> {
  const existing = getAccessToken();
  if (existing) return existing;

  try {
    const res = await fetch("/api/auth/token");
    const data = (await res.json()) as { accessToken?: string } | { error?: string };
    if (!res.ok) return null;
    const token = (data as { accessToken?: string }).accessToken;
    if (token) {
      setAccessToken(token);
      return token;
    }
  } catch {
    // ignore
  }
  return null;
}
