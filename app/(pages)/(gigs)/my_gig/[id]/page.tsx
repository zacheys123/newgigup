"use client";
import AllGigsComponent from "@/components/gig/AllGigsComponent";
import Gigheader from "@/components/gig/Gigheader";
import ColorLoading from "@/components/loaders/ColorLoading";
// import LoadingSpinner from "@/components/LoadingSpinner";
import { useAllGigs } from "@/hooks/useAllGigs";
import { useCurrentUser } from "@/hooks/useCurrentUser";
import { GigProps } from "@/types/giginterface";
import { useAuth } from "@clerk/nextjs";
import { useState } from "react";

const MyGigs = () => {
  const { userId } = useAuth();
  const { loading, gigs } = useAllGigs();
  const { user } = useCurrentUser(userId || null);
  const [typeOfGig, setTypeOfGig] = useState<string>("");
  const [category, setCategory] = useState<string>("all");
  const [location, setLocation] = useState<string>(() =>
    user?.city ? user?.city : "all"
  );
  console.log(
    gigs?.gigs?.filter((gig: GigProps) => gig?.postedBy?._id === user?._id)
  );
  return (
    <div className="h-[83%] w-[90%] mx-auto my-2 shadow-md shadow-orange-300 relative">
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
      <div className="h-[85%] overflow-y-scroll bg-gray-900">
        {gigs?.gigs?.length === 0 && (
          <h1 className="text-white text-center font-bold py-5">
            No gigs found
          </h1>
        )}
        {!loading ? (
          gigs?.gigs
            ?.filter((gig: GigProps) => gig?.postedBy?._id === user?._id)
            ?.map((gig: GigProps) => (
              <AllGigsComponent key={gig?._id} gig={gig} />
            ))
        ) : (
          <div className="flex justify-center items-center h-full w-full">
            <ColorLoading />
          </div>
          // <LoadingSpinner />
        )}
      </div>
    </div>
  );
};

export default MyGigs;
