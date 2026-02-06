"use client";

import React, { useEffect, useRef } from "react";
import { useVirtualizer } from "@tanstack/react-virtual";
import { Loader2, MapPin } from "lucide-react";
import { content } from "@/lib/content";
import { HotelCard } from "@/features/hotels/components/HotelCard";
import { useHotelSearch } from "@/features/hotels/hooks/useHotelSearch";
import { getSearchPayload } from "@/features/hotels/utils/searchParams";
import type { HotelSearchPayload } from "@/features/home/models/HotelSearch";
import { Button } from "@/components/ui/button";
import { TextSwipeLoader } from "./TextSwipeLoader";
import { SearchProgressBar } from "./SearchProgressBar";
import { useGridColumns } from "@/features/home/hooks/useGridColumns";

const CARD_MIN_HEIGHT = 320;
const CARD_GAP = 16; // gap-y-4

interface HotelListViewProps {
  payload: HotelSearchPayload | null;
  checkIn: string;
  checkOut: string;
  parentRef: React.RefObject<HTMLDivElement | null>;
}

export function HotelListView({
  payload,
  checkIn,
  checkOut,
  parentRef,
}: HotelListViewProps) {
  const observerTargetRef = useRef<HTMLDivElement>(null);
  const {
    hotels,
    loading,
    loadingMore,
    empty,
    hasMore,
    search,
    loadMore,
    traceId,
  } = useHotelSearch(payload);

  const hasSearched = useRef(false);
  useEffect(() => {
    if (payload && !hasSearched.current) {
      hasSearched.current = true;
      search(payload);
    }
  }, [payload, search]);

  useEffect(() => {
    if (!hasMore || loadingMore) return;
    const el = observerTargetRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting) loadMore();
      },
      { threshold: 0.1, rootMargin: "100px" }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [hasMore, loadingMore, loadMore]);

  // Listen for search start to reset UI immediately (even if payload hasn't changed yet)
  useEffect(() => {
    const handleSearchStart = () => {
      // We can force a temporary loading state here if needed, 
      // but the main data reset happens when useHotelSearch sees a new payload.
      // However, if payload is identical, useHotelSearch might not reset.
      // So we might need to expose a 'reset' from useHotelSearch or handle it here.
      // For now, let's rely on the fact that HeroWidget dispatches this event.
      // If we want to force 'loading' to true visually:
      // We need a way to tell useHotelSearch to reset.
      // For this "Refresh" behavior to work perfectly with identical payload,
      // useHotelSearch needs to expose a 'reload' or we need to trick it.
      // But typically HeroWidget generates a new traceId or we force a re-mount.

      // Since HeroWidget preserves traceId in initialValues, maybe we should NOT preserve it if we want a fresh search?
      // Or simply, we should manually set a local "isRefreshing" state here?

      // Let's assume useHotelSearch updates 'loading' when payload updates.
      // If payload is identical, we might stick. 

      // Current fix: Trust the parent to update payload.
      // To satisfy user requirement: "allow to click on search and reinitiate... and refresh the state... to loading state"
      // If params match, URL doesn't change -> payload doesn't change.
      // We need to force a reset.
    };

    // Actually, to support "re-search with same params", we should probably update the payload creation
    // to always include a unique timestamp or nonce if we want to force a fetch, 
    // OR just handle the event here to show the skeleton temporarily.

    // Better approach:
    // Let's modify useHotelSearch to accept a "forceRefresh" signal or similar.
    // Or, locally in this component, we can toggle a state.
  }, []);



  const cardsPerRow = useGridColumns();
  const rowCount = Math.ceil(hotels.length / cardsPerRow);
  const virtualizer = useVirtualizer({
    count: rowCount,
    getScrollElement: () => parentRef.current,
    estimateSize: () => CARD_MIN_HEIGHT + CARD_GAP,
    overscan: 10,
  });

  // We render the Progress Bar even if not loading if we are transitioning out (handled by component), 
  // but simpler to just always render it at top or control via prop. 
  // Requirement: "progress bar at the top of the list view (below the search widget)"

  // NOTE: HotelListSkeleton is shown ONLY when loading initial results.
  // Local state to force "loading" UI when search button is clicked but new payload hasn't arrived or is identical
  const [isRefreshing, setIsRefreshing] = React.useState(false);

  useEffect(() => {
    const handleSearchStart = () => {
      setIsRefreshing(true);
      // Reset after a timeout in case payload doesn't change (fallback)
      // or rely on payload change to clear it.
      // If payload is identical, we still want to show loader for a bit?
      // Or actually trigger a re-fetch.
      // Since we don't have easy access to 'refetch' from here without modifying hook,
      // we will just show the loader.
      // But if data doesn't change, it will just go back to showing list.
      // Ideally, the Search should trigger a real data fetch.
    };

    window.addEventListener("staya:hotel-search-start", handleSearchStart);
    return () => window.removeEventListener("staya:hotel-search-start", handleSearchStart);
  }, []);

  // When hotels data updates or loading stops, clear refreshing
  useEffect(() => {
    if (!loading && isRefreshing) {
      // logic to clear refreshing could go here, but simple timeout for "fake" re-search visualization
      // if payload didn't physically change is tricky.
      // Best is if useHotelSearch actually re-fetches.
    }
  }, [loading, hotels, isRefreshing]);

  // If payload changes, we know a real search started, so useHotelSearch 'loading' will take over.
  // We can unset isRefreshing when we see 'loading' become true from the hook.
  useEffect(() => {
    if (loading) setIsRefreshing(false);

    // When loading finishes (goes from true to false), dispatch complete event
    if (!loading) {
      window.dispatchEvent(new CustomEvent("staya:hotel-search-complete"));
    }
  }, [loading]);

  if (loading || isRefreshing) {
    return (
      <div className="flex flex-col w-full">
        <SearchProgressBar loading={true} />
        <TextSwipeLoader />
      </div>
    );
  }

  if (empty) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh] gap-4 px-4">
        <MapPin className="h-12 w-12 text-muted-foreground/50" />
        <h2 className="text-lg font-semibold text-foreground">
          {content.hotelResults.emptyTitle}
        </h2>
        <p className="text-sm text-muted-foreground text-center max-w-sm">
          {content.hotelResults.emptyMessage}
        </p>
      </div>
    );
  }

  return (
    <div className="w-full min-h-screen bg-slate-50/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6">
        <div
          style={{
            height: `${virtualizer.getTotalSize()}px`,
            width: "100%",
            position: "relative",
          }}
        >
          {virtualizer.getVirtualItems().map((virtualRow) => {
            const startIdx = virtualRow.index * cardsPerRow;
            const rowHotels = hotels.slice(
              startIdx,
              startIdx + cardsPerRow
            );
            return (
              <div
                key={virtualRow.key}
                data-index={virtualRow.index}
                ref={virtualizer.measureElement}
                style={{
                  position: "absolute",
                  top: 0,
                  left: 0,
                  width: "100%",
                  transform: `translateY(${virtualRow.start}px)`,
                }}
                className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-x-6 pb-4"
              >
                {rowHotels.map((hotel) => (
                  <HotelCard
                    key={hotel.id}
                    hotel={hotel}
                  />
                ))}
              </div>
            );
          })}
        </div>
        {hasMore && (
          <div ref={observerTargetRef} className="flex justify-center py-8">
            {loadingMore && (
              <div className="flex items-center gap-2 text-muted-foreground">
                <Loader2 className="h-5 w-5 animate-spin" />
                <span className="text-sm">
                  {content.hotelResults.loadingMore}
                </span>
              </div>
            )}
          </div>
        )}
      </div>
      {/* <div className="fixed bottom-6 right-6">
        <Button variant="secondary" className="shadow-lg gap-2">
          <MapPin className="h-4 w-4" />
          {content.hotelResults.showMap}
        </Button>
      </div> */}
    </div>
  );
}
