"use client";
import useStore from "@/app/zustand/useStore";
import AllGigsComponent from "@/components/gig/AllGigsComponent";
import Gigheader from "@/components/gig/Gigheader";
import Videos from "@/components/gig/Videos";
import ColorLoading from "@/components/loaders/ColorLoading";
import { useAllGigs } from "@/hooks/useAllGigs";
import { useCurrentUser } from "@/hooks/useCurrentUser";
import { GigProps } from "@/types/giginterface";
import { searchfunc } from "@/utils/index";
import { useAuth } from "@clerk/nextjs";
import { motion } from "framer-motion";
import React, { useState } from "react";

const BookedGigs = () => {
  const { userId } = useAuth();
  const { loading, gigs } = useAllGigs();
  const { user } = useCurrentUser(userId || null);
  const [typeOfGig, setTypeOfGig] = useState<string>("");
  const [category, setCategory] = useState<string>("all");
  const [location, setLocation] = useState<string>(() =>
    user?.city ? user?.city : "all"
  );
  const { showVideo } = useStore();
  let gigQuery;
  return (
    <div className="h-[70%] w-[90%] mx-auto my-2 shadow-md shadow-orange-300 relative pb-[30px]">
      {/* Fixed Gigheader */}
      <div className="sticky top-0 z-10 shadow-md bg-gray-900">
        <Gigheader
          typeOfGig={typeOfGig}
          setTypeOfGig={setTypeOfGig}
          category={category}
          setCategory={setCategory}
          location={location}
          setLocation={setLocation}
        />
      </div>

      {/* Scrollable Gigs List */}
      <div className="h-[calc(100%-80px)] overflow-y-auto bg-gray-900">
        {" "}
        {gigs && gigs?.gigs?.length === 0 && (
          <h1 className="text-white text-center font-bold py-5">
            No gigs found
          </h1>
        )}
        {!loading ? (
          searchfunc(gigs?.gigs, typeOfGig, category, gigQuery, location)
            ?.filter((gig: GigProps) => gig.bookedBy?._id === user?._id)
            ?.map((gig: GigProps) => (
              <AllGigsComponent key={gig?._id} gig={gig} />
            ))
        ) : (
          <div className="flex justify-center items-center h-full w-full">
            <ColorLoading />
          </div>
          // <LoadingSpinner />
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

export default BookedGigs;
