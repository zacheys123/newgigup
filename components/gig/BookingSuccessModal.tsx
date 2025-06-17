// components/BookingSuccessModal.tsx
"use client";

import { motion } from "framer-motion";
import { CheckCircle } from "lucide-react";

export const BookingSuccessModal = ({ gigId }: { gigId: string | null }) => {
  if (!gigId) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0 }}
      className="fixed bottom-6 right-6 bg-white p-4 rounded-lg shadow-xl border border-green-200 z-50 flex items-center gap-3"
    >
      <CheckCircle className="h-6 w-6 text-green-500" />
      <span className="absolute right-3 text-[17px] -top-3 font-bold my-2">
        &times;
      </span>
      <div>
        <p className="font-medium text-gray-800">Booking Confirmed!</p>
        <p className="text-sm text-gray-600">Your gig is secured.</p>
      </div>
    </motion.div>
  );
};
