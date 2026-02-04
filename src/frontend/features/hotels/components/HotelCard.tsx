"use client";

import React from "react";
import Image from "next/image";
import { parseISO, format } from "date-fns";
import { Star, Utensils, RefreshCw, Heart } from "lucide-react";
import { cn } from "@/frontend/core/utils";
import type { HotelSearchResultItem } from "../models/HotelSearchResponse";

interface HotelCardProps {
  hotel: HotelSearchResultItem;
  checkIn?: string;
  checkOut?: string;
  className?: string;
}

const PLACEHOLDER_IMAGE =
  "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=400&h=300&fit=crop";

export function HotelCard({
  hotel,
  checkIn,
  checkOut,
  className,
}: HotelCardProps) {
  const price =
    hotel.availability?.rate?.finalRate ??
    hotel.availability?.rate?.finalRateWithDefaultAgentMarkup ??
    0;
  const formattedPrice = new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(price);
  const rating = hotel.starRating ?? 4.5;
  const dateRange =
    checkIn && checkOut
      ? (() => {
          try {
            const from = parseISO(checkIn);
            const to = parseISO(checkOut);
            return `${format(from, "d")}-${format(to, "d MMM")}`;
          } catch {
            return null;
          }
        })()
      : null;

  return (
    <article
      className={cn(
        "group flex flex-col overflow-hidden rounded-xl border border-border bg-card shadow-sm transition-shadow hover:shadow-md",
        className
      )}
    >
      <div className="relative aspect-[4/3] overflow-hidden bg-muted">
        <Image
          src={hotel.imageUrl ?? PLACEHOLDER_IMAGE}
          alt={hotel.name ?? `Hotel ${hotel.id}`}
          fill
          className="object-cover transition-transform group-hover:scale-105"
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 20vw"
        />
        <div className="absolute left-3 top-3">
          <span className="rounded-full bg-white/90 px-2.5 py-1 text-xs font-medium text-foreground shadow-sm">
            Guest favourite
          </span>
        </div>
        <button
          type="button"
          className="absolute right-3 top-3 rounded-full p-2 bg-white/80 backdrop-blur-sm hover:bg-white transition-colors"
          aria-label="Save to favourites"
        >
          <Heart className="h-4 w-4 text-foreground" strokeWidth={1.5} />
        </button>
        <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-1">
          {[1, 2, 3, 4].map((i) => (
            <span
              key={i}
              className="h-1.5 w-1.5 rounded-full bg-white/80"
              aria-hidden
            />
          ))}
        </div>
      </div>

      <div className="flex flex-1 flex-col gap-1 p-3">
        <div className="flex items-start justify-between gap-2">
          <div className="min-w-0 flex-1">
            <h3 className="font-medium text-foreground truncate">
              {hotel.city ?? "Unknown"}, India
            </h3>
            <p className="text-sm text-muted-foreground truncate">
              {hotel.area ?? hotel.name ?? "Hotel"}
            </p>
          </div>
          <div className="flex shrink-0 items-center gap-1">
            <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
            <span className="text-sm font-medium">{rating.toFixed(2)}</span>
          </div>
        </div>

        {dateRange && (
          <p className="text-sm text-muted-foreground">{dateRange}</p>
        )}

        <div className="mt-auto flex items-center justify-between gap-2 pt-1">
          <span className="text-sm font-semibold">
            {formattedPrice}
            <span className="font-normal text-muted-foreground"> night</span>
          </span>
          <div className="flex items-center gap-2 text-muted-foreground">
            {hotel.freeBreakfast !== false && (
              <span title="Free breakfast" className="flex items-center">
                <Utensils className="h-3.5 w-3.5" />
              </span>
            )}
            {hotel.isRefundable !== false && (
              <span title="Refundable" className="flex items-center">
                <RefreshCw className="h-3.5 w-3.5" />
              </span>
            )}
          </div>
        </div>
      </div>
    </article>
  );
}
