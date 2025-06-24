"use client";

import { useParams, useRouter } from "next/navigation";
import { useGetGigs } from "@/hooks/useGetGig";
import useStore from "@/app/zustand/useStore";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ChatBubbleOvalLeftIcon,
  UserIcon,
  VideoCameraIcon,
  XMarkIcon,
} from "@heroicons/react/24/solid";
import { UserProps } from "@/types/userinterfaces";
import Modal from "../Modal";
import { useAuth } from "@clerk/nextjs";
import { useCurrentUser } from "@/hooks/useCurrentUser";
import { useBookMusician } from "@/hooks/useForgetBooking";
import { CircularProgress } from "@mui/material";
import { toast } from "sonner";
import { Drum } from "lucide-react";
import useSocket from "@/hooks/useSocket";
import { CancelationModal } from "./dashboard/PendingModal";

const PrePendingComponent = () => {
  const { userId } = useAuth();
  const { id } = useParams();
  const { loading } = useGetGigs(id as string);
  const { currentgig, setRefetchGig } = useStore();
  const { user } = useCurrentUser();
  const router = useRouter();
  const { bookloading, bookgig } = useBookMusician();
  const [selectedUser, setSelectedUser] = useState<string | null>(null);
  const { socket } = useSocket();
  const [modal, setModal] = useState<{
    type: "chat" | "video";
    user: UserProps;
  } | null>(null);
  const [showX, setShowX] = useState(false);
  const [selectedBookingId, setSelectedBookingId] = useState<string | null>(
    null
  );
  console.log(showX);
  const {
    cancelationreason,
    setcancelationreason,
    setShowCancelGig,
    cancelGig,
  } = useStore();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [removingId, setRemovingId] = useState<string | null>(null);
  const [showConfirmation, setShowConfirmation] = useState(false);

  const removeMusicianfrombookCount = async (userid: string) => {
    try {
      setIsSubmitting(true);
      const updatedGig = {
        ...currentgig,
        bookCount:
          currentgig?.bookCount?.filter((musician) => musician._id !== id) ||
          [],
      };
      useStore.setState({ currentgig: updatedGig });

      const req = await fetch(`/api/gigs/remove-musician/${currentgig?._id}`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          musicianId: userid,
          reason: cancelationreason,
          dep: "client",
        }),
      });

      const data: { message: string } = await req.json();
      if (!req.ok) throw new Error(data.message);

      setRefetchGig(true);
      toast.success(data.message);
    } catch (error) {
      useStore.setState({ currentgig });
      toast.error(
        error instanceof Error ? error.message : "Failed to remove musician"
      );
    } finally {
      setIsSubmitting(false);
      setRemovingId(null);
      setShowCancelGig(false);
    }
  };

  const handleBookUser = (bookingId: string) => {
    setSelectedUser(bookingId);
    setSelectedBookingId(bookingId);
    setShowConfirmation(true);
  };

  const confirmCancel = () => {
    if (selectedBookingId) {
      bookgig(router, currentgig, userId || "", selectedBookingId);
      if (socket) {
        socket.emit("gigBookinMusician", {
          gigId: currentgig?._id,
          musicianId: selectedBookingId,
          isTaken: true,
          title: currentgig?.title,
        });
      }
      setShowConfirmation(false);
    } else {
      toast.error("No booking ID selected.");
    }
  };

  const handleRemoveWithReason = (userid: string) => {
    setRemovingId(userid);
    setShowCancelGig(true);
  };

  const confirmCancellationWithReason = (reason: string) => {
    setcancelationreason(reason);
    removeMusicianfrombookCount(removingId || "");
  };

  const handleOpenX = () => {
    setShowX(false);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-900">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          className="w-10 h-10 border-4 border-amber-500 border-t-transparent rounded-full"
        />
      </div>
    );
  }

  return (
    <div className="p-6 pb-8 bg-gray-900 text-gray-100 min-h-screen">
      <CancelationModal
        isOpen={cancelGig}
        onClose={() => {
          setShowCancelGig(false);
          setRemovingId(null);
        }}
        onSubmit={confirmCancellationWithReason}
        isLoading={isSubmitting}
        userType="client"
      />

      <AnimatePresence>
        {showConfirmation && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-70 backdrop-blur-sm z-50"
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              className="bg-gray-800 p-8 rounded-xl shadow-2xl border border-gray-700 sm:max-w-md max-w-sm w-full"
            >
              <div className="flex justify-between items-start mb-4">
                <h4 className="text-xl font-bold text-gray-100">
                  Confirm Booking
                </h4>
                <button
                  onClick={() => setShowConfirmation(false)}
                  className="text-gray-400 hover:text-gray-200 transition-colors"
                >
                  <XMarkIcon className="h-6 w-6" />
                </button>
              </div>
              <p className="text-gray-300 mb-6">
                Are you sure you want to book this musician? This action cannot
                be undone.
              </p>
              <div className="flex gap-4 justify-end">
                <button
                  className="px-6 py-2 bg-gray-700 hover:bg-gray-600 text-gray-200 rounded-lg transition-all duration-200"
                  onClick={() => {
                    setSelectedUser(null);
                    setShowConfirmation(false);
                  }}
                >
                  Cancel
                </button>
                <button
                  className="px-6 py-2 bg-amber-600 hover:bg-amber-500 text-white rounded-lg transition-all duration-200 shadow-lg shadow-amber-500/10"
                  onClick={confirmCancel}
                >
                  Confirm
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {bookloading && (
        <div className="fixed inset-0 z-50 backdrop-blur-md bg-black bg-opacity-70 flex justify-center items-center">
          <CircularProgress
            size={40}
            thickness={4}
            className="text-amber-500"
          />
        </div>
      )}

      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        exit={{ opacity: 0, height: 0 }}
        className="max-w-4xl mx-auto p-8 bg-gray-800 rounded-xl shadow-2xl border border-gray-700"
      >
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-100 mb-2">
            {currentgig?.title}
          </h1>
          <p className="text-gray-400 text-lg mb-4 capitalize">
            {currentgig?.description}
          </p>
          <div className="flex items-center gap-2">
            <span
              className={`inline-block w-3 h-3 rounded-full ${
                currentgig?.isTaken ? "bg-red-500" : "bg-green-500"
              }`}
            ></span>
            <p className="text-sm font-medium tracking-wide uppercase">
              {currentgig?.isTaken
                ? "Position Filled"
                : "Accepting Applications"}
            </p>
          </div>
        </div>
        <div className="mb-6">
          <h2 className="text-2xl font-semibold text-gray-200 mb-4">
            {currentgig && currentgig?.bookCount?.length > 0
              ? "Interested Musicians"
              : "No Applicants Yet"}
          </h2>
          <div className="space-y-4 max-h-[500px] overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-gray-600 scrollbar-track-gray-800">
            {currentgig?.bookCount?.map((myuser: UserProps) => (
              <motion.div
                key={myuser?._id}
                className="group relative p-5 bg-gray-750 rounded-lg border border-gray-700 hover:border-amber-500/30 transition-all duration-200"
                whileHover={{ y: -2 }}
                layout
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-lg font-semibold text-gray-100 truncate">
                        {myuser.firstname} {myuser.lastname}
                      </h3>
                      <button
                        className={`opacity-0 group-hover:opacity-100 text-gray-400 hover:text-red-400 transition-all ${
                          removingId === myuser?._id ? "cursor-not-allowed" : ""
                        }`}
                        onClick={() =>
                          removingId !== myuser?._id &&
                          handleRemoveWithReason(myuser?._id || "")
                        }
                        disabled={removingId === myuser?._id}
                      >
                        <XMarkIcon className="h-5 w-5 text-white" />
                      </button>
                    </div>

                    <p className="text-sm text-gray-400 mb-3">{myuser.email}</p>

                    <div className="flex flex-wrap gap-2">
                      {myuser.instrument && (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-700 text-amber-300">
                          {myuser.instrument === "drums" ? (
                            <>
                              <Drum className="h-3 w-3 mr-1" />{" "}
                              {myuser.instrument}
                            </>
                          ) : (
                            <>
                              {myuser.instrument === "piano" && "🎹"}
                              {myuser.instrument === "guitar" && "🎸"}
                              {myuser.instrument === "bass" && "🎸"}
                              {myuser.instrument === "saxophone" && "🎷"}
                              {myuser.instrument === "trumpet" && "🎺"}
                              {myuser.instrument === "violin" && "🎻"}
                              {myuser.instrument}
                            </>
                          )}
                        </span>
                      )}

                      {myuser.roleType && (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-700 text-blue-300">
                          {myuser.roleType === "dj" && "🎛 DJ"}
                          {myuser.roleType === "mc" && "🪕 MC"}
                          {myuser.roleType === "voaclist" && "🎙 Vocalist"}
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center gap-2 sm:gap-3">
                    <button
                      onClick={() => handleBookUser(myuser?._id || "")}
                      className={`px-4 py-2 text-sm rounded-lg font-medium transition-all ${
                        selectedUser === user?.user?._id
                          ? "bg-gray-600 text-gray-400 cursor-not-allowed"
                          : "bg-amber-600 hover:bg-amber-500 text-white shadow-md"
                      }`}
                      disabled={selectedUser !== null}
                    >
                      Book
                    </button>

                    <div className="flex gap-2">
                      <button
                        className="p-2 text-amber-400 hover:text-amber-300 bg-gray-700 hover:bg-gray-650 rounded-full transition-all"
                        onClick={() => setModal({ type: "chat", user: myuser })}
                      >
                        <ChatBubbleOvalLeftIcon className="h-5 w-5" />
                      </button>
                      <button
                        className="p-2 text-blue-400 hover:text-blue-300 bg-gray-700 hover:bg-gray-650 rounded-full transition-all"
                        onClick={() =>
                          router.push(`/search/${myuser?.username}`)
                        }
                      >
                        <UserIcon className="h-5 w-5" />
                      </button>
                      <button
                        className="p-2 text-red-400 hover:text-red-300 bg-gray-700 hover:bg-gray-650 rounded-full transition-all"
                        onClick={() =>
                          setModal({ type: "video", user: myuser })
                        }
                      >
                        <VideoCameraIcon className="h-5 w-5" />
                      </button>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.div>

      <AnimatePresence>
        {modal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-80 backdrop-blur-md z-50"
          >
            <Modal
              onClose={() => setModal(null)}
              modal={modal}
              user={user?.user}
              onOpenX={handleOpenX}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default PrePendingComponent;
