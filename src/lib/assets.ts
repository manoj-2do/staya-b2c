/**
 * Public images and icons. Paths relative to public folder.
 */

const BASE = "";

function icon(path: string): string {
  return `${BASE}/icons/${path}`.replace(/^\/+/, "/");
}

export const assets = {
  icons: {
    hotel: icon("hotel_icon.png"),
    flight: icon("flight_icon.png"),
    holidays: icon("holidays_icon.png"),
  },
} as const;

export type Assets = typeof assets;
