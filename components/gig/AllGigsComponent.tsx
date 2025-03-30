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
// import { ArrowRight } from "lucide-react";
import Image from "next/image";
import Videos from "./Videos";
import { useVideos } from "@/hooks/useVideos";
import { motion } from "framer-motion";
import { useSocketContext } from "@/app/Context/socket";
import { useBookGig } from "@/hooks/useBookGig";
import { isCreatorIsCurrentUserAndTaken } from "@/constants";
import { Video } from "lucide-react";

// import { useCurrentUser } from "@/hooks/useCurrentUser";
interface FetchResponse {
  success: boolean;
  message?: string;
  // Add other fields as per your API response
}
interface AllGigsComponentProps {
  gig: GigProps;
}

const AllGigsComponent: React.FC<AllGigsComponentProps> = ({ gig }) => {
  const { userId } = useAuth();
  const [loadingPostId, setLoadingPostId] = useState<string>("");
  const { socket } = useSocketContext();
  const { gigs } = useAllGigs() || { gigs: [] }; // Default to empty array if null or undefined
  const [showvideo, setShowVideo] = useState<boolean>(false);

  const {
    currentUser,

    setShowModal,
    setRefetchGig,
    setIsDescriptionModal,
    isDescriptionModal,
    setCurrentGig,

    setSelectedReview,
  } = useStore();

  const [bookCount, setBookCount] = useState(gig.bookCount.length || 0);
  const { bookGig, bookLoading } = useBookGig();
  const myId = currentUser?._id;
  const router = useRouter();
  // conditionsl styling
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
  // Booking function it updates the isPending state
  const handleEditBooked = async (id: string) => {
    router.push(`/execute/${id}`);
  };

  const handleBookedUsers = (id: string) => {
    router.push(`/pre_execute/${id}`);
  };
  const handleEdit = async (id: string) => {
    return router.push(`/editpage/${id}`);
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
      // Redirect to execute page if no review exists
      router.push(`/execute/${gig._id}`);
    }
  };

  const validGigid = typeof gig?._id === "string" ? gig?._id : ""; // Default to empty string if undefined
  const validUserId =
    typeof gig?.bookedBy?._id === "string" ? gig?.bookedBy?._id : ""; // Default to empty string if undefined

  const { friendvideos } = useVideos(validGigid, validUserId);
  const testfilteredvids = friendvideos?.videos?.filter(
    (video) => video.gigId === gig._id
  );
  const [currentId, setCurrentId] = useState<string | null>();
  const canShowAddGigVideos =
    gig?.isPending === false &&
    gig?.isTaken === true &&
    testfilteredvids &&
    gig?.bookedBy?._id === myId &&
    gig?.postedBy?._id !== myId &&
    testfilteredvids?.length < 4;
  // user?.videos.length < 4;

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
        className="w-full bg-white/5 backdrop-blur-sm rounded-xl p-3 mb-3 border border-white/10 hover:border-white/20 transition-all"
        style={{
          background: gig?.backgroundColor || "rgba(26,28,35,0.8)",
          color: gig?.fontColor || "#f3f4f6",
        }}
      >
        {/* Compact Header */}
        <div className="flex justify-between items-start mb-2">
          <div className="flex-1 min-w-0">
            <h3 className="text-sm font-medium text-white truncate">
              {gig?.title}
            </h3>
            <div className="flex items-center text-xs text-white/70 mt-1 space-x-3">
              <span className="flex items-center">
                <svg
                  className="w-3 h-3 mr-1"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                  />
                </svg>
                {gig?.location}
              </span>
              <span className="flex items-center">
                <svg
                  className="w-3 h-3 mr-1"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                {gig?.price}
              </span>
            </div>
          </div>

          {/* Status Badge */}
          <span
            className={`text-[10px] px-2 py-0.5 rounded-full ml-2 ${
              gig?.isTaken
                ? "bg-emerald-900/50 text-emerald-300"
                : "bg-blue-900/60 text-teal-400"
            }`}
          >
            {gig?.isTaken ? "Taken" : "Available"}
          </span>
        </div>
        {/* Minimal Footer */}
        <div className="flex justify-between items-center mt-2 pt-2 border-t border-white/5">
          <div className="flex items-center">
            <div className="w-6 h-6 rounded-full overflow-hidden border border-white/10 mr-2">
              {gig?.logo ? (
                <Image
                  src={gig.logo}
                  alt="gig-logo"
                  width={24}
                  height={24}
                  className="w-full h-full object-cover"
                />
              ) : gig?.postedBy?.picture ? (
                <Image
                  src={gig.postedBy.picture}
                  alt="user-picture"
                  width={24}
                  height={24}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full bg-white/10 flex items-center justify-center">
                  <span className="text-xs">👤</span>
                </div>
              )}
            </div>
            <span className="text-xs text-white/70">
              {gig?.postedBy?.username?.split(" ")[0] || "User"}
            </span>
          </div>

          <div className="flex space-x-2">
            {canShowAddGigVideos && (
              <button
                onClick={() => {
                  setCurrentId(gig._id);
                  setShowVideo(true);
                }}
                className="text-xs bg-emerald-600/90 hover:bg-emerald-500 px-2 py-1 rounded transition-colors flex items-center"
              >
                <Video size={12} className="mr-1" />
                Add Videos
              </button>
            )}
            {/* Review Button (Restored) */}
            {isCreatorIsCurrentUserAndTaken(gig, myId as string) && (
              <button
                onClick={() => handleReviewModal(gig)}
                className={`text-xs px-3 py-1.5 rounded-md transition-colors  ${
                  gig.postedBy?.myreviews?.some(
                    (review) => review.gigId === gig._id
                  )
                    ? "bg-gray-300 text-gray-600 cursor-default" // Reviewed state
                    : "bg-amber-700 hover:bg-amber-600 text-white" // Review state
                }`}
              >
                {gig.postedBy?.myreviews?.some(
                  (review) => review.gigId === gig._id
                )
                  ? "Reviewed"
                  : "Leave Review"}
              </button>
            )}
            {/* Primary Action Button */}
            {isCurrentWhoCreatedGig && (
              <div className="w-full h-full relative">
                <span className="w6 h-6">
                  <span className="absolute right-0 -top-1 bg-yellow-800 rounded-full text-[8px] w-4 h-4 flex justify-center items-center ">
                    {bookCount}
                  </span>
                </span>
                <ButtonComponent
                  variant="secondary"
                  classname="!bg-indigo-600/90 hover:!bg-indigo-500 h-7 text-[11px] font-normal text-white px-3 rounded transition-all"
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
            )}{" "}
            {isCurrentWhoBooked && (
              <ButtonComponent
                variant="secondary"
                classname="!bg-indigo-600/90 hover:!bg-indigo-500 h-7 text-[11px] font-normal text-white px-3 rounded transition-all"
                onclick={() => {
                  setLoadingPostId(gig?._id || "");
                  setTimeout(() => {
                    handleEditBooked(gig?._id || "");
                    setLoadingPostId("");
                  }, 2000);
                }}
                title={loadingPostId === gig._id ? "Opening..." : "View"}
              />
            )}{" "}
            {canEditGig && (
              <ButtonComponent
                variant="secondary"
                classname="!bg-white/10 hover:!bg-white/20 h-7 text-[11px] font-normal text-white px-3 rounded transition-all"
                onclick={() => {
                  setLoadingPostId(gig?._id || "");
                  setTimeout(() => {
                    handleEdit(gig?._id || "");
                    setLoadingPostId("");
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
                  classname="!bg-purple-600/90 hover:!bg-purple-500 h-7 text-[11px] font-normal text-white px-3 rounded transition-all"
                  onclick={() => {
                    setLoadingPostId(gig?._id || "");
                    setTimeout(() => {
                      bookGig(
                        gig,
                        myId as string,
                        gigs?.gigs || [],
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
                className="text-white hover:text-white p-1 transition-colors"
                aria-label="More options"
              >
                <PiDotsThreeVerticalBold size={16} />
              </button>
            )}
          </div>
        </div>
        {/* Modals */}

        {showvideo && currentId === gig?._id && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          >
            <motion.div
              initial={{ scale: 0.95 }}
              animate={{ scale: 1 }}
              className="w-full max-w-md bg-zinc-800 rounded-xl overflow-hidden border border-zinc-700"
            >
              <Videos
                setShowVideo={setShowVideo}
                gigId={currentId || ""}
                gig={gig}
              />
            </motion.div>
          </motion.div>
        )}
      </motion.div>
    </>
  ); // Example: Displaying the title
};

export default AllGigsComponent;
