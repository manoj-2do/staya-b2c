"use server";

/**
 * Server action: returns tokens from server cache if present; otherwise calls TravClan login once and caches.
 */

import { getAppToken, getCachedTokens } from "./travclanAuth";

export async function loginAction(): Promise<
  | { ok: true; data: Record<string, unknown> }
  | { ok: false; error: string; details?: unknown }
> {
  console.log("[BE] loginAction called (from FE)");

  const cached = getCachedTokens();
  if (cached && (cached.access_token || cached.refresh_token)) {
    console.log(
      "[BE] loginAction result → ok, from server cache (no login API call)"
    );
    return { ok: true, data: cached };
  }

  const result = await getAppToken();
  if (result.ok) {
    console.log(
      "[BE] loginAction result → ok, tokens from login API, saved to server cache"
    );
    return { ok: true, data: result.data };
  }
  console.log("[BE] loginAction result → error", result.error);
  return {
    ok: false,
    error: result.error,
    ...(result.details != null && { details: result.details }),
  };
}
