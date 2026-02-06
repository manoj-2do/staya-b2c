import { Button } from "@/frontend/components/ui/button";
import { RoomRateViewModel } from "../../HotelDetails/models/HotelDetailViewModel";
import { Check, Loader2 } from "lucide-react";
import { GenericErrorModal } from "@/frontend/components/common/GenericErrorModal";
import { useState } from "react";

interface ReviewBookingSummaryProps {
    hotelName?: string;
    selectedRoom: RoomRateViewModel;
    className?: string;
    actionLabel: string;
    onAction: () => void;
    isLoading: boolean;
    disabled?: boolean;
    simpleMode?: boolean;
}

export function ReviewBookingSummary({
    hotelName,
    selectedRoom,
    className,
    actionLabel,
    onAction,
    isLoading,
    disabled,
    simpleMode = false
}: ReviewBookingSummaryProps) {
    const price = new Intl.NumberFormat('en-IN').format(selectedRoom.price);

    return (
        <div className={`border border-gray-200 rounded-xl p-6 shadow-xl shadow-gray-200/50 bg-white sticky top-24 z-20 ${className}`}>
            <div className="space-y-6">
                {/* Header: Price */}
                <div>
                    {!simpleMode && (
                        <p className="text-sm text-gray-500 font-medium mb-1">{hotelName || "Selected Hotel"}</p>
                    )}
                    <div className="flex items-baseline justify-between">
                        <div className="flex items-baseline gap-1">
                            <span className="text-xl font-bold text-gray-900">{selectedRoom.currency}</span>
                            <span className="text-2xl font-bold text-gray-900">{price}</span>
                        </div>
                    </div>
                    {!simpleMode && (
                        <div className="flex items-center gap-1 mt-1 text-green-700 text-sm font-medium">
                            <span>Best value for your dates</span>
                        </div>
                    )}
                </div>

                {/* Selected Room Info */}
                {!simpleMode && (
                    <div className="bg-gray-50 rounded-lg p-3 border border-gray-100">
                        <p className="text-xs font-semibold text-gray-500 uppercase mb-2">Selected Rooms</p>

                        {selectedRoom.rateRooms && selectedRoom.rateRooms.length > 1 ? (
                            <div className="space-y-2 mb-2">
                                {selectedRoom.rateRooms.map((room, idx) => (
                                    <div key={idx} className="flex justify-between items-start border-b border-gray-200 pb-1 last:border-0">
                                        <span className="font-medium text-gray-900 text-sm line-clamp-2">
                                            <span className="text-gray-500 text-xs mr-1">Room {idx + 1}:</span>
                                            {room.name}
                                        </span>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="flex justify-between items-start mb-2">
                                <span className="font-medium text-gray-900 text-sm line-clamp-2">{selectedRoom.name}</span>
                            </div>
                        )}
                        <div className="space-y-1">
                            <div className="flex items-center gap-2 text-xs text-gray-600">
                                {selectedRoom.refundable ? (
                                    <>
                                        <Check className="w-3 h-3 text-green-600" />
                                        <span className="text-green-700">Free cancellation</span>
                                    </>
                                ) : (
                                    <span className="text-gray-500">Non-refundable</span>
                                )}
                            </div>
                            <div className="flex items-center gap-2 text-xs text-gray-600">
                                <Check className="w-3 h-3 text-gray-400" />
                                <span>{selectedRoom.boardBasis}</span>
                            </div>
                        </div>
                    </div>
                )}

                {/* Price Breakdown */}
                <div className="space-y-3 pt-2">
                    <div className="flex justify-between text-sm text-gray-600">
                        <span className="underline decoration-dotted decoration-gray-300 underline-offset-2">Base price</span>
                        <span>{selectedRoom.currency} {price}</span>
                    </div>
                    <div className="flex justify-between text-sm text-gray-600">
                        <span className="underline decoration-dotted decoration-gray-300 underline-offset-2">Taxes & fees</span>
                        <span>Included</span>
                    </div>
                    <div className="border-t border-gray-100 my-2 pt-3 flex justify-between font-bold text-gray-900">
                        <span>Total (INR)</span>
                        <span>{selectedRoom.currency} {price}</span>
                    </div>
                </div>

                {/* Action Button */}
                <Button
                    onClick={onAction}
                    disabled={disabled || isLoading}
                    className="w-full h-12 text-lg font-semibold bg-primary hover:bg-primary/90 shadow-md transition-all"
                >
                    {isLoading ? (
                        <>
                            <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                            Processing...
                        </>
                    ) : (
                        actionLabel
                    )}
                </Button>

                {/* Airbnb style footer text */}
                {actionLabel === "Continue to Review" && (
                    <p className="text-xs text-center text-gray-500 mt-2">
                        You won&apos;t be charged yet
                    </p>
                )}
            </div>
        </div>
    );
}
