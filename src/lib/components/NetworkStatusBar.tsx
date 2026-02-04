"use client";

import { useEffect, useState } from "react";
import { content } from "../content";

const OFFLINE_ACTION_EVENT = "staya:offline-action";

export function dispatchOfflineActionToast() {
  if (typeof window !== "undefined") {
    window.dispatchEvent(new CustomEvent(OFFLINE_ACTION_EVENT));
  }
}

export function NetworkStatusBar() {
  const [isOnline, setIsOnline] = useState(true);
  const [showBackOnline, setShowBackOnline] = useState(false);
  const [showOfflineToast, setShowOfflineToast] = useState(false);

  useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true);
      setShowBackOnline(true);
      setTimeout(() => setShowBackOnline(false), 3000);
    };

    const handleOffline = () => {
      setIsOnline(false);
    };

    const handleOfflineAction = () => {
      setShowOfflineToast(true);
      setTimeout(() => setShowOfflineToast(false), 3000);
    };

    setIsOnline(typeof navigator !== "undefined" ? navigator.onLine : true);
    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);
    window.addEventListener(OFFLINE_ACTION_EVENT, handleOfflineAction);
    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
      window.removeEventListener(OFFLINE_ACTION_EVENT, handleOfflineAction);
    };
  }, []);

  return (
    <>
      {!isOnline && (
        <div
          className="fixed top-0 left-0 right-0 z-50 bg-amber-600 text-white text-center py-2 px-4 text-sm font-medium"
          role="status"
          aria-live="polite"
        >
          {content.network.offlineMessage}
        </div>
      )}

      {showBackOnline && (
        <div
          className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 bg-emerald-600 text-white px-4 py-2 rounded-lg text-sm font-medium shadow-lg"
          role="status"
          aria-live="polite"
        >
          {content.network.backOnlineMessage}
        </div>
      )}

      {showOfflineToast && (
        <div
          className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 bg-zinc-800 text-white px-4 py-2 rounded-lg text-sm border border-zinc-600 shadow-lg"
          role="alert"
        >
          {content.network.internetRequiredMessage}
        </div>
      )}
    </>
  );
}
