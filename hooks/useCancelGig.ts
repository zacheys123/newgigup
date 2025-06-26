// hooks/useCancelGig.ts
import { useState } from "react";
import { toast } from "sonner";
import { mutate } from "swr";

export const useCancelGig = () => {
  const [isCanceling, setIsCanceling] = useState(false);
  const cancelGig = async (
    gigId: string,
    musicianId: string,
    reason: string,
    cancelerRole: "client" | "musician"
  ) => {
    try {
      setIsCanceling(true);
      const response = await fetch(`/api/gigs/cancelbookedgig/${gigId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ musicianId, reason, cancelerRole }),
      });

      if (!response.ok) {
        throw new Error("Failed to cancel gig");
      }

      const data = await response.json();
      mutate("/api/gigs/getgigs"); // Revalidate the gigs data
      toast.success(data.message || "Gig cancelled successfully");
      return data;
    } catch (error) {
      console.error("Error cancelling gig:", error);
      toast.error(
        error instanceof Error ? error.message : "Failed to cancel gig"
      );
      throw error;
    } finally {
      setIsCanceling(false);
    }
  };

  return { cancelGig, isCanceling };
};
