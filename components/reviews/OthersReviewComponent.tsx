"use client";
import { useCurrentUser } from "@/hooks/useCurrentUser";
import { Review } from "@/types/userinterfaces";
import React from "react";
import AllReview from "./allreviews/AllReview";

const OthersReviewComponent = () => {
  const { user } = useCurrentUser();
  console.log(user?._id);
  return (
    <div className="text-gray-300 h-full py-2 bg-neutral-900">
      {user?.allreviews?.length > 0 ? (
        <>
          {user?.allreviews?.map((review: Review) => (
            <AllReview key={review?._id} {...review} w="240px" />
          ))}
        </>
      ) : (
        <div className="flex justify-center items-center h-full">
          <h2 className="text-gray-500">No reviews found.</h2>
        </div>
      )}
    </div>
  );
};

export default OthersReviewComponent;
// 67766d6efcde8ba309c2fb75
