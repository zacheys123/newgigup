"use client";
import React, { ChangeEvent, useCallback, useState } from "react";
import { motion } from "framer-motion";
import { fileupload } from "@/hooks/fileUpload";
import { toast } from "sonner";

import { BsCameraVideo, BsLightningCharge } from "react-icons/bs";
import { useCurrentUser } from "@/hooks/useCurrentUser";

import { CircularProgress } from "@mui/material";
import { FetchResponse } from "@/types/giginterface";
import { useVideos } from "@/hooks/useVideos";
import useStore from "@/app/zustand/useStore";
import { FiAlertTriangle, FiUpload, FiX } from "react-icons/fi";
import { mutate } from "swr";
import { useVideoActions } from "@/hooks/useVideoActions";

const Videos = () => {
  const [addvideo, setAddVideo] = useState<boolean>(false);
  const { user } = useCurrentUser();
  const [fileUrl, setFileUrl] = useState<string>("");
  const [videoUrl, setVideoUrl] = useState<string | null>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [isloading, setIsLoading] = useState<boolean>(false);
  const [videos, setVideos] = useState({
    title: "",
    description: "",
  });
  const { setRefetchData, setShowVideo, currentgig: gig } = useStore();
  const gigId = gig?._id;
  const baseUrl = `/api/gigs/addvideo/${gigId}`;
  const validGigid = typeof gigId === "string" ? gigId : "";
  const validUserId =
    typeof gig?.bookedBy?._id === "string" ? gig?.bookedBy?._id : "";

  const { friendvideos, setRefetch } = useVideos(validGigid, validUserId);

  const filteredVideos =
    friendvideos?.videos?.filter((video) => video.gigId === gig._id) || [];

  const { deleteVideo, deletingId } = useVideoActions();

  const handleDeleteVideo = async (videoId: string) => {
    try {
      await deleteVideo(videoId, mutate);
      // No need to manually refresh - SWR handles it
      toast.success("Video deleted successfully");
    } catch (error) {
      toast.error("Failed to delete video");
      console.error("Failed to delete video:", error);
    }
  };

  const handleInputChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setVideos((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handlePost = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const dataInfo = {
      media: videoUrl,
      title: videos.title,
      description: videos.description,
      postedBy: gig?.bookedBy?._id,
    };

    if (videoUrl) {
      try {
        setIsLoading(true);
        const res = await fetch(baseUrl, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(dataInfo),
        });

        const data: FetchResponse = await res.json();
        setRefetch((prev) => !prev);
        toast.success(data?.message);
        setVideos({ title: "", description: "" });
        setVideoUrl("");
        setFileUrl("");
        setIsLoading(false);
      } catch (error) {
        setIsLoading(false);
        console.log(error);
      }
    } else {
      alert("Please provide all required fields");
    }
  };

  const handleFileChange = useCallback(
    (event: ChangeEvent<HTMLInputElement>) => {
      const dep = "video";
      const allowedTypes = ["video/mp4", "video/webm", "video/ogg"];
      fileupload(
        event,
        (file: string) => {
          if (file) {
            setVideoUrl(file);
          }
        },
        toast,
        allowedTypes,
        fileUrl,
        (file: string | undefined) => {
          if (file) {
            setFileUrl(file);
          }
        },
        setLoading,
        dep,
        user?.user,
        setRefetchData
      );
    },
    []
  );

  return (
    <motion.div
      className="bg-gradient-to-br from-neutral-900 to-neutral-800 rounded-xl shadow-lg border border-neutral-700 overflow-hidden
      h-[80vh] sm:h-[70vh] md:h-[65vh] lg:h-[60vh] xl:h-[55vh] 
      w-[95vw] sm:w-[90vw] md:w-[85vw] lg:w-[80vw] xl:w-[75vw] max-w-[800px] mx-auto"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      {!addvideo ? (
        <div className="h-full flex flex-col p-3 sm:p-4">
          <div className="flex justify-between items-center mb-3 sm:mb-4">
            <h3 className="text-lg sm:text-xl font-bold text-amber-500 flex items-center gap-2">
              <BsCameraVideo className="text-base sm:text-lg" /> Video Showcase
            </h3>
            <button
              onClick={() => setShowVideo(false)}
              className="text-neutral-400 hover:text-white transition-colors text-lg sm:text-xl"
            >
              &times;
            </button>
          </div>

          <div className="flex-1 overflow-y-auto pr-2">
            <div className="bg-neutral-800 bg-opacity-50 p-3 sm:p-4 rounded-lg mb-3 sm:mb-4 border border-neutral-700">
              <h4 className="text-amber-400 text-base sm:text-lg font-semibold mb-2 sm:mb-3">
                Why Showcase Your Work?
              </h4>

              <ul className="space-y-2 sm:space-y-3 text-sm sm:text-base">
                <li className="flex items-start gap-2">
                  <span className="text-amber-500 mt-0.5 sm:mt-1">
                    <BsLightningCharge className="text-sm sm:text-base" />
                  </span>
                  <span className="text-neutral-300">
                    <strong>Boost Your Credibility:</strong> Videos provide
                    undeniable proof of your skills
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-amber-500 mt-0.5 sm:mt-1">
                    <BsLightningCharge className="text-sm sm:text-base" />
                  </span>
                  <span className="text-neutral-300">
                    <strong>Attract Better Clients:</strong> High-quality videos
                    attract premium clients
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-amber-500 mt-0.5 sm:mt-1">
                    <BsLightningCharge className="text-sm sm:text-base" />
                  </span>
                  <span className="text-neutral-300">
                    <strong>Stand Out:</strong>
                    {`Most freelancers don't showcase
                    their work`}
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-amber-500 mt-0.5 sm:mt-1">
                    <BsLightningCharge className="text-sm sm:text-base" />
                  </span>
                  <span className="text-neutral-300">
                    <strong>Build Trust Faster:</strong> Clients book with
                    confidence
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-amber-500 mt-0.5 sm:mt-1">
                    <BsLightningCharge className="text-sm sm:text-base" />
                  </span>
                  <span className="text-neutral-300">
                    <strong>Create Lasting Impressions:</strong> Stay
                    top-of-mind
                  </span>
                </li>
              </ul>
            </div>

            <div className="bg-neutral-800 bg-opacity-50 p-3 sm:p-4 rounded-lg border border-neutral-700">
              <h4 className="text-amber-400 text-base sm:text-lg font-semibold mb-2">
                Pro Tips:
              </h4>
              <p className="text-neutral-400 text-sm sm:text-base mb-2 sm:mb-3">
                Showcase your best moments - short clips (30-60 seconds) work
                best.
              </p>
              <p className="text-neutral-400 text-sm sm:text-base">
                Add context with your titles - explain what makes each clip
                special.
              </p>
            </div>
          </div>

          <button
            onClick={() => setAddVideo(true)}
            className="mb-10 sm:mt-4 w-full bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-500 hover:to-amber-600 text-white font-bold py-2 sm:py-3 px-4 rounded-lg shadow-md transition-all duration-300 transform hover:scale-[1.02] flex items-center justify-center gap-2 text-sm sm:text-base"
          >
            <BsCameraVideo className="text-sm sm:text-base" /> Start Showcasing
          </button>
        </div>
      ) : (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.3 }}
          className="h-full max-h-[90vh] bg-gray-900/90 backdrop-blur-sm rounded-xl border border-gray-700/50 p-4 flex flex-col overflow-y-auto"
          onClick={(ev) => ev.stopPropagation()}
        >
          {/* Header with close button */}
          <div className="flex justify-between items-center mb-4 sticky top-0 bg-gray-900/80 py-2 z-10">
            <div>
              <h3 className="text-xl font-semibold text-white">
                Add Portfolio Content
              </h3>
              <p className="text-xs text-gray-400 mt-1">
                Showcase your best work to clients
              </p>
            </div>
            <button
              onClick={() => setShowVideo(false)}
              className="text-gray-400 hover:text-white transition-colors p-1 rounded-full bg-gray-800/50 hover:bg-gray-700/50"
            >
              <FiX size={24} />
            </button>
          </div>

          <form className="flex-1 flex flex-col gap-5" onSubmit={handlePost}>
            {/* Form Fields */}
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2 flex items-center">
                  Video Title
                  <span className="text-rose-500 ml-1">*</span>
                </label>
                <input
                  id="title"
                  autoComplete="off"
                  type="text"
                  className="w-full bg-gray-800 border border-gray-700 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500/50 text-white placeholder-gray-500 rounded-lg px-4 py-3 text-sm transition-all"
                  placeholder="e.g. 'Wedding Highlights - Summer 2023'"
                  required
                  name="title"
                  value={videos?.title}
                  onChange={handleInputChange}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2 flex items-center">
                  Description
                  <span className="text-rose-500 ml-1">*</span>
                </label>
                <textarea
                  id="description"
                  name="description"
                  value={videos?.description}
                  onChange={handleInputChange}
                  placeholder="Describe the content, equipment used, or special moments captured..."
                  required
                  className="w-full bg-gray-800 border border-gray-700 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500/50 text-white placeholder-gray-500 rounded-lg px-4 py-3 text-sm transition-all min-h-[120px]"
                />
              </div>
            </div>

            {/* Video Upload Section */}
            {filteredVideos && filteredVideos?.length < 4 ? (
              <>
                {!videoUrl ? (
                  <div className="flex-1 flex flex-col">
                    {/* Upload Area */}
                    <div className="flex-1 flex flex-col items-center justify-center">
                      <label
                        htmlFor="postvideo"
                        className="w-full max-w-md mx-auto flex flex-col items-center justify-center border-2 border-dashed border-gray-700 rounded-xl p-6 text-center transition-all hover:border-indigo-500/50 hover:bg-gray-800/30 cursor-pointer"
                      >
                        <div className="p-3 bg-indigo-500/10 rounded-full mb-3">
                          <FiUpload className="text-indigo-400 text-2xl" />
                        </div>
                        <span className="text-gray-200 font-medium text-lg mb-1">
                          Upload Your Video
                        </span>
                        <span className="text-sm text-gray-500">
                          MP4, MOV or AVI (Max 100MB)
                        </span>
                        {loading && (
                          <div className="mt-4 flex items-center gap-2 text-indigo-400">
                            <CircularProgress
                              size={18}
                              className="text-indigo-400"
                            />
                            <span className="text-xs">Processing...</span>
                          </div>
                        )}
                      </label>
                      <input
                        id="postvideo"
                        className="hidden"
                        type="file"
                        accept="video/*"
                        onChange={handleFileChange}
                        disabled={loading}
                      />
                    </div>

                    {/* Existing Videos */}
                    {filteredVideos?.length > 0 && (
                      <div className="mt-6">
                        <div className="flex items-center justify-between mb-3">
                          <h4 className="text-gray-300 text-sm font-semibold">
                            Your Portfolio Videos ({filteredVideos.length}/4)
                          </h4>
                          <span className="text-xs text-gray-500">
                            Swipe to view →
                          </span>
                        </div>

                        <div className="relative">
                          <div className="overflow-x-auto pb-4 -mx-4 px-4">
                            <div
                              className="flex gap-4"
                              style={{
                                minWidth: `${filteredVideos.length * 176}px`,
                              }}
                            >
                              {filteredVideos.map((video) => (
                                <div
                                  key={video._id}
                                  className="relative w-44 flex-shrink-0 rounded-xl overflow-hidden bg-gray-800 border border-gray-700/50 hover:border-indigo-500/50 transition-all group"
                                >
                                  <video
                                    src={video.source}
                                    className="w-full h-full aspect-video object-cover"
                                    muted
                                    playsInline
                                  />
                                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-3">
                                    <p className="text-white text-xs font-medium truncate w-full">
                                      {video.title || "Untitled"}
                                    </p>
                                  </div>
                                  <button
                                    onClick={(e) => {
                                      e.preventDefault();
                                      handleDeleteVideo(video._id);
                                    }}
                                    disabled={deletingId === video._id}
                                    className="absolute top-2 right-2 z-10 text-white bg-rose-600/90 hover:bg-rose-500 rounded-full p-1.5 transition-all"
                                  >
                                    {deletingId === video._id ? (
                                      <CircularProgress
                                        size={12}
                                        className="text-white"
                                      />
                                    ) : (
                                      <FiX size={12} />
                                    )}
                                  </button>
                                </div>
                              ))}
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="flex-1 flex flex-col">
                    {/* Video Preview */}
                    <div className="relative aspect-video w-full bg-black rounded-xl overflow-hidden border border-gray-700/50">
                      <video
                        className="w-full h-full object-contain"
                        src={fileUrl}
                        autoPlay
                        loop
                        muted
                        controls
                      />
                      <button
                        type="button"
                        className="absolute top-3 right-3 bg-gray-900/80 text-white p-2 rounded-full hover:bg-gray-800 transition-all"
                        onClick={() => setVideoUrl(null)}
                      >
                        <FiX size={18} />
                      </button>
                    </div>

                    {/* Description Preview */}
                    {videos.description.length > 0 && (
                      <div className="mt-4 p-4 bg-gray-800/50 rounded-lg border border-gray-700/50">
                        <h4 className="text-gray-400 text-xs font-medium mb-2">
                          DESCRIPTION PREVIEW
                        </h4>
                        <p className="text-gray-200 text-sm">
                          {videos.description}
                        </p>
                      </div>
                    )}

                    {/* Submit Button */}
                    <div className="mt-6 sticky bottom-0 bg-gray-900/80 py-3 -mx-4 px-4">
                      <button
                        disabled={isloading}
                        type="submit"
                        className="w-full bg-gradient-to-r from-indigo-600 to-indigo-700 hover:from-indigo-500 hover:to-indigo-600 text-white font-medium py-3 px-6 rounded-lg shadow-lg transition-all flex items-center justify-center gap-2"
                      >
                        {isloading ? (
                          <>
                            <CircularProgress
                              size={16}
                              className="text-white"
                            />
                            <span>Publishing...</span>
                          </>
                        ) : (
                          <>
                            <FiUpload className="w-4 h-4" />
                            <span>Publish Video</span>
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                )}
              </>
            ) : (
              <div className="flex-1 flex flex-col items-center justify-center p-6 text-center">
                <div className="bg-gray-800/50 border border-gray-700/50 rounded-xl p-6 max-w-md">
                  <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-amber-500/10 mb-3">
                    <FiAlertTriangle className="h-5 w-5 text-amber-400" />
                  </div>
                  <h3 className="text-lg font-medium text-white mb-2">
                    Portfolio Limit Reached
                  </h3>
                  <p className="text-gray-400 text-sm mb-4">
                    {`  You've reached the maximum of 4 portfolio videos. Remove
                    older videos to add new content.`}
                  </p>
                  <button
                    onClick={() => {
                      setRefetch((prev) => !prev);
                      setShowVideo(false);
                      setAddVideo(false);
                    }}
                    className="w-full bg-gray-700 hover:bg-gray-600 text-white py-2.5 px-4 rounded-lg transition-colors text-sm"
                  >
                    Return to Dashboard
                  </button>
                </div>
              </div>
            )}
          </form>
        </motion.div>
      )}
    </motion.div>
  );
};

export default Videos;
