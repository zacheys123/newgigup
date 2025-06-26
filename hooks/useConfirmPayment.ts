// hooks/useConfirmPayment.ts
import useStore from "@/app/zustand/useStore";
import { useState } from "react";
import { toast } from "sonner";

// Storage utilities
export const getConfirmState = (gigId: string) => {
  try {
    const raw = localStorage.getItem("confirmState");
    const parsed = raw ? JSON.parse(raw) : {};
    return parsed[gigId] || { confirmedParty: "none", canFinalize: false };
  } catch {
    return { confirmedParty: "none", canFinalize: false };
  }
};

const setConfirmState = (
  gigId: string,
  status: "none" | "partial" | "both",
  canFinalize: boolean
) => {
  try {
    const raw = localStorage.getItem("confirmState");
    const parsed = raw ? JSON.parse(raw) : {};
    parsed[gigId] = { confirmedParty: status, canFinalize };
    localStorage.setItem("confirmState", JSON.stringify(parsed));
  } catch (err) {
    console.error("Failed to store confirmation state:", err);
  }
};

const clearConfirmState = (gigId: string) => {
  try {
    const raw = localStorage.getItem("confirmState");
    const parsed = raw ? JSON.parse(raw) : {};
    delete parsed[gigId];
    localStorage.setItem("confirmState", JSON.stringify(parsed));
  } catch (err) {
    console.error("Failed to clear confirmation state:", err);
  }
};

export const useConfirmPayment = () => {
  const [isConfirming, setIsConfirming] = useState(false);
  const [isFinalizing, setIsFinalizing] = useState(false);
  const {
    setConfirmedParty,
    setCanFinalize,
    resetConfirmationState,
    setShowPaymentConfirmation,
  } = useStore();

  const confirmPayment = async (
    gigId: string,
    role: string,
    notes: string,
    code: string,
    rating: number
  ) => {
    setIsConfirming(true);

    // Optimistic update
    const optimisticStatus = "partial"; // Assume partial confirmation first
    setConfirmedParty(gigId, optimisticStatus);
    setConfirmState(gigId, optimisticStatus, false);

    try {
      const res = await fetch(`/api/gigs/confirm-payment/${gigId}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ role, notes, code, rating }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to confirm payment");

      const newStatus = data.readyToFinalize ? "both" : "partial";
      setShowPaymentConfirmation(false);
      // Update both store and localStorage
      const { paymentConfirmations } = useStore.getState();
      console.log("After confirm:", paymentConfirmations);

      setConfirmedParty(gigId, newStatus);
      setCanFinalize(gigId, data.readyToFinalize);
      setConfirmState(gigId, newStatus, data.readyToFinalize);

      toast.success(data.message);
      return data;
    } catch (error) {
      // Rollback on error
      setConfirmedParty(gigId, "none");
      setCanFinalize(gigId, false);
      clearConfirmState(gigId);

      toast.error(
        error instanceof Error ? error.message : "Failed to confirm payment"
      );
      throw error;
    } finally {
      setIsConfirming(false);
    }
  };

  const finalizePayment = async (
    gigId: string,
    role: string,
    notes: string
  ) => {
    setIsFinalizing(true);

    // Optimistic update
    setCanFinalize(gigId, false);

    try {
      const res = await fetch(`/api/gigs/confirm-payment/${gigId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ role, notes }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to finalize payment");

      // Clear state on success
      resetConfirmationState(gigId);
      clearConfirmState(gigId);

      toast.success(data.message);
      return data;
    } catch (error) {
      // Rollback on error
      setCanFinalize(gigId, true);

      toast.error(
        error instanceof Error ? error.message : "Failed to finalize payment"
      );
      throw error;
    } finally {
      setIsFinalizing(false);
    }
  };

  return {
    confirmPayment,
    finalizePayment,
    isConfirming,
    isFinalizing,
  };
};
