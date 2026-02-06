/**
 * Helpers for API routes — extract auth token and build response with optional new token header.
 */

export function getAccessTokenFromRequest(request: Request): string | null {
  const authHeader = request.headers.get("authorization");
  return authHeader?.startsWith("Bearer ") ? authHeader.slice(7) : null;
}

export function responseHeadersWithNewToken(newAccessToken?: string): Record<string, string> | undefined {
  if (!newAccessToken) return undefined;
  return { "X-New-Access-Token": newAccessToken };
}
