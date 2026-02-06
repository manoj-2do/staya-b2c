/**
 * Backend — server-side only.
 * Calls TravClan Auth API (login + refresh). Tokens are cached in memory and persisted to a file so they survive restarts.
 */

import { readFileSync, writeFileSync, existsSync } from "fs";
import { join } from "path";
import { env } from "@/frontend/core/config/env";

export interface TravClanAuthResponse {
  AccessToken?: string;
  RefreshToken?: string;
  [key: string]: unknown;
}

export interface TravClanAuthError {
  error: string;
  message?: string;
  details?: unknown;
}

const SERVER_TOKEN_CACHE_KEY = "travclan_app";

function getTokensFilePath(): string {
  return join(process.cwd(), ".travclan-tokens.json");
}

function loadTokensFromFile(): TravClanAuthResponse | null {
  try {
    const path = getTokensFilePath();
    if (!existsSync(path)) return null;
    const raw = readFileSync(path, "utf-8");
    const data = JSON.parse(raw) as TravClanAuthResponse;
    if (!data || typeof data !== "object") return null;
    return data;
  } catch {
    return null;
  }
}

function saveTokensToFile(data: TravClanAuthResponse): void {
  try {
    writeFileSync(getTokensFilePath(), JSON.stringify(data, null, 0), "utf-8");
    if (process.env.NODE_ENV === "development") {
      console.log("[BE] Tokens saved to", getTokensFilePath());
    }
  } catch (err) {
    if (process.env.NODE_ENV === "development") {
      console.warn("[BE] Could not save tokens to file:", err);
    }
  }
}

/** In-memory server cache for tokens (set after login/refresh). */
const serverTokenCache = new Map<string, TravClanAuthResponse>();

/** Server-side refresh token — persists across requests within same Node process (warm instances). */
let serverRefreshToken: string | null = null;

export function setServerTokenCache(data: TravClanAuthResponse): void {
  serverTokenCache.set(SERVER_TOKEN_CACHE_KEY, data);
  saveTokensToFile(data);
  const rt = (data as Record<string, unknown>).refresh_token ?? (data as Record<string, unknown>).RefreshToken;
  if (typeof rt === "string") serverRefreshToken = rt;
}

export function getServerRefreshToken(): string | null {
  return serverRefreshToken;
}

/** Returns tokens from memory, or loads from file if memory is empty. Only calls login when no tokens present. */
export function getCachedTokens(): TravClanAuthResponse | null {
  let tokens = serverTokenCache.get(SERVER_TOKEN_CACHE_KEY) ?? null;
  if (!tokens) {
    tokens = loadTokensFromFile();
    if (tokens) {
      serverTokenCache.set(SERVER_TOKEN_CACHE_KEY, tokens);
      if (process.env.NODE_ENV === "development") {
        console.log("[BE] Tokens loaded from file");
      }
    }
  }
  return tokens;
}

function getAuthUrl(): string {
  const base = (env.travclan.authUrl ?? "").replace(/\/$/, "");
  const path = (env.travclan.loginEndpoint ?? "").replace(/^\//, "") || "";
  return path ? `${base}/${path}` : base;
}

function getRefreshUrl(): string {
  const base = (env.travclan.authUrl ?? "").replace(/\/$/, "");
  const path = (env.travclan.refreshEndpoint ?? "").replace(/^\//, "") || "";
  return path ? `${base}/${path}` : base;
}

/**
 * Calls TravClan auth API; returns tokens. Call only from server (API route).
 */
export async function getAppToken(): Promise<
  | {
      ok: true;
      data: TravClanAuthResponse;
    }
  | {
      ok: false;
      status: number;
      error: string;
      details?: unknown;
    }
> {
  const apiKey = env.travclan.apiKey;
  const userId = env.travclan.userId;
  const merchantId = env.travclan.merchantId;

  if (!apiKey || !userId || !merchantId) {
    if (process.env.NODE_ENV === "development") {
      console.log("[BE] Auth config missing — env check:", {
        TRAVCLAN_API_KEY: apiKey ? "set" : "MISSING",
        TRAVCLAN_USER_ID: userId ? "set" : "MISSING",
        TRAVCLAN_MERCHANT_ID: merchantId ? "set" : "MISSING",
        hint: "Put .env at project root (same folder as package.json), then restart: npm run dev",
      });
    }
    return {
      ok: false,
      status: 500,
      error: "Auth configuration missing",
      details:
        "TRAVCLAN_API_KEY, TRAVCLAN_USER_ID, TRAVCLAN_MERCHANT_ID must be set. Put .env at project root and restart the dev server.",
    };
  }

  const url = getAuthUrl();
  if (!url) {
    return { ok: false, status: 500, error: "Auth URL not configured" };
  }

  const body = { merchant_id: merchantId, user_id: userId, api_key: apiKey };
  const bodyForLog = { ...body, api_key: apiKey ? "***" : "" };
  const curlBody = JSON.stringify(bodyForLog);

  const SEP = "────────────────────────────────────────────────────────";
  const curl = [
    `curl -X POST '${url}'`,
    `  -H 'accept: application/json'`,
    `  -H 'content-type: application/json'`,
    `  -d '${curlBody.replace(/'/g, "'\\''")}'`,
  ].join(" \\\n");

  console.log(`\n${SEP}\n[BE] Request (curl)\n${SEP}\n${curl}\n${SEP}`);

  try {
    const res = await fetch(url, {
      method: "POST",
      headers: {
        accept: "application/json",
        "content-type": "application/json",
      },
      body: JSON.stringify(body),
    });

    const data = await res.json().catch(() => ({}));
    const resSummary = res.ok
      ? {
          status: res.status,
          access_token: (data as TravClanAuthResponse).access_token
            ? "***"
            : undefined,
          refresh_token: (data as TravClanAuthResponse).refresh_token
            ? "***"
            : undefined,
        }
      : { status: res.status, ...(data as object) };

    console.log(
      `[BE] Response\n${SEP}\n${JSON.stringify(resSummary, null, 2)}\n${SEP}\n`
    );

    if (!res.ok) {
      return {
        ok: false,
        status: res.status,
        error: "TravClan auth failed",
        details: data,
      };
    }

    const tokens = data as TravClanAuthResponse;
    setServerTokenCache(tokens);
    return { ok: true, data: tokens };
  } catch (err) {
    return {
      ok: false,
      status: 502,
      error: "Auth request failed",
      details: err instanceof Error ? err.message : "Unknown error",
    };
  }
}

/**
 * Refresh tokens using refresh_token. Call only from server.
 */
export async function refreshAppToken(
  refresh_token: string
): Promise<
  | { ok: true; data: TravClanAuthResponse }
  | { ok: false; status: number; error: string; details?: unknown }
> {
  const url = getRefreshUrl();
  if (!url) {
    return { ok: false, status: 500, error: "Refresh URL not configured" };
  }
  if (!refresh_token) {
    return { ok: false, status: 400, error: "refresh_token required" };
  }

  const body = { refresh_token };
  const SEP = "────────────────────────────────────────────────────────";
  const curl = [
    `curl -X POST '${url}'`,
    `  -H 'accept: application/json'`,
    `  -H 'content-type: application/json'`,
    `  -d '${JSON.stringify({
      refresh_token: refresh_token ? "***" : "",
    }).replace(/'/g, "'\\''")}'`,
  ].join(" \\\n");
  console.log(`\n${SEP}\n[BE] Refresh Request (curl)\n${SEP}\n${curl}\n${SEP}`);

  try {
    const res = await fetch(url, {
      method: "POST",
      headers: {
        accept: "application/json",
        "content-type": "application/json",
      },
      body: JSON.stringify(body),
    });

    const data = await res.json().catch(() => ({}));
    const resSummary = res.ok
      ? {
          status: res.status,
          access_token: (data as TravClanAuthResponse).access_token
            ? "***"
            : undefined,
          refresh_token: (data as TravClanAuthResponse).refresh_token
            ? "***"
            : undefined,
        }
      : { status: res.status, ...(data as object) };
    console.log(
      `[BE] Refresh Response\n${SEP}\n${JSON.stringify(
        resSummary,
        null,
        2
      )}\n${SEP}\n`
    );

    if (!res.ok) {
      return {
        ok: false,
        status: res.status,
        error: "TravClan refresh failed",
        details: data,
      };
    }

    const tokens = data as TravClanAuthResponse;
    setServerTokenCache(tokens);
    return { ok: true, data: tokens };
  } catch (err) {
    return {
      ok: false,
      status: 502,
      error: "Refresh request failed",
      details: err instanceof Error ? err.message : "Unknown error",
    };
  }
}

