"use client";
import AllReview from "@/components/reviews/allreviews/AllReview";
import { Review, UserProps } from "@/types/userinterfaces";
import { useParams } from "next/navigation";
import React, { useEffect, useState } from "react";

const FriendReviewComponent = () => {
  const { id } = useParams();
  const [friendReviews, setFriendReviews] = useState<Review[]>();

  useEffect(() => {
    if (!id) {
      // Guard: Do not run the effect if `id` is undefined or null
      return;
    }

    let isMounted = true;

    async function getFriend() {
      try {
        const response = await fetch(`/api/user/getuser/${id}`);

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const friendData: UserProps = await response.json();
        if (isMounted) {
          setFriendReviews(friendData?.allreviews || []);
        }
      } catch (error) {
        console.error("Error fetching friend data:", error);

        if (isMounted) {
          setFriendReviews([
            {
              _id: "",
              comment: "",
              gigId: "",
              rating: 0,
              createdAt: new Date(),
              updatedAt: new Date(),
            },
          ]);
        }

        // Optional: Notify user about the error
      }
    }

    getFriend();
    return () => {
      isMounted = false;
    };
  }, [id]);

  return (
    <div className=" w-[100%] h-[100%] bg-slate-900 overflow-y-auto">
      <div className="text-gray-300 h-full py-2 bg-neutral-900">
        {friendReviews && friendReviews?.length > 0 ? (
          <>
            {friendReviews?.map((review: Review) => (
              <AllReview key={review?._id} {...review} />
            ))}
          </>
        ) : (
          <div className="flex justify-center items-center h-full">
            <h2 className="text-gray-500">No reviews found.</h2>
          </div>
        )}
      </div>
    </div>
  );
};

export default FriendReviewComponent;
