"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { CheckCircle } from "lucide-react";
import { Button } from "@/frontend/components/ui/button";
import { CompactHeader } from "@/frontend/features/hotels/scenes/HotelDetails/components/CompactHeader";

export default function BookingStatusPage() {
    const router = useRouter();

    return (
        <div className="min-h-screen bg-gray-50 font-sans text-gray-900 pb-20">
            <CompactHeader />

            <main className="max-w-3xl mx-auto px-4 sm:px-6 py-12">
                <section className="text-center py-12 bg-white rounded-xl shadow-sm border border-gray-200">
                    <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-green-100 text-green-600 mb-4">
                        <CheckCircle className="w-8 h-8" />
                    </div>
                    <h2 className="text-2xl font-bold mb-2">Booking Confirmed!</h2>
                    <p className="text-gray-600 mb-8">Your booking has been placed successfully.</p>
                    <Button onClick={() => router.push("/")} className="bg-primary hover:bg-primary/90">
                        Return Home
                    </Button>
                </section>
            </main>
        </div>
    );
}
