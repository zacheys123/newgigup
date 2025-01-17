"use client";
import { UserProps, Video } from "@/types/userinterfaces";
import { CircularProgress } from "@mui/material";
import { ArrowBigLeftIcon } from "lucide-react";
import moment from "moment";
import { useParams, useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";

const AllVideosPage = () => {
  const { userid } = useParams();
  //   const { userId } = useAuth();
  const [friendvideos, setFriendVideos] = useState<Video[]>();
  const [loading, setLoading] = useState<boolean>(false);
  //   const { user } = useCurrentUser(userId || null);
  const router = useRouter();

  useEffect(() => {
    if (!userid) {
      // Guard: Do not run the effect if `id` is undefined or null
      return;
    }

    let isMounted = true;

    async function getFriend() {
      try {
        setLoading(true);
        const response = await fetch(`/api/user/getuser/${userid}`);

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const friendData: UserProps = await response.json();
        console.log(friendData);
        if (isMounted) {
          setFriendVideos(friendData?.videos || []);
        }
      } catch (error) {
        console.error("Error fetching friend data:", error);
        alert("Error fetching friend data");

        if (isMounted) {
          setFriendVideos([
            {
              _id: "",
              title: "",
              source: "",
              description: "",
              gigId: "",
            },
          ]);
        }
        setLoading(false);

        // Optional: Notify user about the error
      } finally {
        setLoading(false);
      }
    }

    getFriend();
    return () => {
      isMounted = false;
    };
  }, [userid]);
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
  return (
    <div className="overflow-y-auto h-screen w-[90%] mx-auto  shadow-md shadow-orange-300 flex flex-col gap-2 bg-slate-900">
      <div className="h-[20px] bg-neutral-800 w-full flex pl-3 items-center">
        <ArrowBigLeftIcon
          className="cursor-pointer hover:text-amber-500 text-neutral-400 "
          size="28"
          onClick={() => router.back()}
        />
      </div>
      {friendvideos &&
        friendvideos?.map((video: Video) => (
          <div
            key={video._id}
            className=" flex flex-col gap-2 bg-slate-900 h-fit shadow-sm shadow-slate-500 py-2 px-3"
          >
            <h3 className="text-amber-300 m-2">{video.title}</h3>
            <div className="flex-1">
              <video controls className="w-full h-full object-cover">
                <source src={video.source} />
                Your browser does not support the video tag.
              </video>
            </div>
            <p className="text-amber-600 m-2">{video.description}</p>
            <h5 className="text-neutral-400 ">
              posted {moment(Date.now()).fromNow()}
            </h5>
          </div>
        ))}
    </div>
  );
};

export default AllVideosPage;
