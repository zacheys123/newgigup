"use client";
import { useCurrentUser } from "@/hooks/useCurrentUser";
import { Review } from "@/types/userinterfaces";
import { useAuth } from "@clerk/nextjs";
import React from "react";
import MainReview from "./myreviews/MainReview";

const ReviewComponent = () => {
  const { userId } = useAuth();
  const { reviews } = useCurrentUser(userId || null);
  // const { reviews } = useStore();

  return (
    <div className="text-gray-300 h-full mt-4 py-2 bg-neutral-900">
      {reviews && reviews?.length > 0 ? (
        <>
          {reviews.map((review: Review) => (
            <MainReview key={review?._id} {...review} />
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

export default ReviewComponent;
// 67766d6efcde8ba309c2fb75
