"use client";
import { UserProps } from "@/types/userinterfaces";
import { useParams, useRouter } from "next/navigation";
import React, { useState } from "react";
import Logo from "../Logo"; // Assuming Logo is designed for a lighter theme
import { useAuth, UserButton } from "@clerk/nextjs";
import { IoCheckmarkDone } from "react-icons/io5";
import { Button } from "../ui/button"; // Ensure your Button component supports variant="outline"
import { MdAdd } from "react-icons/md";
import { useCurrentUser } from "@/hooks/useCurrentUser";
import { BsInstagram, BsTwitter, BsFacebook } from "react-icons/bs"; // Added BsFacebook and BsTwitter
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
import Image from "next/image"; // Import Image for optimized images
import { FaTiktok, FaYoutube } from "react-icons/fa"; // Import TikTok and YouTube icons
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
  const [optimisticFollow, setOptimisticFollow] = useState(isFollowing); // Renamed to avoid clash with `follow` state from original snippet

  const handleFollowClick = async () => {
    if (!friend?._id || !user?.user?._id || isMutating) return;
    setIsMutating(true);
    setOptimisticFollow(true); // Optimistic UI update

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

      mutate(`/api/user/getuser/${username}`); // Revalidate with actual data
    } catch (error) {
      setOptimisticFollow(false); // Revert optimistic update on error
      console.error("Error following:", error);
    } finally {
      setIsMutating(false);
    }
  };

  const handleUnfollowClick = async () => {
    if (!friend?._id || !user?.user?._id || isMutating) return;
    setIsMutating(true);
    setOptimisticFollow(false); // Optimistic UI update

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

      mutate(`/api/user/getuser/${username}`); // Revalidate with actual data
    } catch (error) {
      setOptimisticFollow(true); // Revert optimistic update on error
      console.error("Error unfollowing:", error);
    } finally {
      setIsMutating(false);
    }
  };
  const [show, setShowMore] = useState<boolean>();
  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
          className="w-12 h-12 border-4 border-indigo-500 border-t-transparent rounded-full shadow-lg"
        />
        <h6 className="ml-4 text-xl font-semibold text-gray-700 animate-pulse">
          Loading user data...
        </h6>
      </div>
    );
  }

  if (error || !friend) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
        <div className="bg-white p-10 rounded-2xl shadow-xl border border-gray-100 text-center">
          <p className="text-gray-700 text-xl font-medium mb-4">
            {`Oops! Couldn't load user data.`}
          </p>
          <Button
            onClick={() => router.back()}
            className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-2 px-6 rounded-lg transition-colors duration-300"
          >
            Go Back
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="overflow-y-auto h-screen w-full bg-gradient-to-b from-gray-50 to-gray-100">
      {/* Header Section */}
      <div className="relative h-64 bg-gradient-to-br  via-blue-600 to-emerald-300 rounded-b-3xl shadow-lg">
        {/* Logo and UserButton in top right */}
        <div className="w-[90%] absolute top-4 right-6 flex items-center gap-4 z-10 justify-between ">
          <Logo /> {/* Assuming Logo component can take color prop */}
          <UserButton afterSignOutUrl="/" />
        </div>

        <div className="absolute -bottom-16 left-1/2 transform -translate-x-1/2">
          <div className="w-32 h-32 rounded-full border-4 border-white bg-white shadow-xl flex items-center justify-center overflow-hidden">
            {friend?.picture ? ( // Assuming `friend.picture` exists
              <Image
                src={friend.picture}
                alt="Profile"
                className="w-full h-full rounded-full object-cover"
                width={128} // Set appropriate width for Image component
                height={128} // Set appropriate height for Image component
                quality={80}
              />
            ) : (
              <div className="w-full h-full rounded-full bg-gradient-to-br from-indigo-400 to-purple-400 flex items-center justify-center text-white text-5xl font-bold">
                {friend?.firstname?.charAt(0)}
                {friend?.lastname?.charAt(0)}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Profile Content */}
      {!show ? (
        <div className="mt-20 px-6 pb-10 max-w-3xl mx-auto">
          {/* Name and Follow Button */}
          <div className="flex flex-col items-center mb-6">
            <h1 className="text-3xl font-extrabold text-gray-800 tracking-tight">
              {friend?.firstname} {friend?.lastname}
            </h1>
            {friend?.experience && friend?.instrument && (
              <p className="text-gray-500 text-sm mb-4">
                <span className="font-semibold text-gray-600">
                  {friend.experience}
                </span>{" "}
                years of experience as an{" "}
                <span className="font-semibold text-indigo-600">
                  {friend.instrument}
                </span>
              </p>
            )}

            <div className="flex gap-4 mt-2">
              {optimisticFollow ? (
                <Button
                  variant="outline"
                  className={`px-6 py-2 rounded-full text-indigo-600 border-indigo-600 hover:bg-indigo-50 transition-all duration-300 ${
                    isMutating ? "opacity-70 cursor-not-allowed" : ""
                  }`}
                  onClick={handleUnfollowClick}
                  disabled={isMutating}
                >
                  {isMutating ? (
                    <span className="flex items-center">
                      <span className="loading-spinner-dark mr-2" />{" "}
                      following...
                    </span>
                  ) : (
                    <span className="flex items-center">
                      <IoCheckmarkDone className="mr-2 text-lg" />
                      Following
                    </span>
                  )}
                </Button>
              ) : (
                <Button
                  className={`px-6 py-2 rounded-full bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-600 hover:to-purple-600 text-white shadow-md transition-all duration-300 ${
                    isMutating ? "opacity-70 cursor-not-allowed" : ""
                  }`}
                  onClick={handleFollowClick}
                  disabled={isMutating}
                >
                  {isMutating ? (
                    <span className="flex items-center">
                      <span className="loading-spinner-light mr-2" />{" "}
                      UnFollowing...
                    </span>
                  ) : (
                    <span className="flex items-center">
                      <MdAdd className="mr-2 text-lg" />
                      Follow
                    </span>
                  )}
                </Button>
              )}
              <ReportButton userId={friend?._id || ""} />
              <Button
                variant="outline"
                className="px-6 py-2 rounded-full "
                onClick={() => setShowMore(true)}
              >
                <span className="flex items-center">
                  <MenuIcon />
                </span>
              </Button>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="flex justify-center gap-6 mb-8 bg-white p-4 rounded-xl shadow-sm border border-gray-100">
            <motion.button
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => router.back()}
              className="flex flex-col items-center text-gray-600 hover:text-indigo-600 transition-colors"
            >
              <div className="w-12 h-12 rounded-full bg-indigo-50 shadow-sm border border-indigo-100 flex items-center justify-center">
                <ArrowLeftIcon className="text-indigo-600" size={20} />
              </div>
              <span className="text-xs mt-2 font-medium">Back</span>
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
                className="flex flex-col items-center text-gray-600 hover:text-purple-600 transition-colors"
              >
                <div className="w-12 h-12 rounded-full bg-purple-50 shadow-sm border border-purple-100 flex items-center justify-center">
                  <Music className="text-purple-600" size={20} />
                </div>
                <span className="text-xs mt-2 font-medium">Music Gigs</span>
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
              className="flex flex-col items-center text-gray-600 hover:text-teal-600 transition-colors"
            >
              <div className="w-12 h-12 rounded-full bg-teal-50 shadow-sm border border-teal-100 flex items-center justify-center">
                <Video className="text-teal-600" size={20} />
              </div>
              <span className="text-xs mt-2 font-medium">Videos</span>
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
                className="flex flex-col items-center text-gray-600 hover:text-orange-600 transition-colors"
              >
                <div className="w-12 h-12 rounded-full bg-orange-50 shadow-sm border border-orange-100 flex items-center justify-center">
                  <MdRateReview className="text-orange-600" size={20} />
                </div>
                <span className="text-xs mt-2 font-medium">Reviews</span>
              </motion.button>
            )}
          </div>

          {/* Profile Sections */}
          <div className="space-y-6">
            {/* Contact Info */}
            <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
              <h2 className="text-xl font-bold text-gray-800 mb-4 border-b border-gray-200 pb-3">
                Contact Information
              </h2>
              <div className="space-y-4">
                <div>
                  <p className="text-sm text-gray-500">Email</p>
                  <p className="text-gray-800 font-medium text-base">
                    {friend?.email || "Not provided"}
                  </p>
                </div>
                {friend?.city && (
                  <div>
                    <p className="text-sm text-gray-500">Location</p>
                    <p className="text-gray-800 font-medium text-base">
                      {friend?.city || "Not provided"}
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* Professional Bio */}
            {friend?.talentbio && (
              <div className="bg-white rounded-xl shadow-sm overflow-hidden border border-gray-100">
                <div className="bg-gradient-to-r from-indigo-50 to-purple-50 px-6 py-4">
                  <h2 className="text-xl font-bold text-indigo-800 flex items-center gap-3">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-6 w-6 text-indigo-600"
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
                <div className="p-6">
                  <p className="text-sm text-gray-500">Bio</p>
                  <p className="text-gray-700 leading-relaxed text-base whitespace-pre-line">
                    {friend?.talentbio}
                  </p>
                </div>
                <div className="px-6 py-2">
                  <p className="text-sm text-gray-500">Username</p>
                  <p className="text-gray-700 leading-relaxed text-base whitespace-pre-line">
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
              <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
                <h2 className="text-xl font-bold text-gray-800 mb-4 border-b border-gray-200 pb-3">
                  Professional Details
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {friend?.roleType === "instrumentalist" && (
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <p className="text-sm text-gray-500">Instrument</p>
                      <p className="text-gray-800 font-medium text-base">
                        {friend?.instrument || "N/A"}
                      </p>
                    </div>
                  )}
                  {friend?.roleType === "dj" && (
                    <>
                      <div className="bg-gray-50 p-4 rounded-lg">
                        <p className="text-sm text-gray-500">Profession</p>
                        <p className="text-gray-800 font-medium text-base">
                          Deejay
                        </p>
                      </div>
                      <div className="bg-gray-50 p-4 rounded-lg">
                        <p className="text-sm text-gray-500">Genre</p>
                        <p className="text-gray-800 font-medium text-base">
                          {friend?.djGenre === "openformat"
                            ? "Plays Across all Genres"
                            : friend?.djGenre || "N/A"}
                        </p>
                      </div>
                      <div className="bg-gray-50 p-4 rounded-lg col-span-1 md:col-span-2">
                        <p className="text-sm text-gray-500">Equipment</p>
                        <p className="text-gray-800 font-medium text-base">
                          {friend?.djEquipment || "N/A"}
                        </p>
                      </div>
                    </>
                  )}
                  {friend?.roleType === "mc" && (
                    <>
                      <div className="bg-gray-50 p-4 rounded-lg">
                        <p className="text-sm text-gray-500">Profession</p>
                        <p className="text-gray-800 font-medium text-base">
                          EMcee
                        </p>
                      </div>
                      <div className="bg-gray-50 p-4 rounded-lg">
                        <p className="text-sm text-gray-500">Type</p>
                        <p className="text-gray-800 font-medium text-base">
                          {friend?.mcType || "N/A"}
                        </p>
                      </div>
                      <div className="bg-gray-50 p-4 rounded-lg col-span-1 md:col-span-2">
                        <p className="text-sm text-gray-500">Language</p>
                        <p className="text-gray-800 font-medium text-base">
                          {friend?.mcLanguage || "N/A"}
                        </p>
                      </div>
                    </>
                  )}
                  {friend?.roleType === "vocalist" && (
                    <>
                      <div className="bg-gray-50 p-4 rounded-lg">
                        <p className="text-sm text-gray-500">Profession</p>
                        <p className="text-gray-800 font-medium text-base">
                          Vocalist
                        </p>
                      </div>
                      <div className="bg-gray-50 p-4 rounded-lg">
                        <p className="text-sm text-gray-500">Genre</p>
                        <p className="text-gray-800 font-medium text-base">
                          {friend?.vocalistGenre || "N/A"}
                        </p>
                      </div>
                    </>
                  )}
                  {friend?.experience && (
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <p className="text-sm text-gray-500">Experience</p>
                      <p className="text-gray-800 font-medium text-base">
                        {friend?.experience || "N/A"}
                      </p>
                    </div>
                  )}
                  {friend?.rate && (
                    <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
                      <h2 className="text-xl font-bold text-gray-800 mb-4 border-b border-gray-200 pb-3">
                        Job Rates
                      </h2>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {friend.rate.regular && (
                          <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-4 rounded-lg border border-blue-100">
                            <div className="flex items-center justify-between">
                              <p className="text-sm text-blue-600 font-medium">
                                Regular Gigs
                              </p>
                              <DollarSign className="h-4 w-4 text-blue-400" />
                            </div>
                            <p className="text-gray-800 font-semibold text-lg mt-2">
                              {friend.rate.regular}
                            </p>
                            <p className="text-xs text-blue-500 mt-1">
                              Standard performances
                            </p>
                          </div>
                        )}

                        {friend.rate.function && (
                          <div className="bg-gradient-to-br from-purple-50 to-purple-100 p-4 rounded-lg border border-purple-100">
                            <div className="flex items-center justify-between">
                              <p className="text-sm text-purple-600 font-medium">
                                Functions
                              </p>
                              <Calendar className="h-4 w-4 text-purple-400" />
                            </div>
                            <p className="text-gray-800 font-semibold text-lg mt-2">
                              {friend.rate.function}
                            </p>
                            <p className="text-xs text-purple-500 mt-1">
                              Private events
                            </p>
                          </div>
                        )}

                        {friend.rate.concert && (
                          <div className="bg-gradient-to-br from-amber-50 to-amber-100 p-4 rounded-lg border border-amber-100">
                            <div className="flex items-center justify-between">
                              <p className="text-sm text-amber-600 font-medium">
                                Concerts
                              </p>
                              <Music className="h-4 w-4 text-amber-400" />
                            </div>
                            <p className="text-gray-800 font-semibold text-lg mt-2">
                              {friend.rate.concert}
                            </p>
                            <p className="text-xs text-amber-500 mt-1">
                              Stage performances
                            </p>
                          </div>
                        )}

                        {friend.rate.corporate && (
                          <div className="bg-gradient-to-br from-emerald-50 to-emerald-100 p-4 rounded-lg border border-emerald-100">
                            <div className="flex items-center justify-between">
                              <p className="text-sm text-emerald-600 font-medium">
                                Corporate
                              </p>
                              <Briefcase className="h-4 w-4 text-emerald-400" />
                            </div>
                            <p className="text-gray-800 font-semibold text-lg mt-2">
                              {friend.rate.corporate}
                            </p>
                            <p className="text-xs text-emerald-500 mt-1">
                              Business events
                            </p>
                          </div>
                        )}
                      </div>

                      {/* {friend.rate.notes && (
                      <div className="mt-4 p-3 bg-gray-50 rounded-lg border border-gray-200">
                        <p className="text-xs text-gray-500 font-medium">
                          Notes
                        </p>
                        <p className="text-sm text-gray-700 mt-1">
                          {friend.rate.notes}
                        </p>
                      </div>
                    )} */}
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Social Media */}
            {friend?.handles &&
              friend.handles.length > 0 && ( // Check if handles exist and is not empty
                <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
                  <h2 className="text-xl font-bold text-gray-800 mb-4 border-b border-gray-200 pb-3">
                    Social Media
                  </h2>
                  <div className="flex flex-wrap justify-center gap-6">
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
                            className="w-12 h-12 rounded-full bg-gradient-to-br from-pink-500 to-yellow-500 text-white flex items-center justify-center shadow-md hover:shadow-lg transition-all duration-200"
                          >
                            <BsInstagram size={22} />
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
                            className="w-12 h-12 rounded-full bg-gray-900 text-white flex items-center justify-center shadow-md hover:shadow-lg transition-all duration-200"
                          >
                            <FaTiktok size={22} />
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
                            className="w-12 h-12 rounded-full bg-red-600 text-white flex items-center justify-center shadow-md hover:shadow-lg transition-all duration-200"
                          >
                            <FaYoutube size={22} />
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
                              className="w-12 h-12 rounded-full bg-black text-white flex items-center justify-center shadow-md hover:shadow-lg transition-all duration-200"
                            >
                              <BsTwitter size={22} />
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
                            className="w-12 h-12 rounded-full bg-blue-600 text-white flex items-center justify-center shadow-md hover:shadow-lg transition-all duration-200"
                          >
                            <BsFacebook size={22} />
                          </button>
                        )}
                      </motion.div>
                    ))}
                  </div>
                </div>
              )}

            {/* Stats */}
            <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
              <h2 className="text-xl font-bold text-gray-800 mb-4 border-b border-gray-200 pb-3">
                Engagement Statistics
              </h2>
              <div className="flex justify-around gap-4">
                <div className="text-center bg-indigo-50 p-4 rounded-lg flex-1 shadow-sm">
                  <p className="text-3xl font-extrabold text-indigo-600">
                    <CountUp
                      end={friend?.followers?.length || 0}
                      duration={2}
                      delay={0.5}
                    />
                  </p>
                  <p className="text-sm text-gray-600 mt-1">Followers</p>
                </div>
                <div className="text-center bg-purple-50 p-4 rounded-lg flex-1 shadow-sm">
                  <p className="text-3xl font-extrabold text-purple-600">
                    <CountUp
                      end={friend?.followings?.length || 0}
                      duration={2}
                      delay={0.5}
                    />
                  </p>
                  <p className="text-sm text-gray-600 mt-1">Following</p>
                </div>
              </div>
            </div>

            {/* Organization */}
            {friend?.organization && (
              <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
                <h2 className="text-xl font-bold text-gray-800 mb-4 border-b border-gray-200 pb-3">
                  Affiliation
                </h2>
                <p className="text-gray-700 text-base">
                  {friend?.organization}
                </p>
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="mt-10 text-center text-gray-500 text-sm">
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
      <style jsx>{`
        .loading-spinner-dark {
          border: 3px solid rgba(100, 116, 139, 0.3); /* gray-400 with opacity */
          border-top: 3px solid #64748b; /* gray-500 */
          border-radius: 50%;
          width: 16px;
          height: 16px;
          animation: spin 1s linear infinite;
        }

        .loading-spinner-light {
          border: 3px solid rgba(255, 255, 255, 0.3);
          border-top: 3px solid #fff;
          border-radius: 50%;
          width: 16px;
          height: 16px;
          animation: spin 1s linear infinite;
        }

        @keyframes spin {
          0% {
            transform: rotate(0deg);
          }
          100% {
            transform: rotate(360deg);
          }
        }

        /* Custom Scrollbar for a sleek look */
        .overflow-y-auto::-webkit-scrollbar {
          width: 8px;
        }

        .overflow-y-auto::-webkit-scrollbar-track {
          background: #f1f5f9; /* gray-100 */
          border-radius: 10px;
        }

        .overflow-y-auto::-webkit-scrollbar-thumb {
          background-color: #a78bfa; /* purple-400 */
          border-radius: 10px;
          border: 2px solid #e2e8f0; /* gray-200 */
        }

        .overflow-y-auto::-webkit-scrollbar-thumb:hover {
          background-color: #8b5cf6; /* purple-500 */
        }
      `}</style>
    </div>
  );
};

export default FriendsComponent;
