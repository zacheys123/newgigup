"use client";
import { UserProps } from "@/types/userinterfaces";
import { useParams, useRouter } from "next/navigation";
import React, { useState } from "react";
import Logo from "../Logo";
import { useAuth, UserButton } from "@clerk/nextjs";
import { IoCheckmarkDone } from "react-icons/io5";
import { Button } from "../ui/button";
import { MdAdd, MdPerson } from "react-icons/md";
import { useCurrentUser } from "@/hooks/useCurrentUser";
import { BsChatDots } from "react-icons/bs";
import { MdRateReview } from "react-icons/md";
import { ArrowLeftIcon, Music, Video } from "lucide-react";
import useSWR, { mutate } from "swr";
import {
  handleFollow,
  handleFollowing,
  handleUnfollow,
  handleUnFollowingCurrent,
} from "@/utils";
import { motion } from "framer-motion";
import CountUp from "react-countup";

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
    const userId = user?.user?._id;
    if (!userId || !friend?.followers) return false;

    return friend.followers.some((follower) =>
      typeof follower === "string"
        ? follower === userId
        : follower._id === userId
    );
  });
  const [isMutating, setIsMutating] = useState(false);

  const handleFollowClick = async () => {
    if (!friend?._id || !user?.user?._id || isMutating) return;
    setIsMutating(true);

    try {
      const optimisticData = {
        ...response,
        user: {
          ...friend,
          followers: [...(friend.followers || []), user?.user?._id],
        },
      };

      mutate(`/api/user/getuser/${username}`, optimisticData, false);
      setIsFollowing(true);

      await Promise.all([
        handleFollow(friend._id, user?.user),
        handleFollowing(friend._id, user?.user),
      ]);

      mutate(`/api/user/getuser/${username}`);
    } catch (error) {
      mutate(`/api/user/getuser/${username}`, response, false);
      setIsFollowing(false);
      console.error("Error following:", error);
    } finally {
      setIsMutating(false);
    }
  };

  const handleUnfollowClick = async () => {
    if (!friend?._id || !user?.user?._id || isMutating) return;
    setIsMutating(true);

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
      setIsFollowing(false);
      await Promise.all([
        handleUnfollow(friend._id, user?.user),
        handleUnFollowingCurrent(friend._id, user?.user),
      ]);
      mutate(`/api/user/getuser/${username}`);
    } catch (error) {
      mutate(`/api/user/getuser/${username}`, response, false);
      setIsFollowing(true);
      console.error("Error unfollowing:", error);
    } finally {
      setIsMutating(false);
    }
  };
  console.log("year", friend?.year);
  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen text-gray-300 backdrop-blur-sm bg-neutral-700/50 flex-col gap-4 ">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          className="w-8 h-8 border-4 border-lime-400 border-t-transparent rounded-full"
        />
        <h6 className="animate-pulse font-mono text-1xl  text-amber-500">
          {`Loading User's Data`}
        </h6>
      </div>
    );
  }

  if (error || !friend) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gradient-to-br from-indigo-900/20 via-purple-900/20 to-gray-900/20 backdrop-blur-lg">
        <div className="bg-white/10 backdrop-blur-md p-8 rounded-2xl shadow-xl border border-white/20">
          <p className="text-white text-lg">Error loading user data</p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen flex flex-col overflow-hidden">
      {/* Fixed Header */}
      <div className="sticky top-0 z-50 bg-black/30 backdrop-blur-lg shadow-lg flex justify-between p-4 items-center border-b border-white/10">
        <Logo />
        <div className="flex items-center gap-4">
          <UserButton />
        </div>
      </div>

      {/* Scrollable Content Area */}
      <div className="flex-1 overflow-y-auto bg-gradient-to-br from-indigo-900/10 via-purple-900/10 to-gray-900/10 backdrop-blur-sm">
        <div className="max-w-3xl mx-auto -mt-8 pb-12 px-4">
          {/* Profile Section - Kept as requested */}
          <div className="h-[180px] bg-neutral-800/80 backdrop-blur-md flex items-center px-2 justify-around rounded-bl-3xl rounded-br-3xl border border-white/10 shadow-xl">
            <div className="w-[100px] h-[100px] rounded-full bg-neutral-300/90 flex justify-center items-center shadow-lg">
              <span className="text-5xl text-neutral-800">
                {friend?.firstname?.split("")[0]}
              </span>
              <span className="text-3xl text-neutral-800">
                {friend?.lastname?.split("")[0]}
              </span>
            </div>

            <div className="w-[60px] h-[60px] flex flex-col flex-1 mx-2 mt-[100px]">
              <span className="flex gap-1">
                <span className="text-sm text-gray-200">
                  {friend?.firstname}
                </span>
                <span className="text-sm text-gray-200">
                  {friend?.lastname}
                </span>
              </span>
              <span className="text-[11px] text-gray-300">{friend?.email}</span>
            </div>

            <div className="flex justify-center items-center">
              {isFollowing ? (
                <Button
                  className={`min-w-[50px] h-[30px] text-white text-[11px] bg-transparent border-2 ${
                    isMutating ? "border-amber-400" : "border-gray-300"
                  } hover:bg-white/10 transition-all`}
                  onClick={handleUnfollowClick}
                  disabled={isMutating}
                >
                  {isMutating ? "Updating..." : "Following"} <IoCheckmarkDone />
                </Button>
              ) : (
                <Button
                  className={`min-w-[50px] h-[30px] text-white text-[11px] ${
                    isMutating ? "bg-blue-700" : "bg-blue-600"
                  } hover:bg-blue-700 transition-all`}
                  onClick={handleFollowClick}
                  disabled={isMutating}
                >
                  {isMutating ? "Updating..." : "Follow"} <MdAdd />
                </Button>
              )}
            </div>
          </div>

          {/* Glassmorphism Content Sections */}
          <div className="space-y-6 mt-8">
            {/* Navigation Bar */}
            {(user?.user?.isMusician || user?.user?.isClient) && (
              <div className="bg-white/5 backdrop-blur-md p-4 rounded-xl shadow-lg border border-white/10 flex justify-around items-center">
                <ArrowLeftIcon
                  size={22}
                  className="text-gray-300 hover:text-white cursor-pointer transition-colors"
                  onClick={() => router.back()}
                />
                <BsChatDots
                  size="19"
                  className="text-gray-300 hover:text-white cursor-pointer transition-colors"
                />
                <Music
                  size={22}
                  className="text-gray-300 hover:text-white cursor-pointer transition-colors"
                  onClick={() =>
                    router.push(
                      user?.user?.isClient
                        ? `/create/${userId}`
                        : `/av_gigs/${userId}`
                    )
                  }
                />
                <Video
                  size={22}
                  className="text-gray-300 hover:text-white cursor-pointer transition-colors"
                  onClick={() =>
                    router.push(
                      `/search/allvideos/${friend?._id}/*${friend?.firstname}/${friend?.lastname}`
                    )
                  }
                />
                {!user?.user?.isMusician && user?.user?.isClient && (
                  <MdRateReview
                    size={22}
                    className="text-gray-300 hover:text-white cursor-pointer transition-colors"
                    onClick={() =>
                      router.push(
                        `/search/reviews/${friend?._id}/*${friend?.firstname}${friend?.lastname}`
                      )
                    }
                  />
                )}
              </div>
            )}

            {/* Information Sections */}
            <div className="bg-white/5 backdrop-blur-md p-6 rounded-xl shadow-lg border border-white/10">
              <h4 className="text-lg font-bold text-gray-200 mb-4">Fullname</h4>
              <div className="flex gap-4">
                <div className="bg-white/10 p-3 rounded-lg flex-1">
                  <p className="text-sm text-gray-200">First Name</p>
                  <p className="text-neutral-400 font-medium title my-2">
                    {friend?.firstname || "-"}
                  </p>
                </div>
                <div className="bg-white/10 p-3 rounded-lg flex-1">
                  <p className="text-sm text-gray-200">Last Name</p>
                  <p className="text-neutral-400 font-medium title my-2">
                    {friend?.lastname || "-"}
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-white/5 backdrop-blur-md p-6 rounded-xl shadow-lg border border-white/10">
              <h4 className="text-lg font-bold text-gray-200 mb-4">
                Contact Info
              </h4>
              <div className="bg-white/10 p-3 rounded-lg">
                <p className="text-sm text-gray-200">Email</p>
                <p className="text-neutral-400 font-medium title my-2">
                  {friend?.email || "-"}
                </p>
              </div>
            </div>

            <div className="bg-white/5 backdrop-blur-md p-6 rounded-xl shadow-lg border border-white/10">
              <h4 className="text-lg font-bold text-gray-200 mb-4">
                General Info
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-white/10 p-3 rounded-lg">
                  <p className="text-sm text-gray-200">City</p>
                  <p className="text-neutral-400 font-medium title my-2">
                    {friend?.city || "-"}
                  </p>
                </div>
                <div className="bg-white/10 p-3 rounded-lg">
                  <p className="text-sm text-gray-200">Address</p>
                  <p className="text-gray-200 font-medium">
                    {friend?.address || "-"}
                  </p>
                </div>
              </div>

              <div className="flex justify-center gap-6 my-6">
                <div className="bg-gradient-to-r from-pink-500/20 to-rose-500/20 p-3 rounded-lg text-center min-w-[120px]">
                  <p className="text-sm text-gray-300">Followers</p>
                  <div className="text-xl font-bold text-white">
                    <p className="text-white font-bold text-2xl md:text-3xl">
                      <CountUp
                        end={friend?.followers?.length || 0}
                        duration={1.5}
                        delay={0.2}
                      />
                    </p>
                  </div>
                </div>
                <div className="bg-gradient-to-r from-blue-500/20 to-indigo-500 p-3 rounded-lg text-center min-w-[120px]">
                  <div className="text-sm text-gray-300">Following</div>
                  <div className="text-xl font-bold text-white">
                    <p className="text-white font-bold text-2xl md:text-3xl">
                      <CountUp
                        end={friend?.followings?.length || 0}
                        duration={1.5}
                        delay={0.2}
                      />
                    </p>
                  </div>
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                {friend?.roleType === "instrumentalist" && (
                  <div className="bg-white/10 p-3 rounded-lg">
                    <div className="text-sm text-gray-200">Instrument</div>
                    <div className="text-neutral-400 font-medium title my-2">
                      {friend?.instrument || "-"}
                    </div>
                  </div>
                )}
                {friend?.roleType === "dj" && (
                  <div className="bg-white/10 p-3 rounded-lg">
                    <div className="text-sm text-gray-200">Proffession</div>
                    <div className="text-neutral-400 font-medium title my-2">
                      Deejay
                    </div>
                    <div className="text-neutral-400 font-medium title my-2">
                      {friend?.djGenre === "openformat"
                        ? "Plays Across all Genres"
                        : friend?.djGenre || "-"}
                    </div>
                    <p className="text-gray-400 font-medium title my-2">
                      {friend?.djEquipment || "-"}
                    </p>
                  </div>
                )}
                {friend?.roleType === "mc" && (
                  <div className="bg-white/10 p-3 rounded-lg">
                    <div className="text-sm text-gray-200">Proffession</div>
                    <div className="text-neutral-400 font-medium title my-2">
                      EMcee
                    </div>
                    <div className="text-neutral-400 font-medium title my-2">
                      {friend?.mcType || "-"}
                    </div>
                    <div className="text-neutral-400 font-medium title my-2">
                      {friend?.mcLanguage || "-"}
                    </div>
                  </div>
                )}
                {friend?.roleType === "vocalist" && (
                  <div className="bg-white/10 p-3 rounded-lg">
                    <div className="text-sm text-gray-200">Proffesion</div>
                    <div className="text-neutral-400 font-medium title my-2">
                      Vocalist
                    </div>
                    <div className="text-neutral-400 font-medium title my-2 flex flex-col">
                      <span className="text-emerald-400">Genre</span>
                      {friend?.vocalistGenre || "-"}
                    </div>
                  </div>
                )}
                <div className="bg-white/10 p-3 rounded-lg">
                  <div className="text-sm text-gray-200">Experience</div>
                  <div className="text-neutral-400 font-medium title my-2">
                    {friend?.experience || "-"}
                  </div>
                </div>
                <div className="bg-white/10 p-3 rounded-lg">
                  <div className="text-sm text-gray-200">Bio</div>
                  <div className="text-neutral-400 font-medium title my-2">
                    {friend?.talentbio || "-"}
                  </div>
                </div>
              </div>

              <div className="flex justify-center mt-6">
                <Button
                  className="bg-blue-600/90 hover:bg-blue-700/90 backdrop-blur-md border border-blue-400/30 text-white px-6 py-2 rounded-full shadow-lg transition-all"
                  onClick={() => router.push(`/myvideos/${friend?._id}`)}
                >
                  View Video Profile <MdPerson className="ml-2" />
                </Button>
              </div>
            </div>

            <div className="bg-white/5 backdrop-blur-md p-6 rounded-xl shadow-lg border border-white/10">
              <h4 className="text-lg font-bold text-gray-200 mb-4">
                Personal Info
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-white/10 p-3 rounded-lg">
                  <p className="text-sm text-gray-200">Date</p>
                  <div className="text-neutral-400 font-medium title my-2">
                    {friend?.date || "-"}
                  </div>
                </div>
                <div className="bg-white/10 p-3 rounded-lg">
                  <p className="text-sm text-gray-200">Month</p>
                  <div className="text-neutral-400 font-medium title my-2">
                    {friend?.month || "-"}
                  </div>
                </div>
                <div className="bg-white/10 p-3 rounded-lg">
                  <p className="text-sm text-gray-200">Year</p>
                  <div className="text-neutral-400 font-medium title my-2">
                    {friend?.year || "-"}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FriendsComponent;
