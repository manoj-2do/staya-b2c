/**
 * Hotel search request model and payload builder.
 * Matches CURRENT_FOCUS.md specification.
 * - Include only fields with values (exclude null/undefined)
 * - Dates in YYYY-MM-DD format
 */

import { format } from "date-fns";

export interface HotelSearchOccupancy {
  numOfAdults: number;
  childAges: number[];
}

export interface HotelSearchFilterBy {
  freeBreakfast?: boolean;
  isRefundable?: boolean;
  subLocationIds?: number[];
  ratings?: number[];
  reviewRatings?: number[];
  hotelName?: string;
  facilities?: string[];
  type?: string;
  tags?: string[];
}

export interface HotelSearchSortBy {
  /** Other sort options (e.g. sortBy field) — page is a separate top-level key */
}

export interface HotelSearchPayload {
  checkIn?: string;
  checkOut?: string;
  locationId?: string;
  nationality?: string;
  hotelIds?: string[];
  occupancies?: HotelSearchOccupancy[];
  filterBy?: HotelSearchFilterBy;
  sortBy?: HotelSearchSortBy;
  page?: number;
  traceId?: string;
}

export interface HotelSearchFormInput {
  checkIn?: Date;
  checkOut?: Date;
  locationId?: string | null;
  nationality?: string | null;
  hotelIds?: string[] | null;
  occupancies?: HotelSearchOccupancy[] | null;
  filterBy?: HotelSearchFilterBy | null;
  sortBy?: HotelSearchSortBy | null;
  page?: number | null;
  traceId?: string | null;
}

/** Removes null, undefined, and empty values from an object recursively. */
function pruneEmpty<T extends Record<string, unknown>>(obj: T): Partial<T> {
  const result: Record<string, unknown> = {};
  for (const [key, value] of Object.entries(obj)) {
    if (value === null || value === undefined) continue;
    if (Array.isArray(value)) {
      if (value.length === 0) continue;
      const pruned = value.map((item) =>
        item !== null &&
        typeof item === "object" &&
        !Array.isArray(item) &&
        !(item instanceof Date)
          ? pruneEmpty(item as Record<string, unknown>)
          : item
      );
      result[key] = pruned;
    } else if (
      typeof value === "object" &&
      value !== null &&
      !(value instanceof Date)
    ) {
      const nested = pruneEmpty(value as Record<string, unknown>);
      if (Object.keys(nested).length > 0) result[key] = nested;
    } else {
      result[key] = value;
    }
  }
  return result as Partial<T>;
}

/**
 * Builds the hotel search request payload.
 * - Excludes null and undefined
 * - Converts dates to YYYY-MM-DD
 * - Removes empty nested objects and arrays
 */
export function buildHotelSearchPayload(
  input: HotelSearchFormInput
): HotelSearchPayload {
  const raw: Record<string, unknown> = {};

  if (input.checkIn) {
    raw.checkIn = format(input.checkIn, "yyyy-MM-dd");
  }
  if (input.checkOut) {
    raw.checkOut = format(input.checkOut, "yyyy-MM-dd");
  }
  if (input.locationId != null && input.locationId !== undefined) {
    raw.locationId = input.locationId;
  }
  if (
    input.nationality != null &&
    input.nationality !== undefined &&
    input.nationality !== ""
  ) {
    raw.nationality = input.nationality;
  }
  if (input.hotelIds != null && input.hotelIds.length > 0) {
    raw.hotelIds = input.hotelIds;
  }
  if (input.occupancies != null && input.occupancies.length > 0) {
    raw.occupancies = input.occupancies;
  }
  if (input.filterBy != null && Object.keys(input.filterBy).length > 0) {
    const filterBy: Record<string, unknown> = {};
    const fb = input.filterBy;
    if (fb.freeBreakfast !== undefined)
      filterBy.freeBreakfast = fb.freeBreakfast;
    if (fb.isRefundable !== undefined) filterBy.isRefundable = fb.isRefundable;
    if (fb.subLocationIds?.length) filterBy.subLocationIds = fb.subLocationIds;
    if (fb.ratings?.length) filterBy.ratings = fb.ratings;
    if (fb.reviewRatings?.length) filterBy.reviewRatings = fb.reviewRatings;
    if (fb.hotelName) filterBy.hotelName = fb.hotelName;
    if (fb.facilities?.length) filterBy.facilities = fb.facilities;
    if (fb.type) filterBy.type = fb.type;
    if (fb.tags?.length) filterBy.tags = fb.tags;
    if (Object.keys(filterBy).length > 0) raw.filterBy = filterBy;
  }
  if (input.sortBy != null && Object.keys(input.sortBy).length > 0) {
    raw.sortBy = input.sortBy;
  }
  if (input.page != null && input.page !== undefined) {
    raw.page = input.page;
  }
  if (
    input.traceId != null &&
    input.traceId !== undefined &&
    input.traceId !== ""
  ) {
    raw.traceId = input.traceId;
  }

  return pruneEmpty(raw) as HotelSearchPayload;
}

/** Generates a unique trace ID for request tracking. */
export function generateTraceId(): string {
  return `req-${Date.now()}-${Math.random().toString(36).slice(2, 11)}`;
}
