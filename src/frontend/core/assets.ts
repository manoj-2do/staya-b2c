/**
 * Getter for public images and icons. All paths are relative to the public folder
 * (served at site root). Use these instead of hardcoding URLs so assets can be
 * swapped for localisation or environment-specific CDNs later.
 */

const BASE = "";

function icon(path: string): string {
  return `${BASE}/icons/${path}`.replace(/^\/+/, "/");
}

export const assets = {
  /** Header / nav category icons (public/icons/) */
  icons: {
    hotel: icon("hotel_icon.png"),
    flight: icon("flight_icon.png"),
    holidays: icon("holidays_icon.png"),
  },
} as const;

export type Assets = typeof assets;
