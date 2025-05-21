"use client";
import { useUser } from "@clerk/nextjs";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useSubscription } from "@/hooks/useSubscription";
import { updateSubscription } from "@/lib/mutations";
import { cn } from "@/lib/utils";
import useStore from "@/app/zustand/useStore";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from "../ui/dialog";
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

export function SubscriptionCard({ plan }: SubscriptionCardProps) {
  const { user } = useUser();
  const { subscription, mutateSubscription } = useSubscription(
    user?.id as string
  );
  const { user: myuser } = useCurrentUser();
  const { showConfirmModal, setShowConfirmModal } = useStore();
  const [isMutating, setIsMutating] = useState(false);
  const [pendingTier, setPendingTier] = useState<"free" | "pro">("free");
  const { setisFirstMonthEnd } = useCheckTrial(myuser?.user);

  const handleChange = async (newTier: "free" | "pro") => {
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
      console.error("Subscription error:", error);
    } finally {
      setIsMutating(false);
    }
  };

  const newTier = plan.name === "Pro Tier" ? "pro" : "free";

  const triggerAction = () => {
    if (plan.current) return;
    if (newTier === "free") {
      setPendingTier("free");
      setShowConfirmModal(true);
    } else {
      setisFirstMonthEnd(false);
      handleChange("pro");
    }
  };

  return (
    <>
      <div
        onClick={triggerAction}
        className={cn(
          "border rounded-xl p-6 w-full cursor-pointer transition duration-200",
          plan.current
            ? "border-orange-500 bg-orange-900/10"
            : "border-gray-700 bg-gray-900 hover:border-blue-500"
        )}
      >
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xl font-semibold text-white">{plan.name}</h3>
          <p className="text-2xl font-bold text-white">{plan.price}</p>
        </div>

        <ul className="space-y-2 mb-4">
          {plan.features.map((feature, i) => (
            <li key={i} className="flex text-sm text-gray-300">
              <svg
                className="w-5 h-5 text-green-500 mr-2 mt-0.5"
                fill="currentColor"
              >
                <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41L9 16.17z" />
              </svg>
              {feature}
            </li>
          ))}
        </ul>

        <Button
          onClick={(e) => {
            e.stopPropagation();
            triggerAction();
          }}
          disabled={isMutating || plan.current}
          className={cn(
            "w-full py-2 text-base rounded-md",
            plan.current
              ? "bg-gray-100 text-gray-600"
              : "bg-blue-600 hover:bg-blue-700 text-white",
            isMutating && !plan.current && "opacity-70 cursor-wait"
          )}
        >
          {isMutating ? "Processing..." : plan.cta}
        </Button>

        {plan.current && (
          <p className="mt-2 text-sm text-green-600 text-center">
            Your current plan
            {subscription?.nextBillingDate && (
              <span className="block text-xs text-gray-400">
                Renews on{" "}
                {new Date(subscription.nextBillingDate).toLocaleDateString()}
              </span>
            )}
          </p>
        )}
      </div>

      <Dialog open={showConfirmModal} onOpenChange={setShowConfirmModal}>
        <DialogContent className="bg-gray-900 border border-gray-700 rounded-lg p-6">
          <DialogTitle className="text-xl font-bold text-white">
            Confirm Downgrade
          </DialogTitle>
          <DialogDescription className="text-gray-300 my-4">
            Are you sure you want to downgrade to the Free Tier? You’ll lose
            access to Pro features immediately.
          </DialogDescription>
          <div className="flex justify-end gap-3">
            <Button
              variant="outline"
              onClick={() => setShowConfirmModal(false)}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={() => handleChange(pendingTier)}
              disabled={isMutating}
            >
              {isMutating ? "Processing..." : "Confirm"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
