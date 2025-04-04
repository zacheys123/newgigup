"use client";

import AllGigsComponent from "@/components/gig/AllGigsComponent";
import Gigheader from "@/components/gig/Gigheader";
import Clockwise from "@/components/loaders/Clockwise";
import { useAllGigs } from "@/hooks/useAllGigs";
import { useCurrentUser } from "@/hooks/useCurrentUser";
import { GigProps } from "@/types/giginterface";
import { searchfunc } from "@/utils/index";
import { useAuth } from "@clerk/nextjs";
import { useEffect, useState } from "react";

const GigsPage = () => {
  const { userId } = useAuth();
  const { loading, gigs } = useAllGigs();
  const { user } = useCurrentUser(userId || null);
  const [typeOfGig, setTypeOfGig] = useState<string>("");
  const [category, setCategory] = useState<string>("all");
  let gigQuery;

  const [location, setLocation] = useState<string>("all");

  useEffect(() => {
    if (user?.city) {
      setLocation(user.city);
    }
  }, [user]);

  return (
    <div className="flex flex-col h-full w-[90%] mx-auto md:w-full my-2 md:shadow-lg md:shadow-orange-300/20 md:rounded-xl md:overflow-hidden">
      {/* Enhanced Header */}
      <div className="sticky top-0 z-10 bg-gray-900 shadow-md md:shadow-lg md:rounded-t-xl">
        <Gigheader
          typeOfGig={typeOfGig}
          setTypeOfGig={setTypeOfGig}
          category={category}
          setCategory={setCategory}
          location={location}
          setLocation={setLocation}
          myuser={user}
        />
      </div>

      {/* Enhanced Gigs List */}
      <div className="h-[85%] overflow-y-scroll bg-gray-900 md:bg-gradient-to-b md:from-gray-900 md:to-gray-950">
        {gigs?.length === 0 && (
          <div className="flex flex-col items-center justify-center py-12">
            <h1 className="text-white text-xl font-bold mb-4">No gigs found</h1>
            <p className="text-gray-400 max-w-md text-center">
              Try adjusting your filters or check back later for new
              opportunities
            </p>
          </div>
        )}
        {!loading ? (
          <div className="space-y-3 p-2 pb-[74px] pt-3 md:space-y-4 md:p-4 md:grid md:grid-cols-2 lg:grid-cols-3 md:gap-4">
            {searchfunc(gigs, typeOfGig, category, gigQuery, location)
              ?.filter((gig: GigProps) => gig?.isTaken === false)
              ?.map((gig: GigProps) => (
                <AllGigsComponent key={gig?._id} gig={gig} />
              ))}
          </div>
        ) : (
          <div className="flex justify-center items-center h-full w-full">
            <Clockwise />
          </div>
        )}
      </div>
    </div>
  );
};
export default GigsPage;
