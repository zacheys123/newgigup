"use client";

import { UserProps } from "@/types/userinterfaces";
import { useParams, useRouter } from "next/navigation";
import React, { useState } from "react";
import Logo from "../Logo";
import { useAuth, UserButton } from "@clerk/nextjs";
import { IoCheckmarkDone } from "react-icons/io5";
import { Button } from "../ui/button";
import { MdAdd } from "react-icons/md";
import { useCurrentUser } from "@/hooks/useCurrentUser";
import { BsInstagram, BsTwitter, BsFacebook } from "react-icons/bs";
import { MdRateReview } from "react-icons/md";
import {
  ArrowLeftIcon,
  Briefcase,
  Calendar,
  DollarSign,
  MenuIcon,
  Music,
  Video,
} from "lucide-react";
import useSWR, { mutate } from "swr";
import {
  handleFollow,
  handleFollowing,
  handleUnfollow,
  handleUnFollowingCurrent,
} from "@/utils";
import { motion } from "framer-motion";
import CountUp from "react-countup";
import Image from "next/image";
import { FaTiktok, FaYoutube } from "react-icons/fa";
import ReportButton from "../report/ReportButton";
import UserProfileDetails from "./UserProfileDetails";

interface ApiResponse {
  user: UserProps;
}
const fetcher = (url: string) => fetch(url).then((res) => res.json());

const FriendsComponent = () => {
  const { userId } = useAuth();
  const { username } = useParams();
  const { user } = useCurrentUser();
  const router = useRouter();

  const {
    data: response,
    error,
    isLoading,
  } = useSWR<ApiResponse>(`/api/user/getuser/${username}`, fetcher, {
    revalidateOnFocus: false,
    shouldRetryOnError: false,
  });

  const friend = response?.user;
  const [isFollowing, setIsFollowing] = useState<boolean>(() => {
    const currentUserId = user?.user?._id;
    if (!currentUserId || !friend?.followers) return false;
    return friend.followers.some((follower) =>
      typeof follower === "string"
        ? follower === currentUserId
        : follower._id === currentUserId
    );
  });
  const [isMutating, setIsMutating] = useState(false);
  const [optimisticFollow, setOptimisticFollow] = useState(isFollowing);
  const [show, setShowMore] = useState<boolean>(false);

  const handleFollowClick = async () => {
    if (!friend?._id || !user?.user?._id || isMutating) return;
    setIsMutating(true);
    setOptimisticFollow(true);

    try {
      const optimisticData = {
        ...response,
        user: {
          ...friend,
          followers: [...(friend.followers || []), user?.user?._id],
        },
      };
      mutate(`/api/user/getuser/${username}`, optimisticData, false);
      setIsFollowing(false);
      await Promise.all([
        handleFollow(friend._id, user?.user),
        handleFollowing(friend._id, user?.user),
      ]);
      mutate(`/api/user/getuser/${username}`);
    } catch (error) {
      setOptimisticFollow(false);
      console.error("Error following:", error);
    } finally {
      setIsMutating(false);
    }
  };

  const handleUnfollowClick = async () => {
    if (!friend?._id || !user?.user?._id || isMutating) return;
    setIsMutating(true);
    setOptimisticFollow(false);

    try {
      const optimisticData = {
        ...response,
        user: {
          ...friend,
          followers:
            friend?.followers?.filter((id) => id !== user?.user?._id) || [],
        },
      };
      mutate(`/api/user/getuser/${username}`, optimisticData, false);

      await Promise.all([
        handleUnfollow(friend._id, user?.user),
        handleUnFollowingCurrent(friend._id, user?.user),
      ]);

      mutate(`/api/user/getuser/${username}`);
    } catch (error) {
      setOptimisticFollow(true);
      console.error("Error unfollowing:", error);
    } finally {
      setIsMutating(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gradient-to-br from-gray-900 to-gray-800">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
          className="w-12 h-12 border-4 border-purple-500 border-t-transparent rounded-full shadow-lg"
        />
        <h6 className="ml-4 text-xl font-semibold text-gray-300 animate-pulse">
          Loading user data...
        </h6>
      </div>
    );
  }

  if (error || !friend) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gradient-to-br from-gray-900 to-gray-800">
        <div className="bg-gray-800/90 backdrop-blur-sm p-6 sm:p-10 rounded-2xl shadow-xl border border-gray-700 text-center">
          <p className="text-gray-300 text-lg sm:text-xl font-medium mb-4">
            {`Oops! Couldn't load user data.`}
          </p>
          <Button
            onClick={() => router.back()}
            className="bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white font-semibold py-2 px-6 rounded-lg transition-colors duration-300"
          >
            Go Back
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="overflow-y-auto h-screen w-full bg-gradient-to-b from-gray-900 to-gray-800">
      {/* Header Section */}
      <div className="relative h-[180px] sm:h-[210px] bg-gradient-to-br from-purple-900 to-indigo-800 rounded-b-3xl shadow-lg">
        <div className="w-[90%] absolute top-4 right-6 flex items-center gap-4 z-10 justify-between">
          <Logo />
          <UserButton afterSignOutUrl="/" />
        </div>
        <div className="absolute -bottom-16 left-1/2 transform -translate-x-1/2">
          <div className="w-28 h-28 sm:w-32 sm:h-32 rounded-full border-4 border-gray-800 bg-gray-800 shadow-xl flex items-center justify-center overflow-hidden">
            {friend?.picture ? (
              <Image
                src={friend.picture}
                alt="Profile"
                className="w-full h-full rounded-full object-cover"
                width={128}
                height={128}
                quality={80}
              />
            ) : (
              <div className="w-full h-full rounded-full bg-gradient-to-br from-purple-500 to-indigo-500 flex items-center justify-center text-white text-3xl capitalize font-bold">
                {friend?.firstname?.charAt(0)}
                {friend?.lastname?.charAt(0)}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Profile Content */}
      {!show ? (
        <div className="mt-20 px-4 sm:px-6 pb-10 max-w-3xl mx-auto">
          {/* Name and Follow Button */}
          <div className="flex flex-col items-center mb-6">
            <h1 className="text-xl sm:text-2xl capitalize font-extrabold text-white tracking-tight">
              {friend?.firstname} {friend?.lastname}
            </h1>
            {friend?.experience && friend?.instrument && (
              <p className="text-gray-400 text-xs sm:text-sm mb-4">
                <span className="font-semibold text-gray-300">
                  {friend.experience}
                </span>{" "}
                years of experience as a{" "}
                <span className="font-semibold text-purple-400">
                  {friend.instrument && `${friend.instrument} player`}
                </span>
              </p>
            )}

            <div className="flex gap-3 sm:gap-4 mt-2">
              {optimisticFollow ? (
                <Button
                  variant="outline"
                  className={`px-4 sm:px-6 py-1 sm:py-2 rounded-full shadow-md text-purple-400 border-purple-400 hover:bg-gray-800 transition-all duration-300 ${
                    isMutating ? "opacity-70 cursor-not-allowed" : ""
                  }`}
                  onClick={handleUnfollowClick}
                  disabled={isMutating}
                >
                  {isMutating ? (
                    <span className="flex items-center text-xs sm:text-sm">
                      <span className="loading-spinner-dark mr-2" />
                      following...
                    </span>
                  ) : (
                    <span className="flex items-center text-xs sm:text-sm">
                      <IoCheckmarkDone className="mr-1 sm:mr-2 text-sm sm:text-lg" />
                      Following
                    </span>
                  )}
                </Button>
              ) : (
                <Button
                  className={`px-4 sm:px-6 py-1 sm:py-2 rounded-full bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white shadow-md transition-all duration-300 text-xs sm:text-sm ${
                    isMutating ? "opacity-70 cursor-not-allowed" : ""
                  }`}
                  onClick={handleFollowClick}
                  disabled={isMutating}
                >
                  {isMutating || isFollowing ? (
                    <span className="flex items-center">
                      <span className="loading-spinner-light mr-2" />
                      UnFollowing...
                    </span>
                  ) : (
                    <span className="flex items-center">
                      <MdAdd className="mr-1 sm:mr-2 text-sm sm:text-lg" />
                      Follow
                    </span>
                  )}
                </Button>
              )}
              <ReportButton userId={friend?._id || ""} />
              <Button
                variant="outline"
                className="px-4 sm:px-6 py-1 sm:py-2 rounded-full text-xs sm:text-sm"
                onClick={() => setShowMore(true)}
              >
                <span className="flex items-center">
                  <MenuIcon className="text-gray-300" size={16} />
                </span>
              </Button>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="flex justify-center gap-4 sm:gap-6 mb-6 sm:mb-8 bg-gray-800/50 p-3 sm:p-4 rounded-xl shadow-sm border border-gray-700">
            <motion.button
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => router.back()}
              className="flex flex-col items-center text-gray-300 hover:text-purple-400 transition-colors"
            >
              <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-gray-700 shadow-sm border border-gray-600 flex items-center justify-center">
                <ArrowLeftIcon className="text-purple-400" size={18} />
              </div>
              <span className="text-xs mt-1 sm:mt-2 font-medium">Back</span>
            </motion.button>

            {(user?.user?.isMusician || user?.user?.isClient) && (
              <motion.button
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.95 }}
                onClick={() =>
                  router.push(
                    user?.user?.isClient
                      ? `/create/${userId}`
                      : `/av_gigs/${userId}`
                  )
                }
                className="flex flex-col items-center text-gray-300 hover:text-purple-400 transition-colors"
              >
                <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-gray-700 shadow-sm border border-gray-600 flex items-center justify-center">
                  <Music className="text-purple-400" size={18} />
                </div>
                <span className="text-xs mt-1 sm:mt-2 font-medium">
                  Music Gigs
                </span>
              </motion.button>
            )}

            <motion.button
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.95 }}
              onClick={() =>
                router.push(
                  `/search/allvideos/${friend?._id}/*${friend?.firstname}/${friend?.lastname}`
                )
              }
              className="flex flex-col items-center text-gray-300 hover:text-teal-400 transition-colors"
            >
              <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-gray-700 shadow-sm border border-gray-600 flex items-center justify-center">
                <Video className="text-teal-400" size={18} />
              </div>
              <span className="text-xs mt-1 sm:mt-2 font-medium">Videos</span>
            </motion.button>

            {!user?.user?.isMusician && user?.user?.isClient && (
              <motion.button
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.95 }}
                onClick={() =>
                  router.push(
                    `/search/reviews/${friend?._id}/*${friend?.firstname}${friend?.lastname}`
                  )
                }
                className="flex flex-col items-center text-gray-300 hover:text-orange-400 transition-colors"
              >
                <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-gray-700 shadow-sm border border-gray-600 flex items-center justify-center">
                  <MdRateReview className="text-orange-400" size={18} />
                </div>
                <span className="text-xs mt-1 sm:mt-2 font-medium">
                  Reviews
                </span>
              </motion.button>
            )}
          </div>

          {/* Profile Sections */}
          <div className="space-y-4 sm:space-y-6">
            {/* Contact Info */}
            <div className="bg-gray-800/50 rounded-xl shadow-sm p-4 sm:p-6 border border-gray-700">
              <h2 className="text-lg sm:text-xl font-bold text-white mb-3 sm:mb-4 border-b border-gray-700 pb-2 sm:pb-3">
                Contact Information
              </h2>
              <div className="space-y-3 sm:space-y-4">
                <div>
                  <p className="text-xs sm:text-sm text-gray-400">Email</p>
                  <p className="text-gray-200 font-medium text-sm sm:text-base">
                    {friend?.email || "Not provided"}
                  </p>
                </div>
                {friend?.city && (
                  <div>
                    <p className="text-xs sm:text-sm text-gray-400">Location</p>
                    <p className="text-gray-200 font-medium text-sm sm:text-base">
                      {friend?.city || "Not provided"}
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* Professional Bio */}
            {friend?.talentbio && (
              <div className="bg-gray-800/50 rounded-xl shadow-sm overflow-hidden border border-gray-700">
                <div className="bg-gradient-to-r from-purple-900/30 to-indigo-900/30 px-4 sm:px-6 py-3 sm:py-4">
                  <h2 className="text-lg sm:text-xl font-bold text-purple-300 flex items-center gap-2 sm:gap-3">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5 sm:h-6 sm:w-6 text-purple-400"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path
                        fillRule="evenodd"
                        d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                        clipRule="evenodd"
                      />
                    </svg>
                    About Me
                  </h2>
                </div>
                <div className="p-4 sm:p-6">
                  <p className="text-xs sm:text-sm text-gray-400">Bio</p>
                  <p className="text-gray-300 leading-relaxed text-sm sm:text-base whitespace-pre-line">
                    {friend?.talentbio}
                  </p>
                </div>
                <div className="px-4 sm:px-6 py-2">
                  <p className="text-xs sm:text-sm text-gray-400">Username</p>
                  <p className="text-gray-300 leading-relaxed text-sm sm:text-base whitespace-pre-line">
                    {friend?.username}
                  </p>
                </div>
              </div>
            )}

            {/* Role-Specific Info */}
            {(friend?.roleType === "instrumentalist" ||
              friend?.roleType === "dj" ||
              friend?.roleType === "mc" ||
              friend?.roleType === "vocalist") && (
              <div className="bg-gray-800/50 rounded-xl shadow-sm p-4 sm:p-6 border border-gray-700">
                <h2 className="text-lg sm:text-xl font-bold text-white mb-3 sm:mb-4 border-b border-gray-700 pb-2 sm:pb-3">
                  Professional Details
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4">
                  {friend?.roleType === "instrumentalist" && (
                    <div className="bg-gray-700/50 p-3 sm:p-4 rounded-lg">
                      <p className="text-xs sm:text-sm text-gray-400">
                        Instrument
                      </p>
                      <p className="text-gray-200 font-medium text-sm sm:text-base">
                        {friend?.instrument || "N/A"}
                      </p>
                    </div>
                  )}
                  {friend?.roleType === "dj" && (
                    <>
                      <div className="bg-gray-700/50 p-3 sm:p-4 rounded-lg">
                        <p className="text-xs sm:text-sm text-gray-400">
                          Profession
                        </p>
                        <p className="text-gray-200 font-medium text-sm sm:text-base">
                          Deejay
                        </p>
                      </div>
                      <div className="bg-gray-700/50 p-3 sm:p-4 rounded-lg">
                        <p className="text-xs sm:text-sm text-gray-400">
                          Genre
                        </p>
                        <p className="text-gray-200 font-medium text-sm sm:text-base">
                          {friend?.djGenre === "openformat"
                            ? "Plays Across all Genres"
                            : friend?.djGenre || "N/A"}
                        </p>
                      </div>
                      <div className="bg-gray-700/50 p-3 sm:p-4 rounded-lg col-span-1 md:col-span-2">
                        <p className="text-xs sm:text-sm text-gray-400">
                          Equipment
                        </p>
                        <p className="text-gray-200 font-medium text-sm sm:text-base">
                          {friend?.djEquipment || "N/A"}
                        </p>
                      </div>
                    </>
                  )}
                  {friend?.roleType === "mc" && (
                    <>
                      <div className="bg-gray-700/50 p-3 sm:p-4 rounded-lg">
                        <p className="text-xs sm:text-sm text-gray-400">
                          Profession
                        </p>
                        <p className="text-gray-200 font-medium text-sm sm:text-base">
                          EMcee
                        </p>
                      </div>
                      <div className="bg-gray-700/50 p-3 sm:p-4 rounded-lg">
                        <p className="text-xs sm:text-sm text-gray-400">Type</p>
                        <p className="text-gray-200 font-medium text-sm sm:text-base">
                          {friend?.mcType || "N/A"}
                        </p>
                      </div>
                      <div className="bg-gray-700/50 p-3 sm:p-4 rounded-lg col-span-1 md:col-span-2">
                        <p className="text-xs sm:text-sm text-gray-400">
                          Language
                        </p>
                        <p className="text-gray-200 font-medium text-sm sm:text-base">
                          {friend?.mcLanguage || "N/A"}
                        </p>
                      </div>
                    </>
                  )}
                  {friend?.roleType === "vocalist" && (
                    <>
                      <div className="bg-gray-700/50 p-3 sm:p-4 rounded-lg">
                        <p className="text-xs sm:text-sm text-gray-400">
                          Profession
                        </p>
                        <p className="text-gray-200 font-medium text-sm sm:text-base">
                          Vocalist
                        </p>
                      </div>
                      <div className="bg-gray-700/50 p-3 sm:p-4 rounded-lg">
                        <p className="text-xs sm:text-sm text-gray-400">
                          Genre
                        </p>
                        <p className="text-gray-200 font-medium text-sm sm:text-base">
                          {friend?.vocalistGenre || "N/A"}
                        </p>
                      </div>
                    </>
                  )}
                  {friend?.experience && (
                    <div className="bg-gray-700/50 p-3 sm:p-4 rounded-lg">
                      <p className="text-xs sm:text-sm text-gray-400">
                        Experience
                      </p>
                      <p className="text-gray-200 font-medium text-sm sm:text-base">
                        {friend?.experience || "N/A"}
                      </p>
                    </div>
                  )}
                  {friend?.rate && (
                    <div className="bg-gray-800/50 rounded-xl shadow-sm p-4 sm:p-6 border border-gray-700">
                      <h2 className="text-lg sm:text-xl font-bold text-white mb-3 sm:mb-4 border-b border-gray-700 pb-2 sm:pb-3">
                        Job Rates
                      </h2>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4">
                        {friend.rate.regular && (
                          <div className="bg-gradient-to-br from-blue-900/30 to-blue-800/30 p-3 sm:p-4 rounded-lg border border-blue-800/50">
                            <div className="flex items-center justify-between">
                              <p className="text-xs sm:text-sm text-blue-400 font-medium">
                                Regular Gigs
                              </p>
                              <DollarSign className="h-4 w-4 text-blue-500" />
                            </div>
                            <p className="text-gray-200 font-semibold text-base sm:text-lg mt-2">
                              {friend.rate.regular}
                            </p>
                            <p className="text-xs text-blue-500/80 mt-1">
                              Standard performances
                            </p>
                          </div>
                        )}

                        {friend.rate.function && (
                          <div className="bg-gradient-to-br from-purple-900/30 to-purple-800/30 p-3 sm:p-4 rounded-lg border border-purple-800/50">
                            <div className="flex items-center justify-between">
                              <p className="text-xs sm:text-sm text-purple-400 font-medium">
                                Functions
                              </p>
                              <Calendar className="h-4 w-4 text-purple-500" />
                            </div>
                            <p className="text-gray-200 font-semibold text-base sm:text-lg mt-2">
                              {friend.rate.function}
                            </p>
                            <p className="text-xs text-purple-500/80 mt-1">
                              Private events
                            </p>
                          </div>
                        )}

                        {friend.rate.concert && (
                          <div className="bg-gradient-to-br from-amber-900/30 to-amber-800/30 p-3 sm:p-4 rounded-lg border border-amber-800/50">
                            <div className="flex items-center justify-between">
                              <p className="text-xs sm:text-sm text-amber-400 font-medium">
                                Concerts
                              </p>
                              <Music className="h-4 w-4 text-amber-500" />
                            </div>
                            <p className="text-gray-200 font-semibold text-base sm:text-lg mt-2">
                              {friend.rate.concert}
                            </p>
                            <p className="text-xs text-amber-500/80 mt-1">
                              Stage performances
                            </p>
                          </div>
                        )}

                        {friend.rate.corporate && (
                          <div className="bg-gradient-to-br from-emerald-900/30 to-emerald-800/30 p-3 sm:p-4 rounded-lg border border-emerald-800/50">
                            <div className="flex items-center justify-between">
                              <p className="text-xs sm:text-sm text-emerald-400 font-medium">
                                Corporate
                              </p>
                              <Briefcase className="h-4 w-4 text-emerald-500" />
                            </div>
                            <p className="text-gray-200 font-semibold text-base sm:text-lg mt-2">
                              {friend.rate.corporate}
                            </p>
                            <p className="text-xs text-emerald-500/80 mt-1">
                              Business events
                            </p>
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Social Media */}
            {friend?.handles && friend.handles.length > 0 && (
              <div className="bg-gray-800/50 rounded-xl shadow-sm p-4 sm:p-6 border border-gray-700">
                <h2 className="text-lg sm:text-xl font-bold text-white mb-3 sm:mb-4 border-b border-gray-700 pb-2 sm:pb-3">
                  Social Media
                </h2>
                <div className="flex flex-wrap justify-center gap-4 sm:gap-6">
                  {friend?.handles.split(",").map((handle, i) => (
                    <motion.div
                      key={i}
                      whileHover={{ scale: 1.1, rotate: 5 }}
                      whileTap={{ scale: 0.9 }}
                      className="flex-shrink-0"
                    >
                      {handle.includes("instagram") && (
                        <button
                          onClick={() =>
                            window.open(
                              handle.startsWith("http")
                                ? handle
                                : `https://${handle}`,
                              "_blank"
                            )
                          }
                          className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-gradient-to-br from-pink-500 to-yellow-500 text-white flex items-center justify-center shadow-md hover:shadow-lg transition-all duration-200"
                        >
                          <BsInstagram size={18} />
                        </button>
                      )}
                      {handle.includes("tiktok") && (
                        <button
                          onClick={() =>
                            window.open(
                              handle.startsWith("http")
                                ? handle
                                : `https://${handle}`,
                              "_blank"
                            )
                          }
                          className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-gray-900 text-white flex items-center justify-center shadow-md hover:shadow-lg transition-all duration-200"
                        >
                          <FaTiktok size={18} />
                        </button>
                      )}
                      {handle.includes("youtube") && (
                        <button
                          onClick={() =>
                            window.open(
                              handle.startsWith("http")
                                ? handle
                                : `https://${handle}`,
                              "_blank"
                            )
                          }
                          className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-red-600 text-white flex items-center justify-center shadow-md hover:shadow-lg transition-all duration-200"
                        >
                          <FaYoutube size={18} />
                        </button>
                      )}
                      {handle.includes("x.com") ||
                        (handle.includes("twitter.com") && (
                          <button
                            onClick={() =>
                              window.open(
                                handle.startsWith("http")
                                  ? handle
                                  : `https://${handle}`,
                                "_blank"
                              )
                            }
                            className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-black text-white flex items-center justify-center shadow-md hover:shadow-lg transition-all duration-200"
                          >
                            <BsTwitter size={18} />
                          </button>
                        ))}
                      {handle.includes("facebook") && (
                        <button
                          onClick={() =>
                            window.open(
                              handle.startsWith("http")
                                ? handle
                                : `https://${handle}`,
                              "_blank"
                            )
                          }
                          className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-blue-600 text-white flex items-center justify-center shadow-md hover:shadow-lg transition-all duration-200"
                        >
                          <BsFacebook size={18} />
                        </button>
                      )}
                    </motion.div>
                  ))}
                </div>
              </div>
            )}

            {/* Stats */}
            <div className="bg-gray-800/50 rounded-xl shadow-sm p-4 sm:p-6 border border-gray-700">
              <h2 className="text-lg sm:text-xl font-bold text-white mb-3 sm:mb-4 border-b border-gray-700 pb-2 sm:pb-3">
                Engagement Statistics
              </h2>
              <div className="flex flex-col sm:flex-row justify-around gap-3 sm:gap-4">
                <div className="text-center bg-indigo-900/30 p-3 sm:p-4 rounded-lg shadow-sm">
                  <p className="text-2xl sm:text-3xl font-extrabold text-indigo-400">
                    <CountUp
                      end={friend?.followers?.length || 0}
                      duration={2}
                      delay={0.5}
                    />
                  </p>
                  <p className="text-xs sm:text-sm text-gray-400 mt-1">
                    Followers
                  </p>
                </div>
                <div className="text-center bg-purple-900/30 p-3 sm:p-4 rounded-lg shadow-sm">
                  <p className="text-2xl sm:text-3xl font-extrabold text-purple-400">
                    <CountUp
                      end={friend?.followings?.length || 0}
                      duration={2}
                      delay={0.5}
                    />
                  </p>
                  <p className="text-xs sm:text-sm text-gray-400 mt-1">
                    Following
                  </p>
                </div>
              </div>
            </div>

            {/* Organization */}
            {friend?.organization && (
              <div className="bg-gray-800/50 rounded-xl shadow-sm p-4 sm:p-6 border border-gray-700">
                <h2 className="text-lg sm:text-xl font-bold text-white mb-3 sm:mb-4 border-b border-gray-700 pb-2 sm:pb-3">
                  Affiliation
                </h2>
                <p className="text-gray-300 text-sm sm:text-base">
                  {friend?.organization}
                </p>
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="mt-8 sm:mt-10 text-center text-gray-500 text-xs sm:text-sm">
            <p>&copy; {new Date().getFullYear()} Gigup. All rights reserved.</p>
          </div>
        </div>
      ) : (
        <motion.div
          initial={{ x: "600px", opacity: 0 }}
          animate={{ x: ["0px", "-20px", "40px", "0px"], opacity: 1 }}
          transition={{ duration: 0.7, delay: 0.3 }}
        >
          <UserProfileDetails
            friend={friend}
            error={error}
            isLoading={isLoading}
            setShow={setShowMore}
          />
        </motion.div>
      )}
    </div>
  );
};

export default FriendsComponent;
