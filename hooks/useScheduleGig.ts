import useStore from "@/app/zustand/useStore";
import useSocket from "./useSocket";
import { useState } from "react";

export const useScheduleGig = () => {
  const [loading, setLoading] = useState(false);
  const { updateGigStatus } = useStore(); // Use the direct update function
  const { socket } = useSocket();

  const schedulegig = async (
    gigId: string,
    toast: { error: (msg: string) => void; success: (msg: string) => void }
  ) => {
    try {
      setLoading(true);
      const res = await fetch(`/api/gigs/update-scheduled?gigId=${gigId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ isPending: false }),
      });

      const data = await res.json();

      if (res.ok) {
        // Update local state immediately
        updateGigStatus(gigId, { isPending: false, isTaken: false });

        if (socket) {
          socket.emit("updateGigStatus", {
            gigId,
            isPending: false,
            isTaken: false,
          });
        }
        toast.success("Gig posted successfully!");
      } else {
        toast.error(data.message || "Failed to post gig");
      }
    } catch (error) {
      console.error("Error updating gig status:", error);
      toast.error("An error occurred while posting the gig");
    } finally {
      setLoading(false);
    }
  };

  return { schedulegig, loading };
};
