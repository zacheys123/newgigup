import useStore from "@/app/zustand/useStore";
import { Review, UserProps } from "@/types/userinterfaces";
import { VideoCameraIcon } from "@heroicons/react/24/solid";
import { Box } from "@mui/material";
import React from "react";

interface ReviewProps {
  reviewdata: Review[];
  user: UserProps;
  postedBy: UserProps;
}
const ReviewModal = ({ reviewdata, user, postedBy }: ReviewProps) => {
  const { setReviewModalOpen } = useStore();
  return (
    <div className="bg-neutral-900 w-full max-w-md rounded-t-lg p-6 relative slide-up min-h-[340px] rounded-tl-[50px] rounded-tr-[50px] pt-12 ">
      <button
        onClick={() => setReviewModalOpen(false)}
        className="absolute top-2 right-7 text-gray-300  text-[20px]"
      >
        &times;
      </button>
      <div className="overflow-y-scroll h-full">
        {reviewdata
          ?.filter((u) => u?.postedTo === user?._id)
          .map((review) => {
            return (
              <div
                key={review._id}
                className="flex items-center space-x-4   p-2"
              >
                <div className="flex flex-col">
                  <div>
                    <h3 className="text-sm font-medium text-neutral-400 ">
                      <span className="text-amber-600 mr-1">
                        {" "}
                        All Comments and rating for
                      </span>
                      {user?.firstname} by: {postedBy?.firstname}{" "}
                      {postedBy?.lastname}{" "}
                    </h3>
                    <Box className="shadow-sm shadow-neutral-400 my-3 p-3 rounded-xl">
                      <span className="flex gap-1 text-[11px] text-neutral-400 items-center ">
                        {review?.rating} <StarRating rating={review?.rating} />
                      </span>

                      <p className="text-sm text-gray-300">{review?.comment}</p>

                      <div className="w-full flex justify-center  mt-6 ">
                        <div className="text-neutral-300 bg-amber-700 px-3 py-2 rounded-xl title flex">
                          {" "}
                          View Video Clips{" "}
                          <VideoCameraIcon className="h-5 w-5 text-white ml-2" />
                        </div>
                      </div>
                    </Box>
                  </div>
                </div>
              </div>
            );
          })}
      </div>
    </div>
  );
};

export default ReviewModal;
const StarRating: React.FC<{ rating: number }> = ({ rating }) => {
  const stars = [];
  for (let i = 1; i <= 5; i++) {
    stars.push(
      <span
        key={i}
        className={
          i <= rating
            ? "text-yellow-400 text-[13px]"
            : "text-gray-300 text-[13px]"
        }
      >
        ★
      </span>
    );
  }
  return <div className="flex">{stars}</div>;
};
