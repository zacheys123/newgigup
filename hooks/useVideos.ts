"use client";
import { VideoProps, Videos } from "@/types/userinterfaces";
import { useEffect, useState } from "react";

export function useVideos(gigid: string, userid: string) {
  const [loading, setLoading] = useState<boolean>(false);
  const [refetch, setRefetch] = useState(false);

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
    if (!gigid) return; // Guard against missing params
    if (!userid) return; // Guard against missing params

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
        console.log("my videos", videos);
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
  }, [gigid, url, userid, refetch]);
  return {
    loading,
    friendvideos,
    setRefetch,
  };
}

// "use client";
// import { Videos } from "@/types/userinterfaces";
// import useSWR from "swr";

// const fetcher = async (url: string) => {
//   const response = await fetch(url, {
//     method: "GET",
//     headers: {
//       "Content-Type": "application/json",
//     },
//   });

//   if (!response.ok) {
//     throw new Error(`HTTP error! status: ${response.status}`);
//   }
//   return await response.json();
// };

// const defaultVideos = {
//   videos: [
//     {
//       _id: "",
//       postedBy: "",
//       title: "",
//       description: "",
//       source: "",
//       gigId: "",
//     },
//   ],
// };

// export function useVideos(gigid: string, userid: string) {
//   const url = userid ? `/api/videos/getvideos/${userid}` : null;

//   const { data, error, isLoading, mutate } = useSWR<Videos>(url, fetcher, {
//     revalidateOnFocus: false,
//     revalidateOnReconnect: true,
//     shouldRetryOnError: true,
//     errorRetryCount: 2,
//     errorRetryInterval: 5000,
//     fallbackData: defaultVideos,
//   });

//   // Filter videos by gigId if needed
//   const filteredVideos = gigid
//     ? {
//         videos: data?.videos?.filter((video) => video.gigId === gigid) || [],
//       }
//     : data || defaultVideos;

//   return {
//     loading: isLoading,
//     friendvideos: filteredVideos,
//     setRefetch: mutate,
//     error,
//   };
// }
