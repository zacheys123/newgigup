"use client";
import { useCurrentUser } from "@/hooks/useCurrentUser";
import { VideoProps } from "@/types/userinterfaces";
import { useAuth } from "@clerk/nextjs";
import { CircularProgress } from "@mui/material";
import { motion } from "framer-motion";
import { ArrowBigLeftIcon } from "lucide-react";
import moment from "moment";
import { useParams, useRouter } from "next/navigation";
import React, { FormEvent, useEffect, useState } from "react";
import { BsThreeDotsVertical } from "react-icons/bs";
import { toast } from "sonner";
interface UpdateResponse {
  updateStatus: boolean;
  message?: string;
}
const AllVideosPage = () => {
  const { userid } = useParams();
  const { userId } = useAuth();
  //   const { userId } = useAuth();
  const [friendvideos, setFriendVideos] = useState<VideoProps[]>();
  const [loading, setLoading] = useState<boolean>(false);
  const [editloading, setVideoEdittingLoading] = useState<boolean>(false);
  const [refetch, setRefetch] = useState<boolean>(false);
  const [videoactions, setVideoActions] = useState<boolean>(false);
  const [editVideo, setEditVideo] = useState<boolean>(false);
  const { user } = useCurrentUser(userId || null);
  const [currentVideo, setCurrentVideo] = useState<string | null>("");
  const [currentV, setCurrentV] = useState<string | null>("");

  //   const { user } = useCurrentUser(userId || null);
  const router = useRouter();

  useEffect(() => {
    if (!userid) {
      // Guard: Do not run the effect if `id` is undefined or null
      return;
    }
    setLoading(true);
    fetch(`/api/videos/getvideos/${userid}`)
      .then((response) => response.json())
      .then((data) => {
        setFriendVideos(data.videos);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching videos:", error);
        setLoading(false);
      });
  }, [refetch, userid]);

  const deleteVideo = async (id: string) => {
    try {
      const res = await fetch(`/api/videos/deletevideo/${id}`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
      });
      const data: UpdateResponse = await res.json();
      toast.success(data?.message);
      setRefetch((prev) => !prev);
      setFriendVideos(friendvideos?.filter((v: VideoProps) => v._id !== id));
    } catch (error) {
      console.error("Error deleting video:", error);
    }
  };

  // edit video
  const [title, setTitle] = useState<string>("");
  const [description, setDescription] = useState<string>("");

  const handleEdit = async (
    event: FormEvent<HTMLFormElement>,
    video: VideoProps
  ) => {
    event.preventDefault();

    try {
      setVideoEdittingLoading(true);
      const res = await fetch(`/api/videos/editvideo/${video._id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title, description }),
      });
      const data: UpdateResponse = await res.json();
      toast.success(data?.message);
      setFriendVideos(
        friendvideos?.map((v: VideoProps) =>
          v._id === video._id ? { ...v, title, description } : v
        )
      );
      setEditVideo(false);
      setCurrentV(null);
      setRefetch((prev) => !prev);
    } catch (error) {
      console.error("Error editing video:", error);
      setEditVideo(true);
      setVideoEdittingLoading(false);
    }
    setEditVideo(false);
    setCurrentV(null);
  };
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
    <div className="overflow-y-auto h-screen w-full mx-auto shadow-lg shadow-orange-400 flex flex-col gap-4 bg-gradient-to-br from-black via-zinc-900 to-black">
      <div className="h-[50px] bg-inherit w-full flex items-center justify-between px-6 shadow-md">
        <ArrowBigLeftIcon
          className="cursor-pointer hover:text-amber-500 text-neutral-400 transition duration-200"
          size={28}
          onClick={() => router.back()}
        />
        <h1 className="text-white text-2xl font-extrabold">All My Videos</h1>
      </div>
      {!friendvideos && (
        <div className="flex flex-col gap-4 bg-zinc-800 rounded-lg shadow-md shadow-slate-500 py-8 px-6 text-center">
          <p className="text-neutral-400 text-lg">
            No videos available for this user.
          </p>
        </div>
      )}
      {friendvideos &&
        friendvideos?.map((video: VideoProps) => (
          <div
            key={video._id}
            className="flex flex-col gap-4 bg-zinc-900 rounded-lg shadow-md shadow-slate-600 py-6 px-4 hover:shadow-lg hover:scale-[1.02] transition-transform"
            onClick={(ev) => {
              setCurrentVideo(null);
              setVideoActions(false);

              ev.stopPropagation();
            }}
          >
            <div className="flex items-center justify-between">
              <h3 className="text-sm title font-semibold text-purple-200">
                <span className="choice text-amber-400 font-bold">
                  Gig Title:
                </span>{" "}
                {video.title}
              </h3>
              {user?._id === userid && (
                <BsThreeDotsVertical
                  className="cursor-pointer hover:text-amber-500 text-neutral-400"
                  size={22}
                  onClick={(ev) => {
                    setCurrentVideo(video?._id);
                    setVideoActions(true);
                    ev.stopPropagation();
                  }}
                />
                // <Menu
                //   className="cursor-pointer text-red-500 "
                //   size={24}
                //   onClick={() => deleteVideo(video?._id)}
                // />
              )}
            </div>
            <div className="relative flex justify-end">
              {currentVideo === video?._id && videoactions && (
                <motion.div
                  initial={{ opacity: 0, y: -50, scale: 0.95 }}
                  animate={{ opacity: 1, y: 20, scale: 1 }}
                  exit={{ opacity: 0, y: -20, scale: 0.95 }}
                  transition={{ duration: 0.6, ease: "easeInOut" }}
                  className="absolute right-0 bg-white shadow-2xl rounded-xl w-full max-w-[280px] p-4 border border-gray-200 sm:max-w-[320px] overflow-hidden z-50"
                >
                  <ul className="flex flex-col gap-3">
                    <li
                      className="flex items-center gap-2 text-sm font-medium text-gray-700 hover:text-blue-600 cursor-pointer transition-transform transform hover:translate-x-2"
                      onClick={() => {
                        setEditVideo(true);
                        setCurrentV(video._id);
                      }}
                    >
                      ✏️ <span>Edit Video</span>
                    </li>
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
                      onClick={() => deleteVideo(video?._id)}
                    >
                      🗑️ <span>Delete</span>
                    </li>
                  </ul>
                </motion.div>
              )}
            </div>

            <div className="relative flex justify-end">
              {currentV === video?._id && editVideo && (
                <motion.div
                  initial={{ opacity: 0, transform: "translate(50px, -70px)" }}
                  animate={{ opacity: 1, transform: "translate(0px, 0px)" }}
                  transition={{ duration: 0.4, ease: "easeInOut" }}
                  className="absolute bg-white shadow-lg rounded-lg w-full max-w-[320px] p-6 border border-gray-200 sm:max-w-[340px] z-50"
                >
                  <h3 className="text-lg font-semibold text-gray-800 mb-4 text-center sm:text-left">
                    Edit Video
                  </h3>
                  <form
                    onSubmit={(ev) => handleEdit(ev, video)}
                    className="space-y-4"
                  >
                    <div>
                      <label
                        htmlFor="title"
                        className="block text-sm font-medium text-gray-600"
                      >
                        Title
                      </label>
                      <input
                        type="text"
                        id="title"
                        name="title"
                        value={title ? title : video?.title}
                        onChange={(e) => setTitle(e.target.value)}
                        className="w-full mt-1 p-2 text-sm border rounded-md shadow-sm border-gray-300 focus:ring focus:ring-blue-300 focus:outline-none"
                        placeholder="Enter video title"
                      />
                    </div>

                    <div>
                      <label
                        htmlFor="description"
                        className="block text-sm font-medium text-gray-600"
                      >
                        Description
                      </label>
                      <textarea
                        id="description"
                        name="description"
                        value={description ? description : video?.description}
                        onChange={(e) => setDescription(e.target.value)}
                        rows={4}
                        className="w-full mt-1 p-2 text-sm border rounded-md shadow-sm border-gray-300 focus:ring focus:ring-blue-300 focus:outline-none"
                        placeholder="Enter video description"
                      />
                    </div>

                    <div className="flex justify-between items-center">
                      {/* Cancel Button */}
                      <button
                        type="button"
                        onClick={(ev) => {
                          setCurrentVideo(null);
                          setVideoActions(false);
                          ev.stopPropagation();
                        }}
                        className="px-4 py-2 text-sm font-medium text-gray-600 bg-gray-100 rounded-md shadow hover:bg-gray-200 focus:ring focus:ring-gray-300 focus:outline-none"
                      >
                        Cancel
                      </button>

                      {/* Save Button */}
                      <button
                        type="submit"
                        className="px-4 py-2 text-sm font-medium text-white bg-amber-600 rounded-md shadow hover:bg-blue-700 focus:ring focus:ring-blue-300 focus:outline-none"
                      >
                        {!editloading ? (
                          "Save Changes"
                        ) : (
                          <CircularProgress
                            size={18}
                            style={{ color: "white" }}
                          />
                        )}
                      </button>
                    </div>
                  </form>
                </motion.div>
              )}
            </div>
            <video
              controls
              className="w-full h-auto rounded-lg shadow-md"
              src={video.source}
            >
              Your browser does not support the video tag.
            </video>
            <p className="text-amber-500">{video.description}</p>
            <h5 className="text-neutral-400 text-sm">
              Posted on{" "}
              {moment(video.createdAt).format("MMMM Do YYYY, h:mm:ss a")}
            </h5>
          </div>
        ))}
    </div>
  );
};

export default AllVideosPage;
