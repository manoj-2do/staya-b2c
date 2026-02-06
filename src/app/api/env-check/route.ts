/**
 * GET /api/env-check
 * Returns whether required env vars are set (values are never exposed).
 * Use this to verify Vercel env configuration. Remove or restrict in production if desired.
 */

import { NextResponse } from "next/server";

export async function GET() {
  const apiKey = process.env.TRAVCLAN_API_KEY ?? "";
  const userId = process.env.TRAVCLAN_USER_ID ?? "";
  const merchantId = process.env.TRAVCLAN_MERCHANT_ID ?? "";
  const authUrl = process.env.TRAVCLAN_AUTH_URL ?? "";
  const apiBaseUrl = process.env.TRAVCLAN_API_BASE_URL ?? "";

  const checks = {
    TRAVCLAN_API_KEY: !!apiKey,
    TRAVCLAN_USER_ID: !!userId,
    TRAVCLAN_MERCHANT_ID: !!merchantId,
    TRAVCLAN_AUTH_URL: !!authUrl || true, // optional, has default
    TRAVCLAN_API_BASE_URL: !!apiBaseUrl || true, // optional, has default
  };

  const allRequired = checks.TRAVCLAN_API_KEY && checks.TRAVCLAN_USER_ID && checks.TRAVCLAN_MERCHANT_ID;

  return NextResponse.json({
    ok: allRequired,
    message: allRequired
      ? "All required env vars are set"
      : "Some required env vars are missing. Add TRAVCLAN_API_KEY, TRAVCLAN_USER_ID, TRAVCLAN_MERCHANT_ID in Vercel Project Settings → Environment Variables, then redeploy.",
    checks,
    hint: "Add vars in Vercel → Project → Settings → Environment Variables. Redeploy after adding.",
  });
}
