"use client";
import { useVideos } from "@/hooks/useVideos";
import { VideoProps } from "@/types/userinterfaces";
import { CircularProgress } from "@mui/material";
import { ArrowBigLeftIcon } from "lucide-react";

// import moment from "moment";
import { useParams, useRouter } from "next/navigation";
import React, { useMemo } from "react";

const VideosPage = () => {
  const { gigid, userid } = useParams();

  const validGigid = typeof gigid === "string" ? gigid : ""; // Default to empty string if undefined

  const { loading, friendvideos } = useVideos(validGigid);

  const router = useRouter();

  const filteredVideos = useMemo(() => {
    return friendvideos?.videos?.filter((video: VideoProps) => {
      console.log(gigid);
      return video.gigId === gigid && video?.postedBy === userid;
    });
  }, [friendvideos?.videos, gigid, userid]);

  console.log(filteredVideos);
  if (loading) {
    return (
      <div className="h-screen w-full flex justify-center items-center">
        <div className="flex flex-col items-center gap-2 ">
          <div className="gigtitle text-white flex flex-col gap-2 items-center ">
            <span className="text-neutral-500 font-sans">
              Loading videos...
            </span>
            <CircularProgress
              sx={{ color: "inherit" }}
              size={40}
              className="text-white bg-gradient-to-r from-red-400 to-yellow-400 via-orange-900 rounded-full"
            />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="overflow-y-auto h-screen w-[90%] mx-auto shadow-md shadow-orange-300 flex flex-col gap-2 bg-slate-900">
      <div className="h-[40px] bg-inherit w-full flex pl-3 items-center">
        <ArrowBigLeftIcon
          className="cursor-pointer hover:text-amber-500 text-neutral-400"
          size={28}
          onClick={() => router.back()}
        />
      </div>
      {filteredVideos && filteredVideos.length > 0 ? (
        filteredVideos.map((video: VideoProps) => (
          <div
            key={video._id}
            className="flex flex-col gap-2 bg-slate-900 h-[360px] shadow-sm shadow-slate-500 py-2 px-3"
          >
            <h3 className="text-amber-300 m-2">{video.title}</h3>
            <div className="flex-1">
              <video controls className="w-full h-full object-cover">
                <source src={video.source} />
                Your browser does not support the video tag.
              </video>
            </div>
            <p className="text-amber-600 m-2">{video.description}</p>
            <h5 className="text-neutral-400">
              {/* posted {moment(video.createdAt).fromNow()} */}
            </h5>
          </div>
        ))
      ) : (
        <p className="text-center text-neutral-400 mt-10">
          No videos available for this gig.
        </p>
      )}
    </div>
  );
};

export default VideosPage;
