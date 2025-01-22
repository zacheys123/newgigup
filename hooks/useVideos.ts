"use client";
import { VideoProps, Videos } from "@/types/userinterfaces";
import { useEffect, useState } from "react";

export function useVideos(gigid: string) {
  const [loading, setLoading] = useState<boolean>(false);
  const [friendvideos, setFriendVideos] = useState<{
    videos: VideoProps[];
  } | null>({
    videos: [
      {
        _id: "",
        postedBy: "",
        title: "",
        description: "",
        source: "",
        gigId: "",
      },
    ],
  });
  const url = `/api/videos/getvideos`;

  useEffect(() => {
    if (!gigid) return; // Guard against missing params

    let isMounted = true;

    async function getFriendVideos() {
      try {
        setLoading(true);
        const response = await fetch(url, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const videos: Videos = await response.json();
        console.log(videos);
        if (isMounted) {
          setFriendVideos(videos);
        }
      } catch (error) {
        console.error("Error fetching friend videos:", error);
        if (isMounted) {
          setFriendVideos({
            videos: [
              {
                _id: "",
                postedBy: "",
                title: "",
                description: "",
                source: "",
                gigId: "",
              },
            ],
          });
        }
      } finally {
        if (isMounted) setLoading(false);
      }
    }

    getFriendVideos();
    return () => {
      isMounted = false;
    };
  }, [gigid, url]);
  return {
    loading,
    friendvideos,
  };
}
