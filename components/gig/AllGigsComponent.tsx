// components/gig/AllGigsComponent.ts
import { GigProps } from "@/types/giginterface";
import React, { useCallback, useEffect, useState } from "react";
import ButtonComponent from "../ButtonComponent";
import { PiDotsThreeVerticalBold } from "react-icons/pi";
import GigDescription from "./GigDescription";
import useStore from "@/app/zustand/useStore";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useAllGigs } from "@/hooks/useAllGigs";

import { useAuth } from "@clerk/nextjs";
// import { ArrowRight } from "lucide-react";
import Image from "next/image";
import { useSocketContext } from "@/app/Context/socket";
import { useBookGig } from "@/hooks/useBookGig";
import { isCreatorIsCurrentUserAndTaken } from "@/constants";
import { Ban, EyeIcon, Lock } from "lucide-react";
import { motion } from "framer-motion";
import { Trash2, X } from "lucide-react";
import { Input } from "../ui/input";
import { useCurrentUser } from "@/hooks/useCurrentUser";
import { useScheduleGig } from "@/hooks/useScheduleGig";
import { canStillBookThisWeekDetailed, formatViewCount } from "@/utils";
import { useSubscription } from "@/hooks/useSubscription";
import clsx from "clsx";
import { getGigConditions } from "@/gigHelper";
import { useMemo } from "react";
import { FaBookmark, FaHeart, FaRegBookmark, FaRegHeart } from "react-icons/fa";
import { toast } from "sonner";

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
  const { schedulegig } = useScheduleGig();
  const { socket } = useSocketContext();
  const { gigs, mutateGigs } = useAllGigs() || { gigs: [] }; // Default to empty array if null or undefined
  const { user } = useCurrentUser();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const {
    currentgig,
    setShowModal,
    setRefetchGig,
    setIsDescriptionModal,
    isDescriptionModal,
    setCurrentGig,
    setConfirmEdit,

    setSelectedReview,
    loadingPostId,
    loadPostId,
    setLoadPostId,
    setLoadingPostId,

    setLastBookedGigId,

    setShowConfirmation,
    setShowConfetti,
  } = useStore();

  const { subscription } = useSubscription(userId as string);
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
  // Clear loading state when route changes
  useEffect(() => {
    setLoadingPostId("");
  }, [pathname, searchParams]);
  const handleNavigation = async (path: string) => {
    setLoadingPostId(gig?._id || "");
    try {
      await router.push(path);
    } finally {
      setLoadingPostId("");
    }
  };

  const handleBookGig = async (giginfo: GigProps) => {
    const result = await bookGig(
      giginfo,
      myId,
      gigs,
      userId as string,
      toast,
      setRefetchGig,
      router,
      {
        redirectOnSuccess: false,
        preventAutoRevalidate: true,
      }
    );

    if (result.success) {
      setLastBookedGigId(giginfo._id ? giginfo?._id : "");
      setShowConfetti(true);

      setTimeout(() => {
        setShowConfetti(false);
        setShowConfirmation(true);
      }, 3000); // Auto-hide after 3s
    }
  };

  // In your parent component

  const existingSecret = localStorage.getItem("secret");
  const bookingStatus = canStillBookThisWeekDetailed(subscription);
  const classes = clsx(
    "h-7 text-[11px] font-normal px-3 my-1 transition-all rounded",
    {
      "!bg-purple-600 hover:!bg-purple-700 text-white": bookingStatus.canBook,
      "!bg-gray-200 text-gray-600 cursor-not-allowed": !bookingStatus.canBook,
      "opacity-70": bookLoading,
    }
  );

  // Inside your component

  const {
    isCurrentWhoCreatedGig,
    isCurrentWhoBooked,
    canEditGig,
    formattedPrice,
    canPostAScheduledGig,
    allowedToBookGig,
    isProOnlyForFreeUser,
  } = useMemo(
    () =>
      getGigConditions(
        gig,
        user,
        myId,

        bookCount,
        subscription
      ),
    [gig, user, myId, bookCount, subscription]
  );
  console.log(user);

  const [isFavorite, setIsFavorite] = useState(() =>
    user?.user?.favoriteGigs?.includes(gig._id)
  );
  const [isSaved, setIsSaved] = useState(
    user?.user?.savedGigs?.includes(gig._id)
  );

  const handleFavourite = useCallback(async (action: "add" | "remove") => {
    const previousState = isFavorite;
    setIsFavorite(action === "add");
    try {
      const method = action === "add" ? "POST" : "DELETE";
      const response = await fetch(
        `/api/gigs/dashboard/${userId}/favorites/${gig._id}`,
        {
          method,
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      if (!response.ok) {
        setIsFavorite(previousState);
        throw new Error("Failed to update favorite");
      }
      const data = await response.json();
      setIsFavorite(action === "add");
      toast.success(data.message);
    } catch (error) {
      console.error("Error updating favorite:", error);
      toast.error("Failed to update favorite");
    }
  }, []);

  const handleSave = useCallback(async (action: "add" | "remove") => {
    try {
      const method = action === "add" ? "POST" : "DELETE";
      const response = await fetch(
        `/api/gigs/dashboard/${userId}/saved/${gig._id}/`,
        {
          method,
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (!response.ok) throw new Error("Failed to update saved gigs");

      setIsSaved(action === "add");
      const data = await response.json();
      toast.success(data.message);
    } catch (error) {
      console.error("Error updating saved gig:", error);
      toast.error("Failed to update saved gig");
    }
  }, []);
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
              : "rgba(66,28,35,0.9)",
          color: gig?.fontColor || "#f3f4f6",
        }}
      >
        {/* Compact Header */}
        <div className="flex justify-between items-start mb-2">
          <div className="flex-1 min-w-0">
            <h3 className="text-sm font-medium text-white truncate">
              {gig?.title}
            </h3>
            <div className="flex items-center text-xs text-white/70 mt-1 space-x-3 ">
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
              <span className="flex items-center text-[11px] w-[200px]">
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
                {formattedPrice}
              </span>
            </div>
          </div>
          <div className="flex items-center gap-1 text-sm text-gray-400">
            <EyeIcon className="h-3 w-3" />
            <span className="title">
              {formatViewCount(gig?.viewCount)} views
            </span>
          </div>

          {/* Status Badge */}
          <div
            className={`text-[10px] px-2 py-0.5 rounded-full ml-2 ${
              gig?.isTaken
                ? "bg-emerald-900/50 text-emerald-300"
                : isProOnlyForFreeUser
                ? "bg-purple-900/60 text-purple-300"
                : bookingStatus.status === "available"
                ? "bg-blue-900/60 text-cyan-400"
                : "inline-flex items-center px-3 py-1 rounded-full text-[9px] font-medium bg-gradient-to-r from-amber-600/90 to-amber-700/90 text-amber-100 border border-amber-500/30 shadow-sm"
            }`}
          >
            {gig?.isTaken ? (
              "Taken"
            ) : gig?.isPending ? (
              <span className="text-yellow-300">Coming Soon</span>
            ) : (
              <span className="space-x-2">
                {gig?.postedBy?._id !== user?.user?._id ||
                gig?.bookedBy?._id === user?.user?._id ? (
                  <>
                    {isProOnlyForFreeUser ? (
                      "Pro Only"
                    ) : bookingStatus.status === "available" ? (
                      <span className="text-green-300">Available</span>
                    ) : (
                      <span className="text-amber-300">Premium</span>
                    )}
                  </>
                ) : (
                  ""
                )}
              </span>
            )}
          </div>
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
            {/* <span className="text-xs text-white/70">
              {gig?.postedBy?.username?.split(" ")[0] || "User"}
            </span> */}
          </div>

          <div className="flex space-x-2">
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
                    handleNavigation(`/pre_execute/${gig?._id}`);
                    handleBookedUsers(gig?._id as string);
                  }}
                  disabled={loadingPostId === gig._id}
                  title={loadingPostId === gig._id ? "Opening..." : "View"}
                />
              </div>
            )}
            {canPostAScheduledGig && (
              <div className="w-full h-full relative">
                <ButtonComponent
                  variant="secondary"
                  classname="!bg-indigo-600/90 hover:!bg-indigo-500 h-7 text-[11px] font-normal text-white px-3 rounded transition-all"
                  onclick={async () => {
                    setLoadPostId(gig?._id as string);
                    try {
                      await schedulegig(gig?._id as string, toast);
                      mutateGigs("/api/gigs/getgigs");
                    } finally {
                      setLoadPostId("");
                    }
                  }}
                  disabled={loadPostId === gig._id}
                  title={loadPostId === gig._id ? "Creating..." : "Post"}
                />
              </div>
            )}{" "}
            {isCurrentWhoBooked && (
              <ButtonComponent
                variant="secondary"
                classname="!bg-indigo-600/90 hover:!bg-indigo-500 h-7 text-[11px] font-normal text-white px-3 rounded transition-all"
                onclick={() => {
                  handleNavigation(`/execute/${gig?._id}`);
                  handleEditBooked(gig?._id || "");
                }}
                disabled={loadingPostId === gig._id}
                title={loadingPostId === gig._id ? "Opening..." : "View"}
              />
            )}{" "}
            {canEditGig && (
              <ButtonComponent
                variant="secondary"
                classname="!bg-white/10 hover:!bg-white/20 h-7 text-[11px] font-normal text-white px-3 rounded transition-all"
                onclick={(ev: React.MouseEvent<HTMLButtonElement>) => {
                  ev.preventDefault();
                  setLoadingPostId(gig?._id as string);
                  setCurrentGig(gig);
                  if (!existingSecret) {
                    setConfirmEdit(true);
                  } else {
                    router.push(`/editpage/${gig?._id}`);
                  }
                  // No need to clear loading state here as it's not a navigation
                }}
                title={loadingPostId === gig._id ? "Opening..." : "Edit"}
                disabled={loadingPostId === gig._id}
              />
            )}
            {allowedToBookGig ? (
              <div className="flex flex-col gap-1">
                <ButtonComponent
                  variant={
                    bookingStatus.isLoading
                      ? "ghost"
                      : bookingStatus.canBook
                      ? "default"
                      : "ghost"
                  }
                  classname={classes}
                  onclick={() =>
                    !bookingStatus.isLoading &&
                    bookingStatus.canBook &&
                    handleBookGig(gig)
                  }
                  disabled={
                    bookingStatus.isLoading ||
                    !bookingStatus.canBook ||
                    bookLoading
                  }
                >
                  {bookLoading ? (
                    "Processing..."
                  ) : bookingStatus.isLoading ? (
                    "Checking availability..."
                  ) : bookingStatus.canBook ? (
                    "Book"
                  ) : (
                    <>
                      {bookingStatus.status === "pro-only" ? (
                        <span className="flex items-center gap-1">
                          <Lock className="h-3 w-3" />
                          Pro Only
                        </span>
                      ) : (
                        <span className="flex items-center gap-1">
                          <Ban className="h-3 w-3" />
                          Limit Reached
                        </span>
                      )}
                    </>
                  )}
                </ButtonComponent>

                {!bookingStatus.isLoading && !bookingStatus.canBook && (
                  <p className="text-xs text-amber-600">
                    {bookingStatus.reason}
                  </p>
                )}
                {!bookingStatus.isLoading &&
                  !bookingStatus.canBook &&
                  bookingStatus.desc && (
                    <p
                      onClick={() => router.push(`/dashboard/billing`)}
                      className="cursor-pointer text-xs text-amber-100 flex justify-center bg-emerald-500 animate-pulse p-2 rounded-xl"
                    >
                      {bookingStatus.desc}
                    </p>
                  )}
              </div>
            ) : (
              gig?.postedBy?._id !== myId &&
              gig?.bookedBy?._id !== myId &&
              gig?.isPending === false && (
                <>
                  {isProOnlyForFreeUser ? (
                    <div className="text-center">
                      <p className="text-xs text-amber-300 mb-1 bg-gray-500 p-2">
                        Pro members only for gigs over 10k KES
                      </p>
                      <ButtonComponent
                        variant="ghost"
                        classname="!bg-purple-600 hover:!bg-purple-700 h-7 text-[11px] font-normal text-white px-3 rounded transition-all"
                        onclick={() => router.push("/dashboard/billing")}
                        title="Upgrade to Pro"
                      />
                    </div>
                  ) : (
                    <div className="text-center">
                      <ButtonComponent
                        variant="ghost"
                        classname="!bg-gray-400 hover:!bg-gray-500 h-7 text-[11px] font-normal text-white px-3 rounded transition-all cursor-not-allowed"
                        disabled={true}
                        title="Not Available"
                        onclick={() => console.log("data")}
                      />
                      <p className="text-xs text-amber-600 mt-1">
                        This gig is not available for booking
                      </p>
                    </div>
                  )}
                </>
              )
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
            {subscription.user?.tier === "free" ||
              (gig?.isTaken === false && gig?.postedBy?._id !== myId && (
                <>
                  <div className="w-full absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />

                  <div className="absolute top-23 right-1/2 flex gap-2 opacity-40 hover:opacity-80">
                    <button
                      onClick={() => {
                        const action = isFavorite ? "remove" : "add";
                        handleFavourite(action);
                      }}
                      className="p-2 bg-gray-800/80 rounded-full hover:bg-amber-500/80 transition-colors"
                    >
                      {isFavorite ? (
                        <FaHeart className="text-amber-500" />
                      ) : (
                        <FaRegHeart className="text-white" />
                      )}
                    </button>
                    <button
                      onClick={() => {
                        const action = isSaved ? "remove" : "add";
                        handleSave(action);
                      }}
                      className="p-2 bg-gray-800/80 rounded-full hover:bg-amber-500/80 transition-colors"
                    >
                      {isSaved ? (
                        <FaBookmark className="text-amber-500" />
                      ) : (
                        <FaRegBookmark className="text-white" />
                      )}
                    </button>
                  </div>
                </>
              ))}
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
