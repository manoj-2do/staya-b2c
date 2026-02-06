import React, { useEffect } from "react";
import { X, Mail, Phone, MapPin, Linkedin, Twitter, Instagram } from "lucide-react";
import { cn } from "@/frontend/core/utils";
import { Button } from "@/frontend/components/ui/button";

interface SupportModalProps {
    open: boolean;
    onClose: () => void;
}

import { createPortal } from "react-dom";

export function SupportModal({ open, onClose }: SupportModalProps) {
    // Prevent body scroll when menu is open
    useEffect(() => {
        if (open) {
            document.body.style.overflow = "hidden";
        } else {
            document.body.style.overflow = "";
        }
        return () => {
            document.body.style.overflow = "";
        };
    }, [open]);

    // Hydration check to avoid server-side portal errors
    const [mounted, setMounted] = React.useState(false);
    useEffect(() => setMounted(true), []);

    if (!open || !mounted) return null;

    return createPortal(
        <>
            {/* Backdrop overlay */}
            <div
                className={cn(
                    "fixed inset-0 bg-black/80 z-50 transition-all duration-200 backdrop-blur-sm animate-in fade-in",
                )}
                onClick={onClose}
                aria-hidden="true"
            />

            {/* Centered Modal */}
            <div
                className={cn(
                    "fixed left-[50%] top-[50%] z-50 grid w-full max-w-lg translate-x-[-50%] translate-y-[-50%] gap-4 border border-border bg-background p-0 shadow-lg duration-200 animate-in fade-in-0 slide-in-from-bottom-12 zoom-in-100 sm:rounded-lg"
                )}
                role="dialog"
                aria-modal="true"
                aria-label="Support Menu"
            >
                <div className="flex flex-col h-full max-h-[85vh]">
                    {/* Header */}
                    <div className="flex items-center justify-between p-6 pb-4 border-b border-border">
                        <div className="space-y-1">
                            <h2 className="text-lg font-semibold leading-none tracking-tight">Support & Contact</h2>
                            <p className="text-sm text-muted-foreground">We are here to help you.</p>
                        </div>
                        <Button
                            variant="ghost"
                            size="icon"
                            onClick={onClose}
                            className="h-6 w-6 rounded-full hover:bg-muted opacity-70 hover:opacity-100"
                        >
                            <X className="h-4 w-4" />
                            <span className="sr-only">Close</span>
                        </Button>
                    </div>

                    {/* Content */}
                    <div className="flex-1 overflow-y-auto p-6 space-y-6">
                        {/* Contact Section */}
                        <div className="space-y-4">
                            <div className="flex flex-col gap-3">
                                <a
                                    href="mailto:support@staya.com"
                                    className="flex items-center gap-4 p-3 rounded-md hover:bg-muted transition-colors border border-transparent hover:border-border"
                                >
                                    <div className="h-9 w-9 rounded-md bg-primary/10 flex items-center justify-center shrink-0">
                                        <Mail className="h-4 w-4 text-primary" />
                                    </div>
                                    <div>
                                        <p className="text-sm font-medium leading-none">Email Support</p>
                                        <p className="text-sm text-muted-foreground mt-1"> manoj.tudu@snap.com</p>
                                    </div>
                                </a>

                                <a
                                    href="tel:+919876543210"
                                    className="flex items-center gap-4 p-3 rounded-md hover:bg-muted transition-colors border border-transparent hover:border-border"
                                >
                                    <div className="h-9 w-9 rounded-md bg-primary/10 flex items-center justify-center shrink-0">
                                        <Phone className="h-4 w-4 text-primary" />
                                    </div>
                                    <div>
                                        <p className="text-sm font-medium leading-none">Call Us</p>
                                        <p className="text-sm text-muted-foreground mt-1">+91 7978999520</p>
                                    </div>
                                </a>
                            </div>
                        </div>

                        <div className="w-full h-px bg-border my-2" />

                        {/* Office Address */}
                        <div className="flex items-start gap-4 p-3 rounded-md border border-border bg-muted/20">
                            <div className="h-9 w-9 rounded-md bg-background border border-border flex items-center justify-center shrink-0 mt-0.5">
                                <MapPin className="h-4 w-4 text-muted-foreground" />
                            </div>
                            <div>
                                <h4 className="text-sm font-medium leading-none mb-1.5">Our Office</h4>
                                <p className="text-sm text-muted-foreground leading-relaxed">
                                    001 10101 00001, _._._.___<br />
                                    ___.__.._, _._._.___ - XXXXXX
                                </p>
                            </div>
                        </div>

                        {/* Social Links */}
                        <div className="pt-2">
                            <h4 className="text-sm font-medium mb-4">Connect with us</h4>
                            <div className="flex gap-2">
                                <a
                                    href="#"
                                    className="h-9 w-9 rounded-md border border-border flex items-center justify-center hover:bg-muted transition-all text-muted-foreground hover:text-foreground"
                                    aria-label="LinkedIn"
                                >
                                    <Linkedin className="h-4 w-4" />
                                </a>
                                <a
                                    href="#"
                                    className="h-9 w-9 rounded-md border border-border flex items-center justify-center hover:bg-muted transition-all text-muted-foreground hover:text-foreground"
                                    aria-label="Twitter"
                                >
                                    <Twitter className="h-4 w-4" />
                                </a>
                                <a
                                    href="#"
                                    className="h-9 w-9 rounded-md border border-border flex items-center justify-center hover:bg-muted transition-all text-muted-foreground hover:text-foreground"
                                    aria-label="Instagram"
                                >
                                    <Instagram className="h-4 w-4" />
                                </a>
                            </div>
                        </div>
                    </div>

                    {/* Footer */}
                    <div className="p-6 border-t border-border bg-muted/20">
                        <p className="text-xs text-center text-muted-foreground">
                            © 2026 Snap Inc. All rights reserved.
                        </p>
                    </div>
                </div>
            </div>
        </>,
        document.body
    );
}
