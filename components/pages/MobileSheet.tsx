"use client";
import React from "react";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import {
  BookA,
  BookCopy,
  Home,
  Menu,
  MessageCircle,
  Music,
  Search,
  Settings,
  User,
  VideoIcon,
} from "lucide-react";

import { useAuth } from "@clerk/nextjs";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { MdDashboard } from "react-icons/md";
import { useCurrentUser } from "@/hooks/useCurrentUser";
import { useSubscription } from "@/hooks/useSubscription";
const MobileSheet = () => {
  const { userId } = useAuth();
  const pathname = usePathname();
  const { user } = useCurrentUser();
  const { subscription } = useSubscription(userId as string);

  return (
    <Sheet>
      <SheetTrigger>
        <Menu className="text-white  z-50 hover:text-teal-300 font-bold text-2xl transition-colors duration-200" />
      </SheetTrigger>

      <SheetContent
        side="left"
        className="w-[75%]  z-50 sm:w-[60%] bg-zink-700  bg-opacity-25 px-6 py-3 flex flex-col gap-[17px] justify-start items-start rounded-br-[180px] shadow-3xl backdrop-blur-lg"
      >
        <SheetTitle className="text-2xl font-semibold text-white mb-6">
          Access More Info
        </SheetTitle>

        {pathname === "/" ? (
          ""
        ) : (
          <Link
            href="/"
            className="flex flex-row items-center gap-4 min-w-[100%] px-4 py-2 text-white hover:bg-teal-600 hover:text-white rounded-md transition-all"
          >
            <Home size="20" className="text-white" />
            <SheetDescription className="text-lg font-medium title text-neutral-400 ">
              Home
            </SheetDescription>
          </Link>
        )}

        <Link
          href={`/dashboard`}
          className="flex flex-row items-center gap-4 min-w-[100%] px-4 py-2 text-white hover:bg-teal-600 hover:text-white rounded-md transition-all"
        >
          <MdDashboard size="20" className="text-white" />
          <SheetDescription className="text-lg font-medium title text-neutral-400 ">
            DashBoard
          </SheetDescription>
        </Link>
        <Link
          href={`/allreviews/${user?.user?._id}/*${user?.user?.firstname}${user?.user?.lastname}`}
          className="flex flex-row items-center gap-4 min-w-[100%] px-4 py-2 text-white hover:bg-teal-600 hover:text-white rounded-md transition-all"
        >
          <BookA size="20" className="text-white" />
          <SheetDescription className="text-lg font-medium title text-neutral-400 ">
            Reviews
          </SheetDescription>
        </Link>

        <Link
          href={`/search`}
          className="flex flex-row items-center gap-4 min-w-[100%] px-4 py-2 text-white hover:bg-teal-600 hover:text-white rounded-md transition-all"
        >
          <Search size="20" className="text-white" />
          <SheetDescription className="text-lg font-medium title text-neutral-400 ">
            Search
          </SheetDescription>
        </Link>

        <Link
          href={`/profile`}
          className="flex flex-row items-center gap-4 min-w-[100%] px-4 py-2 text-white hover:bg-teal-600 hover:text-white rounded-md transition-all"
        >
          <User size="20" className="text-white" />
          <SheetDescription className="text-lg font-medium title text-neutral-400 ">
            Profile
          </SheetDescription>
        </Link>

        <Link
          href={`/reviews/${user?.user?._id}/*${user?.user?.firstname}${user?.user?.lastname}`}
          className="flex flex-row items-center gap-4 min-w-[100%] px-4 py-2 text-white hover:bg-teal-600 hover:text-white rounded-md transition-all"
        >
          <BookCopy size="20" className="text-white" />
          <SheetDescription className="text-lg font-medium title text-neutral-400 ">
            Personal Reviews
          </SheetDescription>
        </Link>

        <Link
          href="/chats"
          className="flex flex-row items-center gap-4 min-w-[100%] px-4 py-2 text-white hover:bg-teal-600 hover:text-white rounded-md transition-all"
        >
          <MessageCircle size="20" className="text-white" />
          <SheetDescription className="text-lg font-medium title text-neutral-400 ">
            My Chats
          </SheetDescription>
        </Link>
        {user?.user?.isMusician && !user?.user?.isClient && (
          <Link
            href={`/search/allvideos/${user?.user?._id}/*${user?.user?.firstname}/${user?.user?.lastname}`}
            className="flex flex-row items-center gap-4 min-w-[100%] px-4 py-2 text-white hover:bg-teal-600 hover:text-white rounded-md transition-all"
          >
            <VideoIcon size="20" className="text-white" />
            <SheetDescription className="text-lg font-medium title text-neutral-400 ">
              My Videos
            </SheetDescription>
          </Link>
        )}
        <Link
          href={`/gigs/${userId}`}
          className="flex flex-row items-center gap-4 min-w-[100%] px-4 py-2 text-white hover:bg-teal-600 hover:text-white rounded-md transition-all"
        >
          <Music size="20" className="text-white" />
          <SheetDescription className="text-lg font-medium title text-neutral-400 ">
            Gigs
          </SheetDescription>
        </Link>
        <Link
          href="/settings"
          className="flex flex-row items-center gap-4 min-w-[100%] px-4 py-2 text-white hover:bg-teal-600 hover:text-white rounded-md transition-all"
        >
          <Settings size="20" className="text-white" />
          <SheetDescription className="text-lg font-medium title text-neutral-400 ">
            Settings
          </SheetDescription>
        </Link>
        <div className="p-1 w-[100px] bg-gradient-to-br from-purple-400 via-emerald-400 to-orange-500 capitalize rounded title text-gray-100">
          {subscription?.subscription?.tier} version
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default MobileSheet;
