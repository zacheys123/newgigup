// components/NetworkWrapper.tsx
"use client";

import { useNetworkStatus } from "@/hooks/useNetwork";
import OfflinePage from "./offline/Offline";
import useStore from "@/app/zustand/useStore";
import { motion } from "framer-motion";

export default function NetworkWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  const isOnline = useNetworkStatus();

  const { showOfflineNotification, setShowOfflineNotification } = useStore();

  if (!isOnline) {
    return <OfflinePage />;
  }

  return (
    <>
      {isOnline && !showOfflineNotification && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="fixed top-4 left-1/2 -translate-x-1/2 z-[9998]"
        >
          <div className="bg-emerald-500/90 text-white px-4 py-2 rounded-lg shadow-lg flex items-center gap-2 backdrop-blur-sm text-sm">
            <span>{`You're back online`}</span>
            <button
              onClick={() => setShowOfflineNotification(true)}
              className="underline text-white/80 hover:text-white text-lg"
            >
              &times;
            </button>
          </div>
        </motion.div>
      )}
      {children}
    </>
  );
}
