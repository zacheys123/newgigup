"use client";
import AllGigsComponent from "@/components/gig/AllGigsComponent";
import Gigheader from "@/components/gig/Gigheader";
import LoadingSpinner from "@/components/LoadingSpinner";
import { useAllGigs } from "@/hooks/useAllGigs";
import { useCurrentUser } from "@/hooks/useCurrentUser";
import { GigProps } from "@/types/giginterface";
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

  console.log(gigs?.gigs?.map((gig: GigProps) => console.log(gig)));

  return (
    <div className="h-[88%] w-[90%] mx-auto my-2 overflow-y-scroll shadow-md shadow-orange-300">
      {!loading ? (
        <div className="mt-5">
          <Gigheader
            typeOfGig={typeOfGig}
            setTypeOfGig={setTypeOfGig}
            category={category}
            setCategory={setCategory}
            gigQuery={gigQuery}
            location={location}
            setLocation={setLocation}
          />

          {gigs?.gigs?.map((gig: GigProps) => (
            <AllGigsComponent key={gig?._id} gig={gig} />
          ))}
        </div>
      ) : (
        <LoadingSpinner />
      )}
    </div>
  );
};

export default GigsPage;
