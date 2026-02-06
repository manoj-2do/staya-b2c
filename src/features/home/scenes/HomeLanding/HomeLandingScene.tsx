"use client";

import React, { useEffect, useRef, useMemo } from "react";
import { useSearchParams } from "next/navigation";
import { parse } from "date-fns";
import { paths } from "@/lib/paths";
import { updateSearchPath } from "@/features/home/hooks/useSearchPath";
import { HomeHeader } from "./components/HomeHeader";
import { HeroSection } from "./components/HeroSection";
import { HotelListView } from "./components/HotelListView";
import { FlightsListView } from "./components/FlightsListView";
import { PackagesListView } from "./components/PackagesListView";
import { ExpiredSearchPopup } from "@/features/hotels/components/ExpiredSearchPopup";
import { useSearchPath } from "@/features/home/hooks/useSearchPath";
import { getSearchPayload } from "@/features/hotels/utils/searchParams";
import { getLastSearchedDestination } from "@/features/hotels/utils/lastSearchDestination";
import { cn } from "@/lib/utils/cn";
import type { HeroWidgetInitialValues } from "./components/HeroWidget";
import type { LocationSearchResult } from "@/features/home/models/LocationSearch";

export function HomeLandingScene() {
  const searchParams = useSearchParams();
  const searchView = useSearchPath();
  const parentRef = useRef<HTMLDivElement>(null);

  const isHomeView = searchView === "home";
  const isListView = searchView === "hotels" || searchView === "flights" || searchView === "packages";

  const payload = useMemo(() => getSearchPayload(), [searchParams]);
  const where = searchParams?.get("where") ?? "Destination";
  const checkIn = searchParams?.get("checkIn") ?? "";
  const checkOut = searchParams?.get("checkOut") ?? "";
  const guestCount =
    payload?.occupancies?.reduce(
      (s, o) => s + o.numOfAdults + (o.childAges?.length ?? 0),
      0
    ) ?? 1;
  const roomCount = payload?.occupancies?.length ?? 1;
  const dateRange =
    checkIn && checkOut
      ? `${checkIn.split("-").slice(1).join("/")} – ${checkOut
        .split("-")
        .slice(1)
        .join("/")}`
      : "";

  const heroInitialValues = useMemo((): HeroWidgetInitialValues | undefined => {
    if (!isListView || !payload) return undefined;
    const from =
      checkIn && /^\d{4}-\d{2}-\d{2}$/.test(checkIn)
        ? parse(checkIn, "yyyy-MM-dd", new Date())
        : undefined;
    const to =
      checkOut && /^\d{4}-\d{2}-\d{2}$/.test(checkOut)
        ? parse(checkOut, "yyyy-MM-dd", new Date())
        : undefined;
    const last = getLastSearchedDestination();
    const loc: LocationSearchResult | null = last?.location
      ? {
        id: last.location.id,
        name: last.location.fullName.split(",")[0]?.trim() ?? last.location.fullName,
        fullName: last.location.fullName,
        type: last.location.type as LocationSearchResult["type"],
        city: null,
        state: null,
        country: last.location.country,
        coordinates: { lat: 0, long: 0 },
        referenceId: last.location.referenceId,
        referenceScore: 0,
        isTermMatch: false,
        relevanceScore: 0,
        travclanScore: null,
      }
      : null;
    if (!from || !to) return undefined;
    return {
      where,
      dateRange: { from, to },
      rooms:
        payload.occupancies?.map((o) => ({
          adults: o.numOfAdults,
          childAges: o.childAges ?? [],
        })) ?? [{ adults: 1, childAges: [] }],
      selectedLocation: loc,
      traceId: payload.traceId,
    };
  }, [isListView, payload, where, checkIn, checkOut]);

  useEffect(() => {
    if (searchView === "hotels" && !payload) {
      updateSearchPath(paths.home);
    }
  }, [searchView, payload]);

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <HomeHeader
        isResultsView={isListView}
        heroInitialValues={heroInitialValues}
      />

      <main
        className={cn(
          "flex-1 overflow-auto transition-opacity duration-300",
          isListView && "min-h-0"
        )}
        ref={parentRef}
        aria-label="Page content"
      >
        {/* Hero Section — hidden when list view is shown */}
        <div
          className={cn(
            "grid transition-all duration-700 ease-out",
            isListView ? "grid-rows-[0fr] opacity-0 invisible delay-75" : "grid-rows-[1fr] opacity-100 visible"
          )}
          aria-hidden={isListView}
        >
          <div className="overflow-hidden min-w-0">
            <HeroSection />
          </div>
        </div>

        {/* List View Section — visible after search, fades in */}
        <div
          className={cn(
            "grid transition-all duration-500 ease-in-out",
            isListView ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
          )}
          aria-hidden={!isListView}
        >
          <div className="overflow-hidden min-w-0">
            {searchView === "hotels" && (
              <HotelListView
                payload={payload}
                checkIn={checkIn}
                checkOut={checkOut}
                parentRef={parentRef}
              />
            )}
            {searchView === "flights" && <FlightsListView />}
            {searchView === "packages" && <PackagesListView />}
          </div>
        </div>
      </main>

      <ExpiredSearchPopup open={false} onDismiss={() => { }} />
    </div >
  );
}
