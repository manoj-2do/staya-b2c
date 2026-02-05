/**
 * Central content file for user-facing strings and image URLs.
 * Do not hardcode copy or asset URLs in components — keep them here
 * so localisation can be introduced later.
 *
 * When adding localisation: add per-locale files (e.g. content/en.ts,
 * content/de.ts) with the same shape, then a helper like getContent(locale)
 * that returns the right object. Components keep importing from this layer.
 */

export const content = {
  /** App / site branding */
  app: {
    name: "STAYA",
    tagline: "Snap - Hotels, Flights and Package Booking made effortless",
    description:
      "Snap - Hotels, Flights and Package Booking made effortless. Explore and book hotels, flights, and holiday packages.",
  },

  /** Top utility strip */
  topBar: {
    phone: "123 4567 908",
    promoText: "Best Travel Deals, Seamless Booking",
    register: "Register",
    emailLabel: "Contact",
  },

  /** Navigation */
  nav: {
    travelCategoriesAriaLabel: "Travel categories",
    hotels: "Hotels",
    flights: "Flights",
    holidays: "Holidays",
    hotelsActiveAria: "Hotels — active",
    flightsComingSoonAria: "Flights — coming soon",
    holidaysComingSoonAria: "Holidays — coming soon",
    moreMenuAria: "More menu",
    callSupportAria: "Call or support",
    bookNow: "Book Now",
  },

  /** Hero / search widget */
  hero: {
    headline: "Find your perfect stay",
    hotelTabActiveAria: "Hotels — active",
    hotelTabLabel: "Hotels",
    flightTabLabel: "Flights",
    holidayTabLabel: "Holidays",
    flightTabComingSoonAria: "Flights — coming soon",
    holidayTabComingSoonAria: "Holidays — coming soon",
    /** First-view labels */
    whereLabel: "Where",
    wherePlaceholder: "Search Hotels",
    whenLabel: "When",
    whenPlaceholder: "Add dates",
    whoLabel: "Who",
    whoPlaceholder: "Add guests",
    locationLabel: "Location",
    locationPlaceholder: "Select your location",
    checkInLabel: "Check in",
    checkOutLabel: "Check out",
    datePlaceholder: "Select your Date",
    guestsLabel: "Guest",
    guestPlaceholder: "1 Guest",
    destinationHintSr: "Search is not active in this version",
    searchButton: "Search",
    /** Where suggestions (sample) */
    whereSuggestions: [
      "Mumbai, India",
      "Goa, India",
      "Delhi, India",
      "Bangalore, India",
      "Kerala, India",
    ],
    /** Who / rooms */
    roomLabel: "Room",
    roomsLabel: "Rooms",
    addRoom: "Add room",
    adultsLabel: "Adults",
    childrenLabel: "Children",
    adult: "Adult",
    child: "Child",
  },

  /** Hotel results */
  hotelResults: {
    emptyTitle: "No hotels found",
    emptyMessage: "Try adjusting your search or filters to find more options.",
    loadingMore: "Loading more…",
    showMap: "Show map",
  },

  /** Validation toasts */
  validation: {
    selectDestination: "Please select a hotel",
  },

  /** Network status (global) */
  network: {
    offlineMessage: "You're offline. Some features may not work.",
    backOnlineMessage: "You're back online.",
    internetRequiredMessage: "Internet is required for this.",
  },

  /** Images / assets — URLs only, no inline strings in UI */
  images: {
    homeHeroBackground:
      "https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=1920&q=80",
  },
} as const;

export type Content = typeof content;
