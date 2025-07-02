"use client";
import { VideoProps } from "@/types/userinterfaces";
import { useEffect, useState } from "react";

export function useAllVideos(userid: string) {
  const [loading, setLoading] = useState<boolean>(false);
  const [refetch, setRefetch] = useState<boolean>(false);

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
        likes: [],
        isPublic: false,
        isPrivate: false,
        thumbnail: "",
      },
    ],
  });
  const url = `/api/videos/getvideos/${userid}`;
  useEffect(() => {
    if (!userid) return; // Guard against missing params

    let isMounted = true;

    async function getFriendVideos() {
      try {
        setLoading(true);
        fetch(`/api/videos/getvideos/${userid}`)
          .then((response) => response.json())
          .then((data) => {
            setFriendVideos(data.videos);
            setLoading(false);
            if (isMounted) {
              setFriendVideos(data.videos);
            }
          })
          .catch((error) => {
            console.error("Error fetching videos:", error);
            setLoading(false);
          });
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
                likes: [],
                isPublic: false,
                isPrivate: false,
                thumbnail: "",
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
  }, [url, userid, refetch]);
  return {
    loading,
    friendvideos,
    setRefetch,
    setFriendVideos,
  };
}
