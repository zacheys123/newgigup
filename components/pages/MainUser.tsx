"use client";

// import { useCurrentUser } from "@/hooks/useCurrentUser";
// import { useAuth } from "@clerk/nextjs";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { FetchResponse, UserProps } from "@/types/userinterfaces";
import AvatarComponent from "./Avatar";
import useStore from "@/app/zustand/useStore";
import { useCurrentUser } from "@/hooks/useCurrentUser";
import { IoMdAdd } from "react-icons/io";
import { useAuth } from "@clerk/nextjs";
// import { useState } from "react";
const MainUser = ({
  _id,
  email,
  firstname,
  lastname,
  username,
  followers,
  picture,
}: UserProps) =>
  // followings: string[]
  {
    const { userId } = useAuth();
    const { user } = useCurrentUser(userId || null);
    const router = useRouter();
    // const [loadingPostId, setLoadingPostId] = useState(null);
    // const [loadingFriend, setLoadingFriend] = useState(null);
    const { follow, setFollow } = useStore();
    const updateFollowers = async (id: string) => {
      setFollow(true);

      try {
        const res = await fetch(`/api/user/follower/${id}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ follower: user?._id }),
        });

        const followersData: FetchResponse = await res.json();
        console.log(res);

        if (res.ok) {
          console.log("followed!!!", followersData);
          router.refresh();
        }
      } catch (error) {
        setFollow(false);
        console.log("error updating followers in search page", error);
      }
    };
    const updateFollowing = async (id: string) => {
      try {
        const res = await fetch(`/api/user/following/${id}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ following: user?._id }),
        });
        const followingData: FetchResponse = await res.json();
        console.log(followingData);
        if (res.ok) {
          console.log("following!!!", followingData);
          router.refresh();
        }
      } catch (error) {
        console.log(error);
      }
    };

    const unFollower = async (id: string) => {
      setFollow(false);

      try {
        const res = await fetch(`/api/user/unfollower/${id}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ follower: user?._id }),
        });

        const followersData: FetchResponse = await res.json();
        console.log(res);

        if (res.ok) {
          console.log("unfollowed!!!", followersData);
          router.refresh();
        }
      } catch (error) {
        setFollow(true);
        console.log("error updating followers in search page", error);
      }
    };
    const unFollowing = async (id: string) => {
      try {
        setFollow(false);
        const res = await fetch(`/api/user/unfollowing/${id}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ following: user?._id }),
        });
        const followingData: FetchResponse = await res.json();
        console.log(followingData);
      } catch (error) {
        console.log(error);
      }
    };

    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        whileInView={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.4, delay: 0.2 }}
        className="  bg-neutral-800 ml-[40px] text-neutral-400 w-[300px] my-6 rounded-xl p-2 cursor-pointer hover:bg-gray-500/80 transition ease-in-out delay-150 hover:-translate-x-2 hover:scale-20  duration-300      animate-fade"
      >
        <div className="flex gap-4 items-center ">
          {" "}
          <div
            className=" flex-1 flex items-center gap-1"
            onClick={() => router.push(`/friends/${username}`)}
          >
            <AvatarComponent
              picture={picture || ""}
              posts="rounded-full w-[34px] h-[34px]"
              firstname={firstname || ""}
            />
            <div className="w-full flex-col justify-center">
              <div className="flex items-center gap-2 text-[12px] text-input">
                {firstname} {lastname}
              </div>
              <div className="text-[11px]">{email}</div>
            </div>
          </div>
          {_id && (
            <div
              className={
                !followers.includes(user?._id || "")
                  ? "flex   bg-neutral-700  px-2 -py-6 rounded-md  min-w-[50px]"
                  : "flex   bg-red-800  px-2 -py-6 rounded-md  min-w-[50px]"
              }
            >
              {/* <ButtonComponent
               
                // Simplified user check
                variant={
                  follow || followers?.includes(user?._id || "")
                    ? "ghost"
                    : "ghost"
                }
                classname="h-[20px] text-[10px] my-1 font-bold max-w-[30px]"
                title={follow && !followers.includes(user?._id || "") ? "" : ""}
              /> */}
              {follow === true || !followers.includes(user?._id || "") ? (
                <span
                  className="h-[20px] text-[10px] my-1 font-bold flex "
                  onClick={() => {
                    updateFollowers(_id);
                    updateFollowing(_id);
                  }}
                >
                  follow <IoMdAdd style={{ fontSize: "16px" }} />
                </span>
              ) : (
                <span
                  className="h-[20px] text-[10px] my-1 font-bold text-gray-100 "
                  onClick={() => {
                    unFollower(_id);
                    unFollowing(_id);
                  }}
                >
                  following
                </span>
              )}
            </div>
          )}
        </div>
      </motion.div>
    );
  };
export default MainUser;
