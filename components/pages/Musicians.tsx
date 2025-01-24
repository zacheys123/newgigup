"use client";
import { useAllUsers } from "@/hooks/useAllUsers";
import { UserProps } from "@/types/userinterfaces";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";

import React from "react";

const Musicians = ({ _id }: UserProps) => {
  const { users: allusers } = useAllUsers();
  const router = useRouter();
  return (
    <div className="h-[150px]  mt-[100px] w-[98%] mx-auto flex flex-col gap-2 p-3">
      <h2 className="text-gray-400 text-[13px] font-bold">
        Musicians you may know
      </h2>

      <div className="flex bg-zinc-800 h-full w-full rounded-md overflow-x-auto overflow-y-hidden items-center">
        {allusers?.users
          ?.filter(
            (myuser: UserProps) => myuser?._id !== _id && myuser?.instrument
          )
          .map((myuser: UserProps) => {
            return (
              <motion.div
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 1, delay: 0.2 }}
                key={myuser._id}
                className="flex justify-center items-center flex-col h-[80px] w-[70px] rounded-full  shadow-md cursor-pointer hover:shadow-xl mx-2"
                onClick={() => router.push(`/search/${myuser?.username}`)}
              >
                {/* {myuser?.picture && (
                  <Image
                    className="w-[120px] h-[120px] object-cover rounded-full"
                    src={myuser?.picture}
                    alt=" Pic"
                    width={120}
                    height={120}
                  />
                )}
                 */}
                <div className="text-gray-600  font-bold bg-neutral-800 w-[70px] h-[80px] p-3 rounded-full flex justify-center items-center border border-b-4 border-b-orange-300">
                  <span className="text-red-300 text-[20px]">
                    {myuser?.firstname?.split("")[0]?.toUpperCase()}
                  </span>
                  <span className="text-neutral-300">
                    {myuser?.lastname?.split("")[0]}
                  </span>
                </div>
                <h2 className="text-gray-400 text-sm">
                  {myuser?.firstname?.slice(0, 4)}
                  {myuser?.lastname?.slice(0)}
                </h2>{" "}
              </motion.div>
            );
          })}
      </div>
    </div>
  );
};

export default Musicians;
