"use client";
import { UserProps } from "@/types/userinterfaces";
import { useParams, useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { useAuth } from "@clerk/nextjs";
import { IoCheckmarkDone } from "react-icons/io5";
import { Button } from "../ui/button";
import { MdAdd } from "react-icons/md";
import { useCurrentUser } from "@/hooks/useCurrentUser";
import { Box } from "@mui/material";
import { BsFacebook, BsInstagram, BsTwitter } from "react-icons/bs";

import {
  ArrowLeftIcon,
  AtSign,
  Building2,
  FileText,
  Info,
  MapPin,
  Music,
  Share2,
  UserCircle,
  UserPlus,
  Users,
  Video,
} from "lucide-react";
import useStore from "@/app/zustand/useStore";
import {
  handleFollow,
  handleFollowing,
  handleUnfollow,
  handleUnFollowingCurrent,
} from "@/utils";
import { FaTiktok, FaYoutube } from "react-icons/fa";
import Image from "next/image";
type FriendProps = {
  user: UserProps;
};
const ClientSearchComponent = () => {
  const { userId } = useAuth();
  const { username } = useParams();
  const { follow, setFollow } = useStore();
  const [friend, setFriend] = useState<FriendProps>();
  const [loading, setLoading] = useState<boolean>(false);
  const [refetch, setRefetch] = useState<boolean>(false);
  const { user } = useCurrentUser();
  const router = useRouter();

  useEffect(() => {
    if (!username) {
      // Guard: Do not run the effect if `usernamme` is undefined or null
      return;
    }
    let isMounted = true;

    async function getFriend() {
      // fetch friend data from an API endpoint
      try {
        const response = await fetch(`/api/user/getuser/${username}`);
        const friendData = await response.json();
        console.log(friendData);
        if (isMounted) {
          setFriend(friendData);
        }
        return friendData;
      } catch (error: unknown) {
        console.error("Error fetching friend data:", error);
        // handle the error appropriately, e.g., redirect to a 404 page or show an error message to the user
        if (isMounted) {
          setFriend({
            user: {
              clerkId: "",
              firstname: "",
              lastname: "",
              experience: "",
              instrument: "",
              username: "",
              followers: [],
              followings: [],
              allreviews: [],
              myreviews: [],
              isClient: false,
              isMusician: false,
              videosProfile: [],
              organization: "",
              handles: "",
              bio: "",
              genre: "",
              refferences: [],
              roleType: "",
              djGenre: "",
              djEquipment: "",
              mcType: "",
              mcLanguage: "",
              talentbio: "",
              vocalistGenre: "",
              musiciangenres: [],
              musicianhandles: [{ platform: "", handle: "" }],
              firstLogin: true,
              onboardingComplete: false,
              lastActive: new Date(),
            },
          });
        }
      } finally {
        if (isMounted) setLoading(false);
      }
    }

    // Cleanup function to avoid setting state after component unmounts

    getFriend();
    return () => {
      isMounted = false;
    };
  }, [username, refetch]);

  const [optimisticFollow, setOptimisticFollow] = useState<boolean>(() => {
    const userId = user && user?.user?._id;
    if (!userId || !friend?.user?.followers) return false;

    // Handle both string and UserProps cases
    return friend?.user?.followers.some((follower) =>
      typeof follower === "string"
        ? follower === userId
        : follower?._id === userId
    );
  });

  console.log(friend?.user?.picture);
  const isFollowing = (() => {
    const userId = user && user?.user?._id;
    if (!userId || !friend?.user?.followers) return false;

    return friend?.user?.followers.some((follower) =>
      typeof follower === "string"
        ? follower === userId
        : follower?._id === userId
    );
  })();
  if (loading) return <div>loading....</div>;
  return (
    <div className="overflow-y-auto h-[95vh] w-full max-w-2xl mx-auto shadow-2xl shadow-purple-500/20 flex flex-col gap-4 rounded-2xl bg-gradient-to-br from-neutral-900 via-neutral-800 to-neutral-900 backdrop-blur-sm transition-all duration-500 hover:shadow-purple-500/30 relative isolate">
      {/* Animated background elements */}
      {/* <div className="absolute inset-0 overflow-hidden -z-10">
        <div className="absolute -left-20 -top-20 w-64 h-64 bg-purple-900/30 rounded-full filter blur-3xl animate-float opacity-40"></div>
        <div className="absolute -right-10 -bottom-10 w-72 h-72 bg-indigo-900/30 rounded-full filter blur-3xl animate-float-delay opacity-40"></div>
        <div className="absolute right-1/2 bottom-1/2 w-80 h-80 bg-emerald-900/20 rounded-full filter blur-3xl animate-float-delay-2 opacity-30"></div>
      </div> */}

      {/* Header Section with Parallax Effect */}
      <div className="h-[240px] bg-gradient-to-r from-purple-900/40 via-neutral-800/80 to-indigo-900/40 flex items-center px-8 justify-between rounded-t-2xl border-b border-neutral-700/50 relative overflow-hidden group transition-all duration-700 hover:bg-gradient-to-r hover:from-purple-900/50 hover:via-neutral-800/90 hover:to-indigo-900/50">
        {/* Profile Picture with Hover Effect */}
        <div className="flex items-center gap-6 z-10">
          {friend?.user?.picture ? (
            <div className="w-[130px] h-[130px] rounded-full overflow-hidden">
              <Image
                src={friend.user.picture}
                alt="Profile"
                width={130}
                height={130}
                className="w-full h-full object-cover"
              />
            </div>
          ) : (
            <div className="w-[130px] h-[130px] rounded-full bg-gradient-to-br from-neutral-700 to-neutral-600 flex justify-center items-center border-2 border-neutral-500/30 shadow-lg group-hover:shadow-purple-500/30 transition-all duration-500 hover:scale-105 hover:border-purple-400/30">
              <span className="text-5xl font-light text-neutral-200">
                {friend?.user?.firstname?.split("")[0]}
              </span>
              <span className="text-3xl font-light text-neutral-200">
                {friend?.user?.lastname?.split("")[0]}
              </span>
            </div>
          )}

          {/* Name and Info */}
          <div className="flex flex-col mt-[110px]">
            <h1 className="text-2xl font-medium text-neutral-100 bg-gradient-to-r from-neutral-200 to-neutral-300 bg-clip-text text-transparent">
              {friend?.user?.firstname} {friend?.user?.lastname}
            </h1>
            <p className="text-sm text-neutral-400 mt-1 flex items-center gap-1">
              <span>{friend?.user?.email}</span>
            </p>
          </div>
        </div>

        {/* Follow Button with Pulse Animation */}
        <div className="mt-[110px] z-10 flex flex-col items-end gap-2">
          <div className="flex items-center gap-2">
            <span className="text-xs text-neutral-400">
              Followers: {friend?.user?.followers?.length || 0}
            </span>
            <span className="text-xs text-neutral-400">
              Following: {friend?.user?.followings?.length || 0}
            </span>
          </div>
          {(friend && !follow && isFollowing) || optimisticFollow ? (
            <Button
              className="min-w-[120px] h-[42px] text-neutral-100 text-sm bg-gradient-to-r from-emerald-600/90 to-emerald-500/90 hover:from-emerald-500 hover:to-emerald-400 border border-emerald-600/50 transition-all duration-300 flex items-center justify-center gap-1 rounded-xl shadow-md hover:shadow-emerald-500/20 group-hover:animate-pulse-slow"
              onClick={() => {
                if (friend && friend?.user?._id) {
                  try {
                    handleUnfollow(friend?.user?._id, user?.user);
                    handleUnFollowingCurrent(friend?.user?._id, user?.user);
                    setRefetch((prev) => !prev);
                    setOptimisticFollow(false);
                    setFollow(false);
                  } catch (error) {
                    setOptimisticFollow(true);
                    setFollow(true);
                    console.error("Error following:", error);
                  }
                }
              }}
            >
              <IoCheckmarkDone className="text-white group-hover:animate-bounce" />
              <span>Following</span>
            </Button>
          ) : (
            <Button
              className="min-w-[120px] h-[42px] text-white text-sm bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-400 hover:to-indigo-400 transition-all duration-300 shadow-lg hover:shadow-blue-500/30 flex items-center justify-center gap-1 rounded-xl animate-pulse-slow"
              onClick={() => {
                if (friend && friend?.user?._id) {
                  try {
                    handleFollow(friend?.user?._id, user?.user);
                    handleFollowing(friend?.user?._id, user?.user);
                    setRefetch((prev) => !prev);
                    setOptimisticFollow(true);
                    setFollow(true);
                  } catch (error) {
                    setOptimisticFollow(false);
                    setFollow(!follow);
                    console.error("Error following:", error);
                  }
                }
              }}
            >
              <MdAdd className="group-hover:rotate-180 transition-transform duration-500" />
              <span>Follow</span>
            </Button>
          )}
        </div>
      </div>

      {/* Navigation Icons with Hover Effects */}
      <div className="h-[90px] flex gap-10 justify-center items-center bg-neutral-800/50 rounded-xl mx-6 border border-neutral-700/50 backdrop-blur-md hover:bg-neutral-700/60 transition-colors duration-300 shadow-inner shadow-neutral-900/30">
        <button
          onClick={() => router.back()}
          className="p-3 rounded-full bg-neutral-700/50 hover:bg-neutral-600/60 transition-all duration-300 group"
        >
          <ArrowLeftIcon
            size={26}
            className="text-neutral-400 group-hover:text-white transition-all duration-300 group-hover:scale-125"
          />
        </button>
        <button
          onClick={() => router.push(`/gigs/${userId}`)}
          className="p-3 rounded-full bg-neutral-700/50 hover:bg-emerald-500/20 transition-all duration-300 group relative overflow-hidden"
        >
          <div className="absolute inset-0 bg-emerald-500/10 group-hover:bg-emerald-500/20 transition-all duration-500 rounded-full scale-0 group-hover:scale-100"></div>
          <Music
            size={26}
            className="text-emerald-400 group-hover:text-emerald-300 transition-all duration-300 group-hover:scale-125 drop-shadow-[0_0_8px_rgba(74,222,128,0.4)]"
          />
        </button>
        <button
          onClick={() =>
            router.push(
              `/search/allvideos/${friend?.user?._id}/*${user?.user?.firstname}${user?.user?.lastname}`
            )
          }
          className="p-3 rounded-full bg-neutral-700/50 hover:bg-rose-500/20 transition-all duration-300 group relative overflow-hidden"
        >
          <div className="absolute inset-0 bg-rose-500/10 group-hover:bg-rose-500/20 transition-all duration-500 rounded-full scale-0 group-hover:scale-100"></div>
          <Video
            size={26}
            className="text-rose-400 group-hover:text-rose-300 transition-all duration-300 group-hover:scale-125 drop-shadow-[0_0_8px_rgba(251,113,133,0.4)]"
          />
        </button>
      </div>

      {/* Information Sections with Slide-in Animation */}
      <div className="flex flex-col gap-6 px-6 pb-8">
        {/* Fullname Section */}
        <Box className="bg-neutral-800/50 rounded-xl p-6 border border-neutral-700/40 backdrop-blur-sm hover:border-purple-500/40 transition-all duration-500 animate-slide-up delay-100 hover:shadow-purple-500/10 hover:translate-y-[-2px]">
          <h4 className="text-xs font-semibold text-neutral-400 uppercase tracking-widest mb-3 flex items-center gap-2">
            <UserCircle size={18} className="text-purple-400" />
            <span>Fullname</span>
          </h4>
          <div className="flex gap-3">
            <span className="text-lg font-normal text-neutral-200">
              {friend?.user?.firstname}
            </span>
            <span className="text-lg font-normal text-neutral-200">
              {friend?.user?.lastname}
            </span>
          </div>
        </Box>

        {/* Contact Info Section */}
        <Box className="bg-neutral-800/50 rounded-xl p-6 border border-neutral-700/40 backdrop-blur-sm hover:border-blue-500/40 transition-all duration-500 animate-slide-up delay-200 hover:shadow-blue-500/10 hover:translate-y-[-2px]">
          <h4 className="text-xs font-semibold text-neutral-400 uppercase tracking-widest mb-3 flex items-center gap-2">
            <AtSign size={18} className="text-blue-400" />
            <span>Contact Info</span>
          </h4>
          <div className="flex flex-col gap-2">
            <span className="text-lg text-neutral-200">
              {friend?.user?.email}
            </span>
            {friend?.user?.phone && (
              <span className="text-lg text-neutral-200">
                {friend.user.phone}
              </span>
            )}
          </div>
        </Box>

        {/* General Info Section */}
        <Box className="bg-neutral-800/50 rounded-xl p-6 border border-neutral-700/40 backdrop-blur-sm hover:border-emerald-500/40 transition-all duration-500 animate-slide-up delay-300 hover:shadow-emerald-500/10 hover:translate-y-[-2px]">
          <h4 className="text-xs font-semibold text-neutral-400 uppercase tracking-widest mb-3 flex items-center gap-2">
            <Info size={18} className="text-emerald-400" />
            <span>General Info</span>
          </h4>
          <div className="space-y-6">
            <div>
              <h5 className="text-xs font-medium text-neutral-500/80 mb-2 flex items-center gap-1">
                <MapPin size={14} className="text-amber-400" />
                <span>Location</span>
              </h5>
              <p className="text-lg text-neutral-200">
                {friend?.user?.city ? friend?.user?.city : "Not specified"}
              </p>
            </div>

            <div className="flex justify-center gap-6 my-5">
              <span className="text-xs font-medium bg-gradient-to-r from-neutral-700/60 to-neutral-600/60 text-neutral-300 rounded-full py-2 px-5 hover:scale-105 transition-transform duration-300 flex items-center gap-1">
                <Users size={14} className="text-purple-400" />
                {friend?.user?.followers?.length || 0}{" "}
                {friend?.user?.followers?.length === 1
                  ? "Follower"
                  : "Followers"}
              </span>
              <span className="text-neutral-600">|</span>
              <span className="text-xs font-medium bg-gradient-to-r from-neutral-700/60 to-neutral-600/60 text-neutral-300 rounded-full py-2 px-5 hover:scale-105 transition-transform duration-300 flex items-center gap-1">
                <UserPlus size={14} className="text-blue-400" />
                {friend?.user?.followings?.length || 0} Following
              </span>
            </div>

            <div>
              <h5 className="text-xs font-medium text-neutral-500/80 mb-2 flex items-center gap-1">
                <Building2 size={14} className="text-rose-400" />
                <span>Organization</span>
              </h5>
              <p className="text-lg text-neutral-200">
                {friend?.user?.organization
                  ? friend?.user?.organization
                  : "Not specified"}
              </p>
            </div>

            {friend?.user?.handles && (
              <div>
                <h5 className="text-xs font-medium text-neutral-500/80 mb-3 flex items-center gap-1">
                  <Share2 size={14} className="text-cyan-400" />
                  <span>Social Media</span>
                </h5>
                <div className="flex justify-center gap-8 mt-6">
                  {friend.user.handles.split(",").map((handle, i) => (
                    <div
                      key={i}
                      className="cursor-pointer hover:scale-125 transition-transform duration-300 hover:drop-shadow-lg relative group"
                    >
                      <div className="absolute inset-0 bg-current rounded-full opacity-0 group-hover:opacity-10 scale-0 group-hover:scale-125 transition-all duration-500"></div>
                      {handle.includes("instagram") && (
                        <BsInstagram
                          onClick={() =>
                            window.open(
                              handle.startsWith("http")
                                ? handle
                                : `https://${handle}`,
                              "_blank"
                            )
                          }
                          size={24}
                          className="text-pink-500 hover:text-pink-400"
                        />
                      )}
                      {handle.includes("tiktok") && (
                        <FaTiktok
                          onClick={() =>
                            window.open(
                              handle.startsWith("http")
                                ? handle
                                : `https://${handle}`,
                              "_blank"
                            )
                          }
                          size={24}
                          className="text-cyan-300 hover:text-cyan-200"
                        />
                      )}
                      {handle.includes("youtube") && (
                        <FaYoutube
                          onClick={() =>
                            window.open(
                              handle.startsWith("http")
                                ? handle
                                : `https://${handle}`,
                              "_blank"
                            )
                          }
                          size={24}
                          className="text-red-500 hover:text-red-400"
                        />
                      )}
                      {handle.includes("x") && (
                        <BsTwitter
                          onClick={() =>
                            window.open(
                              handle.startsWith("http")
                                ? handle
                                : `https://${handle}`,
                              "_blank"
                            )
                          }
                          size={24}
                          className="text-blue-400 hover:text-blue-300"
                        />
                      )}
                      {handle.includes("facebook") && (
                        <BsFacebook
                          onClick={() =>
                            window.open(
                              handle.startsWith("http")
                                ? handle
                                : `https://${handle}`,
                              "_blank"
                            )
                          }
                          size={24}
                          className="text-blue-600 hover:text-blue-500"
                        />
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </Box>

        {/* Bio Section */}
        <Box className="bg-neutral-800/50 rounded-xl p-6 border border-neutral-700/40 backdrop-blur-sm hover:border-amber-500/40 transition-all duration-500 animate-slide-up delay-400 hover:shadow-amber-500/10 hover:translate-y-[-2px]">
          <h4 className="text-xs font-semibold text-neutral-400 uppercase tracking-widest mb-3 flex items-center gap-2">
            <FileText size={18} className="text-amber-400" />
            <span>Bio</span>
          </h4>
          <p className="text-lg text-neutral-300 leading-relaxed">
            {friend?.user?.bio ? friend?.user?.bio : "No bio available"}
          </p>
        </Box>
      </div>

      {/* Footer with Glow Effect */}
      <div className="py-6 text-center">
        <span className="text-xs text-neutral-500 hover:text-neutral-400 transition-colors duration-300">
          &copy; Gigup 2025 | All Rights Reserved
        </span>
      </div>
    </div>
  );
};

export default ClientSearchComponent;
