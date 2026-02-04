/**
 * Location search API response model (GET /api/v1/locations/search/).
 * Use in services and views for type-safe results.
 */

export interface LocationSearchCoordinates {
  lat: number;
  long: number;
}

/** Location/entity type from API. */
export enum LocationType {
  Airport = "Airport",
  Country = "Country",
  State = "State",
  MultiCity = "MultiCity",
  City = "City",
  Region = "Region",
  PointOfInterest = "PointOfInterest",
  Neighborhood = "Neighborhood",
  Hotel = "Hotel",
  TrainStation = "TrainStation",
  Undefined = "Undefined",
}

export interface LocationSearchResult {
  id: number | null;
  name: string;
  fullName: string;
  type: LocationType;
  city: string | null;
  state: string | null;
  country: string;
  coordinates: LocationSearchCoordinates;
  /** An identifier used for reference purposes. */
  referenceId: string | null;
  /** A score used to rank or assess the reference. */
  referenceScore: number;
  isTermMatch: boolean;
  relevanceScore: number;
  travclanScore: number | null;
}

export interface LocationSearchResponse {
  message: string;
  error: boolean;
  code: number;
  results: LocationSearchResult[];
}
