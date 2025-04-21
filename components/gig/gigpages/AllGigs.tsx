// GigsPage.tsx
"use client";

import AllGigsComponent from "@/components/gig/AllGigsComponent";
import Gigheader from "@/components/gig/Gigheader";
import Clockwise from "@/components/loaders/Clockwise";
import { useAllGigs } from "@/hooks/useAllGigs";
import { useCurrentUser } from "@/hooks/useCurrentUser";
import { GigProps } from "@/types/giginterface";
import { searchfunc } from "@/utils/index";
import { useEffect, useMemo, useState } from "react";

const AllGigs = () => {
  const { loading: gigsLoading, gigs } = useAllGigs();
  const { user, loading: userLoading } = useCurrentUser();
  const [typeOfGig, setTypeOfGig] = useState<string>("");
  const [category, setCategory] = useState<string>("all");
  const [location, setLocation] = useState<string>("all");
  const [scheduler, setScheduler] = useState<string>("notPending");
  let gigQuery;
  useEffect(() => {
    // if (!user) {
    //   mutateUser().catch((error) => {
    //     console.error("Failed to mutate user:", error);
    //     // Consider adding toast notification here
    //   });
    // }

    if (user?.user?.city) {
      setLocation(user.user?.city);
    }
  }, [user]);

  const filteredGigs = useMemo(() => {
    return (
      searchfunc(
        gigs,
        typeOfGig,
        category,
        gigQuery,
        location,
        scheduler
      )?.filter(
        (gig: GigProps) => gig?.isTaken === false && gig?.isPending === false
      ) || []
    );
  }, [gigs, typeOfGig, category, location, gigQuery, scheduler]);

  const isLoading = gigsLoading || userLoading;
  console.log(filteredGigs);
  return (
    <div className="flex flex-col h-full w-[90%] mx-auto md:w-full my-2 md:shadow-lg md:shadow-orange-300/20 md:rounded-xl md:overflow-hidden">
      <div className="sticky top-0 z-10 bg-gray-900 shadow-md md:shadow-lg md:rounded-t-xl">
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
      </div>

      <div className="h-[10%] overflow-y-scroll md:bg-gradient-to-b md:from-gray-900 md:to-gray-950">
        {filteredGigs.length === 0 && !isLoading && (
          <div className="flex flex-col items-center justify-center py-12">
            <h1 className="text-white text-xl font-bold mb-4">No gigs found</h1>
            <p className="text-gray-400 max-w-md text-center">
              Try adjusting your filters or check back later for new posted gigs
            </p>
          </div>
        )}
        {!isLoading ? (
          <div className="space-y-3 p-2 pb-[74px] pt-3 md:space-y-4 md:p-4 md:grid md:grid-cols-2 lg:grid-cols-3 md:gap-4">
            {filteredGigs.map((gig: GigProps) => (
              <AllGigsComponent key={gig?._id} gig={gig} />
            ))}
          </div>
        ) : (
          <div className="flex justify-center items-center h-full w-full mt-[90px]">
            <Clockwise />
          </div>
        )}
      </div>
    </div>
  );
};

export default AllGigs;
