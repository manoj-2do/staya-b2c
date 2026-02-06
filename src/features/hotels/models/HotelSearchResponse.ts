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

export interface HotelSearchRateOptions {
  freeBreakfast: boolean;
  freeCancellation: boolean;
  refundable: boolean;
  payAtHotel: boolean;
  contractedRateExists: boolean;
  roomOnly: boolean;
  halfBoard: boolean;
  fullBoard: boolean;
  isGstMandatory: boolean;
  isPANMandatory: boolean;
  allInclusive: boolean;
  isPrivateDistribution: boolean;
  isPublicDistribution: boolean;
  isOptimizedDistribution: boolean;
  isCorporateDistribution: boolean;
}

export interface HotelSearchBoardBasis {
  description: string;
  type: string;
}

export interface HotelSearchRate {
  providerHotelId: string | null;
  boardBasis?: HotelSearchBoardBasis;
  refundability?: string;
  providerName?: string | null;
  offer?: HotelSearchRateOffer;
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
  options?: HotelSearchRateOptions;
}

export interface HotelSearchResultItem {
  id: string;
  hotelName: string;
  heroImage: string | null;
  availability?: HotelSearchAvailability;
  visited?: boolean;
  prioritizationScore?: number | null;
  city?: string;
  area?: string;
  starRating?: number;
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
