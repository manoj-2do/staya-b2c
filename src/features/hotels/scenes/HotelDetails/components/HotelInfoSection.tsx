"use client";

import React from "react";
import { Star, MapPin, Share, Heart, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
    HotelHeaderViewModel,
    HotelInfoViewModel
} from "../models/HotelDetailViewModel";

interface HotelInfoSectionProps {
    header?: HotelHeaderViewModel;
    info?: HotelInfoViewModel;
    loading?: boolean;
}

export function HotelInfoSection({ header, info, loading = false }: HotelInfoSectionProps) {
    if (loading) {
        return (
            <div className="space-y-4 animate-pulse pt-4">
                <div className="h-8 bg-gray-200 rounded w-3/4" />
                <div className="h-4 bg-gray-200 rounded w-1/2" />
                <div className="h-40 bg-gray-200 rounded w-full mt-6" />
            </div>
        );
    }

    if (!header || !info) return null;

    return (
        <div className="flex flex-col gap-6 py-6 border-b border-gray-200">
            {/* Header Section */}
            <div className="flex flex-col">
                <div className="flex justify-between items-start gap-4">
                    <h1 className="text-2xl md:text-3xl font-semibold text-gray-900 leading-tight">
                        {header.name}
                    </h1>
                    <div className="flex gap-2 shrink-0">
                        <Button variant="ghost" size="sm" className="gap-2 hidden md:flex text-sm underline decoration-gray-300 decoration-1 underline-offset-4 rounded-md h-9 px-3">
                            <Share className="w-4 h-4" />
                            Share
                        </Button>
                        <Button variant="ghost" size="sm" className="gap-2 hidden md:flex text-sm underline decoration-gray-300 decoration-1 underline-offset-4 rounded-md h-9 px-3">
                            <Heart className="w-4 h-4" />
                            Save
                        </Button>
                    </div>
                </div>

                <div className="flex flex-wrap items-center gap-2 mt-2 text-sm text-gray-600">
                    {/* Rating */}
                    <div className="flex items-center font-medium text-gray-900 gap-1">
                        <Star className="w-4 h-4 fill-gray-900 border-none" />
                        <span>{header.rating}</span>
                    </div>
                    <span className="mx-1">·</span>
                    <button className="underline font-medium hover:text-gray-900">
                        {header.reviewCount} reviews
                    </button>
                    <span className="mx-1">·</span>
                    {/* Badges / Tags */}
                    {header.tags.map(tag => (
                        <React.Fragment key={tag}>
                            <span className="text-gray-600 font-medium">
                                {tag}
                            </span>
                            <span className="mx-1">·</span>
                        </React.Fragment>
                    ))}
                    <a href="#map" className="font-medium underline hover:text-gray-900 flex items-center gap-1">
                        <MapPin className="w-3.5 h-3.5" />
                        {header.address}
                    </a>
                </div>
            </div>

            <Separator />

            {/* Host Info (Mocked for now as not in API) */}
            <div className="flex items-center gap-4 py-2">
                <div className="h-12 w-12 rounded-full bg-gray-200 shrink-0" />
                <div>
                    <h3 className="font-medium text-gray-900">Hosted by Professional Host</h3>
                    <p className="text-sm text-gray-500">Superhost · 5 years hosting</p>
                </div>
            </div>

            <Separator />

            {/* Description */}
            <div className="py-2">
                <p className="text-gray-800 leading-relaxed whitespace-pre-line">
                    {info.description}
                </p>
            </div>

            <Separator />

            {/* Amenities Preview */}
            <div className="py-2">
                <h3 className="text-xl font-semibold mb-4">What this place offers</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-y-3 gap-x-8">
                    {info.amenities.slice(0, 10).map((amenity, idx) => (
                        <div key={idx} className="flex items-center gap-3 text-gray-700">
                            <CheckCircle2 className="w-5 h-5 text-gray-400" />
                            <span>{amenity.name}</span>
                        </div>
                    ))}
                </div>
                {info.amenities.length > 10 && (
                    <Button variant="outline" className="mt-6 border-black text-black hover:bg-gray-50 w-full sm:w-auto">
                        Show all {info.amenities.length} amenities
                    </Button>
                )}
            </div>
        </div>
    );
}
