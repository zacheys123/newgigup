"use client";
import { UserProps } from "@/types/userinterfaces";
import { useParams, useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import Logo from "../Logo";
import { useAuth, UserButton } from "@clerk/nextjs";
import { IoCheckmarkDone } from "react-icons/io5";
import { Button } from "../ui/button";
import { MdAdd } from "react-icons/md";
import { useCurrentUser } from "@/hooks/useCurrentUser";
import { Box } from "@mui/material";
import { BsChatDots } from "react-icons/bs";
import { MdRateReview } from "react-icons/md";
import { Music, Video } from "lucide-react";
const FriendsComponent = () => {
  const { userId } = useAuth();
  const { username } = useParams();
  const [friend, setFriend] = useState<UserProps>();
  const [loading, setLoading] = useState<boolean>(false);
  const { user } = useCurrentUser(userId || null);
  const router = useRouter();
  useEffect(() => {
    if (!username) {
      // Guard: Do not run the effect if `id` is undefined or null
      return;
    }
    let isMounted = true;

    async function getFriend() {
      // fetch friend data from an API endpoint
      try {
        const response = await fetch(`/api/user/getuser/${username}`);
        const friendData: UserProps = await response.json();
        console.log(friendData);
        if (isMounted) {
          setFriend(friendData);
        }
        return friendData;
      } catch (error: unknown) {
        console.error("Error fetching friend data:", error);
        // handle the error appropriately, e.g., redirect to a 404 page or show an error message to the user
        alert("Error fetching friend data");
        if (isMounted) {
          setFriend({
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
  }, [username]);
  console.log(friend?.picture);
  if (loading) return <div>loading....</div>;
  return (
    <div className="overflow-y-auto h-[95%] w-[90%] mx-auto  shadow-md shadow-orange-300 flex flex-col gap-2">
      {/* Fixed Gigheader */}
      <div className="sticky top-0 z-10 shadow-md flex justify-between p-2">
        <Logo />
        <UserButton />
      </div>
      <div className="h-[180px] bg-neutral-800 flex items-center px-2 justify-around  rounded-bl-3xl rounded-br-3xl">
        {/* {friend?.picture && friend?.picture !== null ? (
          <Image
            className="w-[100px] h-[100px] rounded-full object-cover bg-slate-400"
            src={friend.picture}
            alt="Profile Pic"
            width={100}
            height={100}
          />
        ) : ( */}
        <div className="w-[100px] h-[100px] rounded-full  bg-neutral-300 flex justify-center items-center">
          <span className="text-5xl">{friend?.firstname?.split("")[0]}</span>
          <span className="text-3xl">{friend?.lastname?.split("")[0]}</span>
        </div>
        <div className="w-[60px] h-[60px] flex flex-col flex-1 mx-2 mt-[100px]">
          <span className="flex gap-1">
            <span className=" text-sm text-gray-400">{friend?.firstname}</span>
            <span className=" text-sm text-gray-400">{friend?.lastname}</span>
          </span>
          <span className="text-[11px] text-gray-400">
            {/* {friend?.experience} years of experience in {friend?.instrument}
             */}
            {friend?.email}
          </span>
        </div>

        <div className=" flex justify-center items-center">
          {friend && friend?.followers?.includes(user?._id || "") ? (
            <Button
              className="min-w-[50px] h-[30px] text-white  text-[11px] bg-gray-400 hover:bg-blue-700"
              onClick={() => {
                console.log("Follow button clicked");
              }}
            >
              UnFollow <IoCheckmarkDone />
            </Button>
          ) : (
            <Button
              className="min-w-[50px] h-[30px] text-white  text-[11px] bg-blue-600 hover:bg-blue-700"
              onClick={() => {
                console.log("Follow button clicked");
              }}
            >
              Follow <MdAdd />
            </Button>
          )}
        </div>
      </div>
      <div className="h-[70px] flex gap-2 justify-around items-center">
        <BsChatDots size="19" style={{ color: "lightgrey" }} />
        <Music
          size="19"
          style={{ color: "lightgrey" }}
          onClick={() => router.push(`/gigs/${userId}`)}
        />
        <Video
          size="19"
          style={{ color: "lightgrey" }}
          onClick={() =>
            router.push(
              `/search/allvideos/${friend?._id}/*${user?.firstname}${user?.lastname}`
            )
          }
        />
        <MdRateReview
          size="19"
          style={{ color: "lightgrey" }}
          onClick={() =>
            router.push(
              `/search/reviews/${friend?._id}/*${user?.firstname}${user?.lastname}`
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
            {friend?.firstname}
          </span>
          <span className="text-[12px] font-bold text-gray-500 ">
            {friend?.lastname}
          </span>
        </div>
      </Box>
      <Box className="h-fit bg-neutral-800 w-[100%] px-2 py-3">
        <h4 className="text-[16px] font-bold text-gray-400 mt-3 mb-1 ">
          Contact Info
        </h4>
        <div className="flex flex-col">
          <span className="text-[12px] font-bold text-gray-500">
            {friend?.email}
          </span>
        </div>
      </Box>
      <Box className="h-fit bg-neutral-800 w-[100%] px-2 py-3">
        <h4 className="text-[16px] font-bold text-gray-400 mt-3 mb-1 ">
          General Info
        </h4>
        <div className="flex flex-col">
          <span className="text-[12px] font-bold text-gray-500">
            <span className="text-[15px] font-bold text-neutral-200 font-mono">
              City:{" "}
            </span>
            {friend?.city ? friend?.city : "-null"}
          </span>
          <span className="text-[12px] font-bold text-gray-500">
            <span className="text-[15px] font-bold text-neutral-200 font-mono">
              Address:{" "}
            </span>
            {friend?.address ? friend?.address : "-null"}
          </span>
          <span className="text-[12px] font-bold text-gray-400">
            {friend?.followers?.length} followers
          </span>
          <span className="text-[12px] font-bold text-gray-400">
            {friend?.followings?.length} followings
          </span>
        </div>
      </Box>
      <Box className="h-fit bg-neutral-800 w-[100%] px-2 py-3">
        <h4 className="text-[16px] font-bold text-gray-400 mt-3 mb-1 ">
          Personal Info(Date of birth)
        </h4>
        <div className="flex flex-col">
          <span className="text-[12px] font-bold text-gray-500">
            <span className="text-[15px] font-bold text-neutral-200 font-mono">
              Date:{" "}
            </span>
            {friend?.date ? friend?.date : "-null"}
          </span>
          <span className="text-[12px] font-bold text-gray-500">
            <span className="text-[15px] font-bold text-neutral-200 font-mono">
              Month:
            </span>{" "}
            {friend?.month ? friend?.month : "-null"}
          </span>
          <span className="text-[12px] font-bold text-gray-500">
            <span className="text-[15px] font-bold text-neutral-200 font-mono">
              Year:
            </span>{" "}
            {friend?.year ? friend?.year : "-null"}
          </span>
        </div>
      </Box>
    </div>
  );
};

export default FriendsComponent;
