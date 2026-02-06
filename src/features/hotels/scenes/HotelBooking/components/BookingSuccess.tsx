import React from "react";
import { BookingDetails } from "@/features/hotels/models/BookingDetails";
import { CheckCircle, MapPin, Calendar, Users, Moon, CreditCard } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { paths } from "@/lib/paths";

interface BookingSuccessProps {
    booking: BookingDetails;
}

export const BookingSuccess: React.FC<BookingSuccessProps> = ({ booking }) => {

    const router = useRouter();

    const formatDate = (dateStr?: string) => {
        if (!dateStr) return "TBA";
        return new Date(dateStr).toLocaleDateString("en-US", {
            day: "numeric",
            month: "short",
            year: "numeric"
        });
    };

    // Derived Data
    const primaryGuest = booking?.guestData?.find(g => g.isLeadGuest) || booking?.guestData?.[0];
    const totalAmount = (booking?.selectedRoomsAndRates || []).reduce((acc, curr) => acc + curr.rateDetails.price, 0);
    const currency = booking?.selectedRoomsAndRates?.[0]?.rateDetails.currency || "INR";
    const hotelName = booking?.hotelStaticContent?.name || "Hotel Name Unavailable";
    const checkIn = booking?.checkInDate;
    const checkOut = booking?.checkOutDate;

    return (
        <div className="max-w-3xl mx-auto space-y-4 animate-fade-in-up">
            {/* 1. Success Banner */}
            <div className="text-center space-y-2 py-4">
                <div className="flex justify-center mb-2">
                    <div className="relative">
                        <div className="absolute inset-0 bg-green-100 rounded-full animate-ping opacity-75"></div>
                        <div className="relative bg-green-100 p-3 rounded-full">
                            <CheckCircle className="w-8 h-8 text-green-600" />
                        </div>
                    </div>
                </div>
                <h1 className="text-xl font-bold text-gray-900 tracking-tight">Booking Confirmed!</h1>
                <p className="text-sm text-gray-500 max-w-md mx-auto">
                    Your reservation at <span className="font-semibold text-gray-800">{hotelName}</span> is set.
                </p>
                <p className="text-xs text-gray-400 font-mono">Booking ID: {booking?.bookingCode}</p>
            </div>

            {/* 2. Main Booking Card */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden divide-y divide-gray-100">

                {/* Header Section */}
                <div className="p-4 bg-gray-50/50">
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                        <div>
                            <div className="uppercase tracking-wider text-xs font-bold text-gray-500 mb-1">Hotel</div>
                            <h2 className="text-lg font-bold text-gray-900 mb-1">{hotelName}</h2>
                            {booking?.hotelStaticContent?.contact?.address && (
                                <div className="flex items-center text-gray-500 text-xs">
                                    <MapPin className="w-3 h-3 mr-1" />
                                    <span>{[
                                        booking?.hotelStaticContent?.contact?.address?.line1,
                                        booking?.hotelStaticContent?.contact?.address?.city?.name
                                    ].filter(Boolean).join(", ")}</span>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Trip Details Section */}
                <div className="divide-y divide-gray-100">
                    {/* Dates */}
                    <div className="p-4 flex items-start gap-4 hover:bg-gray-50/50 transition-colors">
                        <div className="p-2 bg-blue-50 text-blue-600 rounded-lg shrink-0">
                            <Calendar className="w-5 h-5" />
                        </div>
                        <div className="flex-1">
                            <h3 className="font-semibold text-gray-900 mb-1 text-sm">Dates</h3>
                            <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-3">
                                <p className="text-gray-700 text-sm font-medium">
                                    {formatDate(checkIn)} <span className="text-gray-400 mx-1">→</span> {formatDate(checkOut)}
                                </p>
                                <span className="hidden sm:inline text-gray-300">|</span>
                            </div>
                        </div>
                    </div>

                    {/* Traveller Information Section */}
                    <div className="p-4 flex items-start gap-4 hover:bg-gray-50/50 transition-colors">
                        <div className="p-2 bg-purple-50 text-purple-600 rounded-lg shrink-0">
                            <Users className="w-5 h-5" />
                        </div>
                        <div className="flex-1">
                            <div className="flex justify-between items-center mb-2">
                                <h3 className="font-semibold text-gray-900 text-sm">Traveller Information</h3>
                                <span className="text-xs font-medium px-2 py-0.5 bg-gray-100 text-gray-600 rounded-full">
                                    {(booking?.guestData || []).length} Guests
                                </span>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-3">
                                {(booking?.guestData || []).map((guest, idx) => (
                                    <div key={idx} className="flex items-center p-2 rounded-lg border border-gray-100 bg-white">
                                        <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-xs font-bold text-gray-500 mr-3">
                                            {guest.firstName?.charAt(0)}{guest.lastName?.charAt(0)}
                                        </div>
                                        <div>
                                            <p className="text-sm font-medium text-gray-900">
                                                {guest.title} {guest.firstName} {guest.lastName}
                                            </p>
                                            <p className="text-xs text-gray-500">
                                                {guest.isLeadGuest ? "Primary Guest" : "Guest"} • {guest.type}
                                            </p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Room Details Section */}
                    <div className="p-4 flex items-start gap-4 hover:bg-gray-50/50 transition-colors">
                        <div className="p-2 bg-indigo-50 text-indigo-600 rounded-lg shrink-0">
                            <Moon className="w-5 h-5" />
                        </div>
                        <div className="flex-1">
                            <div className="flex justify-between items-center mb-2">
                                <h3 className="font-semibold text-gray-900 text-sm">Room Details</h3>
                                <span className="text-xs font-medium px-2 py-0.5 bg-gray-100 text-gray-600 rounded-full">
                                    {(booking?.selectedRoomsAndRates || []).length} Room(s)
                                </span>
                            </div>

                            <div className="space-y-3 mt-3">
                                {(booking?.selectedRoomsAndRates || []).map((room, idx) => (
                                    <div key={idx} className="p-3 rounded-lg border border-gray-100 bg-white shadow-sm">
                                        <div className="flex justify-between items-start mb-1">
                                            <p className="text-sm font-bold text-gray-800">{room.roomDetails?.name || "Room"}</p>
                                            <span className="text-xs font-mono text-gray-400">R{idx + 1}</span>
                                        </div>
                                        <p className="text-xs text-gray-500 line-clamp-1 italic mb-2">{room.roomDetails?.description}</p>

                                        <div className="flex flex-wrap gap-2 text-[10px] text-gray-500">
                                            {room.roomDetails?.beds?.length > 0 && (
                                                <span className="px-1.5 py-0.5 bg-gray-50 rounded border border-gray-100">
                                                    🛏️ {room.roomDetails.beds.map(b => `${b.count} ${b.type}`).join(", ")}
                                                </span>
                                            )}
                                            {room.rateDetails?.refundable && (
                                                <span className="px-1.5 py-0.5 bg-green-50 text-green-700 rounded border border-green-100">
                                                    ✓ Refundable
                                                </span>
                                            )}
                                            {!room.rateDetails?.refundable && (
                                                <span className="px-1.5 py-0.5 bg-red-50 text-red-700 rounded border border-red-100">
                                                    Non-Refundable
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Hotel Static Content */}
                {booking?.hotelStaticContent && (
                    <div className="p-4 bg-gray-50/50 border-t border-gray-100">
                        <h3 className="font-semibold text-gray-900 mb-2 text-sm">About the Hotel</h3>
                        <div className="text-xs text-gray-600 space-y-2">
                            {booking?.hotelStaticContent?.contact?.address && (
                                <p className="flex items-start gap-2">
                                    <MapPin className="w-3 h-3 mt-0.5 shrink-0" />
                                    {[
                                        booking?.hotelStaticContent?.contact?.address?.line1,
                                        booking?.hotelStaticContent?.contact?.address?.city?.name,
                                        booking?.hotelStaticContent?.contact?.address?.country?.name
                                    ].filter(Boolean).join(", ")}
                                </p>
                            )}
                            {booking?.hotelStaticContent?.descriptions?.[0]?.text && (
                                <p className="line-clamp-3">{booking?.hotelStaticContent?.descriptions[0].text}</p>
                            )}
                        </div>
                    </div>
                )}

                {/* Price Section */}
                <div className="p-4 bg-gray-50/30 border-t border-gray-100">
                    <div className="flex justify-between items-center">
                        <div className="flex items-center gap-2">
                            <div className="p-1.5 bg-emerald-50 text-emerald-600 rounded-lg">
                                <CreditCard className="w-4 h-4" />
                            </div>
                            <div>
                                <h3 className="font-semibold text-gray-900 text-sm">Total Price</h3>
                                <p className="text-[10px] text-gray-500">Includes all taxes and fees</p>
                            </div>
                        </div>
                        <div className="text-right">
                            <span className="text-xl font-bold text-gray-900">{currency} {totalAmount.toLocaleString()}</span>
                            {booking?.bookingStatus === "Confirmed" ? (
                                <span className="block text-[10px] font-bold text-green-600 mt-0.5 uppercase tracking-wide">Paid</span>
                            ) : (
                                <span className="block text-[10px] font-bold text-orange-500 mt-0.5 uppercase tracking-wide">{booking?.bookingStatus}</span>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* Actions */}
            <div className="flex justify-center gap-4 pt-4 pb-12 print:hidden">
                <Button
                    className="h-10 px-6 text-sm shadow-md hover:shadow-lg transition-all rounded-full bg-primary text-white"
                    onClick={() => window.print()}
                >
                    Print Booking
                </Button>
                <Button
                    variant="outline"
                    className="h-10 px-6 text-sm shadow-sm hover:shadow-md transition-all rounded-full border-gray-300 text-gray-700"
                    onClick={() => router.push(paths.home)}
                >
                    Back to Home
                </Button>
            </div>
        </div>
    );
};
