/**
 * Hotel search API response model.
 * Matches CURRENT_FOCUS.md backend response structure.
 */

export interface HotelSearchRateOffer {
  title: string;
  description: string;
  discountOffer: string;
  percentageDiscountOffer: string;
}

export interface HotelSearchRate {
  providerId: string | null;
  providerName: string | null;
  offer: HotelSearchRateOffer;
  distributionChannel: string;
  payAtHotel: boolean;
  additionalCharges: unknown[];
  cancellationPolicy: unknown[];
  additionalInformation: unknown[];
  isChildConvertedToAdult: boolean;
  sellRate: number | null;
  finalRate: number;
  finalRateWithDefaultAgentMarkup: number;
  totalDefaultMarkup: number;
  pRpNFinalRate: number;
}

export interface HotelSearchAvailability {
  rate: HotelSearchRate;
}

export interface HotelSearchResultItem {
  id: string;
  availability?: HotelSearchAvailability;
  visited?: boolean;
  prioritizationScore?: number | null;
  /** Extended fields from API (when available) */
  name?: string;
  imageUrl?: string;
  starRating?: number;
  freeBreakfast?: boolean;
  isRefundable?: boolean;
  city?: string;
  area?: string;
}

export interface TraceIdDetails {
  id: string;
  remainingTime: number | null;
  createdAt: string | null;
}

export interface HotelSearchResultsData {
  currentPage: number;
  perPage: number;
  previousPage: number | null;
  nextPage: number | null;
  totalCount: number;
  totalPages: number;
  data: HotelSearchResultItem[];
  traceIdDetails?: TraceIdDetails;
}

export interface HotelSearchResponse {
  message: string;
  error: boolean;
  code: number;
  results: HotelSearchResultsData;
}
