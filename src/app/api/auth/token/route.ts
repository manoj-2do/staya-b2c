/**
 * GET /api/auth/token
 * Performs TravClan login, returns access token to frontend, stores refresh token on server.
 */

import { NextResponse } from "next/server";
import { getAppToken } from "@/backend/auth/travclanAuth";

export async function GET() {
  const result = await getAppToken();

  if (!result.ok) {
    return NextResponse.json(
      { error: result.error, details: result.details },
      { status: result.status }
    );
  }

  const t = result.data as Record<string, unknown>;
  const accessToken =
    (t.access_token as string) ?? (t.AccessToken as string) ?? null;

  if (!accessToken) {
    return NextResponse.json(
      { error: "Login succeeded but no access token in response" },
      { status: 500 }
    );
  }

  return NextResponse.json({ accessToken });
}
