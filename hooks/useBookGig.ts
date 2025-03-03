"use cient";
import { FetchResponse, GigProps } from "@/types/giginterface";
import useSocket from "./useSocket";
export function useBookGig() {
  const { socket } = useSocket();
  // logic for useBookGig hook goes here

  const bookGig = async (
    gig: GigProps,
    myId: string,
    gigs: Array<GigProps> | null,
    userId: string | null,
    toast: { error: (msg: string) => void; success: (msg: string) => void },
    setRefetchGig: (refetchgig: boolean) => void,
    router: {
      push: (url: string) => void;
      replace: (url: string) => void;
      refresh: () => void;
    }
  ): Promise<void> => {
    if (!gig) {
      toast.error("Invalid gig data.");
      return;
    }

    const countUserPosts = gigs
      ? gigs.filter((g) => g?.bookedBy?._id === myId && g?.isTaken === true)
          .length
      : 0;

    if (countUserPosts > 2) {
      toast.error("You have reached your maximum booking limit");
      return;
    }

    try {
      const res = await fetch(`/api/gigs/bookgig/${gig?._id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ userid: myId }),
      });

      const data: FetchResponse = await res.json();
      console.log(data);

      if (data.gigstatus === true) {
        toast.success(data.message || "Booked successfully");

        // Emit Socket.IO event before updating state
        if (socket) {
          socket.emit("gigBooked", {
            gigId: gig?._id,
            bookCount: (gig?.bookCount?.length || 0) + 1, // Avoid undefined length
          });
        } else {
          console.warn("Socket connection unavailable");
        }

        setRefetchGig(true);

        // Navigate the user if necessary
        router.replace(`/execute/${gig?._id}`);
      } else {
        toast.error(data.message || "Error occurred");
        router.replace(`/gigs/${userId}`);
        router.refresh();
      }
    } catch (error) {
      console.error("Booking Error:", error);
      toast.error("Failed to book the gig. Please try again.");
    }
  };

  return { bookGig };
}
