"use client";

import React, { useEffect, useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { CompactHeader } from "@/frontend/features/hotels/scenes/HotelDetails/components/CompactHeader";
import { BookingSteps } from "@/frontend/features/hotels/scenes/HotelBooking/components/BookingSteps";
import { TravellerDetailsForm, RoomGuests, ContactInfo } from "@/frontend/features/hotels/scenes/HotelBooking/components/TravellerDetailsForm";
import { ReviewBookingSummary } from "@/frontend/features/hotels/scenes/HotelBooking/components/ReviewBookingSummary";
import { usePriceCheck } from "@/frontend/features/hotels/scenes/HotelDetails/hooks/usePriceCheck";
import { getSelectedRate, getSelectedHotel } from "@/frontend/core/store/searchStore";
import { paths } from "@/frontend/core/paths";
import { Loader2, CheckCircle, ChevronLeft, Calendar, Moon } from "lucide-react";
import { Button } from "@/frontend/components/ui/button";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/frontend/components/ui/alert-dialog";
import { appApiPaths } from "@/backend/apiPaths";
import { fetchWithAuth } from "@/frontend/core/auth/fetchWithAuth";
import { BookingLoader } from "@/frontend/features/hotels/scenes/HotelBooking/components/BookingLoader";
import type { BookHotelPayload, BookHotelGuest, BookHotelResponse } from "@/frontend/features/hotels/models/BookHotel";
import { GenericErrorModal } from "@/frontend/components/common/GenericErrorModal";
import { getSearchPayload } from "@/frontend/features/hotels/utils/searchParams";

function ReviewBookingContent() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const { checkPrice, loading: priceLoading } = usePriceCheck();

    const hotelId = searchParams.get("hotelId");
    const traceId = searchParams.get("traceId");
    const roomId = searchParams.get("optionId");

    const [selectedRate, setSelectedRateState] = useState<any | null>(null);
    const [step, setStep] = useState<1 | 2>(1);

    // Form State (Lifted)
    const [travellerData, setTravellerData] = useState<RoomGuests[]>([]);
    const [contactInfo, setContactInfo] = useState<ContactInfo>({ email: "", phone: "", countryCode: "+91" });
    const [specialRequest, setSpecialRequest] = useState("");
    const [agreedToTerms, setAgreedToTerms] = useState(false);

    // Validation Errors
    const [errors, setErrors] = useState<Record<string, string>>({});



    // Error Modal State
    const [errorModalOpen, setErrorModalOpen] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");

    // Back Alert State
    const [backAlertOpen, setBackAlertOpen] = useState(false);

    // Booking Loader State
    const [bookingLoading, setBookingLoading] = useState(false);

    const occupancies = React.useMemo(() => {
        const payload = getSearchPayload();
        // If we have payload occupancies use them, otherwise default to 1 room 2 adults (fallback)
        return payload?.occupancies || [{ numOfAdults: 2, childAges: [] }];
    }, []);

    // Flag to ensure we don't spam checkPrice
    const priceCheckRun = React.useRef(false);

    useEffect(() => {
        // Hydrate from store
        const rate = getSelectedRate();
        if (!rate || !hotelId || !traceId || !roomId) {
            router.replace(paths.home || "/");
            return;
        }
        setSelectedRateState(rate);

        // Initialize Traveller Data only once
        if (travellerData.length === 0) {
            const initialData = occupancies.map((occ: any, rIdx: number) => ({
                roomIndex: rIdx,
                guests: [
                    ...Array(occ.numOfAdults).fill(null).map(() => ({
                        salutation: rIdx === 0 ? "Mr" : "",
                        firstName: "",
                        lastName: "",
                        type: "Adult" as const
                    })),
                    ...(occ.childAges || []).map((age: number) => ({
                        salutation: "Master",
                        firstName: "",
                        lastName: "",
                        type: "Child" as const,
                        age
                    }))
                ]
            }));
            setTravellerData(initialData);
        }
    }, [hotelId, traceId, roomId, router, occupancies]);

    // Background Price Check to get correct RoomIDs and latest price
    useEffect(() => {
        if (!hotelId || !traceId || !roomId || priceCheckRun.current) return;

        const runPriceCheck = async () => {
            priceCheckRun.current = true;
            try {
                const result = await checkPrice({
                    hotelId,
                    traceId,
                    optionId: roomId
                });

                if (result.ok && result.data?.options?.[roomId]?.rate) {
                    const freshRate = result.data.options[roomId].rate;
                    // Update selectedRate with fresh data (crucially occupancies with roomId)
                    setSelectedRateState((prev: any) => ({
                        ...prev,
                        ...freshRate,
                        // Ensure nested merge if needed, but top level spread of rate usually covers occupancies
                    }));

                    // Also check for price change here if needed (optional feature, but good for data consistency)
                    if (result.data?.priceChangeData?.isPriceChanged) {
                        // setNewPrice(result.data.priceChangeData.newPrice); // Removed unused state setter
                        console.log("Price changed to:", result.data.priceChangeData.newPrice);
                    }
                }
            } catch (err) {
                console.error("Background price check failed", err);
            }
        };

        runPriceCheck();
    }, [hotelId, traceId, roomId, checkPrice]);

    // Clear specific error
    const handleClearError = (key: string) => {
        if (errors[key]) {
            setErrors((prev) => {
                const newErr = { ...prev };
                delete newErr[key];
                return newErr;
            });
        }
    };

    const validateStep1 = () => {
        const newErrors: Record<string, string> = {};
        let isValid = true;


        // Validate Rooms
        travellerData.forEach((room, rIdx) => {
            room.guests.forEach((guest, gIdx) => {
                const keyPrefix = `room${rIdx}_guest${gIdx}`;
                if (!guest.firstName.trim()) {
                    newErrors[`${keyPrefix}_firstName`] = "Required";
                    isValid = false;
                }
                if (!guest.lastName.trim()) {
                    newErrors[`${keyPrefix}_lastName`] = "Required";
                    isValid = false;
                }
            });
        });

        // Validate Contact
        if (!contactInfo.email.trim() || !/^\S+@\S+\.\S+$/.test(contactInfo.email)) {
            newErrors.email = "Valid email is required";
            isValid = false;
        }
        if (!contactInfo.phone.trim() || contactInfo.phone.length < 10) {
            newErrors.phone = "Valid phone number is required";
            isValid = false;
        }

        // Validate Agreement
        if (!agreedToTerms) {
            newErrors.agreement = "You must agree to continue";
            isValid = false;
        }

        setErrors(newErrors);
        if (!isValid && Object.keys(newErrors).length > 0) {
            // Scroll to top or first error (simple scroll top for now)
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }
        return isValid;
    };

    const handleContinueToReview = () => {
        if (validateStep1()) {
            setStep(2);
            window.scrollTo(0, 0);
        }
    };

    const handleConfirmBooking = async () => {
        if (!hotelId || !traceId || !roomId || !selectedRate) return;

        // Skip Price Check -> Direct Booking
        setBookingLoading(true);

        try {
            // Map frontend rooms to API structure
            // NOTE: The API expects `roomDetails` array.
            // Map frontend rooms to API structure
            // NOTE: The API expects `roomDetails` array.
            const roomsPayload = travellerData.map((room, idx) => {
                // Get the correct roomId from the selected rate's occupancies
                // Fallback to the optionId (roomId var) if not found, though it should be there per API spec
                const correctRoomId = selectedRate?.occupancies?.[idx]?.roomId || roomId;

                return {
                    roomId: correctRoomId,
                    guests: room.guests.map((g, gIdx) => {
                        const isLead = (idx === 0 && gIdx === 0);
                        return {
                            title: g.salutation || "Mr",
                            firstName: g.firstName,
                            lastName: g.lastName,
                            isLeadGuest: isLead,
                            type: g.type,
                            email: isLead ? contactInfo.email : "",
                            contactNumber: isLead ? contactInfo.phone : "",
                            isdCode: "91", // Defaulting for MVP
                            age: g.age || (g.type === "Adult" ? 30 : 10),
                            passportNumber: "",
                            passportExpiry: "",
                            passportIssue: ""
                        } as BookHotelGuest;
                    })
                };
            });

            const payload: BookHotelPayload = {
                traceId: traceId,
                hotelId: hotelId,
                roomDetails: roomsPayload,
                specialRequests: specialRequest ? [{ description: specialRequest }] : [],
                recommendationId: roomId, // Using roomId/optionId as recommendationId
                optionId: roomId
            };

            // Call Booking API
            const bookRes = await fetchWithAuth(appApiPaths.book, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload)
            });

            const bookJson: any = await bookRes.json();

            if (!bookRes.ok || bookJson.error) {
                throw new Error(bookJson.error || bookJson.message || "Booking failed at provider.");
            }

            const bookingResponse = bookJson as BookHotelResponse;

            // Success -> Redirect
            // TravClan API expects bookingRefId (booking code) in the path
            const resultItem = bookingResponse.results?.[0];
            const bookingRefId = resultItem?.data?.[0]?.bookingRefId;

            if (!bookingRefId) {
                throw new Error("Booking successful but no booking reference returned.");
            }

            const query = new URLSearchParams({
                bookingId: bookingRefId,
                traceId,
                ...(searchParams.get("checkIn") && { checkIn: searchParams.get("checkIn")! }),
                ...(searchParams.get("checkOut") && { checkOut: searchParams.get("checkOut")! }),
            });
            router.push(`/hotel/booking/status?${query.toString()}`);

        } catch (err) {
            console.error("Booking Error:", err);
            setBookingLoading(false);
            setErrorMessage(err instanceof Error ? err.message : "Booking could not be processed.");
            setErrorModalOpen(true);
        }
    };



    useEffect(() => {
        // Intercept browser back button for safeguards
        // We push state so that the "Back" action pops this state but leaves us on the same page index,
        // allowing us to catch the event and show the modal.
        window.history.pushState(null, "", window.location.href);

        const handlePopState = () => {
            // User pressed Back -> Pop event fired.
            // We immediately push state again to "trap" them on the current view visually
            window.history.pushState(null, "", window.location.href);
            setBackAlertOpen(true);
        };

        window.addEventListener("popstate", handlePopState);

        return () => {
            window.removeEventListener("popstate", handlePopState);
        };
    }, [step]);

    // Also remove the "pushed" state when we deliberately go back to step 1 via UI
    // handled inside the "Yes" action of modal

    const handleStepClick = (clickedStep: 1 | 2) => {
        if (step === 2 && clickedStep === 1) {
            setBackAlertOpen(true);
        }
    };

    const handleGoBackConfirmed = () => {
        setBackAlertOpen(false);
        if (step === 2) {
            setStep(1);
        } else {
            if (hotelId && traceId) {
                router.push(`/hotel/details/${hotelId}?traceId=${traceId}&checkIn=${searchParams.get("checkIn")}&checkOut=${searchParams.get("checkOut")}`);
            } else {
                router.push("/");
            }
        }
    };



    if (!selectedRate) return null; // or loader

    return (
        <div className="min-h-screen bg-gray-50 font-sans text-gray-900 pb-20">
            <CompactHeader />

            <main className="max-w-7xl mx-auto px-4 sm:px-6 py-6">
                <BookingSteps currentStep={step} onStepClick={handleStepClick} />

                <div className="mt-8 mb-6">
                    {step === 1 && <h2 className="text-2xl font-bold">Who's checking in?</h2>}
                    {step === 2 && <h2 className="text-2xl font-bold">Review your booking</h2>}
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mt-8">
                    {/* Left Column: Main Content */}
                    <div className="lg:col-span-2 space-y-6">
                        {step === 1 && (
                            <section>
                                <TravellerDetailsForm
                                    occupancies={occupancies}
                                    rooms={travellerData}
                                    contactInfo={contactInfo}
                                    specialRequest={specialRequest}
                                    agreedToTerms={agreedToTerms}
                                    errors={errors}
                                    onChangeRooms={setTravellerData}
                                    onChangeContact={setContactInfo}
                                    onChangeSpecialRequest={setSpecialRequest}
                                    onChangeAgreement={setAgreedToTerms}
                                    onClearError={handleClearError}
                                />
                            </section>
                        )}

                        {step === 2 && (
                            <section className="space-y-6">
                                {/* Hotel Details Review Card */}
                                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 space-y-6">
                                    <div className="border-b border-gray-100 pb-6">
                                        <h3 className="text-xl font-bold text-gray-900 mb-4">{getSelectedHotel()?.name}</h3>

                                        <div className="space-y-4">
                                            {/* Dates Box */}
                                            <div className="flex items-center gap-3 p-3 border border-gray-200 rounded-lg bg-gray-50/50 w-fit">
                                                <Calendar className="w-4 h-4 text-gray-500" />
                                                <div className="flex items-center gap-2 text-sm font-medium text-gray-900">
                                                    <span>{searchParams.get("checkIn") || "Thu, 6 Feb"}</span>
                                                    <span className="text-gray-400">→</span>
                                                    <span>{searchParams.get("checkOut") || "Fri, 7 Feb"}</span>
                                                </div>
                                            </div>

                                            {/* Duration & Guests */}
                                            <div className="flex items-center gap-4 text-sm">
                                                <div className="flex items-center gap-2 font-medium text-gray-700">
                                                    <Moon className="w-4 h-4 text-gray-500" />
                                                    <span>1 Night</span>
                                                </div>
                                                <div className="w-px h-4 bg-gray-300"></div>
                                                <div className="font-medium text-gray-700">
                                                    {occupancies.reduce((acc: number, curr: any) => acc + Number(curr.numOfAdults) + (curr.childAges?.length || 0), 0)} Guests
                                                </div>
                                            </div>

                                            <div className="pt-2">
                                                <p className="text-sm font-medium text-gray-900">
                                                    <span className="text-gray-600 font-normal">Primary Guest: </span>
                                                    <span className="font-medium">{contactInfo.email}</span>
                                                </p>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Simple Guest List Review */}
                                    <div className="space-y-4">
                                        <h3 className="font-semibold text-sm text-gray-500 uppercase">Guest List</h3>
                                        {travellerData.map((room, i) => {
                                            const roomName = selectedRate.rateRooms?.[i]?.name || selectedRate.name;
                                            return (
                                                <div key={i} className="text-sm border flex flex-col md:flex-row md:items-start md:gap-4 p-3 rounded-lg border-gray-100 bg-gray-50/50">
                                                    <div className="font-semibold text-gray-900 min-w-[150px]">
                                                        Room - {i + 1}
                                                        <span className="block text-xs font-normal text-gray-500 mt-0.5">{roomName}</span>
                                                    </div>
                                                    <div className="text-gray-700 flex-1">
                                                        {room.guests.map((g, idx) => (
                                                            <span key={idx}>
                                                                {g.salutation} {g.firstName} {g.lastName}
                                                                {idx < room.guests.length - 1 && ", "}
                                                            </span>
                                                        ))}
                                                    </div>
                                                </div>
                                            );
                                        })}
                                    </div>

                                    {specialRequest && (
                                        <div className="pt-4 border-t border-gray-100 mt-4">
                                            <h3 className="font-semibold text-sm text-gray-500 uppercase mb-2">Special Request</h3>
                                            <p className="text-gray-600 italic">{specialRequest}</p>
                                        </div>
                                    )}

                                </div>
                            </section>
                        )}
                    </div>

                    {/* Right Column: Summary Widget */}
                    <div className="lg:col-span-1">
                        <ReviewBookingSummary
                            hotelName={getSelectedHotel()?.name}
                            selectedRoom={selectedRate}
                            actionLabel={step === 1 ? "Continue to Review" : "Pay Now"}
                            onAction={step === 1 ? handleContinueToReview : handleConfirmBooking}
                            isLoading={priceLoading}
                            disabled={priceLoading}
                            simpleMode={step === 2}
                        />
                    </div>
                </div>
            </main>

            {/* Back Alert Dialog */}
            <AlertDialog open={backAlertOpen} onOpenChange={setBackAlertOpen}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>
                            {step === 1 ? "Leave Booking Page?" : "Go back to Traveller Details?"}
                        </AlertDialogTitle>
                        <AlertDialogDescription>
                            {step === 1
                                ? "You are about to leave the booking process. Any details entered will be lost. Are you sure?"
                                : "If you go back, any changes made in this step might not be saved. Are you sure you want to edit traveller details?"}
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction onClick={handleGoBackConfirmed}>
                            {step === 1 ? "Yes, Leave" : "Yes, Go Back"}
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>



            <GenericErrorModal
                open={errorModalOpen}
                title="Booking Failed"
                message={errorMessage}
                actionLabel="Close"
                onAction={() => setErrorModalOpen(false)}
            />

            <BookingLoader open={bookingLoading} />
        </div>
    );
}

export default function ReviewBookingPage() {
    return (
        <Suspense fallback={
            <div className="min-h-screen bg-gray-50 flex flex-col font-sans items-center justify-center">
                <Loader2 className="w-10 h-10 text-primary animate-spin" />
                <p className="text-gray-500 font-medium mt-4">Loading...</p>
            </div>
        }>
            <ReviewBookingContent />
        </Suspense>
    );
}
