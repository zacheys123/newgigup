"use client";
// import useStore from "@/app/zustand/useStore";
import { useAllGigs } from "@/hooks/useAllGigs";
import { Review } from "@/types/userinterfaces";
import { Box, Divider } from "@mui/material";
import { Edit } from "lucide-react";
import moment from "moment";
import { useRouter } from "next/navigation";
import React from "react";
import { FaStar } from "react-icons/fa";

const MainReview = ({ gigId, comment, rating, createdAt }: Review) => {
  const { gigs, loading } = useAllGigs();
  //   const [currentgig] = useStore();
  const gig = gigs?.gigs?.find((gig) => gig._id === gigId);
  const router = useRouter();
  return (
    <>
      {!loading || !gig ? (
        <div className="h-fit bg-neutral-700 w-[300px] rounded-md my-2 mx-auto py-2 pb-3">
          <div className="flex items-center gap-3 flex-col px-2">
            <Box className="flex  items-center justify-between w-full">
              <h6 className="rounded-full w-[30px] h-[30px] bg-neutral-500 flex justify-center items-center text-[12px]">
                {gig?.bookedBy?.firstname &&
                  gig?.bookedBy?.firstname.split("")[0].toUpperCase()}

                {gig?.bookedBy?.lastname &&
                  gig?.bookedBy?.lastname.split("")[0].toUpperCase()}
              </h6>

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
            <div className="flex items-center gap-2 flex-col px-2">
              <div
                className="flex gap-2 items-center justify-around w-full"
                onClick={() => {
                  router.push(`/execute/${gig?._id}`);
                }}
              >
                <p className="text-amber-600 text-[12px]">
                  {gig ? gig.title : "No title"}
                </p>{" "}
                <p className="text-neutral-400 text-[11px] flex gap-1">
                  Edit
                  <Edit size="15" />
                </p>
              </div>
              <Divider
                variant="middle"
                sx={{
                  backgroundColor: "gray",
                  height: "1px",
                  width: "100%",

                  top: "-1px",
                }}
              />
              <p className="text-gray-400 text-[12px]">
                posted on:{" "}
                {moment(createdAt).format("MMMM D, YYYY [At] h:mm A")}
              </p>
            </div>
          </div>
        </div>
      ) : (
        <span className="font-bold text-[14px] font-mono animate-ping ">
          ...
        </span>
      )}
    </>
  );
};

export default MainReview;
