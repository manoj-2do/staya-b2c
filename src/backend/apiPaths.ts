/**
 * Central API paths — backend only.
 * TravClan external API paths and our app's internal API routes.
 * Use these instead of hardcoding path strings.
 */

/** TravClan API paths (relative to apiBaseUrl) */
export const travclanPaths = {
  locationsSearch: "api/v1/locations/search",
  hotelSearch: "api/v1/search",
  roomsAndRates: "api/v1/roomsandrates",
  checkPrice: "api/v1/price-check",
  hotelBase: "api/v1/hotels",
} as const;

/** Our app's API routes (used by frontend fetch, relative to origin) */
export const appApiPaths = {
  hotelSearch: "/api/hotel-search",
  checkPrice: "/api/check-price",
} as const;
