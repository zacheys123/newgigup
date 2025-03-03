import { FetchResponse, GigProps } from "@/types/giginterface";
import { io } from "socket.io-client";

export const bookGig = async (
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
  const countUserPosts = gigs
    ? gigs.filter((gig) => gig?.bookedBy?._id === myId && gig?.isTaken === true)
        .length
    : 0; // Default to 0 if gigs is null or undefined

  console.log(gig);
  //... your logic here

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
      body: JSON.stringify({
        userid: myId,
      }),
    });
    const data: FetchResponse = await res.json();
    console.log(data);
    if (data.gigstatus === true) {
      toast.success(data.message || "Booked successfully");
      // socket.emit("book-gig", data);
      // router.push(`/execute/${gig?._id}`);
      // Emit a Socket.IO event to notify all clients about the booking
      const socket = io(process.env.NEXT_PUBLIC_SOCKET_URL); // Replace with your server URL
      socket.emit("gigBooked", {
        gigId: gig?._id,
        bookCount: gig?.bookCount?.length + 1, // Increment the bookCount
      });
      setRefetchGig(true);
    } else {
      toast.error(data.message || "Error Occured");
      router.push(`/gigs/${userId}`);
      router.refresh();
    }
  } catch (error) {
    console.log(error);
    toast.error("Failed to book the gig. Please try again.");
  }
};
