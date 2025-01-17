"use client";
import { UserProps, Video } from "@/types/userinterfaces";
import { CircularProgress } from "@mui/material";
import { useParams } from "next/navigation";
import React, { useEffect, useState } from "react";

const VideosPage = () => {
  const { gigid, userid } = useParams();
  //   const { userId } = useAuth();
  const [friendvideos, setFriendVideos] = useState<Video[]>();
  const [loading, setLoading] = useState<boolean>(false);
  //   const { user } = useCurrentUser(userId || null);
  //   const router = useRouter();
  console.log(gigid, userid);
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
    <div className="overflow-y-auto h-[95%] w-[90%] mx-auto  shadow-md shadow-orange-300 flex flex-col gap-2">
      {friendvideos &&
        friendvideos
          ?.filter(
            (video: {
              title: string;
              source: string;
              description: string;
              gigId: string;
            }) => {
              return video.gigId === gigid;
            }
          )
          ?.map(
            (video: {
              title: string;
              source: string;
              description: string;
              gigId: string;
            }) => (
              <div key={video.gigId} className="flex flex-col gap-2">
                <h3>{video.title}</h3>
                <video controls width="100%">
                  <source src={video.source} type="video/mp4" />
                </video>
                <p>{video.description}</p>
              </div>
            )
          )}
    </div>
  );
};

export default VideosPage;
