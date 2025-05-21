// components/OfflineNotification.tsx
import { motion, AnimatePresence } from "framer-motion";
import { WifiOff } from "lucide-react";

export const OfflineNotification = () => {
  return (
    <AnimatePresence>
      <motion.div
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: -50, opacity: 0 }}
        transition={{ type: "spring", damping: 25 }}
        className="fixed top-4 left-1/2 -translate-x-1/2 z-[9999]"
      >
        <div className="bg-red-500/90 text-white px-6 py-3 rounded-lg shadow-lg flex items-center gap-3 backdrop-blur-sm">
          <WifiOff className="w-5 h-5" />
          <span className="text-sm font-medium">
            {` You're offline - changes will be saved locall`}
          </span>
        </div>
      </motion.div>
    </AnimatePresence>
  );
};
