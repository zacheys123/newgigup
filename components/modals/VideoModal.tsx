import useStore from "@/app/zustand/useStore";
import { UserProps, VideoProps } from "@/types/userinterfaces";
import { ArrowLeftIcon } from "@heroicons/react/24/solid";
import { Box } from "@mui/material";
import moment from "moment";
import React from "react";

interface VideoPropsData {
  videodata: VideoProps[];
  user: UserProps;
  gigId: string;
}
const VideoModal = ({ videodata, user, gigId }: VideoPropsData) => {
  const { setVideoModalOpen, setReviewModalOpen } = useStore();
  const myvideos = videodata?.filter((video) => video.gigId == gigId);
  const video = myvideos?.[0];
  console.log(video);
  return (
    <div
      className={
        myvideos?.length === 0
          ? "bg-neutral-900 w-full max-w-md rounded-t-lg p-6 relative slide-up max-h-[140px] rounded-tl-[50px] rounded-tr-[50px] pt-12 overflow-y-auto "
          : "bg-neutral-900 w-full max-w-md rounded-t-lg p-6 relative slide-up max-h-[400px] rounded-tl-[50px] rounded-tr-[50px] pt-12 "
      }
    >
      {" "}
      <ArrowLeftIcon
        className="absolute top-5 left-12 text-gray-300 text-[20px] h-5 w-5}"
        onClick={(ev) => {
          ev.stopPropagation();
          setReviewModalOpen(true);
          setVideoModalOpen(false);
        }}
      />
      <button
        onClick={() => setVideoModalOpen(false)}
        className="absolute top-2 right-10 text-gray-300 text-[20px]"
      >
        &times;
      </button>
      {myvideos?.length === 0 ? (
        ""
      ) : (
        <div className=" w-full flex justify-center">
          <h6 className="fixed text-center text-md text-neutral-300 -mt-6 capitalize font-bold z-50">{`${user?.firstname}'s Review Videos`}</h6>
        </div>
      )}
      <div className="h-full overflow-y-auto ">
        {myvideos?.length === 0 ? (
          <div className="flex justify-center h-full text-neutral-400 text-xl">
            No videos found
          </div>
        ) : (
          myvideos.map((video) => (
            <div
              key={video._id}
              className="w-full flex justify-center items-center flex-col my-4"
            >
              <Box className="w-[200px] h-[150px] my-2">
                <video
                  controls
                  className="w-full h-full object-cover "
                  src={video.source}
                />
                <div className="flex gap-2 ">
                  <div className="text-gray-500 text-sm">Uploaded At:</div>
                  <div className="text-gray-400 text-[10px]  tracking-wide">
                    {moment(video?.createdAt).format(
                      "MMMM D, YYYY [At] h:mm A"
                    )}
                  </div>
                </div>{" "}
              </Box>
              {/* <div className="flex flex-col ml-4">
            <span className="text-gray-500 text-sm">{video.title}</span>
            <span className="text-gray-400 text-sm">{video.description}</span>
          </div>
          <div className="flex gap-2 mt-2">
            <div className="text-gray-500 text-sm">Uploaded By:</div>
            <div className="text-gray-400 text-sm">{user.firstname} {user.lastname}</div>
          </div>
          <div className="flex gap-2 mt-2">
            <div className="text-gray-500 text-sm">Duration:</div>
            <div className="text-gray-400 text-sm">{video.duration} seconds</div>
          </div>
          <div className="flex gap-2 mt-2">
            <div className="text-gray-500 text-sm">Likes:</div>
            <div className="text-gray-400 text-sm">{video.likes}</div>
          </div>
          <div className="flex gap-2 mt-2">
            <div className="text-gray-500 text-sm">Comments:</div>
            <div className="text-gray-400 text-sm">{video.comments}</div>
          </div> */}
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default VideoModal;
