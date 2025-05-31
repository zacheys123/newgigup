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
import { useCheckTrial } from "@/hooks/useCheckTrials";
import { useCurrentUser } from "@/hooks/useCurrentUser";

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

export function MobileSubscriptionCard({ plan }: SubscriptionCardProps) {
  const { user } = useUser();
  const { user: myuser } = useCurrentUser();
  const { subscription, mutateSubscription } = useSubscription(user?.id || "");
  const [isMutating, setIsMutating] = useState(false);
  const { showConfirmModal, setShowConfirmModal } = useStore();
  const [pendingTier, setPendingTier] = useState<"free" | "pro">("free");
  const { setisFirstMonthEnd } = useCheckTrial(myuser?.user);
  const handleSubscriptionChange = async (newTier: "free" | "pro") => {
    if (!user?.id) return;

    setIsMutating(true);
    setShowConfirmModal(false);

    // Create optimistic data for both tiers
    const optimisticData = {
      tier: newTier,
      isPro: newTier === "pro",
      nextBillingDate:
        newTier === "pro"
          ? new Date(new Date().setMonth(new Date().getMonth() + 1))
          : null,
    };
    console.log("Optimistic update data:", optimisticData);
    try {
      await mutateSubscription(
        async () => {
          const result = await updateSubscription(user.id, newTier);
          return {
            ...optimisticData,
            // Include any additional fields from the actual response
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
  // Update the onPlanClick function in your MobileSubscriptionCard component
  const onPlanClick = async () => {
    const newTier = plan.name === "Pro Tier" ? "pro" : "free";
    if (plan.current) return;

    if (newTier === "free") {
      setPendingTier("free");
      setShowConfirmModal(true);
    } else {
      try {
        setIsMutating(true);

        // Prompt for phone number (replace with a proper modal in production)
        const phoneNumber = prompt(
          "Enter your M-Pesa phone number (format: 2547XXXXXXXX):"
        );
        if (!phoneNumber) {
          setIsMutating(false);
          return;
        }

        // Initiate payment
        const response = await fetch(
          `/api/user/subscription?clerkId=${user?.id} `,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              phoneNumber,
              tier: "pro",
            }),
          }
        );

        const result = await response.json();

        if (result.success) {
          // Poll for payment confirmation
          const checkPayment = async (checkoutRequestId: string) => {
            try {
              const verification = await fetch("/api/verify-payment", {
                method: "POST",
                headers: {
                  "Content-Type": "application/json",
                },
                body: JSON.stringify({ checkoutRequestId }),
              });

              const verificationResult = await verification.json();

              if (verificationResult.success) {
                // Payment confirmed, update UI
                setisFirstMonthEnd(false);
                handleSubscriptionChange("pro");
              } else if (verificationResult.retry) {
                // Still processing, check again after delay
                setTimeout(() => checkPayment(checkoutRequestId), 3000);
              } else {
                // Payment failed
                alert("Payment failed. Please try again.");
                setIsMutating(false);
              }
            } catch (error) {
              console.error("Payment verification error:", error);
              setIsMutating(false);
            }
          };

          // Start polling
          checkPayment(result.checkoutRequestId);
        } else {
          alert(
            result.message || "Failed to initiate payment. Please try again."
          );
          setIsMutating(false);
        }
      } catch (error) {
        console.error("Subscription error:", error);
        setIsMutating(false);
      }
    }
  };

  return (
    <>
      <div
        onClick={onPlanClick}
        className={cn(
          "flex flex-col justify-between border rounded-xl p-5 w-full h-[420px] max-w-xs mx-auto transition-all",
          plan.current
            ? "border-orange-500 bg-orange-900/10"
            : "border-gray-700 bg-gray-900 hover:border-blue-500"
        )}
      >
        <div>
          <h3 className="text-xl font-bold text-white">{plan.name}</h3>
          <p className="text-2xl font-semibold my-2 text-white">{plan.price}</p>

          <ul className="space-y-2 mb-4">
            {plan.features.map((feature, idx) => (
              <li key={idx} className="flex items-start text-sm">
                <svg
                  className="w-4 h-4 text-green-500 mt-1 mr-2"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41L9 16.17z" />
                </svg>
                <span className="text-gray-300">{feature}</span>
              </li>
            ))}
          </ul>
        </div>

        <Button
          onClick={(e) => {
            e.stopPropagation();
            onPlanClick();
          }}
          disabled={isMutating || plan.current}
          className={cn(
            "w-full py-2 text-sm font-semibold rounded-md transition",
            plan.current
              ? "bg-gray-100 text-gray-600 cursor-default"
              : "bg-blue-600 hover:bg-blue-700 text-white",
            isMutating ? "opacity-70 cursor-wait" : ""
          )}
        >
          {isMutating ? "Processing..." : plan.cta}
        </Button>

        {plan.current && (
          <p className="mt-2 text-xs text-green-500 text-center">
            Your current plan
            {subscription?.nextBillingDate && (
              <span className="block text-[10px] text-gray-400">
                Renews on{" "}
                {new Date(subscription.nextBillingDate).toLocaleDateString()}
              </span>
            )}
          </p>
        )}
      </div>

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
