// GigsPage.tsx
"use client";

import AllGigsComponent from "@/components/gig/AllGigsComponent";
import Gigheader from "@/components/gig/Gigheader";
import Clockwise from "@/components/loaders/Clockwise";
import { useAllGigs } from "@/hooks/useAllGigs";
import { useCurrentUser } from "@/hooks/useCurrentUser";
import { GigProps } from "@/types/giginterface";
import { filterGigs } from "@/utils";
import { useAuth } from "@clerk/nextjs";

import { useEffect, useMemo, useState } from "react";

const useDebounce = (value: string, delay: number) => {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
};
const AllGigs = () => {
  const { loading: gigsLoading, gigs } = useAllGigs();
  const { user } = useCurrentUser();
  const [typeOfGig, setTypeOfGig] = useState<string>("");
  const debouncedSearch = useDebounce(typeOfGig, 300);
  const [category, setCategory] = useState<string>("all");
  const [location, setLocation] = useState<string>("all");
  const [scheduler, setScheduler] = useState<string>();
  const { userId } = useAuth();

  const normalizeString = (str?: string) =>
    str
      ?.trim()
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "") || "";
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
          gig?.isPending === false &&
          !gig?.bookCount?.some((bookedUser) => bookedUser?.clerkId === userId)
        // gig?.bookCount?.some(
        //   (bookedUser) => bookedUser?._id === user?.user?._id
        // )
      ) || []
    );
  }, [gigs, debouncedSearch, category, location, scheduler, userId]);

  const isLoading = gigsLoading;
  console.log(filteredGigs);
  return (
    <div className="flex flex-col h-full w-[100%] mx-auto md:w-full my-2 md:shadow-lg md:shadow-orange-300/20 md:rounded-xl md:overflow-hidden">
      <div className="sticky top-0 z-10 bg-gray-900 shadow-md md:shadow-lg md:rounded-t-xl">
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

      <div className="h-[10%] overflow-y-scroll md:bg-gradient-to-b md:from-gray-900 md:to-gray-950">
        {filteredGigs.length === 0 && (
          <div className="flex flex-col items-center justify-center py-12">
            <h1 className="text-white text-xl font-bold mb-4">No gigs found</h1>
            <p className="text-gray-400 max-w-md text-center">
              Try adjusting your filters or check back later for new posted gigs
            </p>
          </div>
        )}
        {!isLoading ? (
          <div className="space-y-3 p-2 pb-[74px] pt-3 md:space-y-4 md:p-4 md:grid md:grid-cols-2 lg:grid-cols-3 md:gap-4">
            {filteredGigs.map((gig: GigProps) => (
              <AllGigsComponent key={gig?._id} gig={gig} />
            ))}
          </div>
        ) : (
          <div className="flex justify-center items-center h-full w-full mt-[90px]">
            <Clockwise />
          </div>
        )}
      </div>
    </div>
  );
};

export default AllGigs;
