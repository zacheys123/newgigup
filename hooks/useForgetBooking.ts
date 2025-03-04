import { FetchResponse, GigProps } from "@/types/giginterface";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";
import useSocket from "./useSocket";

export function useForgetBookings() {
  const [loading, setLoading] = useState<boolean>(false);
  const route = useRouter();
  const { socket } = useSocket();
  const forgetBookings = async (
    id: string,
    myGig: GigProps,
    userId: string
  ) => {
    try {
      setLoading(true);
      const response = await fetch(`/api/gigs/cancelgig/${myGig?._id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ musicianId: id }),
      });
      console.log(response);
      if (!response.ok) {
        throw new Error("Failed to cancel the gig");
      }
      console.log("Musician removed from book count.");
      const data: { message: string } = await response.json();
      if (socket) {
        socket.emit("cancelBooking", {
          gigId: myGig._id,
          bookCount: (myGig?.bookCount?.length || 0) - 1, // Avoid undefined length
        });
      }
      route.push(`/gigs/${userId}`);
      setLoading(false);
      toast.success(data.message);
    } catch (error: unknown) {
      setLoading(false);
      console.error("Error canceling the gig:try again later", error);
    }
  };
  return { loading, forgetBookings };
}

export function useBookMusician() {
  const [bookloading, setLoading] = useState<boolean>();

  // logic for useBookGig hook goes here
  const bookgig = async (
    router: {
      push: (url: string) => void;
      replace: (url: string) => void;
      refresh: () => void;
    },
    myGig: GigProps,
    userId: string,
    userid: string
  ) => {
    try {
      setLoading(true);
      const response = await fetch(`/api/gigs/book/${myGig?._id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          musicianId: userid,
        }),
      });
      if (!response.ok) {
        throw new Error("Failed to choose musician");
      }
      const data: FetchResponse = await response.json();
      if (data.gigstatus === true) {
        console.log(data);
        toast.success(data.message);

        router.refresh();
        setLoading(false);
      } else {
        toast.error(data.message);

        setLoading(false);
      }
    } catch (error) {
      setLoading(false);
      console.error("Error booking the gig:", error);
    }
  };
  return { bookloading, bookgig };
}
