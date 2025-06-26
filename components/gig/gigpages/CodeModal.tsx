"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle2, LockKeyhole, RotateCw, Star } from "lucide-react";

interface CodeModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (code: string, rating: number) => void;
}

export const CodeModal = ({ isOpen, onClose, onConfirm }: CodeModalProps) => {
  const [code, setCode] = useState("");
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [readyToFinalize, setReadyToFinalize] = useState(false);

  const handleSubmit = async () => {
    if (!code.trim()) return;
    setIsSubmitting(true);
    try {
      await onConfirm(code, rating);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleFinalize = async () => {
    setIsSubmitting(true);
    try {
      await onConfirm(code, rating);
      onClose();
      // Reset state after closing
      setCode("");
      setRating(0);
      setHoverRating(0);
      setReadyToFinalize(false);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-md max-w-sm rounded-xl bg-gradient-to-br from-white to-gray-50 dark:from-gray-900 dark:to-gray-800 border border-gray-200 dark:border-gray-700 shadow-xl">
        <DialogHeader>
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            <DialogTitle className="text-xl font-semibold flex items-center gap-2 text-gray-900 dark:text-white">
              {readyToFinalize ? (
                <>
                  <CheckCircle2 className="h-5 w-5 text-green-500" />
                  Finalize Payment
                </>
              ) : (
                <>
                  <LockKeyhole className="h-5 w-5 text-blue-500" />
                  {"Confirm Payment"}
                </>
              )}
            </DialogTitle>
            <DialogDescription className="text-gray-600 dark:text-gray-300 mt-1">
              {readyToFinalize
                ? "Ready to complete the payment process?"
                : "Please  rate your experience and  enter the last 3 letters/digits of the payment confirmation message."}
            </DialogDescription>
          </motion.div>
        </DialogHeader>

        <AnimatePresence mode="wait">
          <motion.div
            key={readyToFinalize ? "finalize" : "confirm"}
            initial={{ opacity: 0, x: 10 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -10 }}
            transition={{ duration: 0.2 }}
          >
            {!readyToFinalize ? (
              <div className="space-y-6 py-4">
                <div className="flex flex-col space-y-2">
                  <Input
                    id="payment-code"
                    value={code}
                    onChange={(e) => setCode(e.target.value)}
                    placeholder="Enter 3-digit code"
                    className="text-center text-lg font-medium tracking-widest h-12 border-gray-300 dark:border-gray-600 focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
                    maxLength={6}
                  />
                </div>

                <div className="flex flex-col items-center space-y-2">
                  <p className="text-sm text-gray-600 dark:text-gray-300">
                    How would you rate this experience?
                  </p>
                  <div className="flex items-center gap-1">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        type="button"
                        className="focus:outline-none"
                        onClick={() => setRating(star)}
                        onMouseEnter={() => setHoverRating(star)}
                        onMouseLeave={() => setHoverRating(0)}
                      >
                        <Star
                          className={`h-6 w-6 ${
                            (hoverRating || rating) >= star
                              ? "fill-yellow-400 text-yellow-400"
                              : "text-gray-300 dark:text-gray-500"
                          }`}
                        />
                      </button>
                    ))}
                  </div>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    {rating > 0
                      ? `You rated ${rating} star${rating > 1 ? "s" : ""}`
                      : "Click to rate"}
                  </p>
                </div>
              </div>
            ) : (
              <div className="py-6 text-center">
                <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-green-100 dark:bg-green-900/50 mb-4">
                  <CheckCircle2 className="h-6 w-6 text-green-600 dark:text-green-400" />
                </div>
                <p className="text-sm text-green-700 dark:text-green-300 font-medium">
                  Both parties have confirmed with matching codes
                </p>
                {rating > 0 && (
                  <div className="flex items-center justify-center gap-1 mt-2">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star
                        key={star}
                        className={`h-4 w-4 ${
                          rating >= star
                            ? "fill-yellow-400 text-yellow-400"
                            : "text-gray-300 dark:text-gray-500"
                        }`}
                      />
                    ))}
                  </div>
                )}
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                  {`Click "Finalize" to complete the transaction`}
                </p>
              </div>
            )}
          </motion.div>
        </AnimatePresence>

        <DialogFooter className="flex flex-col sm:flex-row gap-2">
          {!readyToFinalize ? (
            <>
              <Button
                variant="outline"
                onClick={onClose}
                className="w-full border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700"
              >
                Cancel
              </Button>
              <Button
                onClick={handleSubmit}
                disabled={!code || rating === 0 || isSubmitting}
                className="w-full bg-blue-600 hover:bg-blue-700 dark:bg-blue-700 dark:hover:bg-blue-800"
              >
                {isSubmitting ? (
                  <span className="flex items-center gap-2">
                    <RotateCw className="h-4 w-4 animate-spin" />
                    Confirming...
                  </span>
                ) : (
                  "Confirm"
                )}
              </Button>
            </>
          ) : (
            <>
              <Button
                variant="outline"
                onClick={() => setReadyToFinalize(false)}
                className="w-full border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700"
              >
                Back
              </Button>
              <Button
                onClick={handleFinalize}
                disabled={isSubmitting}
                className="w-full bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 shadow-lg"
              >
                {isSubmitting ? (
                  <span className="flex items-center gap-2">
                    <RotateCw className="h-4 w-4 animate-spin" />
                    Processing...
                  </span>
                ) : (
                  "Finalize Payment"
                )}
              </Button>
            </>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
