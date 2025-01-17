"use client";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import AvatarComponent from "./Avatar";
import FollowButton from "./FollowButton";
import { UserProps } from "@/types/userinterfaces";
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
    const router = useRouter();
    // const [loadingPostId, setLoadingPostId] = useState(null);
    // const [loadingFriend, setLoadingFriend] = useState(null);

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
            onClick={() => router.push(`/search/${username}`)}
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
          {_id && <FollowButton _id={_id} followers={followers} />}
        </div>
      </motion.div>
    );
  };
export default MainUser;
