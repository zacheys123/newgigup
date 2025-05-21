"use client";
import { useEffect, useState } from "react";
import useStore from "@/app/zustand/useStore";
import { motion } from "framer-motion";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from "../ui/dialog";

export const TrialRemainingModal = () => {
  const { trialRemainingDays, setTrialRemainingDays } = useStore();
  const [shouldShow, setShouldShow] = useState(false);

  useEffect(() => {
    const trialModalShown = localStorage.getItem("trialModalShown");

    if (trialRemainingDays && !trialModalShown) {
      setShouldShow(true);
      localStorage.setItem("trialModalShown", "true");
    }
  }, [trialRemainingDays]);

  const closeModal = () => {
    setShouldShow(false);
    setTrialRemainingDays(null); // Optional: Reset Zustand state too
  };

  if (!shouldShow) return null;
  if (trialRemainingDays === null) return null;
  return (
    <Dialog open={true} onOpenChange={closeModal}>
      <DialogContent className="bg-transparent border-none p-0">
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-6">
          <motion.div
            initial={{ y: 40, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ type: "spring", stiffness: 180, damping: 18 }}
            className="w-[90%] max-w-md sm:max-w-lg bg-white rounded-2xl shadow-xl p-6 sm:p-8 text-center space-y-5"
          >
            <DialogTitle className="text-2xl font-bold text-gray-900">
              Trial Active ✨
            </DialogTitle>
            <DialogDescription className="text-gray-600 text-base">
              You have{" "}
              <strong>
                {trialRemainingDays} day{trialRemainingDays > 1 ? "s" : ""}
              </strong>{" "}
              left in your free trial.
              <br />
              Don’t miss out — unlock premium features today.
            </DialogDescription>
            <button
              onClick={() => (window.location.href = "/upgrade")}
              className="mt-4 px-6 py-2.5 text-white text-sm sm:text-base rounded-lg bg-gradient-to-r from-green-500 via-blue-500 to-indigo-500 hover:brightness-110 transition-all"
            >
              Upgrade Now
            </button>
          </motion.div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
