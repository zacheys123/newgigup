"use client";
import { Videos } from "@/types/userinterfaces";
import useSWR from "swr";

const fetcher = async (url: string) => {
  const response = await fetch(url, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }
  return await response.json();
};

const defaultVideos = {
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
};

export function useVideos(gigid: string, userid: string) {
  const url = userid ? `/api/videos/getvideos/${userid}` : null;

  const { data, error, isLoading, mutate } = useSWR<Videos>(url, fetcher, {
    revalidateOnFocus: false,
    revalidateOnReconnect: true,
    shouldRetryOnError: true,
    errorRetryCount: 2,
    errorRetryInterval: 5000,
    fallbackData: defaultVideos,
  });

  // Filter videos by gigId if needed
  const filteredVideos = gigid
    ? {
        videos: data?.videos?.filter((video) => video.gigId === gigid) || [],
      }
    : data || defaultVideos;

  return {
    loading: isLoading,
    friendvideos: filteredVideos,
    setRefetch: mutate,
    error,
  };
}
