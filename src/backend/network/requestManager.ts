/**
 * Backend — server-side only.
 * Network manager with Auth Interceptor: adds token to requests; on 401, refreshes token and retries once.
 * All request/response logging lives here (no duplication in auth or location search).
 */

import { getServerRefreshToken, refreshAppToken, getAppToken } from "@/backend/auth/travclanAuth";
import type { TravClanAuthResponse } from "@/backend/auth/travclanAuth";
import { env } from "@/frontend/core/config/env";

const SEP = "────────────────────────────────────────────────────────";

function getAccessTokenFromTokens(
  tokens: TravClanAuthResponse | null
): string | null {
  if (!tokens) return null;
  const t = tokens as Record<string, unknown>;
  const v = t.access_token ?? t.AccessToken;
  return typeof v === "string" ? v : null;
}

function getAccessTokenFromResponse(tokens: TravClanAuthResponse | null): string | null {
  return getAccessTokenFromTokens(tokens);
}

/** Uses server-stored refresh token to refresh; returns new access token or null. */
async function refreshAndGetNewToken(): Promise<string | null> {
  const refreshToken = getServerRefreshToken();

  if (!refreshToken) {
    console.log("[BE] requestManager: no server refresh_token, attempting full login");
    const loginResult = await getAppToken();
    if (loginResult.ok) {
      return getAccessTokenFromResponse(loginResult.data);
    }
    console.log("[BE] requestManager: full login failed", loginResult.error);
    return null;
  }

  console.log("[BE] requestManager: 401 → refreshing token");
  const result = await refreshAppToken(refreshToken);

  if (!result.ok) {
    console.log("[BE] requestManager: refresh failed", result.error);
    const loginFallback = await getAppToken();
    if (loginFallback.ok) {
      return getAccessTokenFromResponse(loginFallback.data);
    }
    return null;
  }

  return getAccessTokenFromResponse(result.data);
}

export interface RequestConfig {
  method: string;
  url: string;
  headers?: Record<string, string>;
  body?: string;
  /** Access token from frontend (Authorization header). Required for TravClan API calls. */
  accessToken?: string | null;
}

export interface RequestResult<T = unknown> {
  status: number;
  data?: T;
  errorBody?: unknown;
  /** Set when we refreshed token on 401 — API route should forward via X-New-Access-Token header */
  newAccessToken?: string;
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
        `  -H '${k}: ${k === "Authorization" && String(v).startsWith("Bearer ")
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
 * Obtains an access token when none was provided. Uses server refresh token or full login.
 * TravClan API requires Authorization on every request; we must never send without it.
 */
async function ensureAccessTokenForRequest(): Promise<string | null> {
  return refreshAndGetNewToken();
}

/**
 * Sends a request with Auth Interceptor:
 * - Uses accessToken from caller (from frontend request header).
 * - If caller provides no token: obtains one via login/refresh before sending.
 * - If response status is 401: refreshes using server refresh token, retries, returns newAccessToken for frontend.
 */
export async function request<T = unknown>(
  config: RequestConfig
): Promise<RequestResult<T>> {
  const { method, url, headers: configHeaders = {}, body, accessToken: callerToken } = config;

  let accessToken = callerToken ?? null;
  let obtainedTokenForCaller: string | undefined;
  if (!accessToken) {
    accessToken = await ensureAccessTokenForRequest();
    if (accessToken) obtainedTokenForCaller = accessToken;
    else {
      logResponse("Auth failed", 401, undefined, { message: "Could not obtain access token (login/refresh failed)" });
      return { status: 401, errorBody: { message: "Authentication failed. Please try again." } };
    }
  }
  const defaultHeaders = {
    "Content-Type": "application/json",
    accept: "application/json",
    "Authorization-Type": "external-service",
    source: env.travclan.source ?? "website",
  };

  const headers: Record<string, string> = {
    ...defaultHeaders,
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
      const newToken = await refreshAndGetNewToken();
      if (newToken) {
        const retryHeaders: Record<string, string> = {
          ...defaultHeaders,
          ...configHeaders,
          Authorization: `Bearer ${newToken}`,
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
          return { status: retryRes.status, data: retryData as T, newAccessToken: newToken };
        }
        return { status: retryRes.status, errorBody: retryData };
      }
      return { status: 401, errorBody: data };
    }

    if (res.ok) {
      return {
        status: res.status,
        data: data as T,
        ...(obtainedTokenForCaller && { newAccessToken: obtainedTokenForCaller }),
      };
    }
    return {
      status: res.status,
      errorBody: data,
      ...(obtainedTokenForCaller && { newAccessToken: obtainedTokenForCaller }),
    };
  } catch (err) {
    console.log("[BE] requestManager — request failed", err);
    return {
      status: 502,
      errorBody: err instanceof Error ? err.message : "Unknown error",
    };
  }
}
