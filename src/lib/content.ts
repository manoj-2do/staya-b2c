/**
 * Central content file for user-facing strings and image URLs.
 */

export const content = {
  app: {
    name: "STAYA",
    tagline: "Snap - Hotels, Flights and Package Booking made effortless",
    description:
      "Snap - Hotels, Flights and Package Booking made effortless. Explore and book hotels, flights, and holiday packages.",
  },
  topBar: {
    phone: "123 4567 908",
    promoText: "Best Travel Deals, Seamless Booking",
    register: "Register",
    emailLabel: "Contact",
  },
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
  hero: {
    headline: "Find your perfect stay",
    hotelTabActiveAria: "Hotels — active",
    hotelTabLabel: "Hotels",
    flightTabLabel: "Flights",
    holidayTabLabel: "Holidays",
    flightTabComingSoonAria: "Flights — coming soon",
    holidayTabComingSoonAria: "Holidays — coming soon",
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
    whereSuggestions: [
      "Mumbai, India",
      "Goa, India",
      "Delhi, India",
      "Bangalore, India",
      "Kerala, India",
    ],
    roomLabel: "Room",
    roomsLabel: "Rooms",
    addRoom: "Add room",
    adultsLabel: "Adults",
    childrenLabel: "Children",
    adult: "Adult",
    child: "Child",
  },
  hotelResults: {
    emptyTitle: "No hotels found",
    emptyMessage: "Try adjusting your search or filters to find more options.",
    loadingMore: "Loading more…",
    showMap: "Show map",
  },
  validation: {
    selectDestination: "Please select a hotel",
  },
  network: {
    offlineMessage: "You're offline. Some features may not work.",
    backOnlineMessage: "You're back online.",
    internetRequiredMessage: "Internet is required for this.",
  },
  images: {
    homeHeroBackground:
      "https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=1920&q=80",
  },
} as const;

export type Content = typeof content;
