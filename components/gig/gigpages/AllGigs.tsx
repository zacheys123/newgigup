// GigsPage.tsx
"use client";

import AllGigsComponent from "@/components/gig/AllGigsComponent";
import Gigheader from "@/components/gig/Gigheader";
import Clockwise from "@/components/loaders/Clockwise";
import { useAllGigs } from "@/hooks/useAllGigs";
import { useCurrentUser } from "@/hooks/useCurrentUser";
import { useDebounce } from "@/hooks/useDebounce";
import { GigProps } from "@/types/giginterface";
import { dataCounties, filterGigs } from "@/utils";
import { useAuth } from "@clerk/nextjs";
import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useMemo, useState } from "react";

const AllGigs = () => {
  const { loading: gigsLoading, gigs } = useAllGigs();
  const { user } = useCurrentUser();
  const { userId } = useAuth();
  const [typeOfGig, setTypeOfGig] = useState<string>("");
  const [category, setCategory] = useState<string>("all");
  const [location, setLocation] = useState<string>("all");
  const [scheduler, setScheduler] = useState<string>();
  const [showFilters, setShowFilters] = useState(false);
  const [sortOption, setSortOption] = useState<string>("relevance");

  const debouncedSearch = useDebounce(typeOfGig, 300);

  const normalizeString = (str?: string) =>
    str
      ?.trim()
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "") || "";

  useEffect(() => {
    if (normalizeString(user?.user?.city)) {
      setLocation(user?.user?.isClient ? "all" : user.user.city);
    }
  }, [user]);

  useEffect(() => {
    if (typeOfGig.trim() !== "") {
      setShowFilters(true);
    }
  }, [typeOfGig]);

  const filteredGigs = useMemo(() => {
    const filtered = filterGigs(gigs, {
      searchQuery: debouncedSearch,
      category,
      location,
      scheduler,
    });

    const result =
      filtered?.filter(
        (gig: GigProps) =>
          !gig?.isTaken &&
          !gig?.isPending &&
          gig?.bookCount.length < 10 &&
          !gig?.bookCount?.some((bookedUser) => bookedUser?.clerkId === userId)
      ) || [];

    switch (sortOption) {
      case "newest":
        result.sort(
          (a, b) =>
            new Date(b.createdAt!).getTime() - new Date(a.createdAt!).getTime()
        );
        break;
      case "highest":
        result.sort(
          (a, b) =>
            (parseFloat(b.price || "0") || 0) -
            (parseFloat(a.price || "0") || 0)
        );
        break;
      case "popular":
        result.sort(
          (a, b) => (b.viewCount?.length || 0) - (a.viewCount?.length || 0)
        );
        break;
      default:
        result.sort((a, b) => {
          const aScore =
            (a.viewCount?.length || 0) * 0.7 +
            new Date(a.createdAt!).getTime() * 0.3;
          const bScore =
            (b.viewCount?.length || 0) * 0.7 +
            new Date(b.createdAt!).getTime() * 0.3;
          return bScore - aScore;
        });
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
  ]);

  const isLoading = gigsLoading;

  return (
    <div className="flex flex-col min-h-screen w-full bg-gray-900">
      {/* Toggle Filter Button */}
      <div className="flex justify-end max-w-7xl mx-auto p-4">
        <button
          onClick={() => setShowFilters((prev) => !prev)}
          className="relative px-4 py-2 text-sm rounded-md text-white bg-gradient-to-r from-purple-600 via-emerald-500 to-yellow-400 border border-green-300 shadow-md hover:brightness-110 transition-all duration-300 overflow-hidden"
        >
          <span className="relative z-10 font-bold">
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
            className="w-full max-w-7xl mx-auto mb-6"
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

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto scroll-smooth scrollbar-thin scrollbar-thumb-gray-600 scrollbar-track-gray-800 p-4 md:p-8">
        <div className="max-w-7xl mx-auto space-y-10">
          {/* Empty State */}
          {!isLoading && filteredGigs.length === 0 && (
            <div className="text-center py-16 px-4 sm:px-6 lg:px-8 bg-gray-800 rounded-xl border border-gray-700 shadow-xl">
              <div className="inline-flex mb-6 p-3 bg-gray-700 rounded-full">
                <svg
                  className="h-10 w-10 text-amber-400"
                  viewBox="0 0 24 24"
                  fill="none"
                >
                  <path
                    d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
                    stroke="currentColor"
                    strokeWidth={1.5}
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </div>
              <h1 className="text-3xl md:text-4xl font-bold text-white mb-4">
                <span className="bg-clip-text text-transparent bg-gradient-to-r from-amber-400 to-amber-600">
                  Premium Opportunities Await
                </span>
              </h1>
              <p className="text-lg text-gray-300 mb-8">
                Discover high-value gigs from top clients. No gigs available in{" "}
                <span className="font-semibold">{user?.user?.city}</span>.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <button
                  onClick={() => setLocation("all")}
                  className="px-6 py-3 bg-gradient-to-r from-amber-500 to-amber-600 text-gray-900 font-medium rounded-lg hover:shadow-lg hover:brightness-110 transition-all"
                >
                  Show All Listings
                </button>
                <button
                  className="px-6 py-3 border border-gray-600 text-gray-300 font-medium rounded-lg hover:bg-gray-700/50 hover:border-amber-500/30 transition-all"
                  onClick={() => {
                    const userCity = user?.user?.city;
                    const otherCities = dataCounties.filter(
                      (city) => city !== userCity
                    );
                    if (otherCities.length > 0) {
                      alert("hello");
                      const randomCity =
                        otherCities[
                          Math.floor(Math.random() * otherCities.length)
                        ];
                      setLocation!(randomCity);
                    }
                  }}
                >
                  View Featured
                </button>
              </div>
            </div>
          )}

          {/* Loader */}
          {isLoading && (
            <div className="flex flex-col items-center justify-center h-96">
              <Clockwise />
              <p className="mt-6 text-gray-400 font-medium animate-pulse">
                Gathering premium opportunities...
              </p>
            </div>
          )}

          {/* Gigs Display */}
          {filteredGigs.length > 0 && (
            <div>
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
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
                  <p className="text-gray-400/90 text-xs font-mono mt-1 tracking-wide">
                    Handpicked for quality and value
                  </p>
                </div>
                <div className="flex items-center space-x-3">
                  <span className="text-sm text-gray-400">Sort:</span>
                  <select
                    value={sortOption}
                    onChange={(e) => setSortOption(e.target.value)}
                    className="text-sm bg-gray-600 border-gray-700 rounded-lg focus:ring-amber-500 focus:border-amber-500 text-white p-2"
                  >
                    <option value="relevance">Relevance</option>
                    <option value="newest">Newest First</option>
                    <option value="highest">Highest Budget</option>
                    <option value="popular">Most Viewed</option>
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
        </div>
      </main>
    </div>
  );
};

export default AllGigs;
