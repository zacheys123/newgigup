"use client";
import useStore from "@/app/zustand/useStore";
import AllGigsComponent from "@/components/gig/AllGigsComponent";
import Gigheader from "@/components/gig/Gigheader";
import ColorLoading from "@/components/loaders/ColorLoading";
import AlreadyReviewModal from "@/components/modals/AlreadyReviewModall";
// import LoadingSpinner from "@/components/LoadingSpinner";
import { useAllGigs } from "@/hooks/useAllGigs";
import { useCurrentUser } from "@/hooks/useCurrentUser";
import { GigProps } from "@/types/giginterface";
import { searchfunc } from "@/utils/index";
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
  let gigQuery;
  console.log(
    gigs?.gigs?.filter((gig: GigProps) => gig?.postedBy?._id === user?._id)
  );
  const { showModal } = useStore();
  return (
    <div className="h-[70%] w-[90%] mx-auto my-2 shadow-md shadow-orange-300 relative">
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
          searchfunc(gigs?.gigs, typeOfGig, category, gigQuery, location)
            ?.filter((gig: GigProps) => gig?.postedBy?._id === user?._id)
            ?.map((gig: GigProps) => (
              <AllGigsComponent key={gig?._id} gig={gig} />
            ))
        ) : (
          <div className="flex justify-center items-center h-full w-full">
            <ColorLoading />
          </div>
          // <LoadingSpinner />
        )}{" "}
        {showModal && (
          <div className="fixed  w-[80%] mx-auto inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center">
            {/* Dim all other gigs */}
            {/* Center modal on parent gig */}
            <div className=" z-0 mt-10">
              {" "}
              <AlreadyReviewModal />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default MyGigs;
