"use client";
import AllGigsComponent from "@/components/gig/AllGigsComponent";
import Gigheader from "@/components/gig/Gigheader";
import LoadingSpinner from "@/components/LoadingSpinner";
import { useAllGigs } from "@/hooks/useAllGigs";
import { useCurrentUser } from "@/hooks/useCurrentUser";
import { GigProps } from "@/types/giginterface";
import { searchfunc } from "@/utils/index";
import React, { useEffect, useMemo, useState } from "react";

const PublishedGigs = () => {
  const { loading: gigsLoading, gigs } = useAllGigs();
  const { user, loading: userLoading } = useCurrentUser();
  const [typeOfGig, setTypeOfGig] = useState<string>("");
  const [category, setCategory] = useState<string>("all");
  const [location, setLocation] = useState<string>(() =>
    user?.user?.city ? user?.user?.city : "all"
  );
  let gigQuery;
  console.log(gigs);
  useEffect(() => {
    // if (!user) {
    //   mutateUser().catch((error) => {
    //     console.error("Failed to mutate user:", error);
    //     // Consider adding toast notification here
    //   });

    if (user?.user?.city) {
      setLocation(user?.user?.city.toLowerCase());
    }
  }, [user]);
  const filteredGigs = useMemo(() => {
    return (
      searchfunc(gigs, typeOfGig, category, gigQuery, location)?.filter(
        (gig: GigProps) =>
          gig?.postedBy?._id !== user?.user?._id && gig?.isTaken === false
      ) || []
    );
  }, [gigs, typeOfGig, category, location, gigQuery, user?.user?._id]);

  const isLoading = gigsLoading || userLoading;
  console.log(filteredGigs);
  return (
    <div className="flex flex-col h-[calc(100vh-100px)] w-[90%] mx-auto my-2 shadow-md shadow-orange-300">
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
            <LoadingSpinner />
          </div>
        )}
      </div>
    </div>
  );
};

export default PublishedGigs;
