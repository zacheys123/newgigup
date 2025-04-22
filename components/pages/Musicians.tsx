"use client";
import { useAllUsers } from "@/hooks/useAllUsers";
import { useCurrentUser } from "@/hooks/useCurrentUser";
import { UserProps } from "@/types/userinterfaces";
import { motion } from "framer-motion";
import Image from "next/image";
import { useRouter } from "next/navigation";
import React from "react";

const Musicians = ({ _id }: UserProps) => {
  const { users: allusers, loading } = useAllUsers();
  const { user } = useCurrentUser();
  const router = useRouter();
  const NotCurrentUserOrClientIsmusucian = allusers?.users?.filter(
    (myuser: UserProps) =>
      myuser?._id !== _id &&
      myuser?.instrument &&
      myuser?.isClient === false &&
      myuser?.isMusician === true &&
      user?.roleType === "instrumentalist" ? myuser?.roleType==="instrumentalist" : user?.roleType === "dj" ? myuser?.roleType==="dj" : user?.roleType === "mc" ? myuser?.roleType==="mc": user?.roleType === "vocalist" ? 
      myuser?.roleType==="vocalist":false
  );
  const CurrentMusicianAroundWhereIam = allusers?.users?.filter(
    (myuser: UserProps) =>
      myuser?.city === user?.user?.city &&
      myuser?.instrument === user?.user?.instrument &&
      myuser?.roleType === "instrumentalist"
  );
  // const randomUser =
  //   NotCurrentUserOrClientIsmusucian[
  //     Math.floor(Math.random() * NotCurrentUserOrClientIsmusucian.length)
  //   ];

  if (loading) {
    return (
      <div className="mt-21 w-full max-w-6xl mx-auto px-4">
        <div className="flex items-center justify-between mb-6">
          <div>
            <div className="h-7 w-48 bg-neutral-800 rounded-md mb-2"></div>
            <div className="h-4 w-64 bg-neutral-800 rounded-md"></div>
          </div>
          <div className="h-6 w-16 bg-neutral-800 rounded-full"></div>
        </div>

        <div className="relative">
          <div className="flex gap-5 pb-6 overflow-x-auto scrollbar-hide">
            {[...Array(6)].map((_, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="flex flex-col items-center flex-shrink-0 w-28 mx-5 animate-pulse"
              >
                <div className="relative mb-3">
                  <div className="absolute inset-0 bg-neutral-800 rounded-full blur-md -z-10 w-20"></div>
                  <div className="relative flex items-center justify-center w-24 h-24 rounded-full bg-neutral-800 border-2 border-neutral-700 overflow-hidden">
                    <div className="w-full h-full bg-neutral-800 animate-pulse"></div>
                  </div>
                </div>

                <div className="text-center w-full">
                  <div className="h-4 w-20 bg-neutral-800 rounded-md mx-auto mb-2 animate-pulse"></div>
                  <div className="h-3 w-16 bg-neutral-800 rounded-full mx-auto mt-1 animate-pulse"></div>
                  <div className="h-3 w-12 bg-neutral-800 rounded-md mx-auto mt-2 animate-pulse"></div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
<<<<<<< HEAD
    <div className="mt-7 w-full max-w-6xl mx-auto px-4">
=======
    <div className="mt-11 w-full max-w-6xl mx-auto px-4">
>>>>>>> aed385a19b5cf2cf7a8fe669b824b899128ca97b
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-neutral-100 text-xl font-bold">
          Musicians Near You
          <span className="block text-sm font-normal text-neutral-400 mt-1">
            Connect with local talent
          </span>
        </h2>
        <span className="text-xs bg-orange-500/30 text-orange-300 px-3 py-1.5 rounded-full font-medium">
          {CurrentMusicianAroundWhereIam?.length || 0} nearby
        </span>
      </div>

      <div className="relative">
        <div className="flex gap-5 pb-6 overflow-x-auto scrollbar-hide">
          {NotCurrentUserOrClientIsmusucian?.map((myuser: UserProps) => (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              whileHover={{ y: -5 }}
              transition={{ duration: 0.3, ease: "easeOut" }}
              key={myuser?._id}
              className="flex flex-col items-center flex-shrink-0 w-28 cursor-pointer group"
              onClick={() => router.push(`/search/${myuser?.username}`)}
            >
              <div className="relative mb-3">
                <div className="absolute inset-0 bg-gradient-to-br from-orange-500/40 to-purple-500/30 rounded-full blur-md group-hover:blur-lg transition-all duration-300 -z-10" />
                <div className="relative flex items-center justify-center w-14 h-14 rounded-full bg-gradient-to-br from-neutral-800 to-neutral-900 border-2 border-neutral-700 group-hover:border-orange-400 transition-all duration-300 overflow-hidden">
                  {myuser?.picture ? (
                    <Image
                      src={myuser.picture}
                      alt={`${myuser.firstname}'s profile`}
                      className="w-full h-full object-cover"
                      width={14}
                      height={14}
                    />
                  ) : (
                    <>
                      <span className="text-orange-300 text-3xl font-bold">
                        {myuser?.firstname?.split("")[0]?.toUpperCase()}
                      </span>
                      <span className="text-neutral-100 text-2xl">
                        {myuser?.lastname?.split("")[0]}
                      </span>
                    </>
                  )}
                </div>
              </div>

              <div className="text-center w-full">
                <h3 className="text-neutral-100 text-sm font-semibold truncate">
                  {myuser?.firstname} {myuser?.lastname?.split("")[0]}.
                </h3>
                {myuser?.instrument && (
                  <p className="text-xs text-orange-400 mt-1 font-medium bg-orange-500/10 px-2 py-0.5 rounded-full inline-block">
                    {myuser.instrument}
                  </p>
                )}
                {myuser?.genre && (
                  <p className="text-[11px] text-neutral-400 mt-1.5">
                    {myuser.genre}
                  </p>
                )}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Musicians;
