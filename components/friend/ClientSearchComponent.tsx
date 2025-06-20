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

import { ArrowLeftIcon, Music, Video } from "lucide-react";
import useStore from "@/app/zustand/useStore";
import {
  handleFollow,
  handleFollowing,
  handleUnfollow,
  handleUnFollowingCurrent,
} from "@/utils";
import { FaTiktok, FaYoutube } from "react-icons/fa";
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
              createdAt: new Date(),
              updatedAt: new Date(),
              isBanned: false,
              banReason: "",
              bannedAt: new Date(),
              isAdmin: false,
              adminRole: "super",
              adminPermissions: [""],
              lastAdminAction: new Date(),
              adminNotes: "",
              banExpiresAt: new Date(), // New field for temporary ban
              banReference: "", // New fiel
              theme: "lightMode",
              savedGigs: [],
              favoriteGigs: [],
              bookingHistory: [],
              completedGigsCount: 0,
              cancelgigCount: 0,
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
    <div className="overflow-y-auto h-[95%] w-[90%] mx-auto  shadow-md shadow-orange-300 flex flex-col gap-2">
      {/* Fixed Gigheader */}

      <div className="h-[180px] bg-neutral-800 flex items-center px-2 justify-around  rounded-bl-3xl rounded-br-3xl">
        {/* {friend?.user?.picture && friend?.user?.picture !== null ? (
          <Image
            className="w-[100px] h-[100px] rounded-full object-cover bg-slate-400"
            src={friend.picture}
            alt="Profile Pic"
            width={100}
            height={100}
          />
        ) : ( */}
        <div className="w-[100px] h-[100px] rounded-full  bg-neutral-300 flex justify-center items-center">
          <span className="text-5xl">
            {friend?.user?.firstname?.split("")[0]}
          </span>
          <span className="text-3xl">
            {friend?.user?.lastname?.split("")[0]}
          </span>
        </div>
        <div className="w-[60px] h-[60px] flex flex-col flex-1 mx-2 mt-[100px]">
          <span className="flex gap-1">
            <span className=" text-sm text-gray-400">
              {friend?.user?.firstname}
            </span>
            <span className=" text-sm text-gray-400">
              {friend?.user?.lastname}
            </span>
          </span>
          <span className="text-[11px] text-gray-400">
            {/* {friend?.user?.experience} years of experience in {friend?.user?.instrument}
             */}
            {friend?.user?.email}
          </span>
        </div>

        <div className=" flex justify-center items-center">
          {(friend && !follow && isFollowing) || optimisticFollow ? (
            <Button
              className="min-w-[50px] h-[30px] text-white  text-[11px] bg-transparent border-2 border-gray-300 "
              onClick={() => {
                if (friend && friend?.user?._id) {
                  // Ensure _id is defined
                  try {
                    handleUnfollow(friend?.user?._id, user?.user);
                    handleUnFollowingCurrent(friend?.user?._id, user?.user);
                    setRefetch((prev) => !prev);
                    setOptimisticFollow(false);
                    setFollow(false); // Update global state as well
                  } catch (error) {
                    setOptimisticFollow(true);
                    setFollow(true); // Update global state as well
                    console.error("Error following:", error);
                  }
                } else {
                  console.log("No friend Id");
                }
              }}
            >
              following <IoCheckmarkDone />
            </Button>
          ) : (
            <Button
              className="min-w-[50px] h-[30px] text-white  text-[11px] bg-blue-600 hover:bg-blue-700"
              onClick={() => {
                if (friend && friend?.user?._id) {
                  // Ensure _id is defined
                  try {
                    handleFollow(friend?.user?._id, user?.user);
                    handleFollowing(friend?.user?._id, user?.user);
                    setRefetch((prev) => !prev);
                    setOptimisticFollow(true);
                    setFollow(true); // Update global state as well
                  } catch (error) {
                    setOptimisticFollow(false);
                    setFollow(!follow); // Update global state as well
                    console.error("Error following:", error);
                  }
                }
              }}
            >
              Follow <MdAdd />
            </Button>
          )}
        </div>
      </div>
      <div className="h-[70px] flex gap-2 justify-around items-center">
        <ArrowLeftIcon
          size="19"
          style={{ color: "lightgrey" }}
          onClick={() => router.back()}
        />

        <Music
          size="19"
          style={{ color: "lightgreen" }}
          onClick={() =>
            router.push(
              user?.user?.isClient ? `/create/${userId}` : `/av_gigs/${userId}`
            )
          }
        />
        <Video
          size="19"
          style={{ color: "pink" }}
          onClick={() =>
            router.push(
              `/search/allvideos/${friend?.user?._id}/*${user?.user?.firstname}${user?.user?.lastname}`
            )
          }
        />
      </div>
      <Box className="h-fit bg-neutral-800 w-[100%] px-2 py-3">
        <h4 className="text-[16px] font-bold text-gray-400 mt-3 mb-1 ">
          Fullname
        </h4>
        <div className="flex gap-2">
          <span className="text-[12px] font-bold text-gray-500">
            {friend?.user?.firstname}
          </span>
          <span className="text-[12px] font-bold text-gray-500 ">
            {friend?.user?.lastname}
          </span>
        </div>
      </Box>
      <Box className="h-fit bg-neutral-800 w-[100%] px-2 py-3">
        <h4 className="text-[16px] font-bold text-gray-400 mt-3 mb-1 ">
          Contact Info
        </h4>
        <div className="flex flex-col">
          <span className="text-[12px] font-bold text-gray-500">
            {friend?.user?.email}
          </span>
        </div>
      </Box>
      <Box className="h-fit bg-neutral-800 w-[100%] px-2 py-5">
        <h4 className="text-[16px] font-bold text-gray-400 mt-3 mb-1 ">
          General Info
        </h4>
        <div className="flex flex-col h-fit py-2">
          <span className="text-[12px] font-bold text-gray-500 flex flex-col">
            <span className="text-[15px] font-bold text-neutral-400 font-mono">
              City:{" "}
            </span>
            {friend?.user?.city ? friend?.user?.city : "-null"}
          </span>

          <div className="flex justify-around my-3 gap-2">
            <span className="text-[12px] font-bold text-red-500 bg-gray-200 opacity-80 rounded-md py-1 px-2">
              {friend?.user?.followers && friend?.user?.followers?.length === 1
                ? `${friend?.user?.followers?.length} follower`
                : `${friend?.user?.followers?.length} followers`}
            </span>
            <span className="text-gray-400">|</span>
            <span className="text-[12px] font-bold text-red-500 bg-gray-200 opacity-80 rounded-md py-1 px-2">
              {friend?.user?.followings?.length === 1 ||
              friend?.user?.followings?.length === 0
                ? `${friend?.user?.followings?.length} following`
                : `${friend?.user?.followings?.length} followings`}
            </span>
          </div>
          <div className="flex flex-col gap-2">
            <span className="text-[12px] font-bold text-gray-500 flex flex-col">
              <span className="text-[15px] font-bold text-neutral-400 font-mono">
                Organization/Company/Hotel:
              </span>
              {friend?.user?.organization
                ? friend?.user?.organization
                : "-null"}
            </span>
            <div className="text-[12px] font-bold text-gray-500 flex gap-5 mt-3 justify-center">
              {friend?.user?.handles &&
                friend?.user?.handles.split(",").map((handle, i) => (
                  <div key={i} className="mx-4">
                    <span className="text-[12px]  font-bold text-gray-500 flex items-center ">
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
                          size="19"
                          style={{ color: "yellow" }}
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
                          size="19"
                          style={{ color: "purple" }}
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
                          size="19"
                          style={{ color: "red" }}
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
                          size="19"
                          style={{ color: "blue" }}
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
                          size="19"
                          style={{ color: "lightblue" }}
                        />
                      )}
                    </span>
                  </div>
                ))}
            </div>
          </div>
        </div>
      </Box>
      <Box className="h-fit bg-neutral-800 w-[100%] px-2 py-3">
        <h4 className="text-[16px] font-bold text-gray-400 mt-3 mb-1 ">
          Bio Info
        </h4>
        <div className="flex flex-col">
          <span className="text-[12px] font-bold text-gray-500">
            {friend?.user?.bio ? friend?.user?.bio : "-null"}
          </span>
        </div>
      </Box>
      <div className="flex justify-center p-2">
        <span className="text-neutral-500 link"> &copy;Gigup 2025 </span>
      </div>
    </div>
  );
};

export default ClientSearchComponent;
