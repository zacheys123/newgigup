// app/published/page.tsx
"use client";
import useStore from "@/app/zustand/useStore";
import LoadingSpinner from "@/components/LoadingSpinner";
import { useAllGigs } from "@/hooks/useAllGigs";
import { useCurrentUser } from "@/hooks/useCurrentUser";
import { useDebounce } from "@/hooks/useDebounce";
import useSocket from "@/hooks/useSocket";
import { GigProps } from "@/types/giginterface";
import { filterGigs } from "@/utils/filterUtils";
import { useAuth } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import React, { useEffect, useMemo, useState } from "react";
import FilterController from "@/components/filters/FilterController";
import { FilterProvider, useFilters } from "@/app/Context/FilterContext";
import AllGigsComponent from "../AllGigsComponent";
import { motion } from "framer-motion";

const normalizeString = (str?: string) =>
  str
    ?.trim()
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "") || "";

const PublishedContent = () => {
  const { loading: gigsLoading, gigs } = useAllGigs();
  const { user } = useCurrentUser();
  const { state: filterState, dispatch } = useFilters();
  const debouncedSearch = useDebounce(filterState.searchQuery, 300);
  const { userId } = useAuth();
  const router = useRouter();
  const [activeFilterCount, setActiveFilterCount] = useState(0);

  // Calculate active filters count
  useEffect(() => {
    let count = 0;
    if (filterState.searchQuery) count++;
    if (filterState.category !== "all") count++;
    if (filterState.location !== "all") count++;
    if (filterState.scheduler !== "all") count++;
    if (filterState.timelineOption !== "once") count++;
    setActiveFilterCount(count);
  }, [filterState]);

  useEffect(() => {
    if (user?.user?.isClient) {
      router.push(`/create/${userId}`);
    }

    if (normalizeString(user?.user?.city)) {
      dispatch({ type: "SET_LOCATION", payload: user.user.city.toLowerCase() });
    }
  }, [user]);

  const { updateGigStatus } = useStore();
  const { socket } = useSocket();

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
      category: filterState.category,
      location: filterState.location,
      scheduler: filterState.scheduler,
      timelineOption: filterState.timelineOption,
    });

    const result =
      filtered?.filter(
        (gig: GigProps) =>
          gig?.isTaken === false &&
          gig?.bookCount.length < 10 &&
          !gig?.bookCount?.some((bookedUser) => bookedUser?.clerkId === userId)
      ) || [];

    switch (filterState.sortOption) {
      case "newest":
        result.sort(
          (a, b) =>
            new Date(b.createdAt || 0).getTime() -
            new Date(a.createdAt || 0).getTime()
        );
        break;
      case "highest":
        result.sort(
          (a, b) =>
            parseFloat(b.price || "0") || 0 - (parseFloat(a.price || "0") || 0)
        );
        break;
      case "popular":
        result.sort(
          (a, b) => (b.viewCount?.length || 0) - (a.viewCount?.length || 0)
        );
        break;
      default:
        result.sort((a, b) => {
          const aViews = a.viewCount?.length || 0;
          const bViews = b.viewCount?.length || 0;
          const aDate = new Date(a.createdAt || 0).getTime();
          const bDate = new Date(b.createdAt || 0).getTime();
          return bViews * 0.7 + bDate * 0.3 - (aViews * 0.7 + aDate * 0.3);
        });
    }

    return result;
  }, [gigs, debouncedSearch, filterState, userId]);

  const isLoading = gigsLoading;

  return (
    <div className="flex flex-col min-h-screen w-full bg-gray-900 relative">
      {/* Sleek Professional Header without Search */}
      <div className="relative overflow-hidden bg-gradient-to-br from-gray-800 to-gray-900 border-b border-gray-800">
        <div className="max-w-7xl mx-auto px-4 py-12 sm:px-6 lg:px-8 lg:py-16">
          <div className="relative z-10 text-center">
            <motion.h1
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="text-4xl md:text-5xl font-extrabold tracking-tight text-white"
            >
              Discover <span className="text-amber-400">Premium</span> Gigs
            </motion.h1>

            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2, duration: 0.6 }}
              className="mt-4 max-w-2xl text-xl text-gray-300 mx-auto"
            >
              Browse high-quality opportunities tailored to your expertise
            </motion.p>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4, duration: 0.5 }}
              className="mt-6 flex justify-center gap-3"
            >
              <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-amber-400 text-red-700 border border-gray-700">
                {filteredGigs.length}{" "}
                {filteredGigs.length === 1 ? "Gig" : "Gigs"} Found
              </span>
              <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-gray-800 text-amber-400 border border-gray-700">
                Trusted Professionals
              </span>
              <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-gray-800 text-amber-400 border border-gray-700">
                Flexible Work
              </span>
              <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-gray-800 text-amber-400 border border-gray-700">
                Secure Payments
              </span>
            </motion.div>
          </div>

          {/* Subtle decorative elements */}
          <div className="absolute inset-0 overflow-hidden opacity-20">
            <div className="absolute -top-32 -left-32 w-64 h-64 bg-amber-500 rounded-full filter blur-3xl opacity-30"></div>
            <div className="absolute -bottom-48 right-0 w-72 h-72 bg-indigo-500 rounded-full filter blur-3xl opacity-20"></div>
          </div>
        </div>
      </div>

      {/* Your existing filter controller */}
      <div className={`flex-1 transition-all duration-300`}>
        <FilterController activeFilterCount={activeFilterCount} />
      </div>

      <main className="pb-24">
        {" "}
        {/* Added pb-20 for bottom padding */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 h-full">
          {" "}
          {/* Added min-h */}
          {isLoading ? (
            <div className="flex justify-center items-center h-64">
              <LoadingSpinner />
            </div>
          ) : (
            <>
              {filteredGigs.length > 0 ? (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.5 }}
                  className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4  "
                >
                  {filteredGigs.map((gig: GigProps) => (
                    <motion.div
                      key={gig?._id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3 }}
                      whileHover={{ y: -5 }}
                      className="relative group overflow-hidden rounded-xl hover:border-amber-500/30 transition-all duration-300 hover:shadow-lg hover:shadow-amber-500/10 "
                    >
                      <AllGigsComponent gig={gig} />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
                    </motion.div>
                  ))}
                </motion.div>
              ) : (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.5 }}
                  className="max-w-2xl mx-auto text-center py-16"
                >
                  <div className="bg-gradient-to-br from-gray-800/50 to-gray-900/80 p-8 rounded-2xl border border-gray-700 backdrop-blur-sm">
                    <div className="inline-flex p-4 bg-gray-700 rounded-full mb-4">
                      <svg
                        className="h-12 w-12 text-amber-400"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={1.5}
                          d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                        />
                      </svg>
                    </div>
                    <h3 className="text-2xl font-bold text-white mb-3">
                      No gigs found matching your criteria
                    </h3>
                    <p className="text-gray-400 mb-6">
                      Try adjusting your filters or check back later for new
                      opportunities
                    </p>
                    <motion.button
                      whileHover={{ scale: 1.03 }}
                      whileTap={{ scale: 0.97 }}
                      onClick={() => dispatch({ type: "RESET_FILTERS" })}
                      className="px-6 py-2 bg-gradient-to-r from-amber-600 to-amber-700 text-white rounded-lg hover:from-amber-500 hover:to-amber-600 transition-all shadow-lg shadow-amber-500/10"
                    >
                      Reset All Filters
                    </motion.button>
                  </div>
                </motion.div>
              )}
            </>
          )}
        </div>
      </main>
      <footer className="bg-gray-900 border-t border-gray-800 py-6 h-24">
        {" "}
        {/* Added h-24 to match pb-24 */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-gray-500 text-sm">
          Scroll to discover more opportunities
        </div>
      </footer>
    </div>
  );
};

const Published = () => {
  return (
    <FilterProvider>
      <PublishedContent />
    </FilterProvider>
  );
};

export default Published;
