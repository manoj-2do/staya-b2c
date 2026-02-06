
import React from "react";
import { Mail, Phone, MapPin, Linkedin, Twitter, Instagram } from "lucide-react";
import { Button } from "@/components/ui/button";

export function SupportMenuContent() {
    return (
        <div className="flex flex-col gap-4 p-4 min-w-[320px]">
            {/* Header */}
            <div className="space-y-1 border-b border-border pb-2">
                <h3 className="font-semibold leading-none tracking-tight">Support & Contact</h3>
                <p className="text-sm text-muted-foreground">We are here to help you.</p>
            </div>

            {/* Contact Section */}
            <div className="flex flex-col gap-2">
                <a
                    href="mailto:support@staya.com"
                    className="flex items-center gap-3 p-2 rounded-md hover:bg-muted transition-colors"
                >
                    <div className="h-8 w-8 rounded-md bg-primary/10 flex items-center justify-center shrink-0">
                        <Mail className="h-4 w-4 text-primary" />
                    </div>
                    <div>
                        <p className="text-sm font-medium leading-none">Email Support</p>
                        <p className="text-xs text-muted-foreground mt-0.5">manoj.tudu@snap.com</p>
                    </div>
                </a>

                <a
                    href="tel:+919876543210"
                    className="flex items-center gap-3 p-2 rounded-md hover:bg-muted transition-colors"
                >
                    <div className="h-8 w-8 rounded-md bg-primary/10 flex items-center justify-center shrink-0">
                        <Phone className="h-4 w-4 text-primary" />
                    </div>
                    <div>
                        <p className="text-sm font-medium leading-none">Call Us</p>
                        <p className="text-xs text-muted-foreground mt-0.5">+91 7978999520</p>
                    </div>
                </a>
            </div>

            <div className="w-full h-px bg-border" />

            {/* Office Address */}
            <div className="flex items-start gap-3 p-2 rounded-md border border-border bg-muted/20">
                <div className="h-7 w-7 rounded-md bg-background border border-border flex items-center justify-center shrink-0 mt-0.5">
                    <MapPin className="h-3.5 w-3.5 text-muted-foreground" />
                </div>
                <div>
                    <h4 className="text-xs font-medium leading-none mb-1">Our Office</h4>
                    <p className="text-xs text-muted-foreground leading-relaxed">
                        001 10101 00001, _._._.___<br />
                        ___.__.._ - XXXXXX
                    </p>
                </div>
            </div>

            {/* Social Links */}
            <div className="pt-1">
                <h4 className="text-xs font-medium mb-2 text-muted-foreground">Connect with us</h4>
                <div className="flex gap-2">
                    <a
                        href="#"
                        className="h-8 w-8 rounded-md border border-border flex items-center justify-center hover:bg-muted transition-all text-muted-foreground hover:text-foreground"
                        aria-label="LinkedIn"
                    >
                        <Linkedin className="h-3.5 w-3.5" />
                    </a>
                    <a
                        href="#"
                        className="h-8 w-8 rounded-md border border-border flex items-center justify-center hover:bg-muted transition-all text-muted-foreground hover:text-foreground"
                        aria-label="Twitter"
                    >
                        <Twitter className="h-3.5 w-3.5" />
                    </a>
                    <a
                        href="#"
                        className="h-8 w-8 rounded-md border border-border flex items-center justify-center hover:bg-muted transition-all text-muted-foreground hover:text-foreground"
                        aria-label="Instagram"
                    >
                        <Instagram className="h-3.5 w-3.5" />
                    </a>
                </div>
            </div>

            {/* Footer */}
            <div className="pt-2 border-t border-border mt-1">
                <p className="text-[10px] text-center text-muted-foreground">
                    © 2026 Staya Inc.
                </p>
            </div>
        </div>
    );
}
