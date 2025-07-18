"use client";
import { useEffect } from "react";
import { Workbox } from "workbox-window";

export default function PWAProvider() {
  useEffect(() => {
    if (
      typeof window !== "undefined" &&
      "serviceWorker" in navigator &&
      process.env.NODE_ENV === "production"
    ) {
      const wb = new Workbox("/sw.js");

      const showSkipWaitingPrompt = () => {
        if (confirm("A new version is available! Refresh to update?")) {
          wb.addEventListener("controlling", () => {
            window.location.reload();
          });
          wb.messageSkipWaiting();
        }
      };

      wb.addEventListener("waiting", showSkipWaitingPrompt);
      wb.register();
    }
  }, []);

  return null;
}
