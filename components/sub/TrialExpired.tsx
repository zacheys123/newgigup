// components/TrialExpiredModal.tsx

import useStore from "@/app/zustand/useStore";
import { motion } from "framer-motion";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from "../ui/dialog";
import { useRouter } from "next/navigation";

export const TrialExpiredModal = () => {
  const { showTrialModal, setShowTrialModal } = useStore();
  const router = useRouter();

  return (
    <Dialog
      open={showTrialModal}
      onOpenChange={(open) => {
        if (!open) {
          setShowTrialModal(false);
          router.push("/"); // redirect or hide modal logic
        }
      }}
    >
      <DialogContent className="bg-transparent border-none p-0">
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-6">
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: "spring", stiffness: 200, damping: 20 }}
            className="w-[90%] max-w-md sm:max-w-lg bg-white rounded-2xl shadow-xl p-6 sm:p-8 text-center space-y-5"
          >
            <DialogTitle className="text-2xl font-bold text-gray-900">
              Free Trial Ended 🎉
            </DialogTitle>
            <DialogDescription className="text-gray-600 text-base">
              Your 1-month free trial has ended.
              <br />
              Upgrade now to keep enjoying all premium features.
            </DialogDescription>
            <button
              onClick={() => (window.location.href = "/dashboard/billing")}
              className="mt-4 px-6 py-2.5 text-white text-sm sm:text-base rounded-lg bg-gradient-to-r from-purple-600 via-pink-500 to-yellow-400 hover:brightness-110 transition-all"
            >
              Upgrade Now
            </button>
          </motion.div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
