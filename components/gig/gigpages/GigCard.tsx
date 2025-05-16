import useStore from "@/app/zustand/useStore";
import { getFormattedPrice } from "@/gigHelper";
import { useCurrentUser } from "@/hooks/useCurrentUser";
import { useForgetBookings } from "@/hooks/useForgetBooking";
import { useVideos } from "@/hooks/useVideos";
import { GigProps } from "@/types/giginterface";
import { useAuth } from "@clerk/nextjs";
import { CircularProgress } from "@mui/material";
import { motion } from "framer-motion";
import { Lock, Trash2, Video, X } from "lucide-react";
import moment from "moment";
import Image from "next/image";
import React, { useState } from "react";
import Modal from "../create/Modal";
import { VideoProps } from "@/types/userinterfaces";
import { mutate } from "swr";

interface AllGigsComponentProps {
  gig: GigProps;
}
const GigCard = ({ gig }: AllGigsComponentProps) => {
  const { userId } = useAuth();
  const { setShowVideo, setCurrentGig } = useStore();
  const [loadingGig, setLoadingGig] = useState<string>("");
  const { user } = useCurrentUser();
  const validGigid = typeof gig?._id === "string" ? gig?._id : ""; // Default to empty string if undefined
  const validUserId =
    typeof gig?.bookedBy?._id === "string" ? gig?.bookedBy?._id : ""; // Default to empty string if undefined

  const { friendvideos, loading } = useVideos(validGigid, validUserId);
  const testfilteredvids =
    friendvideos?.videos?.filter((video) => video?.gigId === gig?._id) || []; // Add fallback empty array

  const { forgetBookings } = useForgetBookings();
  const forget = (curr: GigProps) => {
    setLoadingGig(curr?._id as string);
    forgetBookings(user?.user?._id as string, curr, userId as string, "taken");
  };
  const videoLimitReached =
    testfilteredvids?.length && testfilteredvids?.length >= 4;
  const [showVideoModal, setShowVideoModal] = useState(false);
  return (
    <motion.div
      key={gig?._id}
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="relative bg-gray-800/50 backdrop-blur-sm rounded-xl overflow-hidden border border-gray-700/50 hover:border-indigo-500/50 transition-all duration-300 shadow-lg hover:shadow-indigo-500/10"
    >
      {/* Gig Header */}
      <div className="p-4 border-b border-gray-700/50">
        <div className="flex items-start justify-between">
          <div>
            <h3 className="text-lg font-semibold text-white truncate">
              {gig.title}
            </h3>
            <p className="text-sm text-gray-400 mt-1">{gig.location}</p>
          </div>
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-indigo-900/50 text-indigo-300">
            Booked
          </span>
        </div>
      </div>

      {/* Gig Content */}
      <div className="p-4">
        <p className="text-gray-300 text-sm line-clamp-3 mb-4 capitalize">
          {gig.description}
        </p>

        {/* Price and Details */}
        <div className="flex items-center justify-between mb-4">
          <span className="text-xl font-bold text-white">
            {getFormattedPrice(gig)}
          </span>
          <div className="flex items-center text-sm text-gray-400">
            <EyeIcon className="w-4 h-4 mr-1" />
            <span>{gig?.viewCount && gig?.viewCount.length} views</span>
          </div>
        </div>

        {/* Video Count Indicator */}
        {testfilteredvids && (
          <div className="text-xs text-gray-400 mb-3">
            Videos added: {testfilteredvids.length}/4
          </div>
        )}

        {/* Action Buttons */}
        {!loading ? (
          <div className="flex space-x-2">
            {videoLimitReached && friendvideos ? (
              <button
                className="flex-1  title whitespace-nowrap flex items-center justify-center gap-2 bg-gray-600 text-gray-400 py-2 px-4 rounded-lg cursor-pointer"
                onClick={() => setShowVideoModal(true)}
              >
                <Lock className="w-4 h-4" />
                Video Limit/Remove
              </button>
            ) : (
              <button
                onClick={() => {
                  setCurrentGig(gig);
                  setShowVideo(true);
                }}
                className="flex-1 title flex items-center justify-center gap-2 bg-indigo-600/90 hover:bg-indigo-500 text-white py-2 px-4 rounded-lg transition-all duration-200"
              >
                <Video className="w-4 h-4" />
                Add Videos
              </button>
            )}
            <button
              onClick={() => forget(gig)}
              className="flex-1 flex items-center justify-center gap-2 title bg-rose-600/90 hover:bg-rose-500 text-white py-2 px-4 rounded-lg transition-all duration-200"
            >
              {loadingGig === gig._id ? (
                <CircularProgress size={16} className="text-white" />
              ) : (
                <>
                  <Trash2 className="w-4 h-4" />
                  Cancel
                </>
              )}
            </button>
          </div>
        ) : (
          <span className="text-neutral-400 title animate-pulse">....</span>
        )}
      </div>

      {/* Gig Footer */}
      <div className="px-4 py-3 bg-gray-800/50 border-t border-gray-700/50 flex items-center justify-between">
        <div className="flex items-center">
          <div className="w-8 h-8 rounded-full overflow-hidden border-2 border-indigo-500/50 mr-2">
            <Image
              src={
                gig.postedBy?.picture ||
                "../../../public/assets/png/logo-no-background.png"
              }
              alt={gig.postedBy?.username}
              className="w-full h-full object-cover"
              width={20}
              height={20}
            />
          </div>
          <span className="text-[11px] text-gray-300">
            {gig.postedBy?.username?.split(" ")[0]}
          </span>
        </div>
        <span className="text-[10px] text-gray-500">
          Posted on {moment(gig.createdAt).format("MMMM Do YYYY, h:mm a")}
        </span>
      </div>
      <VideoModal
        isOpen={showVideoModal}
        title={`${gig?.title} Videos`}
        onClose={() => setShowVideoModal(false)}
        videos={testfilteredvids}
        dep="videos"
        validUserId={validUserId}
      />
    </motion.div>
  );
};

export default GigCard;

const EyeIcon = ({ className }: { className?: string }) => (
  <svg
    className={className}
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
    />
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
    />
  </svg>
);

interface VideoModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  videos: VideoProps[];
  dep: string;
  validUserId: string;
}

const VideoModal = ({
  isOpen,
  onClose,
  title,
  dep,
  validUserId,
  videos = [],
}: VideoModalProps) => {
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [selectedVideo, setSelectedVideo] = useState<VideoProps | null>(null);

  const handleDeleteVideo = async (videoId: string, e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent triggering the play video action
    try {
      setDeletingId(videoId);
      const response = await fetch(`/api/videos/deletevideo/${videoId}`, {
        method: "DELETE",
      });

      if (!response.ok) throw new Error("Failed to delete video");

      // You should implement a way to refresh the videos list here
      // For example: onVideoDeleted?.();
      mutate(`/api/videos/getvideos/${validUserId}`);
    } catch (error) {
      console.error("Error deleting video:", error);
    } finally {
      setDeletingId(null);
    }
  };

  const handlePlayVideo = (video: VideoProps) => {
    setSelectedVideo(video);
  };

  return (
    <>
      {/* Main Modal with scrollable list */}
      <Modal isOpen={isOpen} onClose={onClose} title={title} dep="videos">
        <div
          className={
            dep === "videos"
              ? "max-h-[60vh] overflow-y-auto"
              : "fixed max-h-[60vh] overflow-y-auto"
          }
        >
          {videos.length === 0 ? (
            <p className="text-gray-400 text-center py-4">
              No videos available
            </p>
          ) : (
            <div className="space-y-3">
              {videos.map((video) => (
                <div
                  key={video._id}
                  className="group relative bg-gray-800 rounded-lg p-3 hover:bg-gray-700 transition-colors cursor-pointer  "
                  onClick={() => handlePlayVideo(video)}
                >
                  <div className="flex items-center space-x-3">
                    <div className="flex-shrink-0 bg-indigo-900/50 p-2 rounded-lg">
                      <Video className="w-5 h-5 text-indigo-400" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <h4 className="text-sm font-medium text-white truncate">
                        {video.title || "Untitled Video"}
                      </h4>
                      <p className="text-xs text-gray-400 truncate">
                        {video.description || "No description"}
                      </p>
                    </div>
                    <button
                      onClick={(e) => handleDeleteVideo(video._id, e)}
                      className="text-gray-400 hover:text-red-500 transition-colors p-1"
                      disabled={deletingId === video._id}
                    >
                      {deletingId === video._id ? (
                        <CircularProgress size={16} className="text-white" />
                      ) : (
                        <Trash2 className="w-4 h-4" />
                      )}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </Modal>

      {/* Full-screen Video Player Modal */}
      {selectedVideo && (
        <div className="fixed inset-0 z-50 bg-black/90 flex flex-col">
          <div className="flex justify-between items-center p-4">
            <h2 className="text-xl font-semibold text-white">
              {selectedVideo.title || "Video Player"}
            </h2>
            <button
              onClick={() => setSelectedVideo(null)}
              className="text-gray-300 hover:text-white p-2"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          <div className="flex-1 flex items-center justify-center">
            <div className="w-full max-w-4xl px-4">
              <video
                controls
                autoPlay
                className="w-full h-full max-h-[80vh] rounded-lg"
                src={selectedVideo.source}
              >
                Your browser does not support the video tag.
              </video>
            </div>
          </div>

          <div className="p-4 text-gray-300 text-sm">
            {selectedVideo.description && (
              <p className="mb-2">{selectedVideo.description}</p>
            )}
            <p>Click anywhere outside the video or press ESC to close</p>
          </div>
        </div>
      )}
    </>
  );
};
