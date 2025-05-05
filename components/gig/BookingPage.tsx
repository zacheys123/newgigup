import { useCurrentUser } from "@/hooks/useCurrentUser";
import { useForgetBookings } from "@/hooks/useForgetBooking";
import { useAuth } from "@clerk/nextjs";
import { CircularProgress } from "@mui/material";
import { X } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { MdAdd } from "react-icons/md";
import Modal from "../Modal";
import { UserProps } from "@/types/userinterfaces";
import { ChatBubbleOvalLeftIcon } from "@heroicons/react/24/solid";
import useSocket from "@/hooks/useSocket";
import { toast } from "sonner";
import { GigProps } from "@/types/giginterface";
import MusicWaveLoader from "../loaders/MusicWaver";

interface BookingProps {
  currentGig: GigProps;
}
const BookingPage = ({ currentGig }: BookingProps) => {
  const currentgig = currentGig;
  const { userId } = useAuth();
  const { loading, forgetBookings } = useForgetBookings();
  const { user } = useCurrentUser();
  const router = useRouter();
  const { socket } = useSocket();
  const forget = () =>
    forgetBookings(user?.user?._id as string, currentgig, userId as string);

  console.log(currentgig);
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
    if (
      currentgig?.bookCount?.some((myuser) => myuser?._id !== user?.user?._id)
    ) {
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
      const audio = new Audio("/sounds/click.mp3");
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
  // Define the onOpenX function
  const handleOpenX = () => {
    setShowX(false); // Reset the showX state
  };

  useEffect(() => {
    if (socket) {
      socket.on("musicianBooked", ({ gigId, message }) => {
        // Show a notification to the musician
        console.log(gigId);
        console.log(message);
        toast.success(message);

        // Refresh the page or redirect if needed
      });

      socket.on("updateGigStatus", ({ gigId, isTaken }) => {
        // Refresh the page if the gig is taken
        if (isTaken && gigId && currentgig?.bookedBy !== user?.user?._id) {
          router.push(`/gigs/${userId}`);
        }
      });

      // Cleanup listeners on unmount
      return () => {
        socket.off("musicianBooked");
        socket.off("updateGigStatus");
      };
    }
  }, [socket, currentgig, userId, router, user?.user?._id]);

  if (!currentgig?.title || !user?.user?.firstname) {
    return (
      <div className="h-full w-full flex justify-center items-center">
        <MusicWaveLoader />
      </div>
    );
  }

  return (
    <div className="flex flex-col h-[calc(100vh)-100px] w-full py-1 my-1 overflow-y-auto bg-gradient-to-b from-gray-900 to-gray-800">
      {/* Add this wrapper div with specific height calculation */}
      <div className="flex-1 overflow-y-auto pb-[20px]">
        {!showX && (
          <div className="fixed w-[40px] h-[40px] flex justify-center items-center right-5 top-[calc(100px+460px)] opacity-85 rounded-md shadow-lg shadow-slate-700 bg-gray-700 hover:bg-gray-600 transition-all animate-pulse z-50 hover:animate-none group">
            {!loading ? (
              <div
                className="w-full h-full flex justify-center items-center bg-red-500 hover:bg-red-600 rounded-full shadow-lg cursor-pointer transition-all transform hover:rotate-90 hover:scale-110"
                onClick={handleCancel}
              >
                <X size="24" className="text-white" />
              </div>
            ) : (
              <CircularProgress size="20px" className="text-white" />
            )}
            {/* Tooltip */}
            <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-gray-700 text-white text-xs px-2 py-1 rounded-md opacity-0 group-hover:opacity-100 transition-opacity">
              Cancel Gig
            </div>
          </div>
        )}
        {/* Confirmation Modal */}
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
                  onClick={() => setShowConfirmation(false)}
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Personal Info Card */}
        <div className="min-h-[110px] w-[90%] mx-auto p-3 bg-gray-700 shadow-lg rounded-lg mb-6 transform transition-transform hover:scale-105 hover:shadow-xl border-l-4 border-yellow-400">
          <h4 className="text-gray-300 text-sm font-semibold uppercase tracking-widest mb-4">
            Personal
          </h4>
          <div className="flex justify-between items-center">
            {currentgig?.logo && (
              <Image
                src={currentgig.logo}
                alt="Profile Pic"
                width={40}
                height={40}
                className="rounded-full transform transition-transform hover:scale-110"
              />
            )}
            <div className="flex items-center gap-4">
              <div className="flex items-center">
                <h4 className="text-gray-300 text-xs font-medium">
                  {currentgig?.viewCount?.length} views
                </h4>
              </div>
              <button className="flex items-center bg-gray-600 hover:bg-gray-500 text-white text-xs font-medium py-1 px-3 rounded-md transition-all transform hover:scale-105">
                Follow
                <MdAdd size="14" className="ml-1" />
              </button>
              <ChatBubbleOvalLeftIcon
                className="w-5 h-5 text-yellow-300 hover:text-yellow-400 cursor-pointer transition-transform hover:scale-125"
                onClick={() => {
                  setShowX(true);

                  setModal({ type: "chat", user: postedByUser });
                }}
              />
            </div>
          </div>
          <div className="mt-4">
            <h4 className="text-gray-200 text-lg font-bold">
              {currentgig?.postedBy?.firstname} {currentgig?.postedBy?.lastname}
            </h4>
            <h4 className="text-gray-400 text-sm">
              @{currentgig?.postedBy?.username}
            </h4>
          </div>
        </div>

        {/* Gig Info Card */}
        <div className="min-h-[90px] w-[90%] mx-auto p-3 bg-gray-700 shadow-lg rounded-lg mb-6 animate-fade-in border-l-4 border-blue-400">
          <h4 className="text-gray-300 text-sm font-semibold uppercase tracking-widest mb-4">
            Gig Info
          </h4>
          <div className="space-y-2">
            <h4 className="text-gray-200 text-lg font-bold">
              {currentgig?.title || "No Title Available"}
            </h4>
            <p className="text-gray-400 text-sm">{currentgig?.description}</p>
            <h4 className="text-gray-400 text-sm">
              Location: {currentgig?.location}
            </h4>
          </div>
        </div>

        {/* Business Info Card */}
        <div className="min-h-[100px] w-[90%] mx-auto p-3 bg-gray-700 shadow-lg rounded-lg mb-6 transform transition-transform hover:scale-105 hover:shadow-xl border-l-4 border-green-400">
          <h4 className="text-gray-300 text-sm font-semibold uppercase tracking-widest mb-4">
            Business Info
          </h4>
          <div className="space-y-2">
            <h4 className="text-gray-400 text-sm">
              Price: {currentgig?.price}
            </h4>
            <h4 className="text-gray-400 text-sm">
              Contact: {currentgig?.phone}
            </h4>
            <h4 className="text-gray-400 text-sm">
              Email: {currentgig?.postedBy?.email}
            </h4>
          </div>
        </div>

        {/* More Info Card */}
        <div className="min-h-[130px] w-[90%] mx-auto p-3 mb-[150px] bg-gray-700 shadow-lg rounded-lg animate-slide-in border-l-4 border-purple-400">
          <h4 className="text-gray-300 text-sm font-semibold uppercase tracking-widest mb-4">
            More Info
          </h4>
          <div className="space-y-2">
            <h4 className="text-gray-400 text-sm">
              Gig Type:{" "}
              {currentgig?.bussinesscat === "full"
                ? "Full Band"
                : currentgig?.bussinesscat === "personal"
                ? "Individual"
                : currentgig?.bussinesscat === "other"
                ? "Musicians Cocktail"
                : ""}
            </h4>
            {currentgig?.bussinesscat === "other" &&
              currentgig?.bandCategory &&
              currentgig?.bandCategory.length > 0 && (
                <ul className="mt-1">
                  {[...new Set(currentgig.bandCategory)].map(
                    (bnd: string, i: number) => (
                      <li
                        key={i}
                        className="text-red-400 text-sm font-medium animate-bounce"
                      >
                        {bnd}
                      </li>
                    )
                  )}
                </ul>
              )}
            <h4 className="text-gray-400 text-sm">
              Start Time: {currentgig?.time?.from}
            </h4>
            <h4 className="text-gray-400 text-sm">
              Finish Time: {currentgig?.time?.to}
            </h4>
          </div>
        </div>

        {/* Modal */}
        {modal && (
          <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm animate-fade-in">
            <Modal
              onClose={() => setModal(null)}
              modal={modal}
              user={user?.user}
              onOpenX={handleOpenX}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default BookingPage;
