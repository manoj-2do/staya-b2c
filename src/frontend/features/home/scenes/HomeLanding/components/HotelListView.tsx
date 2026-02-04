"use client";

import React, { useEffect, useRef } from "react";
import { useVirtualizer } from "@tanstack/react-virtual";
import { Loader2, MapPin } from "lucide-react";
import { content } from "@/frontend/core/content";
import { HotelCard } from "@/frontend/features/hotels/components/HotelCard";
import { useHotelSearch } from "@/frontend/features/hotels/hooks/useHotelSearch";
import { getSearchPayload } from "@/frontend/features/hotels/utils/searchParams";
import type { HotelSearchPayload } from "@/frontend/features/home/models/HotelSearch";
import { Button } from "@/frontend/components/ui/button";
import { TextSwipeLoader } from "./TextSwipeLoader";
import { SearchProgressBar } from "./SearchProgressBar";
import { useGridColumns } from "@/frontend/features/home/hooks/useGridColumns";

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
  if (loading) {
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
    <>
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
                    checkIn={checkIn}
                    checkOut={checkOut}
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
      <div className="fixed bottom-6 right-6">
        <Button variant="secondary" className="shadow-lg gap-2">
          <MapPin className="h-4 w-4" />
          {content.hotelResults.showMap}
        </Button>
      </div>
    </>
  );
}
