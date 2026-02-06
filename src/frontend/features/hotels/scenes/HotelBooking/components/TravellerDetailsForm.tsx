"use client";

import React from "react";
import { Input } from "@/frontend/components/ui/input";
import { Label } from "@/frontend/components/ui/label";
import { Checkbox } from "@/frontend/components/ui/checkbox";

export interface Guest {
    salutation: string;
    firstName: string;
    lastName: string;
    type: "Adult" | "Child";
    age?: number;
}

export interface ContactInfo {
    email: string;
    phone: string;
    countryCode: string; // e.g. +91
}

export interface RoomGuests {
    roomIndex: number;
    guests: Guest[];
}

interface TravellerDetailsFormProps {
    occupancies: { numOfAdults: number; childAges: number[] }[];
    rooms: RoomGuests[];
    contactInfo: ContactInfo;
    specialRequest: string;
    agreedToTerms: boolean;
    errors: Record<string, string>; // Simple error map key -> message
    onChangeRooms: (rooms: RoomGuests[]) => void;
    onChangeContact: (info: ContactInfo) => void;
    onChangeSpecialRequest: (val: string) => void;
    onChangeAgreement: (val: boolean) => void;
    onClearError?: (key: string) => void;
}

export function TravellerDetailsForm({
    occupancies,
    rooms,
    contactInfo,
    specialRequest,
    agreedToTerms,
    errors,
    onChangeRooms,
    onChangeContact,
    onChangeSpecialRequest,
    onChangeAgreement,
    onClearError
}: TravellerDetailsFormProps) {

    const updateGuest = (roomIdx: number, guestIdx: number, field: keyof Guest, value: string) => {
        const newRooms = rooms.map((r, rI) => {
            if (rI !== roomIdx) return r;
            return {
                ...r,
                guests: r.guests.map((g, gI) => {
                    if (gI !== guestIdx) return g;
                    return { ...g, [field]: value };
                })
            };
        });
        onChangeRooms(newRooms);

        // Clear error if exists
        const errorKey = `room${roomIdx}_guest${guestIdx}_${field}`;
        if (onClearError && errors[errorKey]) {
            onClearError(errorKey);
        }
    };

    return (
        <div className="space-y-8">
            {/* Rooms Section */}
            {rooms.map((room, rIdx) => (
                <div key={rIdx} className="border border-gray-200 rounded-xl p-6 bg-white shadow-sm">
                    <h3 className="text-lg font-bold text-gray-900 mb-6 border-b pb-4">
                        Room {rIdx + 1}
                        <span className="text-sm font-normal text-gray-500 ml-2">
                            ({occupancies[rIdx].numOfAdults} Adults{occupancies[rIdx].childAges?.length > 0 ? `, ${occupancies[rIdx].childAges.length} Children` : ""})
                        </span>
                    </h3>

                    <div className="space-y-8">
                        {room.guests.map((guest, gIdx) => (
                            <div key={gIdx} className="space-y-3">
                                <h4 className="text-sm font-semibold text-gray-700 uppercase tracking-wider">
                                    {guest.type} {gIdx + 1}
                                </h4>
                                <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-start">
                                    <div className="md:col-span-2">
                                        <div className="flex justify-between h-[18px] mb-1">
                                            <Label className="text-xs text-gray-500">Title</Label>
                                        </div>
                                        <select
                                            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-green-500 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                                            value={guest.salutation}
                                            onChange={(e) => updateGuest(rIdx, gIdx, "salutation", e.target.value)}
                                        >
                                            <option value="">Select</option>
                                            <option value="Mr">Mr</option>
                                            <option value="Mrs">Mrs</option>
                                            <option value="Ms">Ms</option>
                                            <option value="Master">Master</option>
                                        </select>
                                    </div>
                                    <div className="md:col-span-5">
                                        <div className="flex justify-between h-[18px] mb-1">
                                            <Label className="text-xs text-gray-500">First Name <span className="text-red-500">*</span></Label>
                                            {errors[`room${rIdx}_guest${gIdx}_firstName`] && <span className="text-xs text-red-500 ml-2 truncate">{errors[`room${rIdx}_guest${gIdx}_firstName`]}</span>}
                                        </div>
                                        <Input
                                            placeholder="First Name"
                                            value={guest.firstName}
                                            onChange={(e) => updateGuest(rIdx, gIdx, "firstName", e.target.value)}
                                            className={errors[`room${rIdx}_guest${gIdx}_firstName`] ? "border-red-500 focus-visible:ring-red-500" : ""}
                                        />
                                    </div>
                                    <div className="md:col-span-5">
                                        <div className="flex justify-between h-[18px] mb-1">
                                            <Label className="text-xs text-gray-500">Last Name <span className="text-red-500">*</span></Label>
                                            {errors[`room${rIdx}_guest${gIdx}_lastName`] && <span className="text-xs text-red-500 ml-2 truncate">{errors[`room${rIdx}_guest${gIdx}_lastName`]}</span>}
                                        </div>
                                        <Input
                                            placeholder="Last Name"
                                            value={guest.lastName}
                                            onChange={(e) => updateGuest(rIdx, gIdx, "lastName", e.target.value)}
                                            className={errors[`room${rIdx}_guest${gIdx}_lastName`] ? "border-red-500 focus-visible:ring-red-500" : ""}

                                        />
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            ))}

            {/* Contact Information Section */}
            <div className="border border-gray-200 rounded-xl p-6 bg-white shadow-sm">
                <h3 className="text-lg font-bold text-gray-900 mb-6 border-b pb-4">Contact Information</h3>
                <p className="text-sm text-gray-500 mb-4">We will send the booking confirmation to these details.</p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-1">
                        <div className="flex justify-between">
                            <Label className="text-xs text-gray-500">Email Address <span className="text-red-500">*</span></Label>
                            {errors.email && <span className="text-xs text-red-500">{errors.email}</span>}
                        </div>
                        <Input
                            type="email"
                            placeholder="email@example.com"
                            value={contactInfo.email}
                            onChange={(e) => {
                                onChangeContact({ ...contactInfo, email: e.target.value });
                                if (onClearError && errors.email) onClearError("email");
                            }}
                            className={errors.email ? "border-red-500 focus-visible:ring-red-500" : ""}
                        />
                    </div>
                    <div className="space-y-1">
                        <div className="flex justify-between">
                            <Label className="text-xs text-gray-500">Phone Number <span className="text-red-500">*</span></Label>
                            {errors.phone && <span className="text-xs text-red-500">{errors.phone}</span>}
                        </div>
                        <div className="flex gap-2">
                            <Input className="w-20 bg-gray-50" value={contactInfo.countryCode} readOnly disabled />
                            <Input
                                type="tel"
                                placeholder="Mobile Number"
                                value={contactInfo.phone}
                                onChange={(e) => {
                                    const val = e.target.value.replace(/\D/g, '').slice(0, 10);
                                    onChangeContact({ ...contactInfo, phone: val });
                                    if (onClearError && errors.phone) onClearError("phone");
                                }}
                                className={errors.phone ? "border-red-500 focus-visible:ring-red-500" : ""}
                            />
                        </div>
                    </div>
                </div>
            </div>

            {/* Special Requests */}
            <div className="border border-gray-200 rounded-xl p-6 bg-white shadow-sm">
                <h3 className="text-lg font-bold text-gray-900 mb-4">Special Requests</h3>
                <Label className="text-xs text-gray-500 mb-2 block">Any special requests? (Optional)</Label>
                <textarea
                    className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-green-500 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                    placeholder="e.g. Early check-in, late check-out, non-smoking room..."
                    value={specialRequest}
                    onChange={(e) => onChangeSpecialRequest(e.target.value)}
                />
            </div>

            {/* Agreement Section */}
            <div className="border border-gray-200 rounded-xl p-6 bg-white shadow-sm">
                <div className="flex items-start spaces-x-2">
                    <div className="flex items-center h-5">
                        <Checkbox
                            id="terms"
                            checked={agreedToTerms}
                            onCheckedChange={(checked) => {
                                onChangeAgreement(checked === true);
                                if (onClearError && errors.agreement) onClearError("agreement");
                            }}
                            className={errors.agreement ? "border-red-500" : ""}
                        />
                    </div>
                    <div className="ml-3 text-sm">
                        <label htmlFor="terms" className="font-medium text-gray-700">I agree to the <a href="#" className="text-green-600 hover:underline">Terms & Conditions</a> and <a href="#" className="text-green-600 hover:underline">Privacy Policy</a>.</label>
                        {errors.agreement && <p className="text-red-500 text-xs mt-1">{errors.agreement}</p>}
                    </div>
                </div>
            </div>
        </div>
    );
}
