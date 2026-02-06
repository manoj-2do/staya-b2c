/**
 * Location search — shared types used by both lib/api (TravClan) and features (UI).
 * Source of truth for location search DTOs.
 */

export interface LocationSearchCoordinates {
  lat: number;
  long: number;
}

/** Location/entity type from TravClan API. */
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
  referenceId: string | null;
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
