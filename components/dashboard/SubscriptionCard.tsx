"use client";
import { Button } from "@/components/ui/button";
import { useSubscription } from "@/hooks/useSubscription";
import { updateSubscription } from "@/lib/mutations";
import { cn } from "@/lib/utils";
import { useUser } from "@clerk/nextjs";
import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from "../ui/dialog";
import useStore from "@/app/zustand/useStore";
import { useCurrentUser } from "@/hooks/useCurrentUser";
import { MpesaPaymentDialog } from "./mpesa/MpesaPaymentDialog";
import { PaymentSuccessModal } from "./mpesa/PaymentSuccessModal";
import toast from "react-hot-toast";
import { usePaymentVerification } from "@/hooks/usePaymentVerification";
import { motion } from "framer-motion";
import { Check, ChevronRight, Zap, Sparkles } from "lucide-react";

interface Plan {
  name: string;
  price: string;
  features: string[];
  cta: string;
  current: boolean;
}

interface SubscriptionCardProps {
  plan: Plan;
}
export function SubscriptionCard({ plan }: SubscriptionCardProps) {
  const { user } = useUser();
  const { user: myuser } = useCurrentUser();
  const { subscription, mutateSubscription } = useSubscription(user?.id || "");
  const [isMutating, setIsMutating] = useState(false);
  const { showConfirmModal, setShowConfirmModal } = useStore();
  const [pendingTier, setPendingTier] = useState<"free" | "pro">("free");
  const [mpesaPhoneNumber, setMpesaPhoneNumber] = useState<string | null>(null);
  const [showPaymentDialog, setShowPaymentDialog] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  const {
    checkPayment,
    cancelVerification,
    isMutating: isVerifyingPayment,
    paymentSuccess,
    setPaymentSuccess,
  } = usePaymentVerification({
    onSuccess: () => {
      setPaymentSuccess(true);
      setShowPaymentDialog(false);
      setIsMutating(false);
    },
  });

  const handleSubscriptionChange = async (newTier: "free" | "pro") => {
    if (!user?.id) return;

    setIsMutating(true);
    setShowConfirmModal(false);

    const optimisticData = {
      tier: newTier,
      isPro: newTier === "pro",
      nextBillingDate:
        newTier === "pro"
          ? new Date(new Date().setMonth(new Date().getMonth() + 1))
          : null,
    };

    try {
      await mutateSubscription(
        async () => {
          const result = await updateSubscription(user.id, newTier);
          return {
            ...optimisticData,
            ...result,
          };
        },
        {
          optimisticData,
          rollbackOnError: true,
          populateCache: true,
          revalidate: false,
        }
      );
    } catch (err) {
      console.error("Subscription update failed", err);
    } finally {
      setIsMutating(false);
    }
  };

  const handlePaymentInitiated = async (phoneNumber: string) => {
    try {
      if (!phoneNumber || !phoneNumber.startsWith("254")) {
        toast.error(
          "Please enter a valid Kenyan phone number (starts with 254)"
        );
        return;
      }

      setMpesaPhoneNumber(phoneNumber);
      setIsMutating(true);

      const toastId = toast.loading("Initiating payment...");

      const response = await fetch(
        `/api/user/subscription?clerkId=${user?.id}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ phoneNumber, tier: "pro" }),
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to initiate subscription");
      }

      const result = await response.json();

      toast.success("STK push sent to your phone", { id: toastId });

      if (result.checkoutRequestId) {
        setShowPaymentDialog(false);
        checkPayment(result.checkoutRequestId);
      } else {
        toast.error(result.message || "Failed to initiate payment", {
          id: toastId,
        });
        setIsMutating(false);
      }
    } catch (error) {
      toast.error(
        error instanceof Error
          ? error.message
          : "Failed to initiate subscription"
      );
      setIsMutating(false);
    }
  };

  const onPlanClick = async () => {
    const newTier = plan.name === "Pro Tier" ? "pro" : "free";
    if (plan.current) return;

    if (newTier === "free") {
      setPendingTier("free");
      setShowConfirmModal(true);
      mutateSubscription();
    } else {
      setPaymentSuccess(false);
      setShowPaymentDialog(true);
    }
  };

  return (
    <>
      {isVerifyingPayment && (
        <Button
          onClick={(e) => {
            e.stopPropagation();
            cancelVerification();
          }}
          disabled={isMutating || plan.current || isVerifyingPayment}
          className={cn(
            "w-full py-2 text-sm font-semibold rounded-md transition",
            plan.current
              ? "bg-gray-100 text-gray-600 cursor-default"
              : "bg-blue-600 hover:bg-blue-700 text-white",
            isMutating || isVerifyingPayment ? "opacity-70 cursor-wait" : ""
          )}
        >
          {isMutating || isVerifyingPayment ? "Processing..." : plan.cta}
        </Button>
      )}

      <MpesaPaymentDialog
        open={showPaymentDialog}
        onOpenChange={setShowPaymentDialog}
        onPaymentInitiated={handlePaymentInitiated}
        isProcessing={isMutating}
      />
      <PaymentSuccessModal
        open={paymentSuccess}
        onClose={() => {
          setPaymentSuccess(false);
        }}
        amount={myuser?.isClient ? 2000 : 1500}
        phoneNumber={mpesaPhoneNumber}
      />

      <motion.div
        onClick={onPlanClick}
        onHoverStart={() => setIsHovered(true)}
        onHoverEnd={() => setIsHovered(false)}
        whileHover={{ y: -5 }}
        whileTap={{ scale: 0.98 }}
        className={cn(
          "flex flex-col justify-between border rounded-xl p-6 w-full h-[420px] max-w-xs mx-auto transition-all relative overflow-hidden",
          plan.current
            ? "border-orange-400 bg-gradient-to-br from-orange-900/20 to-orange-900/10 shadow-lg shadow-orange-500/10"
            : "border-gray-700 bg-gray-900 hover:border-blue-400 hover:shadow-lg hover:shadow-blue-500/10",
          "hidden md:flex" // Added responsive classes here
        )}
      >
        {/* Glow effect */}
        {plan.current && (
          <motion.div
            animate={{
              opacity: [0, 0.3, 0],
              scale: [1, 1.5, 1],
            }}
            transition={{
              duration: 4,
              repeat: Infinity,
              ease: "easeInOut",
            }}
            className="absolute inset-0 bg-orange-500 rounded-xl pointer-events-none"
          />
        )}

        {/* Current plan badge */}
        {plan.current && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="absolute top-4 right-4 bg-orange-500 text-white text-xs font-bold px-2 py-1 rounded-full"
          >
            Current Plan
          </motion.div>
        )}

        {/* Sparkles for Pro tier */}
        {plan.name === "Pro Tier" && !plan.current && (
          <motion.div
            animate={{
              opacity: isHovered ? 1 : 0.5,
            }}
            className="absolute top-4 right-4"
          >
            <Sparkles className="w-5 h-5 text-yellow-400" />
          </motion.div>
        )}

        <div>
          <div className="flex items-center justify-between">
            <h3 className="text-xl font-bold text-white">{plan.name}</h3>
            {plan.name === "Pro Tier" && !plan.current && (
              <motion.div
                animate={{
                  x: isHovered ? [0, 5, 0] : 0,
                }}
                transition={{
                  repeat: isHovered ? Infinity : 0,
                  duration: 1.5,
                }}
              >
                <Zap className="w-5 h-5 text-yellow-400 fill-yellow-400/20" />
              </motion.div>
            )}
          </div>

          <motion.p
            animate={{
              scale: isHovered && !plan.current ? 1.05 : 1,
            }}
            className="text-2xl font-semibold my-4 text-white"
          >
            {plan.price}
          </motion.p>

          <ul className="space-y-3 mb-4">
            {plan.features.map((feature, idx) => (
              <motion.li
                key={idx}
                whileHover={{ x: 5 }}
                className="flex items-start text-sm group"
              >
                <motion.div
                  animate={{
                    rotate: isHovered ? [0, 10, -10, 0] : 0,
                  }}
                >
                  <Check className="w-4 h-4 text-green-500 mt-1 mr-2 flex-shrink-0" />
                </motion.div>
                <span className="text-gray-300 group-hover:text-white transition-colors">
                  {feature}
                </span>
              </motion.li>
            ))}
          </ul>
        </div>

        <div className="mt-auto">
          <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
            <Button
              onClick={(e) => {
                e.stopPropagation();
                onPlanClick();
              }}
              disabled={isMutating || plan.current}
              className={cn(
                "w-full py-3 text-sm font-semibold rounded-lg transition-all flex items-center justify-center gap-2",
                plan.current
                  ? "bg-gray-100 text-gray-600 cursor-default"
                  : plan.name === "Pro Tier"
                  ? "bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-500 hover:to-blue-400 text-white shadow-lg shadow-blue-500/20"
                  : "bg-gray-700 hover:bg-gray-600 text-white",
                isMutating ? "opacity-70 cursor-wait" : ""
              )}
            >
              {isMutating ? (
                <>
                  <svg
                    className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                  Processing...
                </>
              ) : (
                <>
                  {plan.cta}
                  {!plan.current && (
                    <motion.span
                      animate={{
                        x: isHovered ? [0, 5, 0] : 0,
                      }}
                      transition={{
                        repeat: isHovered ? Infinity : 0,
                        duration: 1.5,
                      }}
                    >
                      <ChevronRight className="w-4 h-4" />
                    </motion.span>
                  )}
                </>
              )}
            </Button>
          </motion.div>

          {plan.current && subscription?.nextBillingDate && (
            <motion.p
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-3 text-xs text-center text-gray-400"
            >
              Renews on{" "}
              {new Date(subscription.nextBillingDate).toLocaleDateString()}
            </motion.p>
          )}
        </div>
      </motion.div>

      <Dialog open={showConfirmModal} onOpenChange={setShowConfirmModal}>
        <DialogContent className="w-[90%] max-w-md bg-gray-900 border border-gray-700 rounded-lg p-6">
          <DialogTitle className="text-white text-lg font-bold mb-3">
            Confirm Downgrade
          </DialogTitle>
          <DialogDescription className="text-sm text-gray-300 mb-5">
            Are you sure you want to downgrade to the Free Tier? Pro features
            will be disabled immediately.
          </DialogDescription>

          <div className="flex justify-end gap-3">
            <Button
              variant="outline"
              onClick={() => setShowConfirmModal(false)}
              className="px-4 py-2 text-sm"
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={() => {
                handleSubscriptionChange(pendingTier);
                mutateSubscription(
                  `/api/user/subscription?clerkId=${user?.id}`
                );
              }}
              disabled={isMutating}
              className="px-4 py-2 text-sm"
            >
              {isMutating ? "Processing..." : "Confirm"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
