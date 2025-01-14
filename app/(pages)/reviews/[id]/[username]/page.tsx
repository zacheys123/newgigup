import ReviewComponent from "@/components/reviews/allreviews/ReviewComponent";
import React from "react";

const AllReviews = ({
  params,
}: {
  params: { id: string; username: string };
}) => {
  const { id } = params;
  console.log("my logged in", id);
  return (
    <div>
      <ReviewComponent />
    </div>
  );
};

export default AllReviews;
