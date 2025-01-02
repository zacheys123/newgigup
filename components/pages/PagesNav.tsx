"use client";
import { Home } from "lucide-react";
import React from "react";
import { IoCreate } from "react-icons/io5";
import { IoIosAddCircle } from "react-icons/io";
import { usePathname } from "next/navigation";
import { useAuth } from "@clerk/nextjs";
import Link from "next/link";
import { MdOutlinePersonalInjury } from "react-icons/md";
import { MdEmojiEvents } from "react-icons/md";

const PagesNav = () => {
  const { userId } = useAuth();
  const pathname = usePathname();
  const inactivelink =
    "text-gray-300  hover:text-yellow-400 ml-4 text-[23px]  ";
  const activelink =
    "text-yellow-400 ml-4  hover:text-yellow transition transion-duration";
  return (
    <div className=" h-[60px]  bottom-0 bg-zinc-900 w-full   border border-1 border-t-slate-600 border-b-0border-l-0 border-r-0">
      <div className="grid grid-cols-5 items-center w-[100%]  h-[100%] px-5 mx-auto ">
        <Link href={`/gigs/${userId}`}>
          <Home
            className={
              pathname === `gigs/${userId}` ? activelink : inactivelink
            }
            style={{ cursor: "pointer" }}
            size={pathname === `/gigs/${userId}` ? 26 : 25}
          />
        </Link>{" "}
        <Link href={`/av_gigs/${userId}`}>
          <IoCreate
            className={
              pathname === `/av_gigs/${userId}` ? activelink : inactivelink
            }
            size={pathname === `/av_gigs/${userId}` ? 26 : 25}
            style={{ cursor: "pointer" }}
          />
        </Link>
        <Link href={`/create/${userId}`}>
          <IoIosAddCircle
            className="text-purple-500 text-2xl hover:text-yellow  ml-2  "
            size={43}
            style={{ cursor: "pointer" }}
          />
        </Link>
        <Link href={`/my_gig/${userId}`}>
          <MdOutlinePersonalInjury
            className={
              pathname === `/my_gig/${userId}` ? activelink : inactivelink
            }
            size={pathname === `/my_gig/${userId}` ? 26 : 25}
            style={{ cursor: "pointer" }}
          />
        </Link>
        <Link href={`/bookedgigs/${userId}`}>
          <MdEmojiEvents
            className={
              pathname === `/bookedgigs/${userId}` ? activelink : inactivelink
            }
            size={pathname === `/bookedgigs/${userId}` ? 26 : 25}
            style={{ cursor: "pointer" }}
          />
        </Link>
      </div>
    </div>
  );
};

export default PagesNav;
