"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { parseISO, format } from "date-fns";
import { Star, Utensils, RefreshCw, Heart, Check } from "lucide-react";
import { cn } from "@/frontend/core/utils";
import type { HotelSearchResultItem } from "../models/HotelSearchResponse";

interface HotelCardProps {
  hotel: HotelSearchResultItem;
  className?: string;
}

const PLACEHOLDER_IMAGES = [
  "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=400&h=300&fit=crop",
  "https://images.unsplash.com/photo-1582719508461-905c673771fd?w=400&h=300&fit=crop",
  "https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=400&h=300&fit=crop",
  "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=400&h=300&fit=crop",
  "https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?w=400&h=300&fit=crop",
  "https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?w=400&h=300&fit=crop",
  "https://images.unsplash.com/photo-1560200353-ce0a76b1d438?w=400&h=300&fit=crop",
  "https://images.unsplash.com/photo-1445019980597-93fa8acb246c?w=400&h=300&fit=crop",
  "https://images.unsplash.com/photo-1512918760383-564556477c93?w=400&h=300&fit=crop",
];

import { setSelectedHotel, getGlobalTraceId } from "@/frontend/core/store/searchStore";

export function HotelCard({
  hotel,
  className,
}: HotelCardProps) {
  // Deterministic random image based on hotel ID to avoid hydration mismatch or flickering
  const placeholderImage = React.useMemo(() => {
    let hash = 0;
    const str = hotel.id || "default";
    for (let i = 0; i < str.length; i++) {
      hash = str.charCodeAt(i) + ((hash << 5) - hash);
    }
    const index = Math.abs(hash) % PLACEHOLDER_IMAGES.length;
    return PLACEHOLDER_IMAGES[index];
  }, [hotel.id]);

  const price =
    hotel.availability?.rate?.finalRate ??
    hotel.availability?.rate?.finalRateWithDefaultAgentMarkup ??
    0;
  const priceParts = new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).formatToParts(price);

  const rating = hotel.starRating ?? 4.5;

  const traceId = getGlobalTraceId();
  const href = `/hotel/${hotel.id}/rooms${traceId ? `?traceId=${traceId}` : ""}`;

  const handleClick = () => {
    setSelectedHotel({
      name: hotel.hotelName ?? `Hotel ${hotel.id}`,
      id: hotel.id,
      stars: hotel.starRating
    });
  };

  return (
    <Link href={href} className={cn("block group", className)} onClick={handleClick}>
      <article
        className={cn(
          "flex flex-col overflow-hidden rounded-xl border border-border bg-card shadow-sm transition-shadow hover:shadow-md h-full"
        )}
      >
        <div className="relative aspect-[4/3] overflow-hidden bg-muted">
          <Image
            src={hotel.heroImage ?? placeholderImage}
            alt={hotel.hotelName ?? `Hotel ${hotel.id}`}
            fill
            className="object-cover transition-transform group-hover:scale-105"
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 20vw"
          />
        </div>

        <div className="flex flex-1 flex-col gap-1 p-3">
          <div className="min-w-0 flex-1">
            <h3 className="font-medium text-foreground truncate">
              {hotel.hotelName ?? "-"}
            </h3>
            <p className="text-sm text-muted-foreground truncate">
              {hotel.area ?? hotel.city}
            </p>
          </div>

          <div className="mt-auto flex items-center justify-between gap-2 pt-1">
            <span className="text-sm font-semibold flex items-baseline">
              {priceParts.map((part, i) => (
                <span
                  key={i}
                  className={part.type === 'currency' ? 'font-[Arial,sans-serif] mr-[1px]' : ''}
                >
                  {part.value}
                </span>
              ))}
            </span>
            <div className="flex items-center gap-2 text-muted-foreground">
              {hotel.availability?.options?.freeBreakfast && (
                <span title="Free breakfast" className="flex items-center">
                  <Utensils className="h-3.5 w-3.5" />
                </span>
              )}
              {hotel.availability?.options?.refundable && (
                <span title="Refundable" className="flex items-center justify-center h-4 w-4 rounded-full border border-emerald-500 text-[10px] font-bold text-emerald-600 bg-emerald-50">
                  R
                </span>
              )}
              {hotel.availability?.options?.freeCancellation && (
                <span title="Free Cancellation" className="flex items-center text-emerald-600 gap-1">
                  <Check className="h-3.5 w-3.5" />
                  <span className="text-[10px] font-bold">Free Cancellation</span>
                </span>
              )}
            </div>
          </div>
        </div>
      </article>
    </Link>
  );
}
