"use client";
import useStore from "@/app/zustand/useStore";
import Videos from "@/components/gig/Videos";
import ColorLoading from "@/components/loaders/ColorLoading";
import { useAllGigs } from "@/hooks/useAllGigs";
import { useDebounce } from "@/hooks/useDebounce";
import { GigProps } from "@/types/giginterface";
import { motion } from "framer-motion";
import React, { useMemo, useState } from "react";
import { BanIcon, RotateCw, Video } from "lucide-react";

import GigCard from "./GigCard";
import { Search } from "react-feather";
import { UserProps } from "@/types/userinterfaces";
import ChatModal from "./ChatModal";
import { useConfirmPayment } from "@/hooks/useConfirmPayment";
import { Button } from "@/components/ui/button";

const Booked = () => {
  const { loading: gigsLoading, gigs } = useAllGigs();

  const [modal, setModal] = useState<{
    type: "chat" | "video";
    user: UserProps;
  } | null>(null);
  const [typeOfGig, setTypeOfGig] = useState<string>("");
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const debouncedSearch = useDebounce(typeOfGig, 300);

  const {
    showVideo,
    setShowVideo,
    currentgig,
    currentUser: user,
    showPaymentConfirmation,
    setShowPaymentConfirmation,
  } = useStore();

  const filterGigs = (gigs: GigProps[], searchquery?: string) => {
    let sortedData = gigs;
    console.log(sortedData);
    if (searchquery) {
      sortedData = sortedData?.filter((gig) => {
        if (
          gig?.title?.toLowerCase().includes(searchquery) ||
          gig?.location?.toLowerCase().includes(searchquery) ||
          // gig?.gigname?.toLowerCase().includes(searchquery) ||
          gig?.category?.toLowerCase().includes(searchquery) ||
          gig?.gigtimeline?.toLowerCase().includes(searchquery) ||
          gig?.price?.toLowerCase().includes(searchquery)
        ) {
          return sortedData;
        } else {
          return false;
        }
      });
    }
    return sortedData;
  };
  const filteredGigs = useMemo(() => {
    const filtered = filterGigs(gigs, debouncedSearch);
    return (
      filtered?.filter(
        (gig: GigProps) =>
          gig?.isTaken === true &&
          gig?.isPending === false &&
          gig?.bookedBy?._id === user?._id
      ) || []
    );
  }, [gigs, debouncedSearch]);

  const [showX, setShowX] = useState(false);
  console.log(showX);
  const handleOpenX = () => {
    setShowX(false);
  };

  const [musicianCode, setMusicianCode] = useState("");
  const { confirmPayment } = useConfirmPayment();

  const handleSubmit = async () => {
    setIsSubmitting(true);
    try {
      await confirmPayment(
        currentgig?._id || "",
        "musician",
        "Musician confirmed via app",
        musicianCode,
        0
      );
      setShowPaymentConfirmation(false);
    } catch (e) {
      console.log(e);
    } finally {
      setIsSubmitting(false);
      setShowPaymentConfirmation(false);
    }
  };
  return (
    <div className="flex flex-col h-[calc(100vh-100px)] w-full bg-gradient-to-br from-gray-900 to-gray-800">
      {/* Main Content Area */}

      {showPaymentConfirmation && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg sm:max-w-[400px] max-w-[300px] w-full">
            <h3 className="text-lg font-medium mb-4">Confirm Payment</h3>
            <p className="mb-2 text-[10px] text-gray-700">
              Please enter the last 3 letters/digits of the payment confirmation
              meessage. Payment will be marked complete only if both codes
              match.{" "}
            </p>

            <input
              type="text"
              placeholder="Enter code"
              className="w-full border px-3 py-2 text-xs rounded-md text-neutral-500 mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={musicianCode}
              onChange={(e) => setMusicianCode(e.target.value)}
            />

            <div className="flex justify-end space-x-3">
              <button
                onClick={() => setShowPaymentConfirmation(false)}
                className="px-4 py-2 border rounded-md text-neutral-500 text-xs"
              >
                Cancel
              </button>

              <Button
                onClick={handleSubmit}
                disabled={isSubmitting}
                className="w-full bg-blue-600 hover:bg-blue-700 dark:bg-blue-700 dark:hover:bg-blue-800"
              >
                {isSubmitting ? (
                  <span className="flex items-center gap-2">
                    <RotateCw className="h-4 w-4 animate-spin" />
                    Confirming...
                  </span>
                ) : (
                  "Confirm"
                )}
              </Button>
            </div>
          </div>
        </div>
      )}

      <div className="flex-1 flex flex-col min-h-0">
        <motion.div
          className="relative group mb-8"
          initial="hidden"
          animate="show"
        >
          <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/10 to-blue-600/10 rounded-xl blur-lg opacity-0 group-hover:opacity-40 transition-all duration-700"></div>
          <div className="relative flex items-center bg-gray-900/50 px-5 py-3.5 rounded-full border border-gray-600 group-hover:border-cyan-400/30 transition-all duration-500 mt-2">
            <Search size={18} className="text-cyan-400 mr-3" />
            <input
              placeholder="Search Gig Title/Location/Time etc..."
              className="flex-1 bg-transparent border-none outline-none text-gray-100 placeholder-gray-400 text-sm font-medium focus:ring-0"
              value={typeOfGig}
              onChange={(ev) => setTypeOfGig(ev.target.value)}
              autoFocus
            />
            <motion.div
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              className="p-2 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-lg shadow cursor-pointer"
            >
              <Search size={16} className="text-white" />
            </motion.div>
          </div>
        </motion.div>{" "}
        {/* Add flex-col and min-h-0 for proper scrolling */}
        <div className="overflow-y-auto p-4 h-full">
          {typeOfGig && (
            <span className="text-neutral-300 title">
              Search results for {`  "${typeOfGig}"`}
            </span>
          )}
          {/* Ensure full height and scroll */}
          {filteredGigs.length === 0 && !typeOfGig && !gigsLoading && (
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
          {filteredGigs.length === 0 && typeOfGig && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex flex-col items-center justify-center py-16 h-full min-h-[300px]" /* Add min height */
            >
              <div className="w-24 h-24 bg-red-500/20 rounded-full flex items-center justify-center mb-6">
                <div className="w-16 h-16 bg-indigo-800/30 rounded-full flex items-center justify-center">
                  <BanIcon className="text-red-400" size={32} />
                </div>
              </div>
              <h1 className="text-white text-2xl font-bold mb-2">
                No results found
              </h1>
              <p className="text-gray-400 max-w-md text-center">
                Your booked gigs search will appear here. Try adjusting the
                search
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
                  <GigCard
                    gig={gig}
                    onOpenChat={(type, user) => setModal({ type, user })}
                  />
                </motion.div>
              ))}
            </div>
          )}
          {modal && (
            <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
              {/* Backdrop with smooth transition */}
              <div
                className="absolute inset-0 bg-gray-900/80 backdrop-blur-md transition-opacity duration-300 ease-in-out"
                onClick={() => setModal(null)}
              />

              {/* Modal container with subtle scale animation */}
              <div className="relative transform transition-all duration-300 ease-out sm:scale-100 scale-95">
                <ChatModal
                  onClose={() => setModal(null)}
                  modal={modal}
                  user={user}
                  onOpenX={handleOpenX}
                  className=""
                />
              </div>
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
