import ReviewComponent from "@/components/reviews/ReviewComponent";
import React from "react";

const AllReviews = ({
  params,
}: {
  params: { id: string; username: string };
}) => {
  const { id } = params;
  console.log("my logged in", id);
  return (
    <div className=" w-[100vw] h-[86%] bg-slate-900 overflow-y-auto">
      <ReviewComponent />
    </div>
  );
};

export default AllReviews;
