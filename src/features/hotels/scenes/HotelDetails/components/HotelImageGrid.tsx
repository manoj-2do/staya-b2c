"use client";

import React from "react";
import Image from "next/image";
import { Grid } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils/cn";
import { HotelImageViewModel } from "../models/HotelDetailViewModel";

interface HotelImageGridProps {
    images?: HotelImageViewModel[];
    loading?: boolean;
}

export function HotelImageGrid({ images = [], loading = false }: HotelImageGridProps) {
    if (loading) {
        return (
            <div className="grid grid-cols-4 gap-2 h-[400px] rounded-xl overflow-hidden animate-pulse">
                <div className="col-span-2 row-span-2 bg-gray-200" />
                <div className="bg-gray-200" />
                <div className="bg-gray-200" />
                <div className="bg-gray-200" />
                <div className="bg-gray-200" />
            </div>
        );
    }

    if (images.length === 0) {
        return (
            <div className="h-[400px] rounded-xl bg-gray-100 flex items-center justify-center text-muted-foreground">
                No images available
            </div>
        );
    }

    const mainImage = images[0];
    const sideImages = images.slice(1, 5);

    return (
        <div className="relative group">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-2 h-[300px] md:h-[400px] rounded-xl overflow-hidden">
                {/* Main Image - Half width on large screens */}
                <div className="md:col-span-2 md:row-span-2 relative h-full w-full bg-gray-100">
                    <Image
                        src={mainImage.url}
                        alt={mainImage.caption || "Hotel View"}
                        fill
                        className="object-cover transition-transform duration-700 hover:scale-105"
                        priority
                        sizes="(max-width: 768px) 100vw, 50vw"
                    />
                </div>

                {/* Side Images */}
                <div className="hidden md:grid md:col-span-2 md:grid-cols-2 md:grid-rows-2 gap-2 h-full">
                    {sideImages.map((img, idx) => (
                        <div key={idx} className="relative h-full w-full bg-gray-100">
                            <Image
                                src={img.url}
                                alt={img.caption || `Room view ${idx + 1}`}
                                fill
                                className="object-cover transition-transform duration-500 hover:scale-105"
                                sizes="25vw"
                            />
                        </div>
                    ))}
                    {/* Fill empty spots if less than 4 side images */}
                    {Array.from({ length: 4 - sideImages.length }).map((_, idx) => (
                        <div key={`empty-${idx}`} className="bg-gray-50" />
                    ))}
                </div>
            </div>

            <div className="absolute bottom-4 right-4">
                <Button
                    variant="outline"
                    size="sm"
                    className="bg-white/90 hover:bg-white text-gray-800 shadow-sm gap-2"
                >
                    <Grid className="w-4 h-4" />
                    Show all photos
                </Button>
            </div>
        </div>
    );
}
