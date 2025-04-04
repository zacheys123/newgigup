// components/gig/AllGigsComponent.ts
import { GigProps } from "@/types/giginterface";
import React, { useEffect, useState } from "react";
import ButtonComponent from "../ButtonComponent";
import { PiDotsThreeVerticalBold } from "react-icons/pi";
import GigDescription from "./GigDescription";
import useStore from "@/app/zustand/useStore";
import { useRouter } from "next/navigation";
import { useAllGigs } from "@/hooks/useAllGigs";
import { toast } from "react-toastify";
import { useAuth } from "@clerk/nextjs";
import Image from "next/image";
import { useVideos } from "@/hooks/useVideos";
import { motion } from "framer-motion";
import { useSocketContext } from "@/app/Context/socket";
import { useBookGig } from "@/hooks/useBookGig";
import { isCreatorIsCurrentUserAndTaken } from "@/constants";
import { Video } from "lucide-react";

interface FetchResponse {
  success: boolean;
  message?: string;
}

interface AllGigsComponentProps {
  gig: GigProps;
}

const AllGigsComponent: React.FC<AllGigsComponentProps> = ({ gig }) => {
  const { userId } = useAuth();
  const { socket } = useSocketContext();
  const { gigs } = useAllGigs() || { gigs: [] };

  const {
    currentUser,
    setShowModal,
    setRefetchGig,
    setIsDescriptionModal,
    isDescriptionModal,
    setCurrentGig,
    setConfirmEdit,
    setShowVideo,
    setSelectedReview,
    loadingPostId,
    setLoadingPostId,
  } = useStore();

  const [bookCount, setBookCount] = useState(gig.bookCount.length || 0);
  const { bookGig, bookLoading } = useBookGig();
  const myId = currentUser?._id;
  const router = useRouter();

  const handleModal = async (gig: GigProps) => {
    try {
      const res = await fetch(`/api/gigs/addview/${gig?._id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ userid: currentUser?._id }),
      });
      const data: FetchResponse = await res.json();
      setIsDescriptionModal(true);
      setCurrentGig(gig);
      console.log(data);
    } catch (error) {
      console.log("error adding view for gigs", error);
    }
  };

  const handleEditBooked = async (id: string) => {
    router.push(`/execute/${id}`);
  };

  const handleBookedUsers = (id: string) => {
    router.push(`/pre_execute/${id}`);
  };

  const handleReviewModal = (gig: GigProps) => {
    const review = gig?.postedBy?.myreviews?.find(
      (review) => review?.gigId === gig?._id
    );

    if (review) {
      setSelectedReview(review);
      setCurrentGig(gig);
      setShowModal(true);
    } else {
      router.push(`/execute/${gig._id}`);
    }
  };

  const validGigid = typeof gig?._id === "string" ? gig?._id : "";
  const validUserId =
    typeof gig?.bookedBy?._id === "string" ? gig?.bookedBy?._id : "";

  const { friendvideos } = useVideos(validGigid, validUserId);
  const testfilteredvids = friendvideos?.videos?.filter(
    (video) => video.gigId === gig._id
  );
  const canShowAddGigVideos =
    gig?.isPending === false &&
    gig?.isTaken === true &&
    testfilteredvids &&
    gig?.bookedBy?._id === myId &&
    gig?.postedBy?._id !== myId &&
    testfilteredvids?.length < 4;

  const isGigCreator = gig?.postedBy?._id === myId;
  const hasBookedGig = gig?.bookCount?.some((i) => i?._id === myId);
  const isCurrentWhoCreatedGig =
    isGigCreator && !hasBookedGig && bookCount > 0 && gig?.isTaken === false;
  const isCurrentWhoBooked = hasBookedGig && !isGigCreator;
  const canEditGig =
    gig?.postedBy?._id &&
    isGigCreator &&
    bookCount === 0 &&
    gig?.isTaken === false;

  useEffect(() => {
    if (!socket) return;

    const handleUpdateBookCount = ({
      gigId,
      bookCount: newBookCount,
    }: {
      gigId: string;
      bookCount: number;
    }) => {
      if (gigId === gig._id) {
        setBookCount(newBookCount);
      }
    };

    socket.on("updateBookCount", handleUpdateBookCount);

    return () => {
      socket.off("updateBookCount", handleUpdateBookCount);
    };
  }, [gig._id, socket]);

  return (
    <>
      {isDescriptionModal && <GigDescription />}

      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="hidden md:block w-full bg-gray-900/80 hover:bg-gray-800/80 rounded-lg p-4 mb-3 transition-all duration-200 ease-in-out shadow-lg hover:shadow-xl"
        style={{
          background: gig?.backgroundColor || "rgba(17, 24, 39, 0.8)",
          color: gig?.fontColor || "#f3f4f6",
        }}
      >
        {/* Header Row */}
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center space-x-3">
            {/* Avatar */}
            <div className="w-10 h-10 rounded-full overflow-hidden border border-gray-700 flex-shrink-0">
              {gig?.logo ? (
                <Image
                  src={gig.logo}
                  alt="gig-logo"
                  width={40}
                  height={40}
                  className="w-full h-full object-cover"
                />
              ) : gig?.postedBy?.picture ? (
                <Image
                  src={gig.postedBy.picture}
                  alt="user-picture"
                  width={40}
                  height={40}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full bg-gray-800 flex items-center justify-center">
                  <span className="text-sm">👤</span>
                </div>
              )}
            </div>

            {/* Title and Info */}
            <div className="min-w-0">
              <h3 className="text-base font-medium text-white truncate">
                {gig?.title}
              </h3>
              <div className="flex items-center text-sm text-gray-400 mt-1 space-x-4">
                <span className="flex items-center">
                  <svg
                    className="w-4 h-4 mr-1.5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={1.5}
                      d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                    />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={1.5}
                      d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                    />
                  </svg>
                  {gig?.location}
                </span>
                <span className="flex items-center">
                  <svg
                    className="w-4 h-4 mr-1.5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={1.5}
                      d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                  {gig?.price}
                </span>
              </div>
            </div>
          </div>

          {/* Status Badge */}
          <span
            className={`text-xs px-3 py-1 rounded-full ${
              gig?.isTaken
                ? "bg-emerald-900/30 text-emerald-400 border border-emerald-800/50"
                : "bg-blue-900/30 text-blue-400 border border-blue-800/50"
            }`}
          >
            {gig?.isTaken ? "Taken" : "Available"}
          </span>
        </div>

        {/* Footer Actions */}
        <div className="flex justify-between items-center pt-3 mt-3 border-t border-gray-800">
          <div className="flex items-center">
            <span className="text-sm text-gray-400">
              {gig?.postedBy?.username?.split(" ")[0] || "User"}
            </span>
          </div>

          <div className="flex items-center space-x-2">
            {canShowAddGigVideos && (
              <button
                onClick={() => {
                  setCurrentGig(gig);
                  setShowVideo(true);
                }}
                className="text-xs bg-emerald-800/70 hover:bg-emerald-700/70 px-3 py-1.5 rounded-md transition-colors flex items-center border border-emerald-700/50"
              >
                <Video size={14} className="mr-1.5" />
                Add Videos
              </button>
            )}

            {/* Review Button */}
            {isCreatorIsCurrentUserAndTaken(gig, myId as string) && (
              <button
                onClick={() => handleReviewModal(gig)}
                className={`text-xs px-3 py-1.5 rounded-md transition-colors border ${
                  gig.postedBy?.myreviews?.some(
                    (review) => review.gigId === gig._id
                  )
                    ? "bg-gray-800/50 text-gray-400 border-gray-700 cursor-default"
                    : "bg-amber-800/70 hover:bg-amber-700/70 text-amber-100 border-amber-700/50"
                }`}
              >
                {gig.postedBy?.myreviews?.some(
                  (review) => review.gigId === gig._id
                )
                  ? "Reviewed"
                  : "Leave Review"}
              </button>
            )}

            {/* Primary Action Buttons */}
            {isCurrentWhoCreatedGig && (
              <div className="relative">
                <span className="absolute -right-1 -top-1 bg-yellow-700 text-white rounded-full text-[10px] w-5 h-5 flex justify-center items-center border border-yellow-600/50">
                  {bookCount}
                </span>
                <ButtonComponent
                  variant="secondary"
                  classname="!bg-indigo-800/70 hover:!bg-indigo-700/70 h-8 text-xs font-normal text-white px-4 rounded-md transition-all border border-indigo-700/50"
                  onclick={() => {
                    setLoadingPostId(gig?._id as string);
                    setTimeout(() => {
                      handleBookedUsers(gig?._id as string);
                      setLoadingPostId("");
                    }, 2000);
                  }}
                  disabled={loadingPostId.length > 0}
                  title={loadingPostId === gig._id ? "Opening..." : "View"}
                />
              </div>
            )}

            {isCurrentWhoBooked && (
              <ButtonComponent
                variant="secondary"
                classname="!bg-indigo-800/70 hover:!bg-indigo-700/70 h-8 text-xs font-normal text-white px-4 rounded-md transition-all border border-indigo-700/50"
                onclick={() => {
                  setLoadingPostId(gig?._id || "");
                  setTimeout(() => {
                    handleEditBooked(gig?._id || "");
                    setLoadingPostId("");
                  }, 2000);
                }}
                title={loadingPostId === gig._id ? "Opening..." : "View"}
              />
            )}

            {canEditGig && (
              <ButtonComponent
                variant="secondary"
                classname="!bg-gray-800/50 hover:!bg-gray-700/50 h-8 text-xs font-normal text-white px-4 rounded-md transition-all border border-gray-700/50"
                onclick={() => {
                  setLoadingPostId(gig?._id as string);
                  setTimeout(() => {
                    setCurrentGig(gig);
                    setConfirmEdit(true);
                    setLoadingPostId(gig?._id as string);
                  }, 2000);
                }}
                title={loadingPostId === gig._id ? "Opening..." : "Edit"}
              />
            )}

            {gig?.postedBy?._id &&
              gig?.postedBy?._id !== myId &&
              !hasBookedGig &&
              gig?.bookCount.length < 4 &&
              currentUser?.isClient === false &&
              gig?.isTaken === false && (
                <ButtonComponent
                  variant="secondary"
                  classname="!bg-purple-800/70 hover:!bg-purple-700/70 h-8 text-xs font-normal text-white px-4 rounded-md transition-all border border-purple-700/50"
                  onclick={() => {
                    setLoadingPostId(gig?._id || "");
                    setTimeout(() => {
                      bookGig(
                        gig,
                        myId as string,
                        gigs || [],
                        userId as string,
                        toast,
                        setRefetchGig,
                        router
                      );
                      setLoadingPostId("");
                    }, 2000);
                  }}
                  title={
                    loadingPostId === gig?._id && !bookLoading
                      ? "Processing..."
                      : "Book"
                  }
                />
              )}

            {/* Context Menu */}
            {!gig?.isTaken && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleModal(gig);
                }}
                className="text-gray-400 hover:text-white p-1.5 transition-colors hover:bg-gray-700/50 rounded-md"
                aria-label="More options"
              >
                <PiDotsThreeVerticalBold size={18} />
              </button>
            )}
          </div>
        </div>
      </motion.div>
    </>
  );
};

export default AllGigsComponent;
