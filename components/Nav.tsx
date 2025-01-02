"use client";
import UsersButton from "./UsersButton";
import { UserButton, useAuth } from "@clerk/nextjs";

import { Badge, CircularProgress } from "@mui/material";
// import { useGlobalContext } from "@/app/Context/store";
import { BiSolidVideoPlus, BiSolidVideos } from "react-icons/bi";
import Link from "next/link";
// import Logo from "./Logo";
import {
  Info,
  MedalIcon,
  MessageCircleQuestion,
  MessageCircleQuestionIcon,
  Music,
  User,
  User2,
} from "lucide-react";

const Nav = ({}) => {
  let userId = "12345";
  return (
    <nav className="container shadow-cyan-700 dark:bg-black bg-neutral-500 p-4 shadow-md sticky top-0 mx-auto  xl:w-[100vw]  flex items-center justify-between ">
      {/* <Logo /> */}
      <div className="flex items-center">
        {userId ? (
          <div className="flex flex-grow gap-4 items-center ml-4">
            <Link
              href="/gigme/social"
              className=" text-white  link md:text-[16px] md:font-mono flex flex-col gap-2 items-center md:hover:bg-gray-200 md:hover:text-neutral-800 md:hover:scale-100 md:p-2 rounded-full  transition-all duration-75"
            >
              <span className="hidden ml-2 md:inline-flex">
                Gigme <span className="hidden ml-2 md:inline-flex">|</span>
              </span>
              <BiSolidVideoPlus size="20px" className="md:hidden" />
            </Link>

            <Link
              href={`/v1/profile/${"12fgfgfggfggfg"}`}
              className=" text-white  link md:text-[16px] md:font-mono flex flex-col gap-2 items-center md:hover:bg-gray-200 md:hover:text-neutral-800 md:hover:scale-100 p-2 rounded-full  transition-all duration-75"
            >
              <span className="hidden ml-2 md:inline-flex">
                Profile <span className="hidden ml-2 md:inline-flex">|</span>
              </span>
              <User2 size="20px" className="md:hidden" />
            </Link>
            {/* <ChatComponent chats={chats} /> */}
            <Link
              href="/gigme/about"
              className=" text-white  link md:text-[16px] md:font-mono flex flex-col gap-2 items-center md:hover:bg-gray-200 md:hover:text-neutral-800 md:hover:scale-100 p-2 rounded-full  transition-all duration-75"
            >
              {" "}
              <span className="hidden ml-2 md:inline-flex">Faq</span>
              <MessageCircleQuestionIcon size="20px" className="md:hidden" />
            </Link>
            {/* <AvatarComponent
              usercomm={user?.user}
              posts="w-[32px] h-[32px] rounded-full object-fit"
            /> */}
            {/* <UserButton afterSignOutUrl="/" /> */}
          </div>
        ) : (
          <div className="flex gap-4">
            {" "}
            <UsersButton
              myimage=""
              myspan=""
              myonClick={() => console.log("User clicked")}
              myloading={false}
              mydisabled={false}
              mygigip="" // If gigip is optional, add it as well
              mylink="/sign-in"
              title="SignIn"
              myclassName=" title mr-6 text-slate-800  bg-neutral-200 py-[3px] md:py-[6px] px-3 w-[80px] border border-yellow-500  rounded-xl md:hover:bg-purple-200 md:hover:text-slate-600 "
            />{" "}
            {/* <UsersButton
              link="/sign-up"
              title="SignUp"
              className="hidden title mr-6 text-slate-800  bg-neutral-200 py-[3px] md:py-[6px] md:hover:bg-slate-600  px-3 w-[80px] border border-yellow-500  rounded-xl "
            />{" "} */}
          </div>
        )}{" "}
      </div>
    </nav>
  );
};

export default Nav;
