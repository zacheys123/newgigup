"use client";
import useStore from "@/app/zustand/useStore";
import AllGigsComponent from "@/components/gig/AllGigsComponent";
import Gigheader from "@/components/gig/Gigheader";
import LoadingSpinner from "@/components/LoadingSpinner";
import { useAllGigs } from "@/hooks/useAllGigs";
import { useCurrentUser } from "@/hooks/useCurrentUser";
import { useDebounce } from "@/hooks/useDebounce";
import useSocket from "@/hooks/useSocket";
import { GigProps } from "@/types/giginterface";
import { filterGigs } from "@/utils";
import { useAuth } from "@clerk/nextjs";

import React, { useEffect, useMemo, useState } from "react";

const normalizeString = (str?: string) =>
  str
    ?.trim()
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "") || "";

const Published = () => {
  const { loading: gigsLoading, gigs } = useAllGigs();
  const { user } = useCurrentUser();
  const [typeOfGig, setTypeOfGig] = useState<string>("");
  const debouncedSearch = useDebounce(typeOfGig, 300);
  const [category, setCategory] = useState<string>("all");
  const [location, setLocation] = useState<string>("all");
  const [scheduler, setScheduler] = useState<string>("all");
  const { userId } = useAuth();

  useEffect(() => {
    // if (!user) {
    //   mutateUser().catch((error) => {
    //     console.error("Failed to mutate user:", error);
    //     // Consider adding toast notification here
    //   });
    // }

    if (normalizeString(user?.user?.city)) {
      setLocation(user.user?.city);
    }
  }, [user]);
  // In PublishedGigs.tsx
  const { updateGigStatus } = useStore();
  const { socket } = useSocket();

  // Add this useEffect to listen for socket updates
  // Socket.io effect
  console.log(gigs);

  useEffect(() => {
    if (!socket) return;

    const handleGigStatusUpdate = ({
      gigId,
      isPending,
      isTaken,
    }: {
      gigId: string;
      isPending: boolean;
      isTaken: boolean;
    }) => {
      updateGigStatus(gigId, { isPending, isTaken });
    };

    socket.on("gigStatusUpdated", handleGigStatusUpdate);

    return () => {
      socket.off("gigStatusUpdated", handleGigStatusUpdate);
    };
  }, [socket, updateGigStatus]);

  const filteredGigs = useMemo(() => {
    const filtered = filterGigs(gigs, {
      searchQuery: debouncedSearch,
      category,
      location,
      scheduler,
    });

    // Additional filtering for user-specific conditions
    return (
      filtered?.filter(
        (gig: GigProps) =>
          gig?.isTaken === false &&
          gig?.bookCount.length < 10 &&
          !gig?.bookCount?.some((bookedUser) => bookedUser?.clerkId === userId)
      ) || []
    );
  }, [gigs, debouncedSearch, category, location, scheduler, userId]);

  const isLoading = gigsLoading;

  return (
    <div className="flex flex-col h-[calc(100vh-100px)] w-[100%] mx-auto my-2 shadow-md shadow-orange-300">
      {/* Fixed Header */}
      <div className="sticky top-0 z-10 bg-gray-900 shadow-md">
        <Gigheader
          typeOfGig={typeOfGig}
          setTypeOfGig={setTypeOfGig}
          category={category}
          setCategory={setCategory}
          location={location}
          setLocation={setLocation}
          myuser={user?.user}
          scheduler={scheduler}
          setScheduler={setScheduler}
        />
      </div>
      {/* Scrollable Gigs List */}
      <div className="h-[85%] overflow-y-scroll bg-gray-900">
        {filteredGigs.length === 0 && (
          <div className="flex flex-col items-center justify-center py-12">
            <h1 className="text-white text-xl font-bold mb-4">No gigs found</h1>
            <p className="text-gray-400 max-w-md text-center">
              Try adjusting your filters or check back later for new posted gigs
            </p>
          </div>
        )}
        {!isLoading ? (
          <div className="space-y-3 p-2 pb-[74px] pt-3">
            {filteredGigs.map((gig: GigProps) => (
              <AllGigsComponent
                key={gig._id}
                gig={gig} // Pass the merged gig data
              />
            ))}
          </div>
        ) : (
          <div className="flex justify-center items-center h-full w-full">
            <LoadingSpinner />
          </div>
        )}
      </div>
    </div>
  );
};

export default Published;
