"use client";
import { VideoProps } from "@/types/userinterfaces";
import { CircularProgress } from "@mui/material";
import { ArrowBigLeftIcon, Trash2Icon } from "lucide-react";
import moment from "moment";
import { useParams, useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";

const AllVideosPage = () => {
  const { userid } = useParams();
  //   const { userId } = useAuth();
  const [friendvideos, setFriendVideos] = useState<VideoProps[]>();
  const [loading, setLoading] = useState<boolean>(false);
  const [deleteloading, setDeleteLoading] = useState<boolean>(false);
  const [refetch, setRefetch] = useState<boolean>(false);
  //   const { user } = useCurrentUser(userId || null);
  const router = useRouter();

  useEffect(() => {
    if (!userid) {
      // Guard: Do not run the effect if `id` is undefined or null
      return;
    }
    setLoading(true);
    fetch(`/api/videos/getvideos/${userid}`)
      .then((response) => response.json())
      .then((data) => {
        setFriendVideos(data.videos);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching videos:", error);
        setLoading(false);
      });
  }, [refetch, userid]);

  const deleteVideo = async (id: string) => {
    setLoading(true);
    try {
      setDeleteLoading(true);
      await fetch(`/api/videos/deletevideo/${id}`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
      });
      setRefetch((prev) => !prev);
      setFriendVideos(friendvideos?.filter((v: VideoProps) => v._id !== id));
      setDeleteLoading(false);
    } catch (error) {
      console.error("Error deleting video:", error);
      setDeleteLoading(false);
    }
  };
  if (!loading) {
    <div className="h-[92%] w-full flex justify-center items-center">
      <div className="flex flex-col items-center gap-2">
        {" "}
        <div className="gigtitle text-white flex flex-col gap-2 items-center">
          <span className="text-neutral-500 font-sans"> loading videos...</span>
          <CircularProgress
            sx={{ color: "inherit" }}
            size="10px"
            className="text-white  bg-gradient-to-r
          from-red-400 to-yellow-400 via-orange-900 rounded-ss-xl rounded-es-full rounded-r-full
          "
          />
        </div>
      </div>
    </div>;
  }
  if (!deleteloading) {
    <div className="h-[92%] w-full flex justify-center items-center bg-gray-200 relative">
      <div className="flex flex-col items-center gap-2 absolute">
        {" "}
        <div className="gigtitle text-white flex flex-col gap-2 items-center">
          <span className="text-neutral-500 font-sans">
            {" "}
            deleting videos...
          </span>
          <CircularProgress
            sx={{ color: "inherit" }}
            size="10px"
            className="text-white  bg-gradient-to-r 
          from-red-400 to-yellow-400 via-orange-900 rounded-ss-xl rounded-es-full rounded-r-full
          "
          />
        </div>
      </div>
    </div>;
  }
  return (
    <div className="overflow-y-auto h-screen w-full mx-auto  shadow-md shadow-orange-300 flex flex-col gap-2 bg-black">
      <div className="h-[40px] bg-inherit w-full flex pl-3 items-center justify-around my-3">
        <ArrowBigLeftIcon
          className="cursor-pointer hover:text-amber-500 text-neutral-400"
          size={28}
          onClick={() => router.back()}
        />
        <h1 className="text-white text-2xl font-bold m-2">All My Videos</h1>
      </div>
      {!friendvideos && (
        <div className=" flex flex-col  gap-2 bg-zinc-900 h-fit shadow-sm shadow-slate-500 py-2 px-3">
          <p className="text-center text-neutral-400 mt-10">
            No videos available for this user.
          </p>
        </div>
      )}
      {friendvideos &&
        friendvideos?.map((video: VideoProps) => (
          <div
            key={video._id}
            className=" flex flex-col  gap-2 bg-zinc-900 h-fit shadow-sm shadow-slate-500 py-2 px-3"
          >
            <div className="flex items-center justify-around p-2">
              <h3 className=" m-2 flex items-center px-2 ">
                <span className="text-amber-400  mx-1"> Gig Title: </span>
                <span className="text-purple-200  mx-1"> {video.title}</span>
              </h3>
              {typeof video.postedBy !== "string" &&
                video.postedBy?._id &&
                video.postedBy &&
                video.postedBy?._id === userid && (
                  <Trash2Icon
                    className="cursor-pointer text-red-500 "
                    size={24}
                    onClick={() => deleteVideo(video?._id)}
                  />
                )}
            </div>
            <div className="flex-1">
              <video controls className="w-full h-full object-cover">
                <source src={video.source} />
                Your browser does not support the video tag.
              </video>
            </div>
            <p className="text-amber-600 m-2">{video.description}</p>
            <h5 className="text-neutral-400 last:mb-4 ">
              posted{" "}
              {moment(video.createdAt).format(
                "              MMMM Do YYYY, h:mm:ss a"
              )}
              {/* posted {moment(video.createdAt).fromNow()} */}
            </h5>
          </div>
        ))}
    </div>
  );
};

export default AllVideosPage;
