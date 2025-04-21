"use client";
import { useAllGigs } from "@/hooks/useAllGigs";
import { useParams } from "next/navigation";
import React from "react";
import AllGigsComponent from "../AllGigsComponent";

const PendingGigs = () => {
  const { id } = useParams();
  console.log(id);
  const { gigs } = useAllGigs();

  const pendingGigs = gigs?.filter((gig) =>
    gig?.bookCount?.some((bookedUser) => bookedUser?._id === id)
  );

  return (
    <div className="h-full W-[100%] mx-auto">
      <div className="text-white">
        {pendingGigs?.map((gig) => (
          <div key={gig?._id}>
            <AllGigsComponent key={gig?._id} gig={gig} />
          </div>
        ))}
      </div>
    </div>
  );
};

export default PendingGigs;
