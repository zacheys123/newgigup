"use client";
import { CircularProgress } from "@mui/material";
import { motion } from "framer-motion";
import Image from "next/image";
import React, { FormEvent, useEffect, useState } from "react";
import { Button } from "../ui/button";
import Rating from "./Rating";
import { ArrowDown, ArrowUp } from "lucide-react";
import { useAuth } from "@clerk/nextjs";
import { Textarea } from "flowbite-react";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";
import { MdAdd } from "react-icons/md";
import { FetchResponse, GigProps } from "@/types/giginterface";
import { Review } from "@/types/userinterfaces";

const AcceptPage = ({
  _id,
  bookedBy,
  postedBy,
  viewCount,
  isTaken,
  bookCount,
}: GigProps) => {
  const { userId } = useAuth();

  const [comment, setComment] = useState<string>("");
  const [rating, setRating] = useState<number>(0);
  const [loadingreview, setLoadingreview] = useState(false);
  const [pers, setPers] = useState<boolean>(false);

  const [rate] = useState<number>(
    bookedBy?.allreviews?.length
      ? bookedBy.allreviews.reduce(
          (acc: number, review: { rating: number }) => acc + review.rating,
          0
        ) / (postedBy?.allreviews?.length || 1)
      : 0
  );
  const [comm] = useState<string>(
    (bookedBy?.allreviews &&
      bookedBy?.allreviews
        .filter((review: { gigId: string }) => review.gigId === _id)
        ?.map((review: { comment: string }) => review.comment)
        .join(" ")) ||
      ""
  );

  const router = useRouter();

  const variant = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0, transition: { duration: 0.5 } },
  };

  useEffect(() => {
    if (typeof isTaken !== "boolean") return; // avoid running on undefined
    if (isTaken) return; // do nothing if gig is taken

    if (bookCount?.length > 0) {
      router.push(`/av_gigs/${userId}`);
    }
  }, [isTaken, bookCount, userId, router]);

  const handleRatingChange = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    try {
      setLoadingreview(true);

      if (!comment) {
        toast.error("A written review is needed.");
        return;
      }
      if (comment && comment.length > 200) {
        toast.error("Comment should not exceed 100 characters");
        return;
      }

      const res = await fetch(`/api/gigs/reviewgig/${_id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          rating,
          comment,
          postedBy: postedBy?._id,
          postedTo: bookedBy?._id,
        }),
      });

      if (!res.ok) {
        throw new Error("Failed to submit the rating");
      }

      const data: FetchResponse = await res.json();

      if (data?.gigstatus === true) {
        toast.success(data?.message || "Review submitted successfully");
        setRating(0);
        setComment("");
        // setTimeout(() => {
        //   router.push(`/gigs/${userId}`);
        // }, 2000);
      } else {
        toast.error(
          data?.message || "There was an issue submitting the review"
        );
      }
    } catch (error: unknown) {
      console.error(error || "An unexpected error occurred");
    } finally {
      setLoadingreview(false);
    }
  };

  return (
    <div className="h-screen w-full overflow-y-auto bg-gradient-to-br from-gray-900 to-gray-800 scroll-smooth">
      <div className="max-w-4xl mx-auto px-4 py-8 space-y-8">
        {/* Profile Card */}
        <motion.div
          className="w-full bg-gray-800 rounded-xl shadow-2xl overflow-hidden"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="p-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                {bookedBy?.picture && (
                  <div className="relative h-16 w-16 rounded-full overflow-hidden border-2 border-amber-500">
                    <Image
                      src={bookedBy?.picture}
                      alt="Profile picture"
                      layout="fill"
                      objectFit="cover"
                      className="rounded-full"
                    />
                  </div>
                )}
                <div>
                  <h2 className="text-xl font-bold text-white">
                    {postedBy?.firstname} {postedBy?.lastname}
                  </h2>
                  <p className="text-gray-400 text-sm">@{bookedBy?.username}</p>
                </div>
              </div>

              <div className="flex items-center space-x-4">
                <button className="flex items-center space-x-1 bg-amber-600 hover:bg-amber-700 px-3 py-1 rounded-full transition-all">
                  <MdAdd className="text-white" size={18} />
                  <span className="text-white text-sm">Follow</span>
                </button>
              </div>
            </div>

            <div className="mt-6 flex justify-between items-center">
              <div className="flex space-x-6">
                <div className="text-center">
                  <p className="text-amber-400 font-bold">
                    {viewCount?.length}
                  </p>
                  <p className="text-gray-400 text-xs">Views</p>
                </div>
                <div className="text-center">
                  <p className="text-amber-400 font-bold">
                    {bookedBy?.followers?.length || 0}
                  </p>
                  <p className="text-gray-400 text-xs">Followers</p>
                </div>
                <div className="text-center">
                  <p className="text-amber-400 font-bold">
                    {bookedBy?.followings?.length || 0}
                  </p>
                  <p className="text-gray-400 text-xs">Following</p>
                </div>
              </div>
            </div>
          </div>

          {/* More Info Section */}
          <div className="border-t border-gray-700 px-6 py-4">
            <button
              className="flex items-center justify-between w-full text-left"
              onClick={() => setPers((prev) => !prev)}
            >
              <span className="text-amber-400 font-medium">
                More Information
              </span>
              {!pers ? (
                <ArrowDown className="text-amber-400" />
              ) : (
                <ArrowUp className="text-amber-400" />
              )}
            </button>

            {pers && (
              <motion.div
                className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4"
                initial="initial"
                animate="animate"
                variants={variant}
              >
                <div className="bg-gray-700 bg-opacity-50 p-4 rounded-lg">
                  <p className="text-gray-400 text-sm">Email Address</p>
                  <p className="text-white title">{bookedBy?.email || "-"}</p>
                </div>
                <div className="bg-gray-700 bg-opacity-50 p-4 rounded-lg">
                  <p className="text-gray-400 text-sm">Profession</p>
                  <p className="text-white title">
                    {bookedBy?.roleType === "instrumentalist"
                      ? bookedBy?.instrument
                      : bookedBy?.roleType === "dj"
                      ? "Deejay"
                      : bookedBy?.roleType === "mc"
                      ? "EMcee"
                      : bookedBy?.roleType === "vocalist"
                      ? "Vocalist"
                      : "-"}
                  </p>
                </div>
                <div className="bg-gray-700 bg-opacity-50 p-4 rounded-lg">
                  <p className="text-gray-400 text-sm">Experience</p>
                  <p className="text-white title">
                    {bookedBy?.experience || "-"}
                  </p>
                </div>
              </motion.div>
            )}
          </div>
        </motion.div>

        {/* Rating Section */}
        {isTaken && (
          <motion.div
            className="w-full bg-gray-800 rounded-xl shadow-xl p-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            <div className="flex flex-col md:flex-row items-center justify-between">
              <div className="mb-4 md:mb-0">
                <h3 className="text-lg font-semibold text-amber-400 mb-2">
                  Rate This Musician
                </h3>
                <Rating rating={rating ? rating : rate} setRating={setRating} />
              </div>

              {bookedBy?.picture && (
                <div className="relative h-20 w-20 rounded-full overflow-hidden border-2 border-amber-500">
                  <Image
                    src={bookedBy?.picture}
                    alt="Profile picture"
                    layout="fill"
                    objectFit="cover"
                    className="rounded-full"
                  />
                </div>
              )}
            </div>

            <form onSubmit={handleRatingChange} className="mt-6">
              <Textarea
                placeholder="Share your experience with this musician..."
                value={comment ? comment : comm}
                onChange={(e) => setComment(e.target.value)}
                className="w-full h-32 p-4 bg-gray-700 border border-gray-600 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent text-white"
                rows={4}
              />

              <div className="mt-4 flex justify-end">
                <Button
                  variant="destructive"
                  disabled={loadingreview}
                  className="bg-gradient-to-r from-amber-600 to-amber-800 hover:from-amber-700 hover:to-amber-900 text-white font-bold py-2 px-6 rounded-full shadow-lg transition-all"
                >
                  {loadingreview ? (
                    <div className="flex items-center">
                      <CircularProgress
                        size={20}
                        className="text-amber-300 mr-2"
                      />
                      <span>Submitting...</span>
                    </div>
                  ) : (
                    "Submit Review"
                  )}
                </Button>
              </div>
            </form>
          </motion.div>
        )}

        {/* Existing Reviews Section */}
        {bookedBy?.allreviews && bookedBy?.allreviews?.length > 0 && (
          <motion.div
            className="w-full bg-gray-800 rounded-xl shadow-xl p-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
          >
            <h3 className="text-lg font-semibold text-amber-400 mb-4">
              Previous Reviews
            </h3>

            <div className="space-y-4 max-h-96 overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-amber-600 scrollbar-track-gray-700">
              {bookedBy.allreviews
                .filter((review: { gigId: string }) => review.gigId === _id)
                .map((review: Review, index: number) => {
                  const reviewDate = review.createdAt
                    ? new Date(review.createdAt).toLocaleDateString()
                    : "No date available";

                  return (
                    <div
                      key={index}
                      className="bg-gray-700 bg-opacity-50 p-4 rounded-lg"
                    >
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center space-x-2">
                          <div className="text-amber-400 font-bold">
                            {review.rating}.0
                          </div>
                          <div className="flex">
                            {[...Array(5)].map((_, i) => (
                              <svg
                                key={i}
                                className={`w-4 h-4 ${
                                  i < review.rating
                                    ? "text-amber-400"
                                    : "text-gray-500"
                                }`}
                                fill="currentColor"
                                viewBox="0 0 20 20"
                              >
                                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                              </svg>
                            ))}
                          </div>
                        </div>
                        <span className="text-gray-400 text-sm">
                          {reviewDate}
                        </span>
                      </div>
                      <p className="text-gray-300">{review.comment}</p>
                    </div>
                  );
                })}
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default AcceptPage;
