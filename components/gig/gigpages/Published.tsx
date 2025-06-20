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
import { dataCounties, filterGigs } from "@/utils";
import { useAuth } from "@clerk/nextjs";
import { AnimatePresence, motion } from "framer-motion";
import { useRouter } from "next/navigation";

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
  const router = useRouter();
  useEffect(() => {
    if (user?.user?.isClient) {
      router.push(`/create/${userId}`);
    }

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

  const [sortOption, setSortOption] = useState<string>("popular");
  const [timelineOption, setTimelineOption] = useState<string>("once");
  const filteredGigs = useMemo(() => {
    const filtered = filterGigs(gigs, {
      searchQuery: debouncedSearch,
      category,
      location,
      scheduler,
      timelineOption,
    });

    // Additional filtering for user-specific conditions
    const result =
      filtered?.filter(
        (gig: GigProps) =>
          gig?.isTaken === false &&
          gig?.bookCount.length < 10 &&
          !gig?.bookCount?.some((bookedUser) => bookedUser?.clerkId === userId)
      ) || [];

    // Apply sorting
    switch (sortOption) {
      case "newest":
        result.sort(
          (a, b) =>
            new Date(b.createdAt || 0).getTime() -
            new Date(a.createdAt || 0).getTime()
        );
        break;
      case "highest":
        result.sort((a, b) => {
          const priceA = parseFloat(a.price || "0") || 0;
          const priceB = parseFloat(b.price || "0") || 0;
          return priceB - priceA;
        });

        break;
      case "popular":
        result.sort(
          (a, b) => (b.viewCount?.length || 0) - (a.viewCount?.length || 0)
        );
        break;
      default:
        // Relevance sorting
        result.sort((a, b) => {
          const aViews = a.viewCount?.length || 0;
          const bViews = b.viewCount?.length || 0;
          const aDate = new Date(a.createdAt || 0).getTime();
          const bDate = new Date(b.createdAt || 0).getTime();

          return bViews * 0.7 + bDate * 0.3 - (aViews * 0.7 + aDate * 0.3);
        });
        break;
    }

    return result;
  }, [
    gigs,
    debouncedSearch,
    category,
    location,
    scheduler,
    userId,
    sortOption,
    timelineOption,
  ]);
  const isLoading = gigsLoading;
  const [showFilters, setShowFilters] = useState(false);
  return (
    <div className="flex flex-col min-h-screen w-full bg-gray-900">
      {/* Sticky Glass Header */}
      <div className="flex justify-end max-w-7xl mx-auto p-4">
        <button
          onClick={() => setShowFilters((prev) => !prev)}
          className="relative px-4 py-2 text-sm rounded-md text-white bg-gradient-to-r from-purple-600 via-pink-500 to-yellow-400 border border-pink-300 shadow-md hover:brightness-110 transition-all duration-300 overflow-hidden"
        >
          <span className="relative z-10">
            {showFilters ? "Hide Filters" : "Show Filters"}
          </span>

          {/* Glitter shimmer layer */}
          <div className="absolute top-0 left-0 w-full h-full z-0 pointer-events-none">
            <div className="w-1/3 h-full bg-white opacity-20 blur-sm animate-[shine_2s_linear_infinite]" />
          </div>

          {/* Sparkles */}
          <span className="absolute top-1 left-2 text-white opacity-75 animate-[sparkle1_3s_infinite] pointer-events-none">
            ✨
          </span>
          <span className="absolute top-3 right-4 text-white opacity-50 animate-[sparkle2_4s_infinite] pointer-events-none">
            ✨
          </span>
          <span className="absolute bottom-1 left-10 text-white opacity-60 animate-[sparkle3_3.5s_infinite] pointer-events-none">
            ✨
          </span>
          <span className="absolute bottom-2 right-8 text-white opacity-40 animate-[sparkle2_4s_infinite] pointer-events-none">
            ✨
          </span>
        </button>
      </div>

      <AnimatePresence mode="wait">
        {showFilters && (
          <motion.div
            key="gig-header"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.4, ease: [0.25, 0.8, 0.25, 1] }}
            className="w-[89%] md:max-w-7xl mx-auto mb-6"
          >
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
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Content Area */}
      <main className="flex-1 overflow-y-auto scroll-smooth scrollbar-thin scrollbar-thumb-gray-600 scrollbar-track-gray-800 p-4 md:p-8 ">
        {/* Premium Empty State */}{" "}
        <div className="flex-1 overflow-y-auto scroll-smooth scrollbar-thin scrollbar-thumb-gray-600 scrollbar-track-gray-800">
          {filteredGigs.length === 0 && !isLoading && (
            <div className="max-w-4xl mx-auto text-center  md:py-16 px-4 sm:px-6 lg:px-8">
              <div className="bg-gray-800 p-8 md:p-12 rounded-xl shadow-2xl border border-gray-700">
                <div className="inline-flex p-3 bg-gray-700 rounded-full">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-10 w-10 text-amber-400"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={1.5}
                      d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
                    />
                  </svg>
                </div>
                <h1 className="text-3xl md:text-4xl font-bold text-white mb-4">
                  <span className="bg-clip-text text-transparent bg-gradient-to-r from-amber-400 to-amber-600">
                    Premium Opportunities Await
                  </span>
                </h1>
                <p className="text-lg text-gray-300 mb-8 max-w-2xl mx-auto">
                  Discover high-value gigs from top clients. Refine your search
                  or explore our curated selections no gigs available in{" "}
                  {user?.user?.city}.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <button
                    onClick={() => {
                      setLocation("all");
                    }}
                    className="px-6 py-3 bg-gradient-to-r from-amber-500 to-amber-600 text-gray-900 font-medium rounded-lg transition-all hover:shadow-lg hover:shadow-amber-500/20 hover:brightness-110"
                  >
                    Show All Listings
                  </button>
                  <button
                    className="px-6 py-3 border title border-gray-600 text-gray-300 font-medium rounded-lg hover:bg-gray-700/50 hover:border-amber-500/30 transition-all"
                    onClick={() => {
                      const userCity = user?.user?.city;
                      const otherCities = dataCounties.filter(
                        (city) => city !== userCity
                      );
                      if (otherCities.length > 0) {
                        const randomCity =
                          otherCities[
                            Math.floor(Math.random() * otherCities.length)
                          ];
                        setLocation!(randomCity);
                      }
                    }}
                  >
                    View Featured/Random Cities
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Loading State */}
          {isLoading && (
            <div className="flex justify-center items-center h-full w-full">
              <LoadingSpinner />
            </div>
          )}

          {/* Gigs Grid */}
          {filteredGigs.length > 0 && (
            <div className="max-w-7xl mx-auto">
              <div className="mb-8 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div className="relative pl-5">
                  <div className="absolute left-0 top-1 h-3/4 w-0.5 bg-gradient-to-b from-amber-400 to-transparent"></div>
                  <div className="flex items-baseline gap-2">
                    <h2 className="text-2xl font-bold text-white">
                      {filteredGigs.length}
                    </h2>
                    <span className="text-2xl text-transparent bg-clip-text bg-gradient-to-r from-amber-400 via-purple-400 to-orange-300 font-semibold">
                      {filteredGigs.length === 1
                        ? "Premium Opportunity"
                        : "Premium Opportunities"}
                    </span>
                  </div>
                  <p className="text-gray-400/90 text-[12px] font-mono mt-1 tracking-wider">
                    Handpicked for quality and value
                  </p>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="flex items-center space-x-3">
                    <span className="text-xs text-gray-400">Sort:</span>
                    <select
                      value={sortOption}
                      onChange={(e) => setSortOption(e.target.value)}
                      className="text-xs bg-gray-600 border-gray-700 rounded-lg focus:ring-amber-500 focus:border-amber-500 text-white p-2"
                    >
                      <option value="relevance">Relevance</option>
                      <option value="newest">Newest First</option>
                      <option value="highest">Highest Budget</option>
                      <option value="popular">Most Viewed</option>{" "}
                    </select>
                  </div>
                  <select
                    value={timelineOption}
                    onChange={(e) => setTimelineOption(e.target.value)}
                    className="text-xs bg-gray-600 border-gray-700 rounded-lg focus:ring-amber-500 focus:border-amber-500 text-white p-2"
                  >
                    <option value="once">Once Gigs/Functions</option>
                    <option value="weekly">Weekly Gigs</option>
                    <option value="other">Other Timeline </option>
                  </select>
                </div>
              </div>
              <div className="max-h-[60vh] sm:max-h-[65vh] md:max-h-[70vh] lg:max-h-[75vh] xl:max-h-[80vh] overflow-y-auto scrollbar-thin scrollbar-thumb-transparent scrollbar-track-gray-800 pr-2 pb-[50px]">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-1 pb-[50px]">
                  {filteredGigs.map((gig: GigProps) => (
                    <div
                      key={gig?._id}
                      className=" overflow-hidden hover:shadow-xl transition-all duration-300 hover:border-amber-500/30 hover:-translate-y-1"
                    >
                      <AllGigsComponent gig={gig} />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Featured Section */}
          {/* {(filteredGigs.length === 0 || filteredGigs.length < 4) &&
            isLoading && (
              <div className="max-w-7xl mx-auto mt-12 border-t border-gray-800 pt-12">
                <h3 className="text-xl font-semibold text-white mb-6 px-4 flex items-center">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5 text-amber-500 mr-2"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                  Curated Selections
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 px-4">
                  {[1, 2, 3, 4].map((item) => (
                    <div
                      key={item}
                      className="bg-gray-800/50 rounded-xl border border-gray-700 p-6 hover:bg-gray-800 transition-colors"
                    >
                      <div className="h-40 bg-gray-700 rounded-lg mb-4 animate-pulse"></div>
                      <div className="h-4 bg-gray-700 rounded w-3/4 mb-3 animate-pulse"></div>
                      <div className="h-3 bg-gray-700 rounded w-1/2 animate-pulse"></div>
                      <div className="mt-4 pt-4 border-t border-gray-700 flex justify-between">
                        <div className="h-3 bg-gray-700 rounded w-1/4 animate-pulse"></div>
                        <div className="h-3 bg-gray-700 rounded w-1/4 animate-pulse"></div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )} */}
        </div>
      </main>

      {/* Floating CTA */}
      {/* <div className="fixed bottom-6 right-6 z-20">
        <button className="flex items-center justify-center w-14 h-14 bg-gradient-to-br from-amber-500 to-amber-600 rounded-full shadow-xl hover:from-amber-600 hover:to-amber-700 transition-all transform hover:scale-105 group">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6 text-gray-900 group-hover:rotate-90 transition-transform"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 6v6m0 0v6m0-6h6m-6 0H6"
            />
          </svg>
        </button>
      </div> */}
    </div>
  );
};

export default Published;
