/**
 * Centralised environment configuration.
 * Do not access process.env in features or components — use this file only.
 * See ENGINEERING_RUELS.md and TECH_STACK.md.
 * TravClan keys are server-side only; never expose in client.
 */

export const env = {
  /** Mock hotel search — set NEXT_PUBLIC_USE_MOCK_HOTEL_SEARCH=true to use mock data */
  useMockHotelSearch: process.env.NEXT_PUBLIC_USE_MOCK_HOTEL_SEARCH === "true",

  /** TravClan — server-side only, used by API routes */
  travclan: {
    apiKey: process.env.TRAVCLAN_API_KEY ?? "",
    userId: process.env.TRAVCLAN_USER_ID ?? "",
    merchantId: process.env.TRAVCLAN_MERCHANT_ID ?? "",
    authUrl:
      process.env.TRAVCLAN_AUTH_URL ?? "https://trav-auth-sandbox.travclan.com",
    apiBaseUrl:
      process.env.TRAVCLAN_API_BASE_URL ??
      "https://hotel-api-sandbox.travclan.com",
    voltLiteApiUrl:
      process.env.TRAVCLAN_VOLT_LITE_API_URL ??
      "https://hotel-volt-api-sandbox.travclan.com",
    loginEndpoint:
      process.env.TRAVCLAN_LOGIN_ENDPOINT ??
      "/authentication/internal/service/login",
    refreshEndpoint:
      process.env.TRAVCLAN_REFRESH_ENDPOINT ??
      "/authentication/internal/service/refresh",
    source: process.env.TRAVCLAN_SOURCE ?? "website",
  },
} as const;
