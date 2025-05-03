"use client";
import useStore from "@/app/zustand/useStore";
import AllGigsComponent from "@/components/gig/AllGigsComponent";
import Gigheader from "@/components/gig/Gigheader";
import Videos from "@/components/gig/Videos";
import ColorLoading from "@/components/loaders/ColorLoading";
import { useAllGigs } from "@/hooks/useAllGigs";
import { useCurrentUser } from "@/hooks/useCurrentUser";
import { GigProps } from "@/types/giginterface";
import { filterGigs } from "@/utils";

import { motion } from "framer-motion";
import React, { useEffect, useMemo, useState } from "react";

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
const Booked = () => {
  const { loading: gigsLoading, gigs } = useAllGigs();
  const { user } = useCurrentUser();
  const [typeOfGig, setTypeOfGig] = useState<string>("");
  const debouncedSearch = useDebounce(typeOfGig, 300);
  const [category, setCategory] = useState<string>("all");
  const [location, setLocation] = useState<string>(() =>
    user?.user?.city ? user?.user?.city : "all"
  );
  const { showVideo } = useStore();
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
    });

    // Additional filtering for user-specific conditions
    return (
      filtered?.filter(
        (gig: GigProps) => gig?.isTaken === true && gig?.isPending === false
      ) || []
    );
  }, [gigs, debouncedSearch, category, location]);

  const isLoading = gigsLoading;
  console.log(filteredGigs);
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
        />
      </div>
      {/* Scrollable Gigs List */}
      <div className="h-[85%] overflow-y-scroll bg-gray-900">
        {filteredGigs.length === 0 && !isLoading && (
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
              <AllGigsComponent key={gig?._id} gig={gig} />
            ))}
          </div>
        ) : (
          <div className="flex justify-center items-center h-full w-full">
            <ColorLoading />
          </div>
        )}
        {showVideo && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          >
            <motion.div
              initial={{ scale: 0.95 }}
              animate={{ scale: 1 }}
              className="w-full max-w-md bg-zinc-800 rounded-xl overflow-hidden border border-zinc-700"
            >
              <Videos />
            </motion.div>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default Booked;
