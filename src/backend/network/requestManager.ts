/**
 * Backend — server-side only.
 * Network manager with Auth Interceptor: adds token to requests; on 401, refreshes token and retries once.
 * All request/response logging lives here (no duplication in auth or location search).
 */

import { getCachedTokens, refreshAppToken } from "@/backend/auth/travclanAuth";
import type { TravClanAuthResponse } from "@/backend/auth/travclanAuth";

const SEP = "────────────────────────────────────────────────────────";

function getAccessTokenFromTokens(
  tokens: TravClanAuthResponse | null
): string | null {
  if (!tokens) return null;
  const t = tokens as Record<string, unknown>;
  const v = t.access_token ?? t.AccessToken;
  return typeof v === "string" ? v : null;
}

function getRefreshTokenFromTokens(
  tokens: TravClanAuthResponse | null
): string | null {
  if (!tokens) return null;
  const t = tokens as Record<string, unknown>;
  const v = t.refresh_token ?? t.RefreshToken;
  return typeof v === "string" ? v : null;
}

/** Auth Interceptor: get current access token from cache/file. Used only inside request manager to attach token to requests. */
function getAccessToken(): string | null {
  return getAccessTokenFromTokens(getCachedTokens());
}

/** Auth Interceptor: get refresh token and call refresh API; saves new tokens to file. Returns true if new token available. */
async function refreshAndSaveToken(): Promise<boolean> {
  const refreshToken = getRefreshTokenFromTokens(getCachedTokens());
  if (!refreshToken) {
    console.log("[BE] requestManager: no refresh_token, cannot refresh");
    return false;
  }
  console.log("[BE] requestManager: 401 → refreshing token");
  const result = await refreshAppToken(refreshToken);
  if (!result.ok) {
    console.log("[BE] requestManager: refresh failed", result.error);
    return false;
  }
  console.log("[BE] requestManager: token refreshed, retrying request");
  return true;
}

export interface RequestConfig {
  method: string;
  url: string;
  headers?: Record<string, string>;
  body?: string;
}

export interface RequestResult<T = unknown> {
  status: number;
  data?: T;
  errorBody?: unknown;
}

function logRequest(
  method: string,
  url: string,
  headers: Record<string, string>,
  hasBody?: boolean
): void {
  const curlLines = [
    `curl -X ${method.toUpperCase()} '${url}'`,
    ...Object.entries(headers).map(
      ([k, v]) =>
        `  -H '${k}: ${
          k === "Authorization" && String(v).startsWith("Bearer ")
            ? "Bearer ***"
            : v
        }'`
    ),
  ];
  if (hasBody) curlLines.push(`  -d '...'`);
  const curl = curlLines.join(" \\\n");
  console.log(
    `\n${SEP}\n[BE] requestManager — Request (curl)\n${SEP}\n${curl}\n${SEP}`
  );
}

function logResponse(
  label: string,
  status: number,
  data?: unknown,
  errorBody?: unknown
): void {
  const summary =
    errorBody != null ? { status, body: errorBody } : { status, data };
  console.log(`[BE] requestManager — ${label} →`, JSON.stringify(summary));
}

/**
 * Sends a request with Auth Interceptor:
 * - Adds Authorization header from cached token (file/memory).
 * - If response status is 401: refreshes token (saves to file), then retries the request once with new token.
 * - All logging (request curl, response status) is done here.
 */
export async function request<T = unknown>(
  config: RequestConfig
): Promise<RequestResult<T>> {
  const { method, url, headers: configHeaders = {}, body } = config;

  let accessToken = getAccessToken();
  const headers: Record<string, string> = {
    ...configHeaders,
    ...(accessToken ? { Authorization: `Bearer ${accessToken}` } : {}),
  };

  logRequest(method, url, headers, body != null);

  try {
    const res = await fetch(url, {
      method,
      headers,
      ...(body != null ? { body } : {}),
      next: { revalidate: 0 },
    });

    const data = await res.json().catch(() => ({}));

    logResponse(
      "Response",
      res.status,
      res.ok ? data : undefined,
      res.ok ? undefined : data
    );

    if (res.status === 401) {
      const refreshed = await refreshAndSaveToken();
      if (refreshed) {
        accessToken = getAccessToken();
        if (accessToken) {
          const retryHeaders: Record<string, string> = {
            ...configHeaders,
            Authorization: `Bearer ${accessToken}`,
          };
          logRequest(method, url, retryHeaders, body != null);
          const retryRes = await fetch(url, {
            method,
            headers: retryHeaders,
            ...(body != null ? { body } : {}),
            next: { revalidate: 0 },
          });
          const retryData = await retryRes.json().catch(() => ({}));
          logResponse(
            "Retry response",
            retryRes.status,
            retryRes.ok ? retryData : undefined,
            retryRes.ok ? undefined : retryData
          );
          if (retryRes.ok) {
            return { status: retryRes.status, data: retryData as T };
          }
          return { status: retryRes.status, errorBody: retryData };
        }
      }
      return { status: 401, errorBody: data };
    }

    if (res.ok) {
      return { status: res.status, data: data as T };
    }
    return { status: res.status, errorBody: data };
  } catch (err) {
    console.log("[BE] requestManager — request failed", err);
    return {
      status: 502,
      errorBody: err instanceof Error ? err.message : "Unknown error",
    };
  }
}
