"use client";
// import useStore from "@/app/zustand/useStore";
import { useAllGigs } from "@/hooks/useAllGigs";
import { useCurrentUser } from "@/hooks/useCurrentUser";
import { useGetVideos } from "@/hooks/useGetVideos";
import { GigProps } from "@/types/giginterface";
import { Review } from "@/types/userinterfaces";
import { useAuth } from "@clerk/nextjs";
import { Box, Divider } from "@mui/material";
import { Video } from "lucide-react";
import moment from "moment";
import { useRouter } from "next/navigation";
import React from "react";
import { FaStar } from "react-icons/fa";

const AllReview = ({
  gigId,
  comment,
  rating,
  createdAt,
  postedBy,

  w,
}: Review & { w: string }) => {
  const { userId } = useAuth();
  const { gigs, loading } = useAllGigs();
  const { user } = useCurrentUser(userId || null);
  //   const [currentgig] = useStore();
  const gig = gigs?.find((gig: GigProps) => gig._id === gigId);
  const router = useRouter();
  const { friendvideos } = useGetVideos();

  const video = friendvideos?.videos?.filter((video) => video.gigId === gigId);
  console.log(video);

  return (
    <>
      {!loading || !gig ? (
        <div
          className={
            w
              ? `h-fit bg-neutral-800 w-[300px] rounded-md my-2 mx-auto py-2 pb-3`
              : "h-fit bg-neutral-700 w-[300px] rounded-md my-1 mx-auto py-2 pb-3"
          }
        >
          <div className="flex items-center gap-3 flex-col px-2 w-full">
            <Box className="flex  items-center justify-between w-full">
              <h6 className="rounded-full w-[30px] h-[30px] bg-neutral-500 flex justify-center items-center text-[12px]">
                <span className="text-md font-bold">
                  {" "}
                  {gig?.postedBy?.firstname &&
                    gig?.postedBy?.firstname.split("")[0].toUpperCase()}
                </span>
                <span className="text-[9px] ">
                  {" "}
                  {gig?.postedBy?.lastname &&
                    gig?.postedBy?.lastname.split("")[0].toUpperCase()}
                </span>
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
              <div className="flex justify-around items-center w-full">
                {" "}
                <p className="text-amber-600 text-[12px]">
                  {gig ? gig.title : "No title"}
                </p>{" "}
                {postedBy !== user?._id &&
                  gig?.bookedBy?._id !== user?._id &&
                  video?.length !== 0 && (
                    <div
                      className="flex gap-2 items-center justify-around "
                      onClick={() => {
                        router.push(`/videos/${gigId}/${gig?.bookedBy?._id}`);
                      }}
                    >
                      <p className="bg-neutral-600 py-1 px-2 rounded-md text-yellow-400 text-[12px] whitespace-nowrap flex items-center gap-2">
                        <span className="text-[12px]">{video?.length}</span>
                        watch clips
                        <Video size="15" />
                      </p>
                    </div>
                  )}
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

export default AllReview;
