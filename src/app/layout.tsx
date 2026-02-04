import type { Metadata } from "next";
import { DM_Sans } from "next/font/google";
import React, { type ReactNode } from "react";
import { appConfig } from "@/frontend/core/app.config";
import { content } from "@/frontend/core/content";
import { NetworkStatusBar } from "@/frontend/core/components/NetworkStatusBar";
import "./globals.css";

const dmSans = DM_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-dm-sans",
  display: "swap",
});

export const metadata: Metadata = {
  title: `${appConfig.appName} — ${content.app.tagline}`,
  description: content.app.description,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: ReactNode;
}>) {
  return (
    <html lang="en" className={dmSans.variable}>
      <body className="min-h-screen bg-background text-foreground font-sans antialiased">
        <NetworkStatusBar />
        {children}
      </body>
    </html>
  );
}
