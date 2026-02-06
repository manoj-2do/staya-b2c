/**
 * App route paths. Use these instead of hardcoding path strings.
 */

export const paths = {
  home: "/",
  homePage: "/home",
  hotels: "/hotels",
  hotelsSearch: "/hotels/search",
  flightsSearch: "/flights/search",
  packagesSearch: "/packages/search",
} as const;

export const categorySearchPaths = {
  hotel: "/hotels/search",
  flights: "/flights/search",
  packages: "/packages/search",
} as const;

export type PathKey = keyof typeof paths;
