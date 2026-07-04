"use client";
import { useEffect } from "react";

export default function ServiceWorkerRegister() {
  useEffect(() => {
    if ("serviceWorker" in navigator) {
      navigator.serviceWorker.register("/sw.js").then((reg) => {
        // Force update if new SW is waiting
        if (reg.waiting) {
          reg.waiting.postMessage({ type: "SKIP_WAITING" });
        }
        // Listen for new SW installing
        reg.addEventListener("updatefound", () => {
          const newWorker = reg.installing;
          if (newWorker) {
            newWorker.addEventListener("statechange", () => {
              if (newWorker.state === "installed" && navigator.serviceWorker.controller) {
                // New SW installed, tell it to activate immediately
                newWorker.postMessage({ type: "SKIP_WAITING" });
              }
            });
          }
        });
      }).catch(() => {});

      // Listen for SW update message and reload
      navigator.serviceWorker.addEventListener("message", (event) => {
        if (event.data?.type === "SW_UPDATED") {
          window.location.reload();
        }
      });
    }
  }, []);
  return null;
}
