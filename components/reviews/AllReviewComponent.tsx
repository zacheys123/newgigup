"use client";
import { useCurrentUser } from "@/hooks/useCurrentUser";
import { Review } from "@/types/userinterfaces";
import { useAuth } from "@clerk/nextjs";
import React from "react";
import MainReview from "./myreviews/MainReview";

const AllReviewComponent = () => {
  const { userId } = useAuth();
  const { user } = useCurrentUser(userId || null);
  console.log(user?._id);
  return (
    <div className="text-gray-300 h-full">
      {user?.allreviews?.length > 0 ? (
        <>
          {user?.allreviews.map((review: Review) => (
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

export default AllReviewComponent;
// 67766d6efcde8ba309c2fb75
