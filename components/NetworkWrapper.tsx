"use client";

import { useNetworkStatus } from "@/hooks/useNetwork";
import OfflinePage from "./offline/Offline";
// import useStore from "@/app/zustand/useStore";
import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";
import { Wifi } from "lucide-react";

export default function NetworkWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  const isOnline = useNetworkStatus();
  const [showNotification, setShowNotification] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    let showTimer: NodeJS.Timeout;
    let hideTimer: NodeJS.Timeout;

    if (isOnline) {
      showTimer = setTimeout(() => {
        setShowNotification(true);
        setIsVisible(true);

        hideTimer = setTimeout(() => {
          setIsVisible(false);
        }, 2000);
      }, 2000);
    }

    return () => {
      clearTimeout(showTimer);
      clearTimeout(hideTimer);
    };
  }, [isOnline]);

  if (!isOnline) {
    return <OfflinePage />;
  }

  return (
    <>
      <AnimatePresence>
        {showNotification && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={isVisible ? { opacity: 1, y: 0 } : { opacity: 0, y: -20 }}
            transition={{
              duration: 0.3,
              ease: [0.16, 1, 0.3, 1], // Smooth spring-like easing
            }}
            onAnimationComplete={() => {
              if (!isVisible) setShowNotification(false);
            }}
            className="fixed top-4 left-1/2 -translate-x-1/2 z-[9998]"
          >
            <div className="bg-emerald-500 text-white px-4 py-3 rounded-lg shadow-lg flex items-center gap-3 backdrop-blur-sm text-sm font-medium border border-emerald-400/50">
              <Wifi className="w-4 h-4" />
              <span>{`You're back online`}</span>
              <button
                onClick={() => setIsVisible(false)}
                className="ml-2 p-1 rounded-full hover:bg-white/10 transition-colors"
                aria-label="Dismiss notification"
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                  <path
                    d="M18 6L6 18M6 6l12 12"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                  />
                </svg>
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      {children}
    </>
  );
}
