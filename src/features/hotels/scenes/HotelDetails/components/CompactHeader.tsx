"use client";

import React from "react";
import { Search, Menu, Loader2 } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { updateSearchPath } from "@/features/home/hooks/useSearchPath";
import { Button } from "@/components/ui/button";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover";
import { SupportMenuContent } from "@/features/home/scenes/HomeLanding/components/SupportMenuContent";
import { SearchProgressBar } from "@/features/home/scenes/HomeLanding/components/SearchProgressBar";
import { TextSwipeLoader } from "@/features/home/scenes/HomeLanding/components/TextSwipeLoader";
import { content } from "@/lib/content";
import { HeroWidget, type HeroWidgetInitialValues } from "@/features/home/scenes/HomeLanding/components/HeroWidget";
import { getSearchPayload } from "@/features/hotels/utils/searchParams";

export function CompactHeader() {
    const [searchExpanded, setSearchExpanded] = React.useState(false);

    // Confirmation Alert State
    const [showExitConfirmation, setShowExitConfirmation] = React.useState(false);
    const [isNavigating, setIsNavigating] = React.useState(false);
    const searchResolveRef = React.useRef<((proceed: boolean) => void) | null>(null);

    // Initial values for HeroWidget based on current URL search params
    const heroInitialValues = React.useMemo((): HeroWidgetInitialValues | undefined => {
        if (typeof window === 'undefined') return undefined; // simple check
        const payload = getSearchPayload();
        if (!payload) return undefined;

        return {
            where: "", // We might not have the text easily, let widget infer from last search or payload if possible, or leave empty
            dateRange: {
                from: payload.checkIn ? new Date(payload.checkIn) : undefined,
                to: payload.checkOut ? new Date(payload.checkOut) : undefined
            },
            rooms: payload.occupancies?.map(o => ({
                adults: o.numOfAdults,
                childAges: o.childAges
            })) || [],
            traceId: payload.traceId
        };
    }, [searchExpanded]); // re-calc when opening

    const handleBeforeSearch = () => {
        return new Promise<boolean>((resolve) => {
            setShowExitConfirmation(true);
            searchResolveRef.current = resolve;
        });
    };

    const handleConfirmExit = () => {
        setIsNavigating(true);
        // Do not close confirmation, show loader instead
        if (searchResolveRef.current) {
            searchResolveRef.current(true);
            searchResolveRef.current = null;
        }
    };

    const handleCancelExit = () => {
        setShowExitConfirmation(false);
        if (searchResolveRef.current) {
            searchResolveRef.current(false);
            searchResolveRef.current = null;
        }
    };

    return (
        <>
            <header className="sticky top-0 z-40 border-b border-gray-200 bg-white shadow-sm relative">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4">
                    <div className="flex items-center justify-between h-10">
                        {/* Logo */}
                        <div className="flex-shrink-0">
                            <Link
                                href="/"
                                className="focus:outline-none block hover:opacity-80 transition-opacity"
                                aria-label="Go to Home"
                            >
                                <Image
                                    src="/logo/logo.png"
                                    alt={content.app.name}
                                    width={120}
                                    height={120}
                                    className="h-10 w-auto object-contain"
                                    priority
                                />
                            </Link>
                        </div>

                        {/* Search Bar - Compact Trigger */}
                        <div className="flex-1 max-w-[30vw] px-4 lg:px-8">
                            <div className="relative">
                                <div
                                    className="flex items-center w-full h-10 px-4 rounded-full border border-gray-300 bg-white shadow-sm hover:shadow-md cursor-pointer transition-all"
                                    onClick={() => setSearchExpanded(true)}
                                >
                                    <div className="flex-1 truncate text-sm font-medium text-gray-900 border-r border-gray-300 pr-4 mr-4">
                                        Anywhere
                                    </div>
                                    <div className="flex-1 truncate text-sm font-medium text-gray-900 border-r border-gray-300 pr-4 mr-4 hidden sm:block">
                                        Any week
                                    </div>
                                    <div className="flex-1 truncate text-sm font-medium text-gray-900 border-gray-300 pr-4 mr-4 hidden sm:block">
                                        Add guests
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* User Menu */}
                        <div className="flex-shrink-0">
                            <Popover>
                                <PopoverTrigger asChild>
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        className="h-10 w-10 rounded-full text-muted-foreground bg-slate-100/50 hover:bg-slate-100 hover:text-foreground shrink-0 transition-colors border border-gray-200"
                                        aria-label={content.nav.moreMenuAria}
                                    >
                                        <Menu className="h-5 w-5" strokeWidth={1.5} />
                                    </Button>
                                </PopoverTrigger>
                                <PopoverContent className="w-auto p-0" align="end" sideOffset={8}>
                                    <SupportMenuContent />
                                </PopoverContent>
                            </Popover>
                        </div>
                    </div>
                </div>
            </header>

            {/* Expanded Search Overlay */}
            {/* ... */}

            {/* Expanded Search Overlay */}
            {searchExpanded && (
                <div
                    className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm animate-in fade-in duration-300 flex flex-col"
                    onClick={() => setSearchExpanded(false)}
                >
                    <div
                        className="bg-white w-full border-b border-gray-200 shadow-xl animate-in slide-in-from-top-10 duration-500 pt-4 pb-6"
                        onClick={e => e.stopPropagation()}
                    >
                        <div className="max-w-7xl mx-auto px-4 sm:px-6">
                            <div className="flex items-center gap-4 w-full min-h-[56px]">
                                {/* Logo - Same as HomeHeader */}
                                <div className="self-start pt-2 transform transition-transform hover:scale-105 origin-left">
                                    <button
                                        type="button"
                                        onClick={() => updateSearchPath("/")}
                                        className="focus:outline-none"
                                        aria-label="Go to Home"
                                    >
                                        <Image
                                            src="/logo/logo.png"
                                            alt={content.app.name}
                                            width={120}
                                            height={120}
                                            className="h-10 w-auto object-contain"
                                            priority
                                        />
                                    </button>
                                </div>

                                {/* Widget - Centered with HomeHeader constraints */}
                                <div className="flex-1 min-w-0 flex justify-center items-center">
                                    <div className="w-full max-w-[50vw] flex flex-col pt-2">
                                        <HeroWidget
                                            initialValues={heroInitialValues}
                                            onBeforeSearch={handleBeforeSearch}
                                        />
                                    </div>
                                </div>

                                {/* Menu - Same as HomeHeader */}
                                <div className="self-start pt-2">
                                    <Popover>
                                        <PopoverTrigger asChild>
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                className="h-10 w-10 rounded-full text-muted-foreground bg-slate-100/50 hover:bg-slate-100 hover:text-foreground shrink-0 transition-colors border border-gray-200"
                                                aria-label={content.nav.moreMenuAria}
                                            >
                                                <Menu className="h-5 w-5" strokeWidth={1.5} />
                                            </Button>
                                        </PopoverTrigger>
                                        <PopoverContent className="w-auto p-0" align="end" sideOffset={8}>
                                            <SupportMenuContent />
                                        </PopoverContent>
                                    </Popover>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Exit Confirmation Dialog (or Full Screen Loader when Navigating) */}
            {showExitConfirmation && (
                <>
                    {/* If navigating, we show a full-screen loader mocking the results page to prevent lag snap */}
                    {isNavigating ? (
                        <div className="fixed inset-0 z-[100] bg-slate-50 flex flex-col items-center animate-in fade-in duration-300">
                            {/* Mock Header space - matches standard header height to prevent visual jump */}
                            <div className="w-full h-[73px] bg-white border-b border-gray-200 opacity-80" />

                            <div className="w-full">
                                <SearchProgressBar loading={true} />
                            </div>

                            <div className="flex-1 flex flex-col items-center justify-start pt-[20vh] w-full">
                                <TextSwipeLoader />
                            </div>
                        </div>
                    ) : (
                        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 animate-in fade-in zoom-in duration-200">
                            <div className="bg-white rounded-xl shadow-2xl max-w-sm w-full p-6 text-center">
                                <h3 className="text-xl font-bold text-gray-900 mb-2">Leave this page?</h3>
                                <p className="text-gray-600 mb-6">
                                    You are about to start a new search. Your current hotel selection will be lost.
                                </p>
                                <div className="flex justify-center gap-3">
                                    <Button variant="outline" onClick={handleCancelExit} className="flex-1">
                                        Cancel
                                    </Button>
                                    <Button onClick={handleConfirmExit} className="flex-1 bg-red-600 hover:bg-red-700 text-white">
                                        Search Anyway
                                    </Button>
                                </div>
                            </div>
                        </div>
                    )}
                </>
            )}
        </>
    );
}
