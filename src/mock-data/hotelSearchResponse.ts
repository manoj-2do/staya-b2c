/**
 * Mock hotel search response for development.
 * Enable via NEXT_PUBLIC_USE_MOCK_HOTEL_SEARCH=true
 */

import type { HotelSearchResponse } from "@/features/hotels/models/HotelSearchResponse";

const MOCK_HOTELS = [
  {
    id: "39621191",
    hotelName: "Beach View Resort",
    heroImage:
      "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=400&h=300&fit=crop",
    starRating: 4.79,
    city: "Kollam",
    area: "Kollam beach",
    visited: true,
    prioritizationScore: null,
    availability: {
      rate: {
        providerHotelId: "115399",
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
      options: {
        freeBreakfast: true,
        freeCancellation: true,
        refundable: true,
        payAtHotel: false,
        contractedRateExists: false,
        roomOnly: false,
        halfBoard: false,
        fullBoard: false,
        isGstMandatory: false,
        isPANMandatory: false,
        allInclusive: false,
        isPrivateDistribution: false,
        isPublicDistribution: true,
        isOptimizedDistribution: false,
        isCorporateDistribution: false,
      }
    },
  },
  {
    id: "39621192",
    hotelName: "Oceanfront Paradise",
    heroImage:
      "https://images.unsplash.com/photo-1582719508461-905c673771fd?w=400&h=300&fit=crop",
    starRating: 4.85,
    city: "Vypin",
    area: "Vypin beach",
    visited: false,
    prioritizationScore: null,
    availability: {
      rate: {
        providerHotelId: "115400",
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
      options: {
        freeBreakfast: true,
        freeCancellation: true,
        refundable: true,
        payAtHotel: false,
        contractedRateExists: false,
        roomOnly: false,
        halfBoard: false,
        fullBoard: false,
        isGstMandatory: false,
        isPANMandatory: false,
        allInclusive: false,
        isPrivateDistribution: false,
        isPublicDistribution: true,
        isOptimizedDistribution: false,
        isCorporateDistribution: false,
      }
    },
  },
  {
    id: "39621193",
    hotelName: "Sunset Haven",
    heroImage:
      "https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=400&h=300&fit=crop",
    starRating: 4.72,
    city: "Kollam",
    area: "Kollam beach",
    visited: true,
    prioritizationScore: null,
    availability: {
      rate: {
        providerHotelId: "115401",
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
      options: {
        freeBreakfast: false,
        freeCancellation: true,
        refundable: true,
        payAtHotel: true,
        contractedRateExists: false,
        roomOnly: false,
        halfBoard: false,
        fullBoard: false,
        isGstMandatory: false,
        isPANMandatory: false,
        allInclusive: false,
        isPrivateDistribution: false,
        isPublicDistribution: true,
        isOptimizedDistribution: false,
        isCorporateDistribution: false,
      }
    },
  },
  {
    id: "39621194",
    hotelName: "Palm Grove Villa",
    heroImage:
      "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=400&h=300&fit=crop",
    starRating: 4.65,
    city: "Kozhikode",
    area: "Kozhikode beach",
    visited: false,
    prioritizationScore: null,
    availability: {
      rate: {
        providerHotelId: "115402",
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
      options: {
        freeBreakfast: true,
        freeCancellation: false,
        refundable: false,
        payAtHotel: false,
        contractedRateExists: false,
        roomOnly: false,
        halfBoard: false,
        fullBoard: false,
        isGstMandatory: false,
        isPANMandatory: false,
        allInclusive: false,
        isPrivateDistribution: false,
        isPublicDistribution: true,
        isOptimizedDistribution: false,
        isCorporateDistribution: false,
      }
    },
  },
  {
    id: "39621196",
    hotelName: "Tropical Bliss",
    heroImage:
      "https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?w=400&h=300&fit=crop",
    starRating: 4.58,
    city: "Kovalam",
    area: "Lighthouse beach",
    visited: false,
    prioritizationScore: null,
    availability: {
      rate: {
        providerHotelId: "115403",
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
      options: {
        freeBreakfast: true,
        freeCancellation: true,
        refundable: true,
        payAtHotel: false,
        contractedRateExists: false,
        roomOnly: false,
        halfBoard: false,
        fullBoard: false,
        isGstMandatory: false,
        isPANMandatory: false,
        allInclusive: false,
        isPrivateDistribution: false,
        isPublicDistribution: true,
        isOptimizedDistribution: false,
        isCorporateDistribution: false,
      }
    },
  },
  {
    id: "39621197",
    hotelName: "Seaside Retreat",
    heroImage:
      "https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?w=400&h=300&fit=crop",
    starRating: 4.91,
    city: "Goa",
    area: "Calangute",
    visited: false,
    prioritizationScore: null,
    availability: {
      rate: {
        providerHotelId: "115404",
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
      options: {
        freeBreakfast: true,
        freeCancellation: true,
        refundable: true,
        payAtHotel: false,
        contractedRateExists: false,
        roomOnly: false,
        halfBoard: false,
        fullBoard: false,
        isGstMandatory: false,
        isPANMandatory: false,
        allInclusive: false,
        isPrivateDistribution: false,
        isPublicDistribution: true,
        isOptimizedDistribution: false,
        isCorporateDistribution: false,
      }
    },
  },
];

export function getMockHotelSearchResponse(
  page: number = 1,
  perPage: number = 5
): HotelSearchResponse {
  const start = (page - 1) * perPage;
  // Repeat the mock hotels to simulate more pages
  const allHotels = [...MOCK_HOTELS, ...MOCK_HOTELS, ...MOCK_HOTELS].map((h, i) => ({
    ...h,
    id: `${h.id}-${i}`,
  }));

  const paginatedHotels = allHotels.slice(start, start + perPage);
  const totalCount = allHotels.length;
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
