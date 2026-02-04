/**
 * Mock hotel search response for development.
 * Enable via NEXT_PUBLIC_USE_MOCK_HOTEL_SEARCH=true
 */

import type { HotelSearchResponse } from "@/frontend/features/hotels/models/HotelSearchResponse";

const MOCK_HOTELS = [
  {
    id: "39621191",
    name: "Beach View Resort",
    imageUrl:
      "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=400&h=300&fit=crop",
    starRating: 4.79,
    freeBreakfast: true,
    isRefundable: true,
    city: "Kollam",
    area: "Kollam beach",
    visited: true,
    prioritizationScore: null,
    availability: {
      rate: {
        providerId: null,
        providerName: null,
        offer: {
          title: "3",
          description: "ExclusiveDeal",
          discountOffer: "0",
          percentageDiscountOffer: "0",
        },
        distributionChannel: "Any",
        payAtHotel: false,
        additionalCharges: [],
        cancellationPolicy: [],
        additionalInformation: [],
        isChildConvertedToAdult: false,
        sellRate: null,
        finalRate: 2568,
        finalRateWithDefaultAgentMarkup: 2568,
        totalDefaultMarkup: 0,
        pRpNFinalRate: 856,
      },
    },
  },
  {
    id: "39621192",
    name: "Oceanfront Paradise",
    imageUrl:
      "https://images.unsplash.com/photo-1582719508461-905c673771fd?w=400&h=300&fit=crop",
    starRating: 4.85,
    freeBreakfast: true,
    isRefundable: true,
    city: "Vypin",
    area: "Vypin beach",
    visited: false,
    prioritizationScore: null,
    availability: {
      rate: {
        providerId: null,
        providerName: null,
        offer: {
          title: "2",
          description: "Best Value",
          discountOffer: "0",
          percentageDiscountOffer: "0",
        },
        distributionChannel: "Any",
        payAtHotel: false,
        additionalCharges: [],
        cancellationPolicy: [],
        additionalInformation: [],
        isChildConvertedToAdult: false,
        sellRate: null,
        finalRate: 2568,
        finalRateWithDefaultAgentMarkup: 2568,
        totalDefaultMarkup: 0,
        pRpNFinalRate: 856,
      },
    },
  },
  {
    id: "39621193",
    name: "Sunset Haven",
    imageUrl:
      "https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=400&h=300&fit=crop",
    starRating: 4.72,
    freeBreakfast: false,
    isRefundable: true,
    city: "Kollam",
    area: "Kollam beach",
    visited: true,
    prioritizationScore: null,
    availability: {
      rate: {
        providerId: null,
        providerName: null,
        offer: {
          title: "1",
          description: "Standard",
          discountOffer: "0",
          percentageDiscountOffer: "0",
        },
        distributionChannel: "Any",
        payAtHotel: true,
        additionalCharges: [],
        cancellationPolicy: [],
        additionalInformation: [],
        isChildConvertedToAdult: false,
        sellRate: null,
        finalRate: 2568,
        finalRateWithDefaultAgentMarkup: 2568,
        totalDefaultMarkup: 0,
        pRpNFinalRate: 856,
      },
    },
  },
  {
    id: "39621194",
    name: "Palm Grove Villa",
    imageUrl:
      "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=400&h=300&fit=crop",
    starRating: 4.65,
    freeBreakfast: true,
    isRefundable: false,
    city: "Kozhikode",
    area: "Kozhikode beach",
    visited: false,
    prioritizationScore: null,
    availability: {
      rate: {
        providerId: null,
        providerName: null,
        offer: {
          title: "2",
          description: "Deal",
          discountOffer: "0",
          percentageDiscountOffer: "0",
        },
        distributionChannel: "Any",
        payAtHotel: false,
        additionalCharges: [],
        cancellationPolicy: [],
        additionalInformation: [],
        isChildConvertedToAdult: false,
        sellRate: null,
        finalRate: 2568,
        finalRateWithDefaultAgentMarkup: 2568,
        totalDefaultMarkup: 0,
        pRpNFinalRate: 856,
      },
    },
  },
  {
    id: "39621196",
    name: "Tropical Bliss",
    imageUrl:
      "https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?w=400&h=300&fit=crop",
    starRating: 4.58,
    freeBreakfast: true,
    isRefundable: true,
    city: "Kovalam",
    area: "Lighthouse beach",
    visited: false,
    prioritizationScore: null,
    availability: {
      rate: {
        providerId: null,
        providerName: null,
        offer: {
          title: "1",
          description: "Standard",
          discountOffer: "0",
          percentageDiscountOffer: "0",
        },
        distributionChannel: "Any",
        payAtHotel: false,
        additionalCharges: [],
        cancellationPolicy: [],
        additionalInformation: [],
        isChildConvertedToAdult: false,
        sellRate: null,
        finalRate: 2890,
        finalRateWithDefaultAgentMarkup: 2890,
        totalDefaultMarkup: 0,
        pRpNFinalRate: 963,
      },
    },
  },
  {
    id: "39621197",
    name: "Seaside Retreat",
    imageUrl:
      "https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?w=400&h=300&fit=crop",
    starRating: 4.91,
    freeBreakfast: true,
    isRefundable: true,
    city: "Goa",
    area: "Calangute",
    visited: false,
    prioritizationScore: null,
    availability: {
      rate: {
        providerId: null,
        providerName: null,
        offer: {
          title: "3",
          description: "ExclusiveDeal",
          discountOffer: "0",
          percentageDiscountOffer: "0",
        },
        distributionChannel: "Any",
        payAtHotel: false,
        additionalCharges: [],
        cancellationPolicy: [],
        additionalInformation: [],
        isChildConvertedToAdult: false,
        sellRate: null,
        finalRate: 3245,
        finalRateWithDefaultAgentMarkup: 3245,
        totalDefaultMarkup: 0,
        pRpNFinalRate: 1082,
      },
    },
  },
];

export function getMockHotelSearchResponse(
  page: number = 1,
  perPage: number = 5
): HotelSearchResponse {
  const start = (page - 1) * perPage;
  const paginatedHotels = MOCK_HOTELS.slice(start, start + perPage);
  const totalCount = MOCK_HOTELS.length;
  const totalPages = Math.ceil(totalCount / perPage);

  return {
    message: "OK",
    error: false,
    code: 200,
    results: {
      currentPage: page,
      perPage,
      previousPage: page > 1 ? page - 1 : null,
      nextPage: page < totalPages ? page + 1 : null,
      totalCount,
      totalPages,
      data: paginatedHotels,
      traceIdDetails: {
        id: "mock-trace-" + Date.now(),
        remainingTime: null,
        createdAt: new Date().toISOString(),
      },
    },
  };
}
