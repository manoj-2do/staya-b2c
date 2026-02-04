/**
 * Hotel search params — encode/decode payload for URL and sessionStorage.
 */

import type { HotelSearchPayload } from "@/frontend/features/home/models/HotelSearch";

const STORAGE_KEY = "staya:hotelSearchPayload";

export function storeSearchPayload(payload: HotelSearchPayload): void {
  if (typeof window === "undefined") return;
  try {
    sessionStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
  } catch {
    // ignore
  }
}

export function getSearchPayload(): HotelSearchPayload | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = sessionStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    return JSON.parse(raw) as HotelSearchPayload;
  } catch {
    return null;
  }
}

export function buildSearchParamsFromPayload(
  payload: HotelSearchPayload,
  where: string
): string {
  const params = new URLSearchParams();
  params.set("checkIn", payload.checkIn ?? "");
  params.set("checkOut", payload.checkOut ?? "");
  params.set("where", where);
  if (payload.locationId != null)
    params.set("locationId", String(payload.locationId));
  if (payload.hotelIds?.length)
    params.set("hotelIds", payload.hotelIds.join(","));
  return params.toString();
}
