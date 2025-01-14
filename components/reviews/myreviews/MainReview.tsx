// import useStore from "@/app/zustand/useStore";
import { useAllGigs } from "@/hooks/useAllGigs";
import { Review } from "@/types/userinterfaces";
import { Box } from "@mui/material";
import Image from "next/image";
import React from "react";
import { FaStar } from "react-icons/fa";

const MainReview = ({ gigId, comment, rating }: Review) => {
  const { gigs, loading } = useAllGigs();
  //   const [currentgig] = useStore();
  const gig = gigs?.gigs?.find((gig) => gig._id === gigId);

  return (
    <>
      {!loading || !gig ? (
        <>
          {" "}
          <div className="h-fit bg-neutral-700 w-[300px] rounded-md my-1 mx-auto py-1 pb-3">
            <div className="flex items-center gap-3 flex-col px-2">
              <Box className="flex  items-center justify-between w-full">
                {gig?.postedBy?.picture && (
                  <Image
                    src={gig.postedBy.picture}
                    alt="Profile Pic"
                    width={27}
                    height={27}
                    className="rounded-full h-[27px] w-[27px]"
                  />
                )}
                <div className="flex gap-1 my-3 items-center ">
                  <div className="flex">
                    {[...Array(5)].map((star, index) => {
                      const currentRating = index + 1;
                      return (
                        <label key={index}>
                          <input
                            type="radio"
                            name="rating"
                            value={rating}
                            hidden
                          />
                          <FaStar
                            className="star text-neutral-200"
                            color={currentRating <= rating ? "#FFBF00" : "gray"}
                            size={"22px"}
                          />
                        </label>
                      );
                    })}
                  </div>
                </div>
              </Box>
              <div>
                <p className="text-gray-300 text-[12px]">{comment}</p>
              </div>{" "}
              <div>
                <p className="text-amber-600 text-[12px]">
                  {gig ? gig.title : "No title"}
                </p>
              </div>
            </div>
          </div>
        </>
      ) : (
        <span className="font-bold text-[14px] font-mono animate-ping ">
          ...
        </span>
      )}
    </>
  );
};

export default MainReview;
