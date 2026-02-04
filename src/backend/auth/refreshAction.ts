"use server";

/**
 * Server action: calls backend refreshAppToken. Used when client gets 401.
 */

import { refreshAppToken } from "./travclanAuth";

export async function refreshAction(
  refresh_token: string
): Promise<
  | { ok: true; data: Record<string, unknown> }
  | { ok: false; error: string; details?: unknown }
> {
  console.log("[BE] refreshAction called (from FE, 401 flow)");
  const result = await refreshAppToken(refresh_token);
  if (result.ok) {
    console.log(
      "[BE] refreshAction result → ok, new tokens in server cache + client"
    );
    return { ok: true, data: result.data };
  }
  console.log("[BE] refreshAction result → error", result.error);
  return {
    ok: false,
    error: result.error,
    ...(result.details != null && { details: result.details }),
  };
}
