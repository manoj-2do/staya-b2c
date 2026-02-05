"use client";

import React from "react";
import Image from "next/image";
import { Check, ShieldCheck, Users, BedDouble, Utensils, Ban } from "lucide-react";
import { Button } from "@/frontend/components/ui/button";
import { Badge } from "@/frontend/components/ui/badge";
import { Card, CardContent, CardFooter, CardHeader } from "@/frontend/components/ui/card";
import { SectionLoader } from "./PageLoader";
import { RoomRateViewModel } from "../models/HotelDetailViewModel";
import { cn } from "@/frontend/core/utils";

interface RoomsSectionProps {
    rooms?: RoomRateViewModel[];
    loading?: boolean;
    selectedRoomId?: string | null;
    onSelectRoom?: (room: RoomRateViewModel) => void;
}

export function RoomsSection({ rooms = [], loading = false, selectedRoomId, onSelectRoom }: RoomsSectionProps) {
    const [modalAmenities, setModalAmenities] = React.useState<string[] | null>(null);

    if (loading) {
        return (
            <div className="py-8">
                <h2 className="text-2xl font-semibold mb-6">Checking available rooms...</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-1 gap-6">
                    <SkeletonRoomCard />
                    <SkeletonRoomCard />
                    <SkeletonRoomCard />
                </div>
            </div>
        );
    }

    if (rooms.length === 0) {
        return (
            <div className="py-12 text-center bg-gray-50 rounded-xl border border-dashed border-gray-200">
                <h3 className="text-lg font-medium text-gray-900">No rooms available for these dates</h3>
                <p className="text-gray-500 mt-2">Try changing your dates or number of guests.</p>
            </div>
        );
    }

    return (
        <div className="py-0">
            <h2 className="text-2xl font-semibold mb-6">Available Rooms</h2>
            <div className="grid grid-cols-1 gap-6">
                {rooms.map((room) => (
                    <RoomCard
                        key={room.id}
                        room={room}
                        isSelected={selectedRoomId === room.id}
                        onSelect={() => onSelectRoom?.(room)}
                        onShowAmenities={() => setModalAmenities(room.facilities)}
                    />
                ))}
            </div>

            <AmenitiesModal
                isOpen={!!modalAmenities}
                onClose={() => setModalAmenities(null)}
                amenities={modalAmenities || []}
            />
        </div>
    );
}

function RoomCard({ room, isSelected, onSelect, onShowAmenities }: { room: RoomRateViewModel; isSelected?: boolean; onSelect?: () => void; onShowAmenities?: () => void }) {
    return (
        <Card
            className={cn(
                "overflow-hidden border transition-all cursor-pointer",
                isSelected
                    ? "border-emerald-600 ring-2 ring-emerald-600 ring-offset-2 shadow-md"
                    : "border-gray-200 shadow-sm hover:shadow-md hover:border-gray-300"
            )}
            onClick={onSelect}
        >
            <div className="flex flex-col md:flex-row">
                {/* Room Image - Left Side */}
                <div className="w-full md:w-[300px] h-[200px] md:h-auto relative bg-gray-100 shrink-0">
                    {room.images?.[0] ? (
                        <Image
                            src={room.images[0]}
                            alt={room.name}
                            fill
                            className="object-cover"
                            sizes="(max-width: 768px) 100vw, 300px"
                        />
                    ) : (
                        <div className="flex items-center justify-center h-full text-gray-400 bg-gray-100">
                            <BedDouble className="w-12 h-12 opacity-50" />
                        </div>
                    )}
                </div>

                {/* Room Details - Middle */}
                <div className="flex-1 p-6 flex flex-col justify-between">
                    <div>
                        <div className="flex justify-between items-start mb-2">
                            <div className="space-y-1">
                                {room.rateRooms && room.rateRooms.length > 1 ? (
                                    <>
                                        {room.rateRooms.map((r, idx) => (
                                            <div key={idx} className="flex items-start gap-2">
                                                <Badge variant="outline" className="h-5 px-1.5 text-[10px] text-gray-500 mt-0.5">Room {idx + 1}</Badge>
                                                <h3 className="text-lg font-semibold text-gray-900 line-clamp-1">{r.name}</h3>
                                            </div>
                                        ))}
                                    </>
                                ) : (
                                    <h3 className="text-xl font-semibold text-gray-900 line-clamp-2">{room.name}</h3>
                                )}
                            </div>
                        </div>

                        <div className="flex flex-wrap gap-2 mb-4">
                            {/* Combined or primary occupancy display */}
                            {room.maxOccupancy && (
                                <Badge variant="secondary" className="font-normal text-gray-600 gap-1">
                                    <Users className="w-3 h-3" />
                                    {/* If multiple rooms, maybe sum up or just show primary? Keeping simple for now, relying on explicit room list above */}
                                    {room.maxOccupancy.adults} Adults
                                </Badge>
                            )}
                            {room.facilities.slice(0, 3).map((f, i) => (
                                <Badge key={i} variant="outline" className="font-normal text-gray-600">
                                    {f}
                                </Badge>
                            ))}
                            {room.facilities.length > 3 && (
                                <button
                                    className="text-xs text-blue-600 hover:text-blue-800 hover:underline self-center font-medium focus:outline-none"
                                    onClick={(e) => {
                                        e.stopPropagation(); // Prevent card selection when clicking more
                                        onShowAmenities?.();
                                    }}
                                >
                                    +{room.facilities.length - 3} more
                                </button>
                            )}
                        </div>

                        <div className="space-y-2 text-sm text-gray-700 mt-4">
                            {/* Cancellation Policy */}
                            <div className={cn("flex items-start gap-2", room.refundable ? "text-green-700" : "text-gray-600")}>
                                {room.refundable ? <Check className="w-4 h-4 shrink-0 mt-0.5" /> : <Ban className="w-4 h-4 shrink-0 mt-0.5" />}
                                <span className="font-medium">{room.cancellationPolicy}</span>
                            </div>

                            {/* Board Basis */}
                            {room.boardBasis && (
                                <div className="flex items-start gap-2 text-gray-600">
                                    <Utensils className="w-4 h-4 shrink-0 mt-0.5" />
                                    <span>{room.boardBasis}</span>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Price & Action - Right Side */}
                <div className="w-full md:w-[280px] border-t md:border-t-0 md:border-l border-gray-100 bg-gray-50/50 p-6 flex flex-col justify-end items-end text-right">
                    <div className="mb-4">
                        <span className="text-sm text-gray-500 block mb-1">Total price for stay</span>
                        <div className="flex items-baseline justify-end gap-1">
                            <span className="text-lg font-semibold text-gray-900">{room.currency}</span>
                            <span className="text-3xl font-bold text-gray-900">
                                {new Intl.NumberFormat('en-IN').format(room.price)}
                            </span>
                        </div>
                        <p className="text-xs text-gray-500 mt-1">Includes taxes & fees</p>
                    </div>

                    <Button
                        className={cn("w-full md:w-auto min-w-[140px]", isSelected ? "bg-emerald-600 hover:bg-emerald-700 text-white" : "")}
                        size="lg"
                        variant={isSelected ? "default" : "outline"}
                    >
                        {isSelected ? "Selected" : "Select"}
                    </Button>
                </div>
            </div>
        </Card>
    );
}

function SkeletonRoomCard() {
    return (
        <div className="rounded-xl border border-gray-200 overflow-hidden bg-white shadow-sm flex flex-col h-full animate-pulse">
            <div className="h-48 bg-gray-200 w-full" />
            <div className="p-5 flex-1 space-y-4">
                <div className="h-6 bg-gray-200 rounded w-3/4" />
                <div className="flex gap-2">
                    <div className="h-5 bg-gray-200 rounded w-16" />
                    <div className="h-5 bg-gray-200 rounded w-16" />
                </div>
                <div className="space-y-2 pt-2">
                    <div className="h-4 bg-gray-200 rounded w-full" />
                    <div className="h-4 bg-gray-200 rounded w-5/6" />
                </div>
            </div>
            <div className="p-5 border-t border-gray-100 bg-gray-50/50 flex justify-between items-center">
                <div className="h-8 bg-gray-200 rounded w-24" />
                <div className="h-10 bg-gray-200 rounded w-28" />
            </div>
        </div>
    );
}

function AmenitiesModal({
    isOpen,
    onClose,
    amenities
}: {
    isOpen: boolean;
    onClose: () => void;
    amenities: string[];
}) {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 animate-in fade-in duration-200" onClick={onClose}>
            <div
                className="bg-white rounded-2xl shadow-xl max-w-lg w-full p-6 animate-in zoom-in-95 duration-200 max-h-[80vh] flex flex-col"
                onClick={e => e.stopPropagation()}
            >
                <div className="flex justify-between items-center mb-4">
                    <h3 className="text-xl font-bold text-gray-900">Room Facilities</h3>
                    <Button variant="ghost" size="sm" onClick={onClose} className="h-8 w-8 p-0 rounded-full">
                        <span className="sr-only">Close</span>
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </Button>
                </div>

                <div className="overflow-y-auto flex-1 pr-2">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        {amenities.map((facility, idx) => (
                            <div key={idx} className="flex items-start gap-2 p-2 rounded-lg bg-gray-50">
                                <Check className="w-4 h-4 text-green-600 mt-1 shrink-0" />
                                <span className="text-sm text-gray-700">{facility}</span>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="mt-6 pt-4 border-t border-gray-100 text-right">
                    <Button onClick={onClose}>Close</Button>
                </div>
            </div>
        </div>
    );
}
