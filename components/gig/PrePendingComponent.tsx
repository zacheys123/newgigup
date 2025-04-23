"use client";

import { useParams, useRouter } from "next/navigation";
import { useGetGigs } from "@/hooks/useGetGig";
import useStore from "@/app/zustand/useStore";
import { useState } from "react";
import { motion } from "framer-motion";
import {
  ChatBubbleOvalLeftIcon,
  UserIcon,
  VideoCameraIcon,
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
  console.log(modal);
  const [showX, setShowX] = useState(false);
  // //   const forget = () => forgetBookings(userId || "", currentgig);
  // const handleBookUser = (bookingId: string) => {
  //   setSelectedUser(bookingId);
  //   console.log(`User ${userId} booked. Others disqualified.`);
  //   bookgig(router, currentgig, userId || "", bookingId as string);
  // };

  // Define the onOpenX function
  const handleOpenX = () => {
    setShowX(false); // Reset the showX state
  };
  console.log(showX);

  const removeMusicianfrombookCount = async (id: string) => {
    try {
      const req = await fetch(`/api/gigs/remove-musician/${currentgig?._id}`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ musicianId: id }),
      });
      console.log("Musician removed from book count.");
      const data: { message: string } = await req.json();
      console.log(data);
      setRefetchGig(true);
      toast.success(data.message);
    } catch (error) {
      console.error(error);
    }
  };
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [selectedBookingId, setSelectedBookingId] = useState<string | null>(
    null
  );

  const handleBookUser = (bookingId: string) => {
    setSelectedUser(bookingId);
    setSelectedBookingId(bookingId);
    setShowConfirmation(true);
  };

  const confirmCancel = () => {
    if (selectedBookingId) {
      // playSound();
      bookgig(router, currentgig, userId || "", selectedBookingId);
      if (socket) {
        socket.emit("gigBookinMusician", {
          gigId: currentgig?._id,
          musicianId: selectedBookingId,
          isTaken: true,
          title: currentgig?.title,
          // bookCount: currentgig?.bookCount,
        });
      }
      setShowConfirmation(false);
    } else {
      toast.error("No booking ID selected.");
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen text-gray-300 backdrop-blur-xl bg-black bg-opacity-50 ">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full"
        />
      </div>
    );
  }
  return (
    <div className="p-6 pb-[30px] bg-gradient-to-b from-gray-900 to-black text-white min-h-screen">
      {showConfirmation && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm z-50">
          <div className="bg-gray-700 p-6 rounded-lg shadow-lg ">
            <h4 className="text-gray-200 text-lg font-bold mb-4">
              Are you sure?
            </h4>
            <p className="text-gray-400 text-sm mb-4">
              This action cannot be undone.
            </p>
            <div className="flex gap-4">
              <button
                className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-md transition-colors"
                onClick={confirmCancel}
              >
                Confirm
              </button>
              <button
                className="bg-gray-600 hover:bg-gray-500 text-white px-4 py-2 rounded-md transition-colors"
                onClick={() => {
                  setSelectedUser(null);
                  setShowConfirmation(false);
                }}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
      {bookloading && (
        <div className="h-[800px] absolute w-[90%] mx-auto  z-50 backdrop-blur-xl bg-black bg-opacity-50 flex justify-center items-center">
          <CircularProgress
            className="mx-auto mb-6"
            size={30}
            thickness={5}
            style={{ color: "yellow" }}
          />
        </div>
      )}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-3xl mx-auto p-6 bg-gray-800 rounded-xl shadow-xl pb-[50px]"
      >
        <h1 className="text-3xl font-extrabold text-gray-100">
          {currentgig?.title}
        </h1>
        <p className="text-gray-400 text-md mt-2 capitalize">
          {currentgig?.description}
        </p>
        <p
          className={`mt-3 text-sm font-semibold tracking-wide uppercase ${
            currentgig?.isTaken ? "text-red-400" : "text-green-400"
          }`}
        >
          {currentgig?.isTaken ? "This gig is taken" : "Available"}
        </p>

        <h2 className="text-2xl font-semibold mt-6 text-gray-200">
          {currentgig && currentgig?.bookCount?.length > 0
            ? "Interested Musicians"
            : "No Musicians"}
        </h2>
        <div className="mt-1 max-h-[370px]  sm:max-h-[400px] overflow-y-auto scrollbar-thin scrollbar-thumb-gray-600 scrollbar-track-gray-800 space-y-4">
          {currentgig?.bookCount?.map((myuser: UserProps) => {
            return (
              <motion.div
                key={myuser?._id}
                className="flex last:mb-30 flex-col sm:flex-row justify-between items-start sm:items-center p-4 bg-gray-700 rounded-lg transition-all shadow-md relative"
                whileHover={{
                  scale: 1.02,
                  boxShadow: "0px 5px 15px rgba(255, 255, 255, 0.1)",
                }}
              >
                <div className="min-w-0 flex-1">
                  <p className="text-lg font-semibold text-gray-100">
                    {myuser.firstname} {myuser.lastname}
                    <span
                      className="absolute right-4 top-1 font-bold"
                      onClick={() =>
                        removeMusicianfrombookCount(myuser?._id || "")
                      }
                    >
                      x
                    </span>
                  </p>
                  <p className="text-sm text-gray-400">{myuser.email}</p>
                  {myuser.instrument === "piano" && (
                    <p className="text-sm text-gray-300 italic">
                      🎹 {myuser.instrument}
                    </p>
                  )}
                  {myuser.instrument === "guitar" && (
                    <p className="text-sm text-gray-300 italic">
                      🎸 {myuser.instrument}
                    </p>
                  )}
                  {myuser.instrument === "bass" && (
                    <p className="text-sm text-gray-300 italic">
                      🎸 {myuser.instrument}
                    </p>
                  )}{" "}
                  {myuser.instrument === "drums" && (
                    <p className="text-sm text-gray-300 italic flex gap-1 my-1">
                      <Drum /> {myuser.instrument}
                    </p>
                  )}{" "}
                  {myuser.instrument === "saxophone" && (
                    <p className="text-sm text-gray-300 italic">
                      🎷 {myuser.instrument}
                    </p>
                  )}{" "}
                  {myuser.instrument === "trumpet" && (
                    <p className="text-sm text-gray-300 italic">
                      🎺 {myuser.instrument}
                    </p>
                  )}
                  {myuser.instrument === "violin" && (
                    <p className="text-sm text-gray-300 italic">
                      🎻 {myuser.instrument}
                    </p>
                  )}
                  {myuser.roleType === "dj" && (
                    <p className="text-sm text-gray-300 italic">🎛 Deejay</p>
                  )}
                  {myuser.roleType === "mc" && (
                    <p className="text-sm text-gray-300 italic">🪕 EMcee</p>
                  )}{" "}
                  {myuser.roleType === "voaclist" && (
                    <p className="text-sm text-gray-300 italic">🎙 Vocalist</p>
                  )}
                </div>
                <div className="flex items-center space-x-3 sm:space-x-4 mt-3 sm:mt-0">
                  <button
                    onClick={() => handleBookUser(myuser?._id || "")}
                    className={`px-4 py-2 text-xs sm:text-sm rounded-lg font-semibold transition-all ${
                      selectedUser === user?.user?._id
                        ? "bg-orange-300 text-gray-300 cursor-not-allowed"
                        : "bg-amber-600 hover:bg-blue-500 text-white"
                    }`}
                    disabled={selectedUser !== null}
                  >
                    Book
                  </button>
                  <ChatBubbleOvalLeftIcon
                    className="w-5 h-5 sm:w-6 sm:h-6 text-yellow-300 cursor-pointer hover:text-yellow-400 transition-transform transform hover:scale-110"
                    onClick={() => setModal({ type: "chat", user: myuser })}
                  />
                  <UserIcon
                    className="w-5 h-5 sm:w-6 sm:h-6 text-green-300 cursor-pointer hover:text-green-400 transition-transform transform hover:scale-110"
                    onClick={() => router.push(`/search/${myuser?.username}`)}
                  />
                  <VideoCameraIcon
                    className="w-5 h-5 sm:w-6 sm:h-6 text-red-400 cursor-pointer hover:text-red-500 transition-transform transform hover:scale-110"
                    onClick={() => setModal({ type: "video", user: myuser })}
                  />
                </div>
              </motion.div>
            );
          })}
        </div>
      </motion.div>
      {/* Modal */}
      {modal && (
        <div className="fixed inset-0 flex items-center justify-center  bg-opacity-70 backdrop-blur-[12px] w-[100%] mx-auto h-full -py-6">
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

export default PrePendingComponent;
