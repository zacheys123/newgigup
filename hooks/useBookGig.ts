"use client";
import { GigProps } from "@/types/giginterface";
import useSocket from "./useSocket";
import { useState } from "react";
import { usePendingGigs } from "@/app/Context/PendinContext";
import { mutate, type MutatorCallback } from "swr";
import { DashboardData } from "@/types/dashboard";
import { UserProps } from "@/types/userinterfaces";

interface BookGigOptions {
  redirectOnSuccess?: boolean;
  redirectUrl?: string;
  preventAutoRevalidate?: boolean;
}

export function useBookGig() {
  const { socket } = useSocket();
  const [bookLoading, setBookLoading] = useState(false);
  const { incrementPendingGigs } = usePendingGigs();

  const bookGig = async (
    gig: GigProps,
    myId: string,
    gigs: GigProps[] | null,
    userId: string | null,
    toast: { error: (msg: string) => void; success: (msg: string) => void },
    setRefetchGig: (refetchgig: boolean) => void,
    navigation: {
      push: (url: string) => void;
      replace: (url: string) => void;
      refresh: () => void;
    },
    options: BookGigOptions = {
      redirectOnSuccess: true,
      redirectUrl: `/execute/${gig?._id}`,
      preventAutoRevalidate: false,
    }
  ): Promise<{
    success: boolean;
    message?: string;
    data?: { updatedGig: GigProps; weeklyBookings: number };
  }> => {
    if (!gig) {
      toast.error("Invalid gig data.");
      return { success: false, message: "Invalid gig data" };
    }

    const countUserPosts = gigs
      ? gigs.filter((g) => g?.bookedBy?._id === myId && g?.isTaken === true)
          .length
      : 0;

    if (countUserPosts > 4) {
      toast.error("You have reached your maximum booking limit");
      return { success: false, message: "Maximum booking limit reached" };
    }

    setBookLoading(true);

    // Type-safe optimistic update
    const optimisticUpdate: MutatorCallback<GigProps[]> = (
      currentData: GigProps[] | undefined
    ) => {
      return (
        currentData?.map((g) =>
          g._id === gig._id
            ? {
                ...g,
                bookCount: [
                  ...g.bookCount,
                  { _id: myId, clerkId: userId } as UserProps,
                ],
              }
            : g
        ) ?? []
      );
    };

    mutate("/api/gigs/getgigs", optimisticUpdate, { revalidate: false });

    try {
      const res = await fetch(`/api/gigs/bookgig/${gig._id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ userid: myId }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Booking failed");
      }

      // Type-safe server response update
      const updateWithServerData: MutatorCallback<GigProps[]> = (
        currentData: GigProps[] | undefined
      ) => {
        return (
          currentData?.map((g) =>
            g._id === gig._id ? data.updatedGig || g : g
          ) ?? []
        );
      };

      mutate("/api/gigs/getgigs", updateWithServerData, {
        revalidate: !options.preventAutoRevalidate,
      });

      // Update user data
      const updateUserData: MutatorCallback<DashboardData> = (
        currentData: DashboardData | undefined
      ) => {
        if (!currentData) return currentData;
        return {
          ...currentData,
          user: {
            ...currentData.user,
            gigsBookedThisWeek: data.weeklyBookings,
            gigsBooked: (currentData.user.gigsBooked || 0) + 1,
          },
          subscription: {
            ...currentData.subscription,
            lastBookingDate: new Date(),
          },
        };
      };

      mutate<DashboardData>(`/api/user/getuser/${userId}`, updateUserData, {
        revalidate: false,
      });
      setBookLoading(false);

      if (!gig.bookCount.some((bookedUser) => bookedUser?.clerkId === userId)) {
        incrementPendingGigs();
      }

      if (socket) {
        socket.emit("gigBooked", {
          gigId: gig._id,
          bookCount:
            data.updatedGig?.bookCount?.length || gig.bookCount.length + 1,
        });
      }

      setRefetchGig(true);

      if (options.redirectOnSuccess && options.redirectUrl) {
        navigation.push(options.redirectUrl);
      }

      return {
        success: true,
        message: data.message,
        data,
      };
    } catch (error: unknown) {
      mutate("/api/gigs/getgigs");
      mutate(`/api/user/getuser/${userId}`);

      const errorMessage =
        error instanceof Error ? error.message : "Booking failed";
      console.error("Booking Error:", error);
      toast.error(errorMessage);
      setBookLoading(false);
      return {
        success: false,
        message: errorMessage,
      };
    }
  };

  return { bookGig, bookLoading };
}
