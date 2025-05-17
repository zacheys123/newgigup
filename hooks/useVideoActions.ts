"use client";

import { VideoProps, Videos } from "@/types/userinterfaces";
import { useState } from "react";

import { KeyedMutator } from "swr";

export const useVideoActions = () => {
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const deleteVideo = async (
    videoId: string,
    mutate: KeyedMutator<Videos | undefined>
  ) => {
    try {
      setDeletingId(videoId);
      // Optimistically update the UI
      mutate(
        async (currentData) => {
          if (!currentData) return;
          return {
            videos: currentData?.videos.filter(
              (v: VideoProps) => v._id !== videoId
            ),
          };
        },
        { revalidate: false }
      );

      // API call
      const res = await fetch(`/api/videos/deletevideo/${videoId}`, {
        method: "DELETE",
      });

      if (!res.ok) throw new Error("Delete failed");

      // Revalidate cache
      await mutate();
      return true;
    } catch (error) {
      // On error, trigger a revalidation to reset the UI
      await mutate();
      throw error;
    } finally {
      setDeletingId(null);
    }
  };

  return { deleteVideo, deletingId };
};
