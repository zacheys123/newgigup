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
import React, { useEffect, useState } from "react";
import Modal from "../create/Modal";
import { UserProps, VideoProps } from "@/types/userinterfaces";
import { mutate } from "swr";
import { MapPin, RefreshCcw } from "react-feather";
import { useVideoActions } from "@/hooks/useVideoActions";
import { toast } from "sonner";
import CountUp from "react-countup";

import { ChatBubbleLeftIcon } from "@heroicons/react/24/solid";

interface AllGigsComponentProps {
  gig: GigProps;
  onOpenChat: (type: "chat", user: UserProps) => void;
}
const GigCard = ({ gig, onOpenChat }: AllGigsComponentProps) => {
  const { userId } = useAuth();
  const { setShowVideo, setCurrentGig } = useStore();
  const [loadingGig, setLoadingGig] = useState<string>("");
  const { user } = useCurrentUser();
  const validGigid = typeof gig?._id === "string" ? gig?._id : ""; // Default to empty string if undefined
  const validUserId =
    typeof gig?.bookedBy?._id === "string" ? gig?.bookedBy?._id : ""; // Default to empty string if undefined

  const { friendvideos, loading, setRefetch } = useVideos(
    validGigid,
    validUserId
  );

  const testfilteredvids =
    friendvideos?.videos?.filter((video) => video.gigId === gig._id) || [];
  const { forgetBookings } = useForgetBookings();
  const forget = (curr: GigProps) => {
    setLoadingGig(curr?._id as string);
    forgetBookings(user?.user?._id as string, curr, userId as string, "taken");
  };
  const videoLimitReached =
    testfilteredvids?.length && testfilteredvids?.length >= 4;
  const [showVideoModal, setShowVideoModal] = useState(false);

  const postedByUser = gig?.postedBy;

  const handleOpenChat = () => {
    onOpenChat("chat", postedByUser);
  };
  return (
    <motion.div
      key={gig?._id}
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="relative bg-gradient-to-br from-gray-900 to-gray-800 rounded-xl overflow-hidden border border-gray-700 hover:border-indigo-400/70 transition-all duration-300 shadow-2xl hover:shadow-indigo-500/20"
    >
      {/* Gig Header with subtle gradient */}
      <div className="p-5 border-b border-gray-700 bg-gradient-to-r from-gray-800/70 to-gray-900/50">
        <div className="flex items-start justify-between">
          <div className="pr-2">
            <h3 className="text-xl font-medium text-white tracking-tight truncate">
              {gig.title}
            </h3>
            <div className="flex items-center mt-1">
              <MapPin className="w-3.5 h-3.5 text-indigo-300 mr-1" />
              <p className="text-sm text-gray-300">{gig.location}</p>
            </div>
          </div>
          <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-indigo-500/20 text-indigo-200 border border-indigo-400/30">
            Active Booking
          </span>
        </div>
      </div>

      {/* Gig Content */}
      <div className="p-5">
        <p className="text-gray-300 text-sm leading-relaxed mb-5 line-clamp-3 capitalize">
          {gig.description}
        </p>
        {/* Price and Engagement Metrics */}
        <div className="flex items-center justify-between mb-5 flex-col space-y-3">
          <div className="flex items-center space-x-1">
            <div className="flex items-center text-sm text-gray-300 bg-gray-800/60 rounded-full px-3 py-1.5 w-[100px]">
              <EyeIcon className="w-3 h-3 mr-1.5 text-indigo-300 " />
              <span className="title flex  items-center  gap-1  ">
                <CountUp
                  end={gig?.viewCount?.length || 0}
                  duration={1.5}
                  delay={0.2}
                />{" "}
                {` views`}
              </span>
            </div>
            <button
              className="flex items-center text-xs text-gray-300 hover:text-white bg-gray-800/60 hover:bg-gray-700/50 rounded-full px-3 py-1.5 transition-all"
              onClick={() => setRefetch((prev) => !prev)}
            >
              <RefreshCcw className="w-3.5 h-3.5 mr-1.5" />
              Refresh
            </button>
            {testfilteredvids.length === 0 && (
              <button
                onClick={handleOpenChat}
                className="p-2.5 bg-gray-700 hover:bg-gray-600 rounded-full text-yellow-400 hover:text-yellow-300 transition-all duration-200 shadow"
                aria-label="Chat"
              >
                <ChatBubbleLeftIcon className="w-4 h-4" />
              </button>
            )}
          </div>{" "}
          <div className="flex items-center gap-2">
            <span className="text-xs font-medium text-gray-400">
              Total Value
            </span>
            <span className="block text-2xl font-bold text-white mt-0.5">
              {getFormattedPrice(gig)}
            </span>
          </div>
        </div>
        {/* Progress Indicator */}
        {testfilteredvids && (
          <div className="mb-4">
            <div className="flex items-center justify-between text-xs text-gray-400 mb-1.5">
              <span>Video Milestone</span>
              <span>{testfilteredvids.length}/4</span>
            </div>
            <div className="w-full bg-gray-700/50 rounded-full h-1.5">
              <div
                className="bg-gradient-to-r from-indigo-400 to-indigo-600 h-1.5 rounded-full"
                style={{ width: `${(testfilteredvids.length / 4) * 100}%` }}
              ></div>
            </div>
          </div>
        )}

        {/* Action Buttons */}
        {!loading ? (
          <div className="flex space-x-3">
            {videoLimitReached && testfilteredvids ? (
              <button
                className="flex-1 flex items-center justify-center gap-2 bg-gray-700/70 hover:bg-gray-600/80 text-gray-300 hover:text-white py-2.5 px-4 rounded-lg transition-all duration-200 border border-gray-600/50"
                onClick={() => setShowVideoModal(true)}
              >
                <Lock className="w-4 h-4" />
                <span className="text-sm">Manage Videos</span>
              </button>
            ) : (
              <button
                onClick={() => {
                  setCurrentGig(gig);
                  setShowVideo(true);
                }}
                className="flex-1 flex items-center justify-center gap-2 bg-gradient-to-r from-indigo-500 to-indigo-600 hover:from-indigo-400 hover:to-indigo-500 text-white py-2.5 px-4 rounded-lg transition-all duration-200 shadow-md hover:shadow-indigo-500/30"
              >
                <Video className="w-4 h-4" />
                <span className="text-sm">Add Content</span>
              </button>
            )}

            {/* Only show cancel button if no videos have been added */}
            {testfilteredvids.length === 0 && (
              <button
                onClick={() => forget(gig)}
                className="flex-1 flex items-center justify-center gap-2 bg-gradient-to-r from-rose-600/90 to-rose-700 hover:from-rose-500 hover:to-rose-600 text-white py-2.5 px-4 rounded-lg transition-all duration-200 shadow-md hover:shadow-rose-500/20"
              >
                {loadingGig === gig._id ? (
                  <CircularProgress size={16} className="text-white" />
                ) : (
                  <>
                    <Trash2 className="w-4 h-4" />
                    <span className="text-sm">Cancel</span>
                  </>
                )}
              </button>
            )}
          </div>
        ) : (
          <div className="animate-pulse flex space-x-4">
            <div className="flex-1 h-10 bg-gray-700/50 rounded-lg"></div>
            <div className="flex-1 h-10 bg-gray-700/50 rounded-lg"></div>
          </div>
        )}
      </div>

      {/* Gig Footer */}
      <div className="px-5 py-3 bg-gray-800/30 border-t border-gray-700/50 flex items-center justify-between">
        <div className="flex items-center">
          <div className="w-8 h-8 rounded-full overflow-hidden border-2 border-indigo-400/50 mr-2.5 shadow-md">
            <Image
              src={
                gig.postedBy?.picture ||
                "../../../public/assets/png/logo-no-background.png"
              }
              alt={gig.postedBy?.username}
              className="w-full h-full object-cover"
              width={32}
              height={32}
            />
          </div>
          <div>
            <p className="text-xs font-medium text-gray-200">
              {gig.postedBy?.username?.split(" ")[0]}
            </p>
            <p className="text-[10px] text-gray-400">Talent Partner</p>
          </div>
        </div>
        <span className="text-[10px] text-gray-400 font-light">
          {moment(gig.createdAt).format("MMM D, YYYY [at] h:mm A")}
        </span>
      </div>

      <VideoModal
        isOpen={showVideoModal}
        title={`${gig?.title} Content`}
        onClose={() => {
          setRefetch((prev) => !prev);
          setShowVideoModal(false);
        }}
        videos={testfilteredvids}
        dep="videos"
        validUserId={validUserId}
        setRefetch={setRefetch}
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
  setRefetch?: React.Dispatch<React.SetStateAction<boolean>>;
}

const VideoModal = ({
  isOpen,
  onClose,
  title,
  dep,
  setRefetch,
  videos = [],
}: VideoModalProps) => {
  const [selectedVideo, setSelectedVideo] = useState<VideoProps | null>(null);
  const [optimisticVideos, setOptimisticVideos] =
    useState<VideoProps[]>(videos);

  // Keep optimisticVideos in sync with props
  useEffect(() => {
    setOptimisticVideos(videos);
  }, [videos]);
  const { deleteVideo, deletingId } = useVideoActions();
  const handleDeleteVideo = async (videoId: string, e: React.MouseEvent) => {
    e.stopPropagation();

    try {
      // Optimistically update UI
      await deleteVideo(videoId, mutate);
      // Optimistic update - remove the video immediately

      toast.success("Video deleted successfully");
      setOptimisticVideos((prev) =>
        prev.filter((video) => video._id !== videoId)
      );
      // Trigger refetch if setRefetch exists
      if (setRefetch) {
        setRefetch((prev) => !prev);
      }
      // Refresh the videos list
    } catch (error) {
      setOptimisticVideos(videos);
      toast.error("Failed to delete video");
      console.error("Error deleting video:", error);
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
          {optimisticVideos.length === 0 ? (
            <p className="text-gray-400 text-center py-4">
              No videos available
            </p>
          ) : (
            <div className="space-y-3">
              {optimisticVideos.map((video) => (
                <div
                  key={video._id}
                  className={`group relative bg-gray-800 rounded-lg p-3 hover:bg-gray-700 transition-colors cursor-pointer ${
                    deletingId === video._id ? "opacity-50" : ""
                  }`}
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
