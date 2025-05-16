"use client";
import useStore from "@/app/zustand/useStore";
import Gigheader from "@/components/gig/Gigheader";
import Videos from "@/components/gig/Videos";
import ColorLoading from "@/components/loaders/ColorLoading";
import { useAllGigs } from "@/hooks/useAllGigs";
import { useCurrentUser } from "@/hooks/useCurrentUser";
import { useDebounce } from "@/hooks/useDebounce";
import { GigProps } from "@/types/giginterface";
import { filterGigs } from "@/utils";
import { motion } from "framer-motion";
import React, { useMemo, useState } from "react";
import { Video } from "lucide-react";

import GigCard from "./GigCard";

const Booked = () => {
  const { loading: gigsLoading, gigs } = useAllGigs();

  const { user } = useCurrentUser();
  const [typeOfGig, setTypeOfGig] = useState<string>("");
  const debouncedSearch = useDebounce(typeOfGig, 300);
  const [category, setCategory] = useState<string>("all");
  const [location, setLocation] = useState<string>("all");
  const { showVideo, setShowVideo, currentgig } = useStore();

  const filteredGigs = useMemo(() => {
    const filtered = filterGigs(gigs, {
      searchQuery: debouncedSearch,
      category,
      location,
    });
    return (
      filtered?.filter(
        (gig: GigProps) => gig?.isTaken === true && gig?.isPending === false
      ) || []
    );
  }, [gigs, debouncedSearch, category, location]);

  return (
    <div className="flex flex-col h-[calc(100vh-100px)] w-full bg-gradient-to-br from-gray-900 to-gray-800">
      {/* Enhanced Header with Glass Morphism */}
      <div className="sticky top-0 z-10 backdrop-blur-md bg-gray-800/50 border-b border-gray-700/50 shadow-lg">
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

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-h-0">
        {" "}
        {/* Add flex-col and min-h-0 for proper scrolling */}
        <div className="overflow-y-auto p-4 h-full">
          {" "}
          {/* Ensure full height and scroll */}
          {filteredGigs.length === 0 && !gigsLoading && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex flex-col items-center justify-center py-16 h-full min-h-[300px]" /* Add min height */
            >
              <div className="w-24 h-24 bg-indigo-900/20 rounded-full flex items-center justify-center mb-6">
                <div className="w-16 h-16 bg-indigo-800/30 rounded-full flex items-center justify-center">
                  <Video className="text-indigo-400" size={32} />
                </div>
              </div>
              <h1 className="text-white text-2xl font-bold mb-2">
                No gigs booked
              </h1>
              <p className="text-gray-400 max-w-md text-center">
                Your booked gigs will appear here. Try adjusting filters or
                check back later.
              </p>
            </motion.div>
          )}
          {gigsLoading ? (
            <div className="flex justify-center items-center h-full min-h-[300px]">
              {" "}
              {/* Full height with min */}
              <ColorLoading />
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 pb-4">
              {" "}
              {/* Add bottom padding */}
              {filteredGigs.map((gig: GigProps) => (
                <motion.div
                  key={gig?._id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                  className="relative bg-gray-800/50 backdrop-blur-sm rounded-xl overflow-hidden border border-gray-700/50 hover:border-indigo-500/50 transition-all duration-300 shadow-lg hover:shadow-indigo-500/10"
                >
                  <GigCard gig={gig} />
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Video Modal */}
      {showVideo && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
        >
          <motion.div
            initial={{ scale: 0.95, y: 20 }}
            animate={{ scale: 1, y: 0 }}
            className="w-full max-w-2xl bg-gray-800 rounded-xl overflow-hidden border border-gray-700 shadow-2xl"
          >
            <div className="p-4 border-b border-gray-700 flex justify-between items-center">
              <h3 className="text-lg font-semibold text-white">
                Add Videos for {currentgig?.title}
              </h3>
              <button
                onClick={() => setShowVideo(false)}
                className="text-gray-400 hover:text-white"
              >
                ✕
              </button>
            </div>
            <Videos />
          </motion.div>
        </motion.div>
      )}
    </div>
  );
};

export default Booked;

// Simple EyeIcon component since we don't have the import
