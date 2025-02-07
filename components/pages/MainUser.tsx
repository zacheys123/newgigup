"use client";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import AvatarComponent from "./Avatar";
import FollowButton from "./FollowButton";
import { UserProps } from "@/types/userinterfaces";
import { CgProfile } from "react-icons/cg";

const MainUser = ({
  _id,
  email,
  firstname,
  lastname,
  username,
  followers,
  picture,
  isClient,
  isMusician,
  organization,
}: UserProps) => {
  const router = useRouter();

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      whileInView={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.4, delay: 0.2 }}
      className={`ml-10 mt-6 w-[320px] rounded-xl p-4 cursor-pointer transition duration-300 shadow-lg mb-4
        ${
          isMusician
            ? "bg-gradient-to-r from-amber-800 to-amber-600 hover:from-amber-700 hover:to-amber-500"
            : isClient
            ? "bg-gradient-to-r from-gray-800 to-gray-600 hover:from-gray-700 hover:to-gray-500"
            : "bg-neutral-800 hover:bg-neutral-700"
        }
      `}
    >
      <div className="flex gap-4 items-center">
        <div
          className="flex-1 flex items-center gap-2"
          onClick={() => router.push(`/search/${username}`)}
        >
          <AvatarComponent
            picture={picture || ""}
            posts="rounded-full w-[40px] h-[40px] border-2 border-white"
            firstname={firstname || ""}
          />
          <div className="flex flex-col justify-center">
            <div className="flex items-center gap-2 text-[14px] font-semibold text-white">
              {firstname} {lastname}
            </div>
            {isClient ? (
              <div className="text-[12px] text-gray-200">
                {organization || firstname}
              </div>
            ) : isMusician ? (
              <div className="text-[12px] text-gray-300">{email}</div>
            ) : (
              <div className="text-[12px] text-gray-300">{email}</div>
            )}
          </div>
        </div>

        <div className="flex flex-col gap-1 items-center">
          {isClient && (
            <div className="flex justify-center mb-1">
              <CgProfile className="text-white text-lg" />
            </div>
          )}
          {_id && <FollowButton _id={_id} followers={followers} />}
        </div>
      </div>
    </motion.div>
  );
};

export default MainUser;
