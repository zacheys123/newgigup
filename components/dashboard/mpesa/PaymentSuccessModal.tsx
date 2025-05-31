"use client";
import { useEffect, useState } from "react";
import { Check, PartyPopper } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
type ConfettiPiece = {
  id: number;
  style: React.CSSProperties;
};
export function PaymentSuccessModal({
  open,
  onClose,
  amount,
  phoneNumber,
}: {
  open: boolean;
  onClose: () => void;
  amount: number;
  phoneNumber: string;
}) {
  const [confetti, setConfetti] = useState<ConfettiPiece[]>([]);

  useEffect(() => {
    if (!open) return;

    // Generate 100 confetti pieces
    const pieces = Array.from({ length: 100 }).map((_, i) => ({
      id: i,
      style: {
        left: `${Math.random() * 100}%`,
        animationDelay: `${Math.random() * 2}s`,
        backgroundColor: `hsl(${Math.random() * 360}, 100%, 50%)`,
        transform: `rotate(${Math.random() * 360}deg)`,
      },
    }));

    setConfetti(pieces);

    // Clear confetti after animation
    const timer = setTimeout(() => setConfetti([]), 3000);
    return () => clearTimeout(timer);
  }, [open]);

  const formattedPhone = phoneNumber.replace(
    /(\d{3})(\d{3})(\d{3})(\d{3})/,
    "$1 $2 $3 $4"
  );

  return (
    <AnimatePresence>
      {open && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 overflow-hidden">
          {/* Custom Confetti */}
          <div className="absolute inset-0 pointer-events-none">
            {confetti.map((piece) => (
              <div
                key={piece.id}
                className="absolute w-2 h-2 rounded-full animate-confetti"
                style={{
                  ...piece.style,
                  top: "-10px",
                  animation: `confettiFall ${
                    Math.random() * 3 + 2
                  }s linear forwards`,
                }}
              />
            ))}
          </div>

          {/* Modal Content (Same as before) */}
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.8, opacity: 0 }}
            className="bg-gradient-to-br from-green-600 to-green-800 rounded-2xl shadow-2xl overflow-hidden border-2 border-green-400 max-w-md w-full relative"
          >
            {/* Animated checkmark circle */}
            <div className="relative flex justify-center mt-10 mb-6">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{
                  type: "spring",
                  delay: 0.2,
                  stiffness: 260,
                  damping: 20,
                }}
                className="absolute inset-0 bg-green-500 rounded-full blur-xl opacity-30"
              />
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{
                  type: "spring",
                  delay: 0.1,
                  stiffness: 260,
                  damping: 20,
                }}
                className="h-24 w-24 bg-green-500 rounded-full flex items-center justify-center shadow-lg border-4 border-green-300"
              >
                <motion.div
                  initial={{ pathLength: 0 }}
                  animate={{ pathLength: 1 }}
                  transition={{
                    delay: 0.3,
                    type: "tween",
                    duration: 0.5,
                    ease: "easeOut",
                  }}
                >
                  <Check className="h-12 w-12 text-white stroke-[4]" />
                </motion.div>
              </motion.div>
            </div>

            {/* Content */}
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="px-6 pb-8 text-center"
            >
              <h2 className="text-3xl font-bold text-white mb-2">
                Payment Successful!
              </h2>
              <p className="text-green-100 mb-6">
                Your bill has been cleared successfully
              </p>

              <div className="bg-green-700/50 rounded-xl p-4 mb-6 border border-green-600">
                <div className="flex justify-between mb-2">
                  <span className="text-green-200">Amount:</span>
                  <span className="font-bold text-white">
                    KES {amount.toLocaleString()}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-green-200">Phone Number:</span>
                  <span className="font-mono text-white">{formattedPhone}</span>
                </div>
              </div>

              {/* Celebration button */}
              <motion.div
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.98 }}
              >
                <Button
                  onClick={onClose}
                  className="w-full bg-yellow-400 hover:bg-yellow-500 text-green-900 font-bold py-6 text-lg rounded-xl shadow-lg relative overflow-hidden"
                >
                  <PartyPopper className="w-5 h-5 mr-2" />
                  <span>Done</span>
                  <motion.div
                    initial={{ x: -100, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ delay: 0.8 }}
                    className="absolute inset-0 flex items-center justify-center"
                  >
                    <span className="text-green-900 font-bold">Thank You!</span>
                  </motion.div>
                </Button>
              </motion.div>
            </motion.div>

            {/* Floating emojis animation */}
            {["🎉", "💰", "✅", "💵"].map((emoji, i) => (
              <motion.div
                key={i}
                initial={{ y: 0, x: Math.random() * 100 - 50, opacity: 0 }}
                animate={{
                  y: -100,
                  x: Math.random() * 200 - 100,
                  opacity: [0, 1, 0],
                  scale: [0.5, 1.2, 0.8],
                }}
                transition={{
                  delay: 0.7 + i * 0.2,
                  duration: 2,
                  ease: "easeOut",
                }}
                className="absolute text-3xl pointer-events-none"
                style={{
                  left: `${Math.random() * 80 + 10}%`,
                  bottom: "10%",
                }}
              >
                {emoji}
              </motion.div>
            ))}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
