import { VideoProps, Videos } from "@/types/userinterfaces";
import { useEffect, useState } from "react";

export const useGetVideos = () => {
  const [Isloading, setLoading] = useState<boolean>(false);
  console.log(Isloading);
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
  const url = `/api/allvideo/getvideos`;

  useEffect(() => {
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
  }, [url]);
  return {
    Isloading,
    friendvideos,
  };
};
