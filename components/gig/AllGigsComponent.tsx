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
    selectedReview,
    setSelectedReview,
  } = useStore();

  console.log(selectedReview);
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
  const handleEdit = async (id: string) => {
    return router.push(`/editpage/${id}`);
  };

  const handleReviewModal = (gig: GigProps) => {
    // Find the review for this specific gig
    const review = gig?.postedBy?.myreviews?.find(
      (review) => review.gigId === gig._id
    );

    if (review) {
      setSelectedReview(review);
      setCurrentGig(gig); // Make sure to set the current gig
      setShowModal(true);
    } else {
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

  const hasBookedGig = gig?.bookCount?.some((user) => user._id === myId);

  const isGigCreator = gig?.postedBy?._id === myId;
  const canEditGig =
    gig?.postedBy?._id &&
    isGigCreator &&
    bookCount === 0 &&
    gig?.isTaken === false &&
    gig?.postedBy?._id.includes(myId || "");

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
  console.log("descccc", gig?.description);
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
                ? "bg-emerald-900/30 text-emerald-300"
                : "bg-blue-900/30 text-blue-300"
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
                className="text-xs bg-amber-600/90 hover:bg-amber-500 px-2 py-1 rounded transition-colors"
              >
                {gig?.postedBy?.myreviews?.some(
                  (review) => review.gigId === gig?._id
                )
                  ? "Reviewed"
                  : "Review"}
              </button>
            )}

            {/* Primary Action Button */}
            {hasBookedGig ? (
              <ButtonComponent
                variant="secondary"
                className="!bg-indigo-600/90 hover:!bg-indigo-500 h-7 text-[11px] font-normal text-white px-3 rounded transition-all"
                onclick={() => {
                  setLoadingPostId(gig?._id || "");
                  setTimeout(() => {
                    handleEditBooked(gig?._id || "");
                    setLoadingPostId("");
                  }, 2000);
                }}
                title={loadingPostId === gig._id ? "Opening..." : "View"}
              />
            ) : canEditGig ? (
              <ButtonComponent
                variant="secondary"
                className="!bg-white/10 hover:!bg-white/20 h-7 text-[11px] font-normal text-white px-3 rounded transition-all"
                onclick={() => {
                  setLoadingPostId(gig?._id || "");
                  setTimeout(() => {
                    handleEdit(gig?._id || "");
                    setLoadingPostId("");
                  }, 2000);
                }}
                title={loadingPostId === gig._id ? "Opening..." : "Edit"}
              />
            ) : (
              gig?.postedBy?._id &&
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
              )
            )}

            {/* Context Menu */}
            {!gig?.isTaken && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleModal(gig);
                }}
                className="text-white/40 hover:text-white p-1 transition-colors"
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

// <>
//   {isDescriptionModal && <GigDescription />}

//   <motion.article
//     initial={{ opacity: 0, y: 10 }}
//     animate={{ opacity: 1, y: 0 }}
//     transition={{ duration: 0.3 }}
//     className="flex flex-col rounded-2xl w-full max-w-2xl mx-auto bg-gradient-to-br from-zinc-800/90 to-zinc-900/90 p-4 my-3 border border-zinc-700/50 hover:border-zinc-600 transition-all duration-200 shadow-lg"
//     style={{ background: gig?.backgroundColor }}
//     onClick={() => showvideo && setShowVideo(false)}
//   >
//     {/* Main Content */}
//     <div className="flex flex-col md:flex-row gap-4 w-full">
//       {/* Left Section - Gig Details */}
//       <div className="flex-1 min-w-0">
//         <div className="flex justify-between items-start">
//           <div className="space-y-2 w-full">
//             {/* Gig Title */}
//             <h3 className="text-lg font-bold text-white truncate">
//               {gig?.title}
//             </h3>

//             {/* Location and Price */}
//             <div className="flex flex-wrap gap-x-4 gap-y-1 text-sm">
//               <div className="flex items-center gap-1.5">
//                 <span className="text-zinc-400">📍</span>
//                 <span className="text-zinc-300 truncate max-w-[180px]">
//                   {gig?.location}
//                 </span>
//               </div>
//               <div className="flex items-center gap-1.5">
//                 <span className="text-zinc-400">💰</span>
//                 <span className="text-zinc-300">{gig?.price}</span>
//               </div>
//             </div>
//           </div>

//           {/* Vertical Dots Menu */}
//           {!gig?.isTaken && (
//             <button
//               onClick={(e) => {
//                 e.stopPropagation();
//                 handleModal(gig);
//               }}
//               className="text-zinc-400 hover:text-white p-1 -mt-1 -mr-1 transition-colors"
//               aria-label="More options"
//             >
//               <PiDotsThreeVerticalBold size={18} />
//             </button>
//           )}
//         </div>

//         {/* Status Badge */}
//         <div className="mt-3 flex flex-wrap gap-2">
//           <span
//             className={`text-xs font-medium px-3 py-1 rounded-full ${
//               gig?.isTaken
//                 ? "bg-green-900/30 text-green-400"
//                 : "bg-blue-900/30 text-blue-400"
//             }`}
//           >
//             {gig?.isTaken ? "Taken" : "Available"}
//           </span>

//           {gig?.isPending && (
//             <span className="text-xs font-medium bg-red-900/30 text-red-400 px-3 py-1 rounded-full">
//               Not Available
//             </span>
//           )}
//         </div>
//       </div>

//       {/* Right Section - Action Buttons */}
//       <div className="flex flex-col gap-2 min-w-[120px] md:w-auto">
//         {/* Booked Gig Button */}
//         {hasBookedGig && (
//           <ButtonComponent
//             variant="secondary"
//             classname="w-full !bg-purple-600 hover:!bg-purple-500 h-9 text-sm font-medium text-white px-3 rounded-lg transition-colors"
//             onclick={() => {
//               setLoadingPostId(gig?._id || "");
//               setTimeout(() => {
//                 handleEditBooked(gig?._id || "");
//                 setLoadingPostId("");
//               }, 2000);
//             }}
//             title={
//               loadingPostId === gig._id ? "Viewing..." : "View Booking"
//             }
//           />
//         )}

//         {/* Edit Gig Button */}
//         {gig.bookCount.length < 4 && canEditGig && (
//           <ButtonComponent
//             variant="secondary"
//             classname="w-full !bg-zinc-700 hover:!bg-zinc-600 h-9 text-sm font-medium text-white px-3 rounded-lg transition-colors"
//             onclick={() => {
//               setLoadingPostId(gig?._id || "");
//               setTimeout(() => {
//                 handleEdit(gig?._id || "");
//                 setLoadingPostId("");
//               }, 2000);
//             }}
//             title={loadingPostId === gig._id ? "Editing..." : "Edit Gig"}
//           />
//         )}

//         {/* Book Gig Button */}
//         {gig?.postedBy?._id &&
//           gig?.postedBy?._id !== myId &&
//           !hasBookedGig &&
//           gig?.bookCount.length < 4 &&
//           currentUser?.isClient === false &&
//           gig?.isTaken === false && (
//             <ButtonComponent
//               variant="secondary"
//               classname="w-full !bg-red-600 hover:!bg-red-500 h-9 text-sm font-medium text-white px-3 rounded-lg transition-colors"
//               onclick={() => {
//                 setLoadingPostId(gig?._id || "");
//                 setTimeout(() => {
//                   bookGig(
//                     gig,
//                     myId as string,
//                     gigs?.gigs || [],
//                     userId as string,
//                     toast,
//                     setRefetchGig,
//                     router
//                   );
//                   setLoadingPostId("");
//                 }, 2000);
//               }}
//               title={
//                 loadingPostId === gig?._id && !bookLoading
//                   ? "Booking..."
//                   : "Book Now"
//               }
//             />
//           )}

//         {/* View Details Button */}
//         {isGigCreator && bookCount > 0 && !gig?.isTaken && (
//           <div className="relative">
//             <ButtonComponent
//               variant="secondary"
//               classname="w-full !bg-blue-600 hover:!bg-blue-500 h-9 text-sm font-medium text-white px-3 rounded-lg transition-colors"
//               onclick={() => {
//                 setLoadingPostId(gig?._id || "");
//                 setTimeout(() => {
//                   router.push(`/pre_execute/${gig?._id}`);
//                   setLoadingPostId("");
//                 }, 2000);
//               }}
//               title={
//                 loadingPostId === gig._id ? "Loading..." : "View Details"
//               }
//             />
//             {bookCount > 0 && (
//               <span className="absolute -right-2 -top-2 bg-blue-500 w-5 h-5 text-white text-xs font-bold rounded-full flex justify-center items-center">
//                 {bookCount}
//               </span>
//             )}
//           </div>
//         )}
//       </div>
//     </div>

//     {/* Footer Section */}
//     <Divider className="!my-3 !border-zinc-700/50" />

//     <div className="flex flex-col xs:flex-row justify-between items-start xs:items-center gap-3">
//       {/* User Avatar */}
//       {!gig?.bookedBy && (
//         <div className="flex items-center gap-2">
//           <div className="w-8 h-8 rounded-full overflow-hidden border border-zinc-700">
//             {gig?.logo ? (
//               <Image
//                 src={gig.logo}
//                 alt="gig-logo"
//                 width={32}
//                 height={32}
//                 className="w-full h-full object-cover"
//               />
//             ) : gig?.postedBy?.picture ? (
//               <Image
//                 src={gig.postedBy.picture}
//                 alt="user-picture"
//                 width={32}
//                 height={32}
//                 className="w-full h-full object-cover"
//               />
//             ) : (
//               <div className="w-full h-full bg-zinc-700 flex items-center justify-center">
//                 <span className="text-xs">👤</span>
//               </div>
//             )}
//           </div>
//           <span className="text-sm text-zinc-300 truncate max-w-[120px]">
//             {gig?.postedBy?.username || "User"}
//           </span>
//         </div>
//       )}

//       {/* Action Buttons */}
//       <div className="flex flex-wrap gap-2 w-full xs:w-auto justify-end">
//         {/* Review Button */}
//         {isCreatorIsCurrentUserAndTaken(gig, myId || "") && (
//           <button
//             onClick={handleReviewModal}
//             className="bg-amber-600 hover:bg-amber-500 px-4 py-2 rounded-full transition-colors flex items-center gap-1.5"
//           >
//             <span className="text-xs font-medium text-amber-50 whitespace-nowrap">
//               {gig?.postedBy?.myreviews?.some(
//                 (review) => review.gigId === gig?._id
//               )
//                 ? "View Review"
//                 : "Add Review"}
//             </span>
//           </button>
//         )}

//         {/* Add Videos Button */}
//         {gig?.bookedBy?._id === myId && canShowAddGigVideos && (
//           <button
//             onClick={() => {
//               setCurrentId(gig._id);
//               setShowVideo(true);
//             }}
//             className="bg-emerald-600 hover:bg-emerald-500 px-4 py-2 rounded-full transition-colors flex items-center gap-1.5"
//           >
//             <Video size={14} className="text-white" />
//             <span className="text-xs font-medium text-white whitespace-nowrap">
//               Add Videos
//             </span>
//           </button>
//         )}
//       </div>
//     </div>

//     {/* Modals */}
//     {showModal && selectedReview && (
//       <AlreadyReviewModal
//         {...gig}
//         setSelectedReview={setSelectedReview}
//         selectedReview={selectedReview}
//       />
//     )}

//     {/* Videos Modal */}
//     {showvideo && currentId === gig?._id && (
//       <motion.div
//         initial={{ opacity: 0 }}
//         animate={{ opacity: 1 }}
//         exit={{ opacity: 0 }}
//         className="fixed inset-0 bg-zinc-900/90 backdrop-blur-sm z-50 flex items-center justify-center p-4"
//         onClick={(e) => {
//           if (e.target === e.currentTarget) {
//             setShowVideo(false);
//           }
//         }}
//       >
//         <motion.div
//           initial={{ scale: 0.95 }}
//           animate={{ scale: 1 }}
//           className="w-full max-w-4xl bg-zinc-800 rounded-2xl overflow-hidden border border-zinc-700 shadow-xl"
//         >
//           <Videos
//             setShowVideo={setShowVideo}
//             gigId={currentId || ""}
//             gig={gig}
//           />
//         </motion.div>
//       </motion.div>
//     )}
//   </motion.article>
// </>
// <>
//   {isDescriptionModal && <GigDescription />}

//   <motion.article
//     initial={{ opacity: 0, y: 10 }}
//     animate={{ opacity: 1, y: 0 }}
//     transition={{ duration: 0.4, ease: "easeOut" }}
//     className="flex flex-col w-full max-w-3xl mx-auto bg-white/5 backdrop-blur-sm p-6 my-4 rounded-2xl border border-white/10 hover:border-white/20 transition-all duration-300 shadow-[0_8px_30px_rgb(0,0,0,0.12)]"
//     style={{
//       background:
//         gig?.backgroundColor ||
//         "linear-gradient(135deg, rgba(26,28,35,0.8) 0%, rgba(16,18,24,0.9) 100%)",
//       color: gig?.fontColor || "#f3f4f6",
//     }}
//     onClick={() => showvideo && setShowVideo(false)}
//   >
//     {/* Header Section */}
//     <div className="flex justify-between items-start mb-4">
//       <div>
//         <h3 className="text-xl font-light tracking-tight text-white mb-1">
//           {gig?.title}
//         </h3>
//         <div className="flex items-center space-x-4 text-sm text-white/80">
//           <span className="flex items-center">
//             <svg
//               className="w-4 h-4 mr-1"
//               fill="none"
//               stroke="currentColor"
//               viewBox="0 0 24 24"
//             >
//               <path
//                 strokeLinecap="round"
//                 strokeLinejoin="round"
//                 strokeWidth={1.5}
//                 d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
//               />
//               <path
//                 strokeLinecap="round"
//                 strokeLinejoin="round"
//                 strokeWidth={1.5}
//                 d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
//               />
//             </svg>
//             {gig?.location}
//           </span>
//           <span className="flex items-center">
//             <svg
//               className="w-4 h-4 mr-1"
//               fill="none"
//               stroke="currentColor"
//               viewBox="0 0 24 24"
//             >
//               <path
//                 strokeLinecap="round"
//                 strokeLinejoin="round"
//                 strokeWidth={1.5}
//                 d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
//               />
//             </svg>
//             {gig?.price}
//           </span>
//         </div>
//       </div>

//       {!gig?.isTaken && (
//         <button
//           onClick={(e) => {
//             e.stopPropagation();
//             handleModal(gig);
//           }}
//           className="text-white/50 hover:text-white p-1 transition-colors"
//           aria-label="More options"
//         >
//           <PiDotsThreeVerticalBold size={20} />
//         </button>
//       )}
//     </div>

//     {/* Status Badge */}
//     <div className="mb-5">
//       <span
//         className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${
//           gig?.isTaken
//             ? "bg-emerald-900/30 text-emerald-300"
//             : "bg-blue-900/30 text-blue-300"
//         }`}
//       >
//         {gig?.isTaken ? (
//           <>
//             <span className="w-2 h-2 mr-2 bg-emerald-400 rounded-full"></span>
//             Booked
//           </>
//         ) : (
//           <>
//             <span className="w-2 h-2 mr-2 bg-blue-400 rounded-full"></span>
//             Available
//           </>
//         )}
//       </span>

//       {gig?.isPending && (
//         <span className="inline-flex items-center ml-2 px-3 py-1 rounded-full text-xs font-medium bg-amber-900/30 text-amber-300">
//           <span className="w-2 h-2 mr-2 bg-amber-400 rounded-full"></span>
//           Pending
//         </span>
//       )}
//     </div>

//     {/* Description Preview */}
//     <div className="mb-6">
//       <p className="text-white/70 font-light leading-relaxed line-clamp-3">
//         {gig?.description || "No description provided"}
//       </p>
//     </div>

//     {/* Action Buttons */}
//     <div className="flex flex-wrap gap-3 mb-5">
//       {/* Primary Action Button */}
//       {hasBookedGig ? (
//         <ButtonComponent
//           variant="secondary"
//           classname="!bg-indigo-600 hover:!bg-indigo-500 h-10 text-sm font-normal text-white px-5 rounded-lg transition-all shadow-md"
//           onclick={() => {
//             setLoadingPostId(gig?._id || "");
//             setTimeout(() => {
//               handleEditBooked(gig?._id || "");
//               setLoadingPostId("");
//             }, 2000);
//           }}
//           title={loadingPostId === gig._id ? "Opening..." : "View Booking"}
//         />
//       ) : canEditGig ? (
//         <ButtonComponent
//           variant="secondary"
//           classname="!bg-zinc-700 hover:!bg-zinc-600 h-10 text-sm font-normal text-white px-5 rounded-lg transition-all shadow-md"
//           onclick={() => {
//             setLoadingPostId(gig?._id || "");
//             setTimeout(() => {
//               handleEdit(gig?._id || "");
//               setLoadingPostId("");
//             }, 2000);
//           }}
//           title={loadingPostId === gig._id ? "Opening..." : "Edit Gig"}
//         />
//       ) : (
//         gig?.postedBy?._id &&
//         gig?.postedBy?._id !== myId &&
//         !hasBookedGig &&
//         gig?.bookCount.length < 4 &&
//         currentUser?.isClient === false &&
//         gig?.isTaken === false && (
//           <ButtonComponent
//             variant="secondary"
//             classname="!bg-gradient-to-r from-purple-600 to-blue-500 hover:from-purple-500 hover:to-blue-400 h-10 text-sm font-normal text-white px-5 rounded-lg transition-all shadow-md"
//             onclick={() => {
//               setLoadingPostId(gig?._id || "");
//               setTimeout(() => {
//                 bookGig(
//                   gig,
//                   myId as string,
//                   gigs?.gigs || [],
//                   userId as string,
//                   toast,
//                   setRefetchGig,
//                   router
//                 );
//                 setLoadingPostId("");
//               }, 2000);
//             }}
//             title={
//               loadingPostId === gig?._id && !bookLoading
//                 ? "Processing..."
//                 : "Book Now"
//             }
//           />
//         )
//       )}

//       {/* Secondary Actions */}
//       {isGigCreator && bookCount > 0 && !gig?.isTaken && (
//         <div className="relative">
//           <ButtonComponent
//             variant="secondary"
//             classname="!bg-white/10 hover:!bg-white/20 h-10 text-sm font-normal text-white px-5 rounded-lg transition-all border border-white/20"
//             onclick={() => {
//               setLoadingPostId(gig?._id || "");
//               setTimeout(() => {
//                 router.push(`/pre_execute/${gig?._id}`);
//                 setLoadingPostId("");
//               }, 2000);
//             }}
//             title={
//               loadingPostId === gig._id
//                 ? "Loading..."
//                 : `${bookCount} Requests`
//             }
//           />
//         </div>
//       )}
//     </div>

//     {/* Footer */}
//     <Divider className="!my-4 !border-white/10" />

//     <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
//       {/* User Info */}
//       <div className="flex items-center">
//         <div className="relative w-10 h-10 rounded-full overflow-hidden border-2 border-white/20">
//           {gig?.logo ? (
//             <Image
//               src={gig.logo}
//               alt="gig-logo"
//               width={40}
//               height={40}
//               className="w-full h-full object-cover"
//             />
//           ) : gig?.postedBy?.picture ? (
//             <Image
//               src={gig.postedBy.picture}
//               alt="user-picture"
//               width={40}
//               height={40}
//               className="w-full h-full object-cover"
//             />
//           ) : (
//             <div className="w-full h-full bg-white/10 flex items-center justify-center">
//               <span className="text-lg">👤</span>
//             </div>
//           )}
//         </div>
//         <div className="ml-3">
//           <h4 className="text-sm font-medium text-white">
//             {gig?.postedBy?.username || "Anonymous"}
//           </h4>
//           <p className="text-xs text-white/50">
//             {gig?.postedBy?.profession || "Musician"}
//           </p>
//         </div>
//       </div>

//       {/* Footer Actions */}
//       <div className="flex gap-3">
//         {isCreatorIsCurrentUserAndTaken(gig, myId || "") && (
//           <button
//             onClick={handleReviewModal}
//             className="flex items-center px-4 py-2 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 transition-colors"
//           >
//             <svg
//               className="w-4 h-4 mr-2"
//               fill="none"
//               stroke="currentColor"
//               viewBox="0 0 24 24"
//             >
//               <path
//                 strokeLinecap="round"
//                 strokeLinejoin="round"
//                 strokeWidth={1.5}
//                 d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"
//               />
//             </svg>
//             <span className="text-sm font-light text-white">
//               {gig?.postedBy?.myreviews?.some(
//                 (review) => review.gigId === gig?._id
//               )
//                 ? "View Review"
//                 : "Add Review"}
//             </span>
//           </button>
//         )}

//         {gig?.bookedBy?._id === myId && canShowAddGigVideos && (
//           <button
//             onClick={() => {
//               setCurrentId(gig._id);
//               setShowVideo(true);
//             }}
//             className="flex items-center px-4 py-2 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 transition-colors"
//           >
//             <Video size={16} className="mr-2 text-white" />
//             <span className="text-sm font-light text-white">Add Media</span>
//           </button>
//         )}
//       </div>
//     </div>

//     {/* Modals */}
//     {showModal && selectedReview && (
//       <AlreadyReviewModal
//         {...gig}
//         setSelectedReview={setSelectedReview}
//         selectedReview={selectedReview}
//       />
//     )}

//     {/* Videos Modal */}
//     {showvideo && currentId === gig?._id && (
//       <motion.div
//         initial={{ opacity: 0 }}
//         animate={{ opacity: 1 }}
//         exit={{ opacity: 0 }}
//         className="fixed inset-0 bg-black/80 backdrop-blur-lg z-50 flex items-center justify-center p-4"
//         onClick={(e) => {
//           if (e.target === e.currentTarget) {
//             setShowVideo(false);
//           }
//         }}
//       >
//         <motion.div
//           initial={{ scale: 0.96, y: 20 }}
//           animate={{ scale: 1, y: 0 }}
//           className="w-full max-w-4xl bg-zinc-900 rounded-2xl overflow-hidden border border-white/10 shadow-2xl"
//         >
//           <Videos
//             setShowVideo={setShowVideo}
//             gigId={currentId || ""}
//             gig={gig}
//           />
//         </motion.div>
//       </motion.div>
//     )}
//   </motion.article>
// </>
