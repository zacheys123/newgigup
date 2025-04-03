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
  const { subscription, mutateSubscription } = useSubscription(
    user?.id as string
  );
  const [isMutating, setIsMutating] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [pendingTier, setPendingTier] = useState<"free" | "pro">("free");

  const handleSubscriptionChange = async (newTier: "free" | "pro") => {
    if (!user?.id) return;

    setIsMutating(true);
    setShowConfirmModal(false);

    try {
      // Optimistic update
      const optimisticData = {
        tier: newTier,
        isPro: newTier === "pro",
        nextBillingDate:
          newTier === "pro"
            ? new Date(new Date().setMonth(new Date().getMonth() + 1))
            : null,
      };

      await mutateSubscription(
        async () => {
          const result = await updateSubscription(user.id, newTier, {
            onSuccess: () => mutateSubscription(),
          });
          return result;
        },
        {
          optimisticData,
          rollbackOnError: true,
          populateCache: true,
          revalidate: false,
        }
      );
    } catch (error) {
      // Error handling is done in the mutation function
      console.error("Error updating subscription:", error);
    } finally {
      setIsMutating(false);
    }
  };

  return (
    <div
      onClick={() => {
        const newTier = plan.name === "Free Tier" ? "free" : "pro";
        if (newTier === "free" && !plan.current) {
          setPendingTier("free");
          setShowConfirmModal(true);
        } else {
          handleSubscriptionChange(newTier);
        }
      }}
      className={cn(
        "border rounded-lg p-6",
        plan.current
          ? "border-orange-500 bg-orange-900/10"
          : "border-gray-700 bg-gray-900"
      )}
    >
      <h3 className="text-xl font-semibold text-white">{plan.name}</h3>
      <p className="text-2xl font-bold my-4 text-white">{plan.price}</p>

      <ul className="space-y-2 mb-6">
        {plan.features.map((feature, i) => (
          <li key={i} className="flex items-start">
            <svg className="w-5 h-5 text-green-500 mt-0.5 mr-2 flex-shrink-0">
              <path
                fill="currentColor"
                d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41L9 16.17z"
              />
            </svg>
            <span>{feature}</span>
          </li>
        ))}
      </ul>

      <Button
        onClick={() => {
          const newTier = plan.name === "Free Tier" ? "free" : "pro";
          if (newTier === "free" && !plan.current) {
            setPendingTier("free");
            setShowConfirmModal(true);
          } else {
            handleSubscriptionChange(newTier);
          }
        }}
        disabled={isMutating || plan.current}
        className={`w-full py-2 px-4 rounded-md font-medium transition-colors ${
          plan.current
            ? "bg-gray-100 text-gray-600 cursor-default"
            : "bg-blue-600 hover:bg-blue-700 text-white"
        } ${isMutating ? "opacity-70 cursor-wait" : ""}`}
      >
        {isMutating ? "Processing..." : plan.cta}
      </Button>

      {plan.current && (
        <p className="mt-2 text-sm text-green-600 text-center">
          Your current plan
          {subscription?.nextBillingDate && (
            <span className="block text-xs text-gray-500">
              Renews on{" "}
              {new Date(subscription?.nextBillingDate).toLocaleDateString()}
            </span>
          )}
        </p>
      )}
      <Dialog
        open={showConfirmModal}
        onOpenChange={() => setShowConfirmModal(false)}
      >
        <div className="fixed inset-0 bg-black/30" />
        <div className="fixed inset-0 flex items-center justify-center p-4">
          <DialogContent className="w-full max-w-md rounded-lg bg-white p-6">
            <DialogTitle className="text-xl font-bold mb-4">
              Confirm Downgrade
            </DialogTitle>
            <DialogDescription className="mb-6">
              {`Are you sure you want to downgrade to the Free Tier? You'll lose
              access to Pro features immediately.`}
            </DialogDescription>

            <div className="flex justify-end space-x-3">
              <button
                onClick={() => setShowConfirmModal(false)}
                className="px-4 py-2 border rounded-md hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={() => handleSubscriptionChange(pendingTier)}
                disabled={isMutating}
                className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 disabled:opacity-70"
              >
                {isMutating ? "Processing..." : "Confirm Downgrade"}
              </button>
            </div>
          </DialogContent>
        </div>
      </Dialog>
    </div>
  );
}
