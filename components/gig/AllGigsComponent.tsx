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

import { useCurrentUser } from "@/hooks/useCurrentUser";
import { useScheduleGig } from "@/hooks/useScheduleGig";
import { canStillBookThisWeekDetailed, formatViewCount } from "@/utils";
import { useSubscription } from "@/hooks/useSubscription";
import clsx from "clsx";
import { getGigConditions } from "@/gigHelper";
import { useMemo } from "react";
import { FaBookmark, FaHeart, FaRegBookmark, FaRegHeart } from "react-icons/fa";
import { toast } from "sonner";
import { getConfirmState, useConfirmPayment } from "@/hooks/useConfirmPayment";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "../ui/input";
import { useCancelGig } from "@/hooks/useCancelGig";
import { Button } from "../ui/button";

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
    setShowPaymentConfirmation,
  } = useStore();

  const { isConfirming, isFinalizing, finalizePayment } = useConfirmPayment();
  const { paymentConfirmations, setConfirmedParty, setCanFinalize } =
    useStore();

  const gigId = gig?._id;
  const confirmation = gigId ? paymentConfirmations[gigId] : undefined;
  const confirmedParty = confirmation?.confirmedParty ?? "none";
  const canFinalize = confirmation?.canFinalize ?? false;

  console.log(confirmation, confirmedParty, canFinalize);
  useEffect(() => {
    const storedState = getConfirmState(gig._id ? gig?._id : "");

    setConfirmedParty(gig._id ? gig?._id : "", storedState.confirmedParty);
    setCanFinalize(gig._id ? gig?._id : "", storedState.canFinalize);
  }, []);
  const { subscription } = useSubscription(userId as string);
  const [bookCount, setBookCount] = useState(gig.bookCount.length || 0);
  const [currviewCount, setCurrviewCount] = useState(0);
  const [isDeleteModal, setIsDeleteModal] = useState(false);

  const { bookGig, bookLoading } = useBookGig();
  const myId = user?.user?._id;
  const router = useRouter();

  const isClient = gig?.postedBy?._id === myId;
  // conditionsl styling

  const needsClientConfirmation = gig?.isTaken && isClient;

  const paymentConfirmed = gig?.paymentStatus === "paid";

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
      // Add to local booking history state if using context/state management

      setLastBookedGigId(giginfo._id || "");
      setShowConfetti(true);

      setTimeout(() => {
        setShowConfetti(false);
        setShowConfirmation(true);
      }, 3000);
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

  const [showCancelDialog, setShowCancelDialog] = useState(false);
  const [cancelReason, setCancelReason] = useState("");
  const [cancelingGigId, setCancelingGigId] = useState<string | null>(null);
  const { cancelGig, isCanceling } = useCancelGig();
  console.log(gig);
  const handleCancelClick = (gigId: string) => {
    setCancelingGigId(gigId);
    setShowCancelDialog(true);
    setCurrentGig(gig); // Assuming you want to track the current gig
  };

  const handleConfirmCancel = async () => {
    if (!cancelingGigId || !cancelReason) return;

    try {
      await cancelGig(
        cancelingGigId,
        gig.bookedBy?._id ? gig.bookedBy?._id : "", // musicianId
        cancelReason,
        isClient ? "client" : "musician" // Determine role based on who is canceling
      );
      setShowCancelDialog(false);
      setCancelReason("");
      setCancelingGigId(null);
    } catch (error) {
      console.error("Cancellation failed:", error);
    }
  };

  const handleFinalizePayment = async () => {
    if (!currentgig) return;

    await finalizePayment(
      gig._id ? gig?._id : "",
      isClient ? "client" : "musician",
      "Confirmed payment ,Finalized via app"
    );
  };

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
            {/* Payment Confirmation Flow */}
            {needsClientConfirmation && (
              <div className="w-full flex flex-col gap-2">
                {/* Initial state */}
                {confirmedParty === "none" &&
                  !gig?.clientConfirmPayment?.code && (
                    <div className="flex justify-evenly gap-4">
                      <ButtonComponent
                        variant="secondary"
                        classname="!bg-green-600 hover:!bg-green-700 h-7 text-[11px] font-normal text-white px-3 rounded transition-all"
                        onclick={() => {
                          setShowPaymentConfirmation(true);
                          setCurrentGig(gig);
                        }}
                        disabled={isConfirming || isFinalizing}
                        title={
                          isConfirming
                            ? "Confirming..."
                            : isFinalizing
                            ? "Finalizing..."
                            : "Confirm Payment"
                        }
                      />
                      <ButtonComponent
                        variant="secondary"
                        classname="!bg-red-600 hover:!bg-red-700 h-7 text-[11px] font-normal text-white px-3 rounded transition-all"
                        onclick={() => handleCancelClick(gig._id ?? "")}
                        disabled={isCanceling}
                        title={isCanceling ? "Canceling..." : "Cancel Musician"}
                      />
                    </div>
                  )}

                {/* Waiting for other party */}
                {gig?.clientConfirmPayment?.code &&
                  gig?.clientConfirmPayment?.temporaryConfirm &&
                  !gig?.musicianConfirmPayment?.code &&
                  !gig?.musicianConfirmPayment?.temporaryConfirm && (
                    <div className="text-center">
                      <p className="text-xs text-yellow-400 font-medium animate-pulse">
                        Payment Status Pending:Wating for musician confirmation
                      </p>
                      <div className="flex justify-center mt-1">
                        <div className="h-1 w-1/2 bg-yellow-400 rounded-full animate-pulse"></div>
                      </div>
                    </div>
                  )}

                {/* Finalize button */}
                {gig?.musicianConfirmPayment?.temporaryConfirm &&
                  gig?.clientConfirmPayment?.temporaryConfirm &&
                  !gig?.musicianConfirmPayment?.confirmPayment &&
                  !gig?.clientConfirmPayment?.confirmPayment && (
                    <ButtonComponent
                      variant="secondary"
                      classname="!bg-emerald-600 hover:!bg-emerald-700 w-full h-7 text-[11px] font-semibold text-white px-3 rounded transition-all"
                      onclick={() => handleFinalizePayment()}
                      disabled={isFinalizing}
                      title={
                        isFinalizing ? "Finalizing..." : "Finalize Payment"
                      }
                    />
                  )}
              </div>
            )}
            {/* Review Button (Restored) */}
            {gig.postedBy?.myreviews?.some(
              (review) => review.gigId === gig._id
            ) ? (
              <button className="text-xs px-3 py-1.5 rounded-md bg-gray-300 text-gray-600 cursor-default">
                Reviewed
              </button>
            ) : paymentConfirmed &&
              isCreatorIsCurrentUserAndTaken(gig, myId as string) ? (
              <button
                onClick={() => handleReviewModal(gig)}
                className="text-xs px-3 py-1.5 rounded-md bg-amber-700 hover:bg-amber-600 text-white whitespace-nowrap"
              >
                Leave Review
              </button>
            ) : null}
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
            {subscription?.user?.tier === "free" ||
              (gig?.isTaken === false && gig?.postedBy?._id !== myId && (
                <>
                  <div className="w-full absolute inset-0 bg-gradient-to-t  to-transparent -z-50" />

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
      {/* Cancellation Dialog */}
      <Dialog open={showCancelDialog} onOpenChange={setShowCancelDialog}>
        <DialogContent className="sm:max-w-[500px] max-w-[360px]  bg-white dark:bg-gray-900 rounded-xl shadow-xl border border-gray-200 dark:border-gray-700 transition-all duration-300">
          <DialogHeader>
            <DialogTitle className="text-2xl font-semibold text-gray-800 dark:text-white">
              ❌ Cancel Booking
            </DialogTitle>
            <DialogDescription className="text-sm text-gray-500 dark:text-gray-300">
              Please provide a reason for cancelling this booking. This helps us
              improve future experiences.
            </DialogDescription>
          </DialogHeader>

          <div className="grid gap-6 py-4">
            <div className="flex flex-col gap-2">
              <label
                htmlFor="reason"
                className="text-sm font-medium text-gray-700 dark:text-gray-300"
              >
                Reason for cancellation
              </label>
              <Input
                id="reason"
                value={cancelReason}
                onChange={(e) => setCancelReason(e.target.value)}
                placeholder="E.g. scheduling conflict, artist unavailable..."
                className="w-full px-4 py-2 border rounded-md bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white placeholder-gray-400 focus:ring-2 focus:ring-indigo-500 dark:focus:ring-cyan-500 focus:outline-none transition"
              />
            </div>
          </div>

          <DialogFooter className="flex justify-end space-x-4 mt-4">
            <Button
              variant="outline"
              onClick={() => setShowCancelDialog(false)}
              className="border-gray-300 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-300 transition"
            >
              Back
            </Button>
            <Button
              variant="destructive"
              onClick={handleConfirmCancel}
              disabled={!cancelReason || isCanceling}
              className="bg-red-600 hover:bg-red-700 text-white transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isCanceling ? "Cancelling..." : "Confirm Cancellation"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
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
