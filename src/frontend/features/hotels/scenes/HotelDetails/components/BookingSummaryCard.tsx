import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/frontend/components/ui/button";
import { RoomRateViewModel } from "../models/HotelDetailViewModel";
import { Check, Star, Trophy, Loader2 } from "lucide-react";
import { usePriceCheck } from "../hooks/usePriceCheck";
import { paths } from "@/frontend/core/paths";
import { setSelectedRate } from "@/frontend/core/store/searchStore";
import { GenericErrorModal } from "@/frontend/components/common/GenericErrorModal";

interface BookingSummaryCardProps {
    hotelId: string;
    traceId?: string;
    selectedRoom: RoomRateViewModel | null;
    className?: string;
}

export function BookingSummaryCard({ hotelId, traceId, selectedRoom, className }: BookingSummaryCardProps) {
    const router = useRouter();
    const { loading, checkPrice } = usePriceCheck();

    // Error Modal State
    const [errorModalOpen, setErrorModalOpen] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");

    const handleContinue = async () => {
        if (!selectedRoom || !hotelId || !traceId) return;
        const result = await checkPrice({
            hotelId,
            traceId,
            optionId: selectedRoom.id,
        });

        if (result.ok && result.data) {
            let rateToSave = { ...selectedRoom };

            // If price changed, update the rate we are saving to store
            if (result.data.priceChangeData?.isPriceChanged) {
                rateToSave.price = result.data.priceChangeData.newPrice;
            }

            // Save selected room to store for the next page
            setSelectedRate(rateToSave);

            // Navigate to Review Booking Page
            // Construct query params
            const query = new URLSearchParams({
                hotelId,
                traceId,
                optionId: selectedRoom.id,
            });
            // Assuming the new route is /hotel/booking/review
            router.push(`/hotel/booking/review?${query.toString()}`);
        } else {
            setErrorMessage(result.error || "Price check failed. Please try again.");
            setErrorModalOpen(true);
        }
    };

    if (!selectedRoom) {
        return (
            <div className={`border border-gray-200 rounded-xl p-6 shadow-xl shadow-gray-200/50 bg-white ${className}`}>
                <div className="animate-pulse space-y-4">
                    <div className="h-8 bg-gray-100 rounded w-1/2"></div>
                    <div className="h-32 bg-gray-50 rounded border border-gray-100"></div>
                    <div className="h-12 bg-gray-200 rounded"></div>
                </div>
            </div>
        );
    }

    const price = new Intl.NumberFormat('en-IN').format(selectedRoom.price);

    return (
        <>
            <div className={`border border-gray-200 rounded-xl p-6 shadow-xl shadow-gray-200/50 bg-white ${className}`}>
                <div className="space-y-6">
                    {/* Header: Price */}
                    <div>
                        <div className="flex items-baseline justify-between">
                            <div className="flex items-baseline gap-1">
                                <span className="text-xl font-bold text-gray-900">{selectedRoom.currency}</span>
                                <span className="text-2xl font-bold text-gray-900">{price}</span>
                            </div>
                        </div>
                        <div className="flex items-center gap-1 mt-1 text-green-700 text-sm font-medium">
                            <span>Best value for your dates</span>
                        </div>
                    </div>

                    {/* Selected Room Info */}
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

                    {/* Action Button - Updated color as per request (Primary) */}
                    <Button
                        onClick={handleContinue}
                        disabled={loading || !traceId}
                        className="w-full h-12 text-lg font-semibold bg-primary hover:bg-primary/90 shadow-md transition-all"
                    >
                        {loading ? (
                            <>
                                <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                            </>
                        ) : (
                            "Continue"
                        )}
                    </Button>
                </div>
            </div>

            <GenericErrorModal
                open={errorModalOpen}
                title="Price Check Failed"
                message={errorMessage}
                actionLabel="Close"
                onAction={() => setErrorModalOpen(false)}
            />
        </>
    );
}
