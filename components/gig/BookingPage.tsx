import { useCurrentUser } from "@/hooks/useCurrentUser";
import { useForgetBookings } from "@/hooks/useForgetBooking";
import { useAuth } from "@clerk/nextjs";
import { CircularProgress } from "@mui/material";
import { ArrowLeft, X } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";

import Modal from "../Modal";
import { UserProps } from "@/types/userinterfaces";
import { ChatBubbleOvalLeftIcon } from "@heroicons/react/24/solid";
import { GigProps } from "@/types/giginterface";
import MusicWaveLoader from "../loaders/MusicWaver";
import { motion } from "framer-motion";
import FollowButton from "../pages/FollowButton";

interface BookingProps {
  currentGig: GigProps;
}

const BookingPage = ({ currentGig }: BookingProps) => {
  const currentgig = currentGig;
  const { userId } = useAuth();
  const { loading, forgetBookings } = useForgetBookings();
  const { user } = useCurrentUser();
  const router = useRouter();
  const forget = () =>
    forgetBookings(user?.user?._id as string, currentgig, userId as string);

  useEffect(() => {
    if (currentgig?.isTaken === true) {
      router.push(`/gigs/${userId}`);
    }
    if (
      currentgig?.bookCount?.some(
        (myuser) => myuser?._id === user?.user?._id
      ) &&
      currentgig?.isTaken === false
    ) {
      return;
    }
  }, [
    currentgig?.isTaken,
    currentgig?.isPending,
    currentgig?.bookCount,
    user?.user?._id,
    userId,
    router,
  ]);

  const postedByUser = currentgig?.postedBy;
  const [modal, setModal] = useState<{
    type: "chat" | "video";
    user: UserProps;
  } | null>(null);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [showX, setShowX] = useState(false);

  const playSound = () => {
    try {
      const audio = new Audio("../../public/notification-tone.mp3");
      audio.play().catch((error) => {
        console.error("Failed to play sound:", error);
      });
    } catch (error) {
      console.error("Failed to load sound:", error);
    }
  };

  const handleCancel = () => {
    setShowConfirmation(true);
  };

  const confirmCancel = () => {
    playSound();
    forget();
    setShowConfirmation(false);
  };

  const handleOpenX = () => {
    setShowX(false);
  };

  if (!currentgig?.title || !user?.user?.firstname) {
    return (
      <div className="flex items-center justify-center w-full h-full">
        <MusicWaveLoader />
      </div>
    );
  }

  const showPriceRangeAndCurrency =
    currentgig?.pricerange === "thousands"
      ? `${currentgig?.price}k ${currentgig?.currency} `
      : currentgig?.pricerange === "hundreds"
      ? `${currentgig?.price},00 ${currentgig?.currency} `
      : currentgig?.pricerange === "tensofthousands"
      ? `${currentgig?.price}0000 ${currentgig?.currency} `
      : currentgig?.pricerange === "hundredsofthousands"
      ? `${currentgig?.price},00000 ${currentgig?.currency} `
      : `${currentgig?.price} ${currentgig?.currency} `;

  console.log(currentgig?.postedBy?.followers);
  return (
    <div className="relative w-full h-[calc(100vh-100px)] bg-gray-950 overflow-hidden">
      {/* Floating Action Button */}
      {!showX && (
        <div className="fixed right-6 top-24 z-50 group">
          <div className="relative">
            {/* Floating cancel button with animated pulses */}
            <button
              onClick={handleCancel}
              disabled={loading}
              className={`flex items-center justify-center w-14 h-14 rounded-full shadow-xl cursor-pointer transform transition-all duration-300
          ${
            loading
              ? "bg-gray-600 hover:bg-gray-600"
              : "bg-gradient-to-br from-red-500 to-red-600 hover:from-red-600 hover:to-red-700"
          }
          hover:scale-110 hover:shadow-2xl active:scale-95
          animate-[float_3s_ease-in-out_infinite] hover:animate-none
          ring-2 ring-transparent hover:ring-red-400/50`}
              aria-label="Cancel booking"
            >
              {!loading ? (
                <>
                  <X size={24} className="text-white" />
                  {/* Micro-interaction particles */}
                  <span className="absolute inset-0 overflow-hidden rounded-full">
                    {[...Array(8)].map((_, i) => (
                      <span
                        key={i}
                        className="absolute block w-1 h-1 bg-white/80 rounded-full"
                        style={{
                          top: "50%",
                          left: "50%",
                          transform: "translate(-50%, -50%)",
                          opacity: 0,
                          transition: "all 0.6s ease-out",
                        }}
                      />
                    ))}
                  </span>
                </>
              ) : (
                <CircularProgress size={24} className="text-white" />
              )}
            </button>

            {/* Animated tooltip */}
            <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-gray-800 text-white text-xs px-3 py-1.5 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-200 shadow-lg flex items-center">
              <span>Cancel Booking</span>
              {/* Tooltip arrow */}
              <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-2 h-2 bg-gray-800 rotate-45"></span>
            </div>
          </div>
        </div>
      )}

      {/* Main Content */}
      <div className="h-full overflow-y-auto scroll-smooth scrollbar-thin scrollbar-thumb-gray-700 scrollbar-track-gray-900">
        <div className="max-w-4xl mx-auto px-4 py-8">
          {/* Confirmation Modal */}
          {showConfirmation && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm">
              <div className="bg-gray-800 rounded-xl p-6 max-w-md w-full border border-gray-700 shadow-2xl animate-fade-in">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-xl font-bold text-white">
                    Confirm Cancellation
                  </h3>
                  <button
                    onClick={() => setShowConfirmation(false)}
                    className="text-gray-400 hover:text-white transition-colors"
                  >
                    <X size={20} />
                  </button>
                </div>
                <p className="text-gray-300 mb-6">
                  Are you sure you want to cancel this booking? This action
                  cannot be undone.
                </p>
                <div className="flex justify-end space-x-3">
                  <button
                    onClick={() => setShowConfirmation(false)}
                    className="px-4 py-2 rounded-lg bg-gray-700 hover:bg-gray-600 text-white transition-all duration-200 hover:shadow-md"
                  >
                    Go Back
                  </button>
                  <button
                    onClick={confirmCancel}
                    className="px-4 py-2 rounded-lg bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white transition-all duration-200 hover:shadow-md"
                  >
                    Confirm
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Profile Header */}
          <section className="mb-8">
            <div className="p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  {currentgig?.logo && (
                    <div className="relative w-16 h-16 rounded-full overflow-hidden border-2 border-yellow-400 shadow-lg">
                      <Image
                        src={currentgig.logo}
                        alt="Profile"
                        width={64}
                        height={64}
                        className="object-cover"
                      />
                    </div>
                  )}
                  <div>
                    <h2 className="text-xl font-bold text-white">
                      {currentgig?.postedBy?.firstname}{" "}
                      {currentgig?.postedBy?.lastname}
                    </h2>
                    <p className="text-gray-400 text-sm">
                      @{currentgig?.postedBy?.username}
                    </p>
                  </div>
                </div>
              </div>
              <div className="mt-6 flex justify-between items-center">
                <div className="flex space-x-6">
                  <div className="text-center">
                    <p className="text-amber-400 font-bold">
                      {currentgig?.viewCount?.length}
                    </p>
                    <p className="text-gray-400 text-xs">Views</p>
                  </div>
                  <div className="text-center">
                    <p className="text-amber-400 font-bold">
                      {currentgig?.postedBy?.followers?.length || 0}
                    </p>
                    <p className="text-gray-400 text-xs">Followers</p>
                  </div>
                  <div className="text-center">
                    <p className="text-amber-400 font-bold">
                      {currentgig?.postedBy?.followings?.length || 0}
                    </p>
                    <p className="text-gray-400 text-xs">Following</p>
                  </div>
                </div>
              </div>{" "}
              <div className="flex items-center space-x-3 self-end sm:self-center mt-3">
                <ArrowLeft
                  size={16}
                  className="text-neutral-300"
                  onClick={() => router.back()}
                />
                {user?.user?._id && currentgig?.postedBy?.followers && (
                  <motion.div
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <FollowButton
                      _id={currentgig?.postedBy?._id as string}
                      followers={currentgig?.postedBy?.followers}
                      myid={user?.user?.id}
                    />
                  </motion.div>
                )}
                <button
                  onClick={() => {
                    setShowX(true);
                    setModal({ type: "chat", user: postedByUser });
                  }}
                  className="p-2.5 bg-gray-700 hover:bg-gray-600 rounded-full text-yellow-400 hover:text-yellow-300 transition-all duration-200 shadow"
                  aria-label="Chat"
                >
                  <ChatBubbleOvalLeftIcon className="w-5 h-5" />
                </button>
              </div>
            </div>
          </section>

          {/* Gig Details Sections */}
          <div className="space-y-6">
            {/* Gig Information Card */}
            <section className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-2xl p-6 shadow-xl border border-gray-700">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm uppercase tracking-wider text-gray-400 font-medium">
                  Gig Details
                </h3>
                <div className="text-xs text-yellow-400 bg-yellow-400/10 px-2 py-1 rounded-full">
                  Active Booking
                </div>
              </div>
              <h2 className="text-3xl font-bold text-white mb-3">
                {currentgig?.title}
              </h2>
              <p className="text-gray-300 mb-6 leading-relaxed">
                {currentgig?.description}
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-gray-800/50 p-4 rounded-lg border border-gray-700">
                  <div className="text-gray-400 text-sm mb-1">Location</div>
                  <div className="text-white font-medium">
                    {currentgig?.location}
                  </div>
                </div>
                <div className="bg-gray-800/50 p-4 rounded-lg border border-gray-700">
                  <div className="text-gray-400 text-sm mb-1">Compensation</div>
                  <div className="text-white font-medium">
                    {showPriceRangeAndCurrency}
                  </div>
                </div>
              </div>
            </section>

            {/* Schedule Card */}
            <section className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-2xl p-6 shadow-xl border border-gray-700">
              <h3 className="text-sm uppercase tracking-wider text-gray-400 mb-6 font-medium">
                Schedule
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <h4 className="text-gray-400 text-sm mb-1">Start Time</h4>
                    <p className="text-white font-medium">
                      {currentgig?.time?.from}
                    </p>
                  </div>
                  <div>
                    <h4 className="text-gray-400 text-sm mb-1">Finish Time</h4>
                    <p className="text-white font-medium">
                      {currentgig?.time?.to}
                    </p>
                  </div>
                </div>
                <div>
                  <h4 className="text-gray-400 text-sm mb-1">Gig Type</h4>
                  <p className="text-white font-medium mb-3">
                    {currentgig?.bussinesscat === "full"
                      ? "Full Band"
                      : currentgig?.bussinesscat === "personal"
                      ? "Individual"
                      : currentgig?.bussinesscat === "other"
                      ? "Musicians Cocktail"
                      : ""}
                  </p>
                  {currentgig?.bussinesscat === "other" &&
                    currentgig?.bandCategory &&
                    currentgig?.bandCategory.length > 0 && (
                      <div className="mt-2 flex flex-wrap gap-2">
                        {[...new Set(currentgig.bandCategory)].map(
                          (bnd: string, i: number) => (
                            <span
                              key={i}
                              className="inline-block px-3 py-1 bg-gray-700 rounded-full text-xs text-yellow-400 animate-pulse"
                            >
                              {bnd}
                            </span>
                          )
                        )}
                      </div>
                    )}
                </div>
              </div>
            </section>

            {/* Contact Card */}
            <section className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-2xl p-6 shadow-xl border border-gray-700 mb-12">
              <h3 className="text-sm uppercase tracking-wider text-gray-400 mb-6 font-medium">
                Contact Information
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-gray-800/50 p-4 rounded-lg border border-gray-700">
                  <h4 className="text-gray-400 text-sm mb-1">Phone</h4>
                  <p className="text-white font-medium">{currentgig?.phone}</p>
                </div>
                <div className="bg-gray-800/50 p-4 rounded-lg border border-gray-700">
                  <h4 className="text-gray-400 text-sm mb-1">Email</h4>
                  <p className="text-white font-medium">
                    {currentgig?.postedBy?.email}
                  </p>
                </div>
              </div>
            </section>
          </div>
        </div>
      </div>

      {/* Chat/Video Modal */}
      {modal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm">
          <Modal
            onClose={() => setModal(null)}
            modal={modal}
            user={user?.user}
            onOpenX={handleOpenX}
          />
        </div>
      )}
    </div>
  );
};

export default BookingPage;
