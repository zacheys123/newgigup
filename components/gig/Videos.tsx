"use client";
import React, { ChangeEvent, useCallback, useMemo, useState } from "react";
import { motion } from "framer-motion";
import { fileupload } from "@/hooks/fileUpload";
import { toast } from "sonner";
import { Input } from "../ui/input";
import { BsCameraVideo, BsLightningCharge } from "react-icons/bs";
import { useCurrentUser } from "@/hooks/useCurrentUser";
import { Button } from "../ui/button";
import { CircularProgress } from "@mui/material";
import { FetchResponse } from "@/types/giginterface";
import { VideoProps } from "@/types/userinterfaces";
import { useVideos } from "@/hooks/useVideos";
import useStore from "@/app/zustand/useStore";
import { Textarea } from "../ui/textarea";
import { FiUpload, FiX } from "react-icons/fi";
import { mutate } from "swr";

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
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const handleDeleteVideo = async (videoId: string) => {
    try {
      setDeletingId(videoId);
      const response = await fetch(`/api/videos/deletevideo/${videoId}`, {
        method: "DELETE",
      });

      if (!response.ok) throw new Error("Failed to delete video");

      // Optimistic update
      setRefetch((prev) => !prev);
      mutate(`/api/videos/getvideos/${validUserId}`);
      toast.success("Video deleted successfully");
    } catch (error) {
      console.error("Error deleting video:", error);
      toast.error("Failed to delete video");
    } finally {
      setDeletingId(null);
    }
  };

  const filteredVideos = useMemo(() => {
    return friendvideos?.videos?.filter((video: VideoProps) => {
      return video?.gigId === gig?._id;
    });
  }, [friendvideos?.videos, gig?._id]);
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
            className="mt-3 sm:mt-4 w-full bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-500 hover:to-amber-600 text-white font-bold py-2 sm:py-3 px-4 rounded-lg shadow-md transition-all duration-300 transform hover:scale-[1.02] flex items-center justify-center gap-2 text-sm sm:text-base"
          >
            <BsCameraVideo className="text-sm sm:text-base" /> Start Showcasing
          </button>
        </div>
      ) : (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.3 }}
          className="h-full bg-neutral-800 bg-opacity-70 rounded-lg p-3 sm:p-4 flex flex-col"
          onClick={(ev) => ev.stopPropagation()}
        >
          <div className="flex justify-between items-center mb-3 sm:mb-4">
            <h3 className="text-base sm:text-lg font-semibold text-amber-400">
              Add New Video
            </h3>
            <button
              onClick={() => setShowVideo(false)}
              className="text-neutral-400 hover:text-white transition-colors text-lg sm:text-xl"
            >
              &times;
            </button>
          </div>

          <form className="flex-1 flex flex-col" onSubmit={handlePost}>
            <div className="space-y-3 sm:space-y-4">
              <div>
                <label
                  htmlFor="title"
                  className="block text-xs sm:text-sm font-medium text-neutral-300 mb-1"
                >
                  Video Title*
                </label>
                <Input
                  id="title"
                  autoComplete="off"
                  type="text"
                  className="w-[97%] mx-auto bg-neutral-700 border border-neutral-600 focus:border-amber-500 focus:ring-amber-500 text-white placeholder-neutral-400 text-sm sm:text-base"
                  placeholder="Catchy title that describes your work..."
                  required
                  name="title"
                  value={videos?.title}
                  onChange={handleInputChange}
                />
              </div>

              <div>
                <label
                  htmlFor="description"
                  className="block text-xs sm:text-sm font-medium text-neutral-300 mb-1"
                >
                  Description*
                </label>
                <Textarea
                  id="description"
                  name="description"
                  value={videos?.description}
                  onChange={handleInputChange}
                  placeholder="What makes this clip special?..."
                  required
                  cols={10}
                  rows={4}
                  className=" bg-neutral-700 border border-neutral-600 focus:border-amber-500 focus:ring-amber-500 text-white placeholder-neutral-400 text-sm sm:text-base mb-12 w-[97%] mx-auto"
                ></Textarea>
              </div>
            </div>

            {filteredVideos && filteredVideos?.length < 4 ? (
              <>
                {!videoUrl ? (
                  <div className=" w-[80%]  mx-auto flex flex-col items-center justify-center ">
                    <div className="w-full mx-auto flex flex-col items-center justify-center border-2 border-dashed border-neutral-600 rounded-xl p-8 text-center transition-all hover:border-amber-500/50 hover:bg-neutral-700/20">
                      <label
                        htmlFor="postvideo"
                        className="cursor-pointer flex flex-col items-center w-full "
                      >
                        <div className="p-4 bg-amber-500/10 rounded-full mb-3">
                          <FiUpload className="text-amber-400 text-2xl" />
                        </div>
                        <span className="text-neutral-300 font-medium text-lg mb-1">
                          Upload Your Work Video
                        </span>
                        <span className="text-sm text-neutral-500 max-w-md">
                          Drag & drop your video file here or click to browse
                          (MP4, MOV, or AVI - Max 100MB)
                        </span>
                        {loading && (
                          <div className="mt-4">
                            <CircularProgress
                              size={24}
                              className="text-amber-500"
                            />
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
                    {filteredVideos?.length > 0 && (
  <div className="w-full mt-6 bg-neutral-800/50 rounded-lg p-4 border border-neutral-700">
    <h4 className="text-amber-400 text-sm font-semibold mb-1 -mt-2 ">
      Your Existing Videos
    </h4>

    <div className="overflow-x-auto whitespace-nowrap pr-2 custom-scroll">
      <div className="flex gap-4 pr-10">
        {filteredVideos.map((video) => (
          <div
            key={video._id}
            className="relative w-44 min-w-[176px] aspect-video bg-neutral-900 rounded-lg overflow-hidden shrink-0"
          >
            <video
              src={video.source}
              className="w-full h-full object-cover "
              muted
              playsInline
            />
            
            {/* Always visible delete icon */}
            <button
              onClick={() => handleDeleteVideo(video._id)}
              disabled={deletingId === video._id}
              className="absolute top-2 right-2 z-10 text-white bg-red-600/90 hover:bg-red-500 rounded-full p-1 transition-colors"
            >
              {deletingId === video._id ? (
                <CircularProgress size={14} className="text-white" />
              ) : (
                <FiX size={14} />
              )}
            </button>

            {/* Title overlay */}
            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-1">
              <p className="text-white text-[11px] truncate">
                {video.title || "Untitled"}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  </div>
)}

                  </div>
                ) : (
                  <div className="flex flex-col items-center">
                    <div className="relative aspect-video w-full max-w-2xl bg-black rounded-xl overflow-hidden shadow-lg">
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
                        className="absolute top-3 right-3 bg-black/70 text-white p-2 rounded-full hover:bg-black transition-colors"
                        onClick={() => setVideoUrl(null)}
                      >
                        <FiX size={18} />
                      </button>
                    </div>
                    {videos.description.length > 0 && (
                      <div className="mt-4 p-3 bg-neutral-800 rounded-lg border border-neutral-700 w-full max-w-2xl">
                        <span className="text-amber-500 font-mono">#</span>
                        <span className="text-neutral-300 ml-2">
                          {videos.description}
                        </span>
                      </div>
                    )}
                  </div>
                )}

                {videoUrl && (
                  <div className="mt-auto pt-3 sm:pt-4">
                    <Button
                      disabled={isloading}
                      type="submit"
                      className="w-full bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-500 hover:to-amber-600 text-white font-medium py-2 px-4 rounded-lg shadow transition-all text-sm sm:text-base"
                    >
                      {isloading ? (
                        <CircularProgress size={14} className="text-white" />
                      ) : (
                        "Publish Video"
                      )}
                    </Button>
                  </div>
                )}
              </>
            ) : (
              <div className="mt-4 sm:mt-6 p-3 sm:p-4 bg-neutral-700 rounded-lg border border-amber-500/30">
                <p className="text-neutral-400 text-sm mb-4">
                  {`You've reached the maximum number of portfolio videos (4). 
                Consider replacing older videos with newer, higher-quality work.`}
                </p>
                <button
                  onClick={() => {
                    mutate(`/api/videos/getvideos/${validUserId}`);
                    setShowVideo(false);
                    setAddVideo(false);
                    window.location.reload();
                  }}
                  className="w-full bg-neutral-600 hover:bg-neutral-500 text-white py-2 rounded-lg transition-colors text-sm sm:text-base"
                >
                  Return to Dashboard
                </button>
              </div>
            )}
          </form>
        </motion.div>
      )}
    </motion.div>
  );
};

export default Videos;
