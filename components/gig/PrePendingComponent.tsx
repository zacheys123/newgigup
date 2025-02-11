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

const PrePendingComponent = () => {
  const { userId } = useAuth();
  const { id } = useParams();
  const { loading } = useGetGigs(id as string);
  const { currentgig, setRefetchGig } = useStore();
  const { user } = useCurrentUser(userId || "");
  const router = useRouter();
  const { bookloading, bookgig } = useBookMusician();
  const [selectedUser, setSelectedUser] = useState<string | null>(null);
  const [modal, setModal] = useState<{
    type: "chat" | "video";
    user: UserProps;
  } | null>(null);

  //   const forget = () => forgetBookings(userId || "", currentgig);
  const handleBookUser = (userId: string) => {
    setSelectedUser(userId);
    console.log(`User ${userId} booked. Others disqualified.`);
    bookgig(router, currentgig, userId || "", user._id || "");
  };

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

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen btext-gray-300 backdrop-blur-xl bg-black bg-opacity-50 ">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full"
        />
      </div>
    );
  }
  return (
    <div className="p-6 bg-gradient-to-b from-gray-900 to-black text-white min-h-screen">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-3xl mx-auto p-6 bg-gray-800 rounded-xl shadow-xl"
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
          Interested Musicians
        </h2>
        <div className="mt-4 max-h-[370px] sm:max-h-[400px] overflow-y-auto scrollbar-thin scrollbar-thumb-gray-600 scrollbar-track-gray-800 space-y-4">
          {currentgig?.bookCount?.map((user: UserProps) => (
            <motion.div
              key={user._id}
              className="flex flex-col sm:flex-row justify-between items-start sm:items-center p-4 bg-gray-700 rounded-lg transition-all shadow-md relative"
              whileHover={{
                scale: 1.02,
                boxShadow: "0px 5px 15px rgba(255, 255, 255, 0.1)",
              }}
            >
              <div className="min-w-0 flex-1">
                <p className="text-lg font-semibold text-gray-100">
                  {user.firstname} {user.lastname}
                  <span
                    className="absolute right-4 top-1 font-bold"
                    onClick={() => removeMusicianfrombookCount(user?._id || "")}
                  >
                    x
                  </span>
                </p>
                <p className="text-sm text-gray-400">{user.email}</p>
                {user.instrument === "piano" && (
                  <p className="text-sm text-gray-300 italic">
                    🎹 {user.instrument}
                  </p>
                )}
                {user.instrument === "guitar" && (
                  <p className="text-sm text-gray-300 italic">
                    🎸 {user.instrument}
                  </p>
                )}
                {user.instrument === "bass" && (
                  <p className="text-sm text-gray-300 italic">
                    🎸 {user.instrument}
                  </p>
                )}{" "}
                {user.instrument === "drums" && (
                  <p className="text-sm text-gray-300 italic">
                    <Drum /> {user.instrument}
                  </p>
                )}{" "}
                {user.instrument === "saxophone" && (
                  <p className="text-sm text-gray-300 italic">
                    🎷 {user.instrument}
                  </p>
                )}{" "}
                {user.instrument === "trumpet" && (
                  <p className="text-sm text-gray-300 italic">
                    🎺 {user.instrument}
                  </p>
                )}
                {user.instrument === "violin" && (
                  <p className="text-sm text-gray-300 italic">
                    🎻 {user.instrument}
                  </p>
                )}
              </div>
              <div className="flex items-center space-x-3 sm:space-x-4 mt-3 sm:mt-0">
                <button
                  onClick={() => handleBookUser(user._id || "")}
                  className={`px-4 py-2 text-xs sm:text-sm rounded-lg font-semibold transition-all ${
                    selectedUser === user._id
                      ? "bg-orange-300 text-gray-300 cursor-not-allowed"
                      : "bg-amber-600 hover:bg-blue-500 text-white"
                  }`}
                  disabled={selectedUser !== null}
                >
                  {selectedUser === user._id && bookloading ? (
                    <CircularProgress
                      size="16px"
                      className="animate-spin text-white"
                    />
                  ) : (
                    "Book"
                  )}
                </button>
                <ChatBubbleOvalLeftIcon
                  className="w-5 h-5 sm:w-6 sm:h-6 text-yellow-300 cursor-pointer hover:text-yellow-400 transition-transform transform hover:scale-110"
                  onClick={() => setModal({ type: "chat", user })}
                />
                <UserIcon
                  className="w-5 h-5 sm:w-6 sm:h-6 text-green-300 cursor-pointer hover:text-green-400 transition-transform transform hover:scale-110"
                  onClick={() => router.push(`/profile/${user._id}`)}
                />
                <VideoCameraIcon
                  className="w-5 h-5 sm:w-6 sm:h-6 text-red-400 cursor-pointer hover:text-red-500 transition-transform transform hover:scale-110"
                  onClick={() => setModal({ type: "video", user })}
                />
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Modal */}
      {modal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm w-[100%] mx-auto h-full">
          <Modal onClose={() => setModal(null)} modal={modal} user={user} />
        </div>
      )}
    </div>
  );
};

export default PrePendingComponent;
