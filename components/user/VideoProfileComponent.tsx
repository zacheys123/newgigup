"use client";
import useStore from "@/app/zustand/useStore";
import { fileupload } from "@/hooks/fileUpload";
import { UserProps, VideoProfileProps } from "@/types/userinterfaces";
import { CircularProgress } from "@mui/material";
import { motion } from "framer-motion";
import React, { ChangeEvent, useCallback, useState } from "react";
import { toast } from "sonner";
import { HiOutlineDotsVertical } from "react-icons/hi";
interface VideoComponentProfileProps {
  user: UserProps;
  setVideoUrl: (videoUrl: string) => void;
  videos: VideoProfileProps[];
  upload: boolean;
  videoUrl: string | null;
  showUpload: (upload: boolean) => void;
}

const VideoProfileComponent = ({
  user,
  setVideoUrl,
  upload,
  showUpload,
}: VideoComponentProfileProps) => {
  const [fileUrl, setFileUrl] = useState<string>("");
  const [uploading, setUploading] = useState<boolean>(false);
  const [videopreview, setVideopreview] = useState<boolean>(false);
  const [videomenu, setVideomenu] = useState<boolean>(false);
  const [currentvideo, setCurrentVideo] = useState<VideoProfileProps>();
  const [addedVideos, setAddedVideos] = useState<string[]>([]);
  const { setRefetchData } = useStore();

  console.log(videopreview);
  const handleFileChange = useCallback(
    async (event: ChangeEvent<HTMLInputElement>) => {
      const dep = "video";
      const allowedTypes = ["video/mp4", "video/webm", "video/ogg"];
      if (addedVideos.includes(fileUrl)) return;
      fileupload(
        event,
        (file: string) => {
          if (file) {
            setVideoUrl(file);
            setAddedVideos((prev) =>
              prev.length < 3 ? [...prev, file] : prev
            );
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
        setUploading,
        dep,
        user,
        setRefetchData
      );
    },
    [fileUrl, addedVideos]
  );
  const deleteVideo = async (id: string) => {
    const response = await fetch(`/api/user/deletevideo/${id}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        userid: user?._id,
      }),
    });
    if (!response.ok) {
      throw new Error("Failed to delete video");
    }
    const data: { message: string } = await response.json();
    toast.success(data.message);
    setRefetchData(true);
    setCurrentVideo({
      _id: "",
      title: "",
      url: "",
      // description: "",
      // videoUrl: "",
      // createdAt: "",
      // postedBy: null,
      // bookedBy: null,
      // bookedAt: null,
      // booker: null,
      // rating: 0,
      // comments: [],
      // likes: [],
      // dislikes: [],
      // booked: false,
      // viewed: 0,
      // shared: 0,
      // likedByUser: false,
      // dislikedByUser: false,
      // bookedByUser: false,
      // hasBooked: false,
      // hasLiked: false,
      // hasDisliked: false,
      // hasShared: false,
      // user: null,
      // commentsCount: 0,
      // likeCount: 0,
      // dislikeCount: 0,
      // sharedCount: 0,
      // hasLikedComment: false,
      // hasDislikedComment: false,
      // hasSharedComment: false,
    });
    setAddedVideos(addedVideos.filter((video) => video !== id));

    setCurrentVideo({
      _id: "",
      url: "",
      title: "",
    });

    setVideopreview(!videopreview);
    setVideomenu(false);
  };
  return (
    <>
      {upload && (
        <div className="flex justify-center items-center fixed inset-0 z-50 bg-black/40">
          <div className="relative w-[80%] mx-auto max-w-2xl bg-neutral-700 rounded-lg p-6 shadow-lg">
            {/* Close Button */}
            <button
              onClick={() => showUpload(false)}
              className="absolute right-4 top-4 text-white text-2xl font-bold hover:text-gray-300"
            >
              &times;
            </button>
         {(user?.videosProfile?.length || 0) < 3 && addedVideos.length < 3 && (
  <h2 className="text-center text-white text-xl font-semibold mb-4">
    Upload Your Video
  </h2>
)}
            {user?.videosProfile?.length && user?.videosProfile?.length < 3 && addedVideos.length < 3 ? (
              <div className="flex flex-col items-center gap-4">
                {addedVideos.length < 3 && (
                  <>
                    <label
                      htmlFor="postvideo"
                      className={
                        !uploading
                          ? "bg-blue-600 hover:bg-blue-500 text-white font-medium py-2 px-5 rounded-lg cursor-pointer transition"
                          : "pointer-events-none"
                      }
                    >
                      {!uploading ? (
                        "Upload Video"
                      ) : (
                        <CircularProgress
                          size="16px"
                          style={{ color: "white" }}
                        />
                      )}
                    </label>
                    <input
                      id="postvideo"
                      className="hidden"
                      type="file"
                      accept="video/*"
                      onChange={handleFileChange}
                      disabled={uploading}
                    />
                  </>
                )}
              </div>
            ) : (
              <p className="text-neutral-400 text-center">
                {`You've reached the maximum number of clips (3). Delete one to
                upload another.`}
              </p>
            )}

            {/* Display Added Videos */}
            {addedVideos.length > 0 && user?.videosProfile?.length && user?.videosProfile?.length < 4 && (
              <div className="mt-6">
                <h3 className="text-white text-md font-semibold mb-2">
                  Recently Added Videos
                </h3>
                <div className="flex gap-3 overflow-x-auto">
                  {addedVideos.map((vid, index) => (
                    <div
                      key={index}
                      className="relative group w-24 h-24 rounded-lg overflow-hidden border"
                    >
                      <video
                        className="w-full h-full object-cover"
                        src={vid}
                        muted
                      />
                    </div>
                  ))}
                </div>
              </div>
            )}
            {/* Display Permanent Videos */}
            {user?.videosProfile && user?.videosProfile?.length > 0 && (
              <div className="mt-6">
                <h3 className="text-white text-lg font-semibold mb-2">
                  Your Videos
                </h3>
                <div className="flex gap-3 overflow-x-auto">
                  {user?.videosProfile.map((vid) => (
                    <div
                      onClick={() => {
                        setCurrentVideo(vid);
                        setVideopreview(!videopreview);
                      }}
                      key={vid._id}
                      className="relative group w-24 h-24 rounded-lg overflow-hidden border"
                    >
                      <video
                        className="w-full h-full object-cover"
                        src={vid.url}
                        muted
                      />
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
          {currentvideo?._id && videopreview === true && (
            <motion.div
              className="absolute h-[87%] w-[85%] m-auto z-50 bg-gray-700 backdrop-blur-3xl"
              initial={{
                opacity: 0,
                transform: "scale(0)",
                x: -150,
              }}
              animate={{
                opacity: currentvideo?._id && videopreview === true ? 1 : 0,
                x: 50,
                transform: "scale(1)",
              }}
              transition={{ duration: 1, ease: "easeInOut" }}
              exit={{
                opacity: !currentvideo?._id && videopreview ? 0 : 1,
                x: 50,
                transform: "scale(0)",
                transition: { duration: 1, ease: "easeInOut" },
              }}
            >
              <div className="relative flex justify-center items-center    rounded-full cursor-pointer ">
                <span
                  className="absolute text-white font-bold text-[25px] top-3 left-2 z-50"
                  onClick={(ev) => {
                    ev.stopPropagation();

                    setVideomenu(true);
                  }}
                >
                  {" "}
                  <HiOutlineDotsVertical />
                </span>
                <span
                  className="absolute text-white font-bold text-[25px] top-0 right-2 z-50"
                  onClick={() => {
                    setCurrentVideo({
                      _id: "",
                      url: "",
                      title: "",
                    });

                    setVideopreview(!videopreview);
                    setVideomenu(false);
                  }}
                >
                  &times;
                </span>{" "}
              </div>
              <video
                onClick={() => {
                  setVideomenu(false);
                }}
                className="w-[100%] h-[100%] rounded-lg object-cover"
                src={currentvideo?.url}
                controls
                autoPlay
              />
            </motion.div>
          )}{" "}
          <div className="absolute flex  top-24 left-10">
            {videomenu && (
              <motion.div
                initial={{ opacity: 0, y: -50, scale: 0.95 }}
                animate={{ opacity: 1, y: 20, scale: 1 }}
                exit={{ opacity: 0, y: -20, scale: 0.95 }}
                transition={{ duration: 0.6, ease: "easeInOut" }}
                className=" right-20 bg-white shadow-2xl rounded-xl w-full max-w-[280px] p-4 border border-gray-200 sm:max-w-[320px] overflow-hidden z-50"
              >
                <ul className="flex flex-col gap-3">
                  <li className="flex items-center gap-2 text-sm font-medium text-gray-700 hover:text-blue-600 cursor-pointer transition-transform transform hover:translate-x-2">
                    🌍 <span>Share Publicly</span>
                  </li>
                  <li className="flex items-center gap-2 text-sm font-medium text-gray-700 hover:text-blue-600 cursor-pointer transition-transform transform hover:translate-x-2">
                    🔒 <span>Share Privately</span>
                  </li>
                  <li className="flex items-center gap-2 text-sm font-medium text-gray-700 hover:text-blue-600 cursor-pointer transition-transform transform hover:translate-x-2">
                    👥 <span>Share with Clients</span>
                  </li>
                  <li
                    className="flex items-center gap-2 text-sm font-medium text-red-600 hover:text-red-800 cursor-pointer transition-transform transform hover:translate-x-2"
                    onClick={() => deleteVideo(currentvideo?._id || "")}
                  >
                    🗑️ <span>Delete</span>
                  </li>
                </ul>
              </motion.div>
            )}
          </div>
        </div>
      )}
    </>
  );
};

export default VideoProfileComponent;
