"use client";

import React from "react";
import { AlertCircle } from "lucide-react";
import { Button } from "@/frontend/components/ui/button";
import { content } from "@/frontend/core/content"; // Assuming content exists, otherwise hardcode or pass prop

interface GenericErrorModalProps {
    open: boolean;
    title?: string;
    message?: string;
    onAction?: () => void;
    actionLabel?: string;
}

export function GenericErrorModal({
    open,
    title = "Something went wrong",
    message = "We encountered an unexpected error. Please try again later.",
    onAction,
    actionLabel = "Go Home",
}: GenericErrorModalProps) {
    if (!open) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 animate-in fade-in duration-200">
            <div
                className="bg-white rounded-2xl shadow-xl max-w-md w-full p-6 text-center animate-in zoom-in-95 duration-200"
                role="alertdialog"
                aria-modal="true"
                aria-labelledby="error-title"
                aria-describedby="error-desc"
            >
                <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-red-100 mb-4">
                    <AlertCircle className="h-8 w-8 text-red-600" aria-hidden="true" />
                </div>

                <h3 id="error-title" className="text-xl font-bold text-gray-900 mb-2">
                    {title}
                </h3>

                <p id="error-desc" className="text-sm text-gray-500 mb-6">
                    {message}
                </p>

                <div className="flex justify-center">
                    {onAction && (
                        <Button onClick={onAction} className="w-full sm:w-auto min-w-[120px]">
                            {actionLabel}
                        </Button>
                    )}
                </div>
            </div>
        </div>
    );
}
