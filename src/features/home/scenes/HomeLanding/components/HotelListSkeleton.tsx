import React from "react";
import { useVirtualizer } from "@tanstack/react-virtual";
import { HotelCardSkeleton } from "@/features/hotels/components/HotelCardSkeleton";
import { useGridColumns } from "@/features/home/hooks/useGridColumns";

const SKELETON_COUNT = 20; // Enough to fill screen + scroll a bit
const CARD_MIN_HEIGHT = 320;
const CARD_GAP = 16; /* gap-y-4 = 16px */

export function HotelListSkeleton({ parentRef }: { parentRef: React.RefObject<HTMLDivElement | null> }) {
    const cardsPerRow = useGridColumns();
    const rowCount = Math.ceil(SKELETON_COUNT / cardsPerRow);

    const virtualizer = useVirtualizer({
        count: rowCount,
        getScrollElement: () => parentRef.current,
        estimateSize: () => CARD_MIN_HEIGHT + CARD_GAP,
        overscan: 2,
    });

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 mt-4">
            <div
                style={{
                    height: `${virtualizer.getTotalSize()}px`,
                    width: "100%",
                    position: "relative",
                }}
            >
                {virtualizer.getVirtualItems().map((virtualRow) => {
                    const startIdx = virtualRow.index * cardsPerRow;
                    // Generate indices for this row
                    const items = Array.from({ length: cardsPerRow })
                        .map((_, i) => startIdx + i)
                        .filter((idx) => idx < SKELETON_COUNT);

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
                            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-x-6 pb-4" // pb-4 adds the Y gap to the measured height
                        >
                            {items.map((key) => (
                                <HotelCardSkeleton key={key} />
                            ))}
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
