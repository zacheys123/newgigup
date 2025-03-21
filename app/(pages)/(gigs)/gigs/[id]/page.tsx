"use client";
import AllGigsComponent from "@/components/gig/AllGigsComponent";
import Gigheader from "@/components/gig/Gigheader";
import Clockwise from "@/components/loaders/Clockwise";
// import LoadingSpinner from "@/components/LoadingSpinner";
import { useAllGigs } from "@/hooks/useAllGigs";
import { useCurrentUser } from "@/hooks/useCurrentUser";
import { GigProps } from "@/types/giginterface";
import { searchfunc } from "@/utils/index";
import { useAuth } from "@clerk/nextjs";

import React, { useState } from "react";

const GigsPage = () => {
  const { userId } = useAuth();
  const { loading, gigs } = useAllGigs();
  const { user } = useCurrentUser(userId || null);
  const [typeOfGig, setTypeOfGig] = useState<string>("");
  const [category, setCategory] = useState<string>("all");
  let gigQuery;

  // const [loadingview, setLoadingView] = useState<boolean>();
  // const [loadingPostId, setLoadingPostId] = useState<object | null>(null);
  // const [loadingId, setLoadingId] = useState<boolean>();

  const [location, setLocation] = useState<string>(() =>
    user?.city ? user?.city : "all"
  );

  return (
    <div className="h-[70%] w-[90%] mx-auto my-2 shadow-md shadow-orange-300 relative pb-[30px]">
      {/* Fixed Gigheader */}
      <div className="sticky top-0 z-10 shadow-md">
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
      <div className="h-[calc(100%-60px)] overflow-y-auto bg-gray-900">
        {gigs?.gigs?.length === 0 && (
          <h1 className="text-white text-center font-bold py-5">
            No gigs found
          </h1>
        )}
        {!loading ? (
          searchfunc(gigs?.gigs, typeOfGig, category, gigQuery, location)
            ?.filter((gig: GigProps) => gig?.isTaken === false)
            ?.map((gig: GigProps) => {
              console.log(gig?.description);
              return <AllGigsComponent key={gig?._id} gig={gig} />;
            })
        ) : (
          // <LoadingSpinner />
          <div className="flex justify-center items-center h-full w-full">
            <Clockwise />
          </div>
        )}
      </div>
    </div>
  );
};

export default GigsPage;
