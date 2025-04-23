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
import { useVideos } from "@/hooks/useVideos";
import { useSocketContext } from "@/app/Context/socket";
import { useBookGig } from "@/hooks/useBookGig";
import { isCreatorIsCurrentUserAndTaken } from "@/constants";
import { Video } from "lucide-react";
import { motion } from "framer-motion";
import { Trash2, X } from "lucide-react";
import { Input } from "../ui/input";
import { useCurrentUser } from "@/hooks/useCurrentUser";
import { useScheduleGig } from "@/hooks/useScheduleGig";
import ButtonComponentLoader from "./gigpages/ButtonComponentLoader";

// import { useCurrentUser } from "@/hooks/useCurrentUser";
interface FetchResponse {
  success: boolean;
  message?: string;
  // Add other fields as per your API response
}
interface AllGigsComponentProps {
  gig: GigProps;
}

// Add this utility function outside your component

const AllGigsComponent: React.FC<AllGigsComponentProps> = ({ gig }) => {
  const { userId } = useAuth();
  const { schedulegig, loading } = useScheduleGig();
  const { socket } = useSocketContext();
  const { gigs } = useAllGigs() || { gigs: [] }; // Default to empty array if null or undefined
  const { user } = useCurrentUser();
  const {
    currentgig,
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
  const [currviewCount, setCurrviewCount] = useState(0);
  const [isDeleteModal, setIsDeleteModal] = useState(false);

  const { bookGig, bookLoading } = useBookGig();
  const myId = user?.user?._id;
  const router = useRouter();
  // conditionsl styling
  const handleModal = async (gig: GigProps) => {
    try {
      if (gig?.postedBy?._id === myId) {
        if (currviewCount > 3) {
          setIsDeleteModal(true);
          setCurrentGig(gig);
          return;
        }
        setCurrviewCount((prev) => prev + 1);
        setIsDeleteModal(true);
        setCurrentGig(gig);
        return;
      }
      const res = await fetch(`/api/gigs/addview/${gig?._id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ userid: user?.user?._id }),
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
  const canShowAddGigVideos =
    gig?.isPending === false &&
    gig?.isTaken === true &&
    testfilteredvids &&
    gig?.bookedBy?._id === myId &&
    gig?.postedBy?._id !== myId &&
    testfilteredvids?.length < 4;
  // user?.videos.length < 4;

  // helper variables
  const isGigCreator = gig?.postedBy?._id === myId;
  const hasBookedGig = gig?.bookCount?.some((i) => i?._id === myId);
  console.log(isGigCreator);
  const isCurrentWhoCreatedGig =
    isGigCreator && !hasBookedGig && bookCount > 0 && gig?.isTaken === false;
  const isCurrentWhoBooked = hasBookedGig && !isGigCreator;

  console.log(myId);
  const canEditGig =
    gig?.postedBy?._id &&
    isGigCreator &&
    bookCount === 0 &&
    gig?.isTaken === false;

  const showPriceRangeAndCurrency =
    gig?.pricerange === "thousands"
      ? `${gig?.price}k ${gig?.currency} `
      : gig?.pricerange === "hundreds"
      ? `${gig?.price},00 ${gig?.currency} `
      : gig?.pricerange === "tensofthousands"
      ? `${gig?.price}0000 ${gig?.currency} `
      : gig?.pricerange === "hundredsofthousands"
      ? `${gig?.price},00000 ${gig?.currency} `
      : `${gig?.price} ${gig?.currency} `;

  console.log(gig);
  //

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

  console.log(gig);

  return (
    <>
      {isDescriptionModal && <GigDescription />}
      {isDeleteModal && (
        <DeleteModal
          setIsDeleteModal={setIsDeleteModal}
          currentGig={currentgig}
        />
      )}
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="w-[90%] mx-auto bg-white/5 backdrop-blur-sm rounded-xl p-3 mb-3 border border-white/10 hover:border-white/20 transition-all"
        style={{
          background:
            gig?.isPending === false
              ? gig?.backgroundColor || "rgba(26,28,35,0.8)"
              : "grey",
          color: gig?.fontColor || "#f3f4f6",
        }}
      >
        {/* Compact Header */}
        <div className="flex justify-between items-start mb-2">
          <div className="flex-1 min-w-0">
            <h3 className="text-sm font-medium text-white truncate">
              {gig?.title}
            </h3>
            <div className="flex items-center text-xs text-white/70 mt-1 space-x-3 line-clamp-1">
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
                <span className="line-clamp-1">{gig?.location}</span>
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
                {showPriceRangeAndCurrency}
              </span>
            </div>
          </div>

          {/* Status Badge */}
          <span
            className={`text-[10px] px-2 py-0.5 rounded-full ml-2 ${
              gig?.isTaken
                ? "bg-emerald-900/50 text-emerald-300"
                : "bg-blue-900/60 text-cyan-400"
            }`}
          >
            {gig?.isTaken ? (
              "Taken"
            ) : gig?.isPending ? (
              <span className="text-yellow-300">Coming Soon</span>
            ) : (
              <span className="text-green-300 space-x-2">Available</span>
            )}
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
                  setCurrentGig(gig);
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
                  <span className="absolute right-0 -top-1 bg-yellow-800 text-white rounded-full text-[8px] w-4 h-4 flex justify-center items-center ">
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
            {/* // For the "Post" button (Creator scheduling their gig) */}
            {isGigCreator && !hasBookedGig && gig?.isPending === true && (
              <div className="relative">
                <ButtonComponentLoader
                  variant="secondary"
                  className={`
        bg-gradient-to-r from-indigo-600 to-indigo-500
        hover:from-indigo-500 hover:to-indigo-400
        h-8 text-xs font-medium text-white 
        px-4 py-1.5 rounded-md 
        transition-all duration-200
        shadow-sm hover:shadow-md
        transform hover:scale-[1.02] active:scale-[0.98]
        focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:ring-opacity-50
        disabled:opacity-70 disabled:cursor-not-allowed
        relative overflow-hidden
        ${loadingPostId !== null && loading ? "cursor-wait" : ""}
      `}
                  onClick={() => {
                    setLoadingPostId(gig?._id as string);
                    setTimeout(() => {
                      schedulegig(gig?._id as string, toast);
                      setLoadingPostId("");
                    }, 2000);
                  }}
                  isLoading={loadingPostId !== null && loading}
                  isCurrentLoading={loadingPostId === gig._id}
                  loadingText="Publishing..."
                >
                  Post Gig
                </ButtonComponentLoader>
              </div>
            )}
            {/* // For the "View" button (Booker viewing their booked gig) */}
            {isCurrentWhoBooked && (
              <ButtonComponentLoader
                variant="secondary"
                className={`
      bg-gradient-to-r from-indigo-600 to-indigo-500
      hover:from-indigo-500 hover:to-indigo-400
      h-8 text-xs font-medium text-white 
      px-4 py-1.5 rounded-md 
      transition-all duration-200
      shadow-sm hover:shadow-md
      transform hover:scale-[1.02] active:scale-[0.98]
      focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:ring-opacity-50
      disabled:opacity-70 disabled:cursor-not-allowed
      relative overflow-hidden
      ${loadingPostId !== null ? "cursor-wait" : ""}
    `}
                onClick={() => {
                  setLoadingPostId(gig?._id || "");
                  setTimeout(() => {
                    handleEditBooked(gig?._id || "");
                    setLoadingPostId("");
                  }, 2000);
                }}
                isLoading={loadingPostId !== null}
                isCurrentLoading={loadingPostId === gig._id}
                loadingText="Opening..."
              >
                View Gig
              </ButtonComponentLoader>
            )}
            {canEditGig && (
              <ButtonComponentLoader
                variant="secondary"
                className={`
      bg-gradient-to-r from-gray-700 to-gray-600
      hover:from-gray-600 hover:to-gray-500
      h-8 text-xs font-medium text-white 
      px-4 py-1.5 rounded-md 
      transition-all duration-200
      shadow-sm hover:shadow-md
      transform hover:scale-[1.02] active:scale-[0.98]
      focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-opacity-50
      disabled:opacity-70 disabled:cursor-not-allowed
      relative overflow-hidden
      ${loadingPostId !== null ? "cursor-wait" : ""}
    `}
                onClick={() => {
                  setLoadingPostId(gig?._id as string);
                  setTimeout(() => {
                    setCurrentGig(gig);
                    setConfirmEdit(true);
                    setLoadingPostId(gig?._id as string);
                  }, 2000);
                }}
                isLoading={loadingPostId !== null}
                isCurrentLoading={loadingPostId === gig._id}
                loadingText="Opening..."
              >
                Edit Gig
              </ButtonComponentLoader>
            )}
            {gig &&
              user &&
              gig?.postedBy?._id &&
              gig?.postedBy?._id !== myId &&
              !hasBookedGig &&
              gig?.bookCount.length < 4 &&
              user?.user?.isMusician === true &&
              gig?.isTaken === false &&
              gig?.isPending === false && (
                <ButtonComponentLoader
                  className={`
        bg-gradient-to-r from-purple-600 to-purple-500
        hover:from-purple-500 hover:to-purple-400
        h-8 text-xs font-medium text-white 
        px-4 py-1.5 rounded-md 
        transition-all duration-200
        shadow-sm hover:shadow-md
        transform hover:scale-[1.02] active:scale-[0.98]
        focus:outline-none focus:ring-2 focus:ring-purple-400 focus:ring-opacity-50
        disabled:opacity-70 disabled:cursor-not-allowed
        relative overflow-hidden
        ${loadingPostId !== null && !bookLoading ? "cursor-wait" : ""}
      `}
                  onClick={() => {
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
                  isLoading={loadingPostId !== null}
                  isCurrentLoading={loadingPostId === gig._id}
                  loadingText="Booking..."
                >
                  Book Now
                </ButtonComponentLoader>
              )}
            {gig?.isPending === true &&
              gig?.postedBy?._id !== user?.user?._id && (
                <ButtonComponent
                  variant="ghost"
                  classname="!bg-red-600/90 hover:!bg-purple-500 h-7 text-[11px] font-normal text-white px-3 rounded transition-all"
                  onclick={() => console.log("data")}
                  title={"Pending"}
                  disabled={true}
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
      </motion.div>
    </>
  ); // Example: Displaying the title
};

export default AllGigsComponent;

const DeleteModal = ({
  setIsDeleteModal,
  currentGig,
}: {
  setIsDeleteModal: (showDeleteModal: boolean) => void;
  currentGig: GigProps;
}) => {
  const [showConfirm, setShowConfirm] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [confirm, setConfirm] = useState("");

  const checkSecret = (e: React.ChangeEvent<HTMLInputElement>) => {
    setConfirm(e.target.value);
  };
  const handleDelete = async (ev: React.FormEvent<HTMLFormElement>) => {
    ev.preventDefault();
    if (!confirm) {
      setError("Please enter the secret");
      return;
    }
    if (confirm.toLowerCase() !== currentGig.secret.toLowerCase()) {
      setError("Invalid Secret");
    } else {
      try {
        setDeleting(false);
        const data = await fetch(`/api/gigs/delete-gig/${currentGig?._id}`, {
          method: "DELETE",
        });
        const d = await data.json();
        if (!data.ok) {
          toast.success(d.message);
          setShowConfirm(true);
          setIsDeleteModal(true);
          throw new Error("Failed to delete gig");
        }
        setDeleting(true);
        setConfirm("");
        toast.success(d.message);
        setShowConfirm(false);
        setIsDeleteModal(false);
        setSuccess(d.message ? d.message : "Gig deleted successfully");

        // You might want to add a success toast/message here
      } catch (error) {
        console.error(error);
        setIsDeleteModal(false);
        setError("Failed to delete gig");
        setDeleting(false);
        // You might want to add an error toast/message here
      }
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 overflow-y-auto"
    >
      <div className="flex min-h-screen items-center justify-center p-4 text-center">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="fixed inset-0 bg-black/50 transition-opacity"
          onClick={() => setIsDeleteModal(false)}
        />
        {!showConfirm ? (
          <motion.div
            initial={{ scale: 0.95, y: 20 }}
            animate={{ scale: 1, y: 0 }}
            className="relative w-[85%] max-w-md transform overflow-hidden rounded-lg bg-white p-6 text-left align-middle shadow-xl transition-all"
          >
            {/* Close button */}
            <button
              onClick={() => setIsDeleteModal(false)}
              className="absolute right-4 top-4 rounded-md p-1 text-gray-400 hover:bg-gray-100 hover:text-gray-500"
            >
              <X size={20} />
            </button>

            {/* Modal content */}
            <div className="flex flex-col items-center">
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-red-100">
                <Trash2 className="h-6 w-6 text-red-600" />
              </div>

              <h3 className="mt-3 text-lg font-medium leading-6 text-gray-900">
                Delete Gig
              </h3>

              <div className="mt-2">
                <p className="text-center text-sm text-gray-500">
                  Are you sure you want to delete{" "}
                  <span className="font-medium">
                    {currentGig?.title || "this gig"}
                  </span>
                  ? This action cannot be undone.
                </p>
              </div>

              <div className="mt-6 flex w-full justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => setIsDeleteModal(false)}
                  className="rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                >
                  Cancel
                </button>

                <button
                  type="button"
                  onClick={() => setShowConfirm(true)}
                  className="rounded-md border border-transparent bg-red-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
                >
                  Delete
                </button>
              </div>
            </div>
          </motion.div>
        ) : (
          <>
            {/* Delete Confirmation */}
            <motion.div
              initial={{ scale: 0.95, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              className="relative w-[85%] max-w-md transform overflow-hidden rounded-lg bg-white p-6 text-left align-middle shadow-xl transition-all"
            >
              {" "}
              <div className="mt-2">
                <p className="text-center text-sm text-gray-500">
                  To delete the{" "}
                  <span className="font-medium">
                    {currentGig?.title || "this gig"}
                  </span>
                  ? enter your gig secret.
                </p>
              </div>
              <form onSubmit={handleDelete}>
                <Input
                  type="text"
                  value={confirm}
                  placeholder="Gig Secret"
                  className="mt-3 block w-full px-4 py-2 text-sm text-gray-700 placeholder-gray-500 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                  onChange={(e) => checkSecret(e)}
                />{" "}
                {error && (
                  <span className="mt-2 text-red-500 text-xs">{error}</span>
                )}
                {success && (
                  <span className="mt-2 text-green-500 text-xs">{success}</span>
                )}
                <div className="mt-6 flex w-full justify-center space-x-3">
                  <button
                    type="submit"
                    className="rounded-md border border-transparent bg-red-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                    disabled={confirm.length === 0 ? true : false}
                  >
                    {!deleting ? "Confirm" : "Deleting...."}
                  </button>
                </div>
              </form>
            </motion.div>
          </>
        )}
      </div>
    </motion.div>
  );
};
