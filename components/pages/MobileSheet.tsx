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
import { useAllUsers } from "@/hooks/useAllUsers";
const MobileSheet = () => {
  const { userId } = useAuth();
  const pathname = usePathname();
  const { user } = useCurrentUser(userId || null);
  const { users } = useAllUsers();
  console.log(users);
  return (
    <Sheet>
      <SheetTrigger>
        <Menu className="text-white hover:text-teal-300 font-bold text-2xl transition-colors duration-200" />
      </SheetTrigger>

      <SheetContent
        side="left"
        className="w-[75%] sm:w-[60%] bg-zink-700  bg-opacity-25 p-6 flex flex-col gap-6 justify-start items-start rounded-br-[180px] shadow-3xl backdrop-blur-lg"
      >
        <SheetTitle className="text-2xl font-semibold text-white mb-6">
          Access More Info
        </SheetTitle>

        {pathname === `/gigs/${userId}` ? (
          ""
        ) : (
          <Link
            href={`/gigs/${userId}`}
            className="flex flex-row items-center gap-4 min-w-[100%] px-4 py-2 text-white hover:bg-teal-600 hover:text-white rounded-md transition-all"
          >
            <Home size="20" className="text-white" />
            <SheetDescription className="text-lg font-medium title ">
              Home
            </SheetDescription>
          </Link>
        )}

        <Link
          href={`/allreviews/${user?._id}/*${user?.firstname}${user?.lastname}`}
          className="flex flex-row items-center gap-4 min-w-[100%] px-4 py-2 text-white hover:bg-teal-600 hover:text-white rounded-md transition-all"
        >
          <MdDashboard size="20" className="text-white" />
          <SheetDescription className="text-lg font-medium title ">
            Reviews
          </SheetDescription>
        </Link>

        <Link
          href={`/search`}
          className="flex flex-row items-center gap-4 min-w-[100%] px-4 py-2 text-white hover:bg-teal-600 hover:text-white rounded-md transition-all"
        >
          <Search size="20" className="text-white" />
          <SheetDescription className="text-lg font-medium title ">
            Search
          </SheetDescription>
        </Link>

        <Link
          href={
            user?.isClient
              ? `/profile`
              : user?.isMusician
              ? `/client/profile/${userId}`
              : ""
          }
          className="flex flex-row items-center gap-4 min-w-[100%] px-4 py-2 text-white hover:bg-teal-600 hover:text-white rounded-md transition-all"
        >
          <User size="20" className="text-white" />
          <SheetDescription className="text-lg font-medium title ">
            Profile
          </SheetDescription>
        </Link>

        <Link
          href={`/reviews/${user?._id}/*${user?.firstname}${user?.lastname}`}
          className="flex flex-row items-center gap-4 min-w-[100%] px-4 py-2 text-white hover:bg-teal-600 hover:text-white rounded-md transition-all"
        >
          <BookCopy size="20" className="text-white" />
          <SheetDescription className="text-lg font-medium title ">
            Personal Reviews
          </SheetDescription>
        </Link>

        <Link
          href="gigs/chats"
          className="flex flex-row items-center gap-4 min-w-[100%] px-4 py-2 text-white hover:bg-teal-600 hover:text-white rounded-md transition-all"
        >
          <MessageCircle size="20" className="text-white" />
          <SheetDescription className="text-lg font-medium title ">
            My Chats
          </SheetDescription>
        </Link>

        <Link
          href={`/search/allvideos/${user?._id}/*${user?.firstname}${user?.lastname}`}
          className="flex flex-row items-center gap-4 min-w-[100%] px-4 py-2 text-white hover:bg-teal-600 hover:text-white rounded-md transition-all"
        >
          <VideoIcon size="20" className="text-white" />
          <SheetDescription className="text-lg font-medium title ">
            My Videos
          </SheetDescription>
        </Link>
        <Link
          href={`/gigs/${userId}`}
          className="flex flex-row items-center gap-4 min-w-[100%] px-4 py-2 text-white hover:bg-teal-600 hover:text-white rounded-md transition-all"
        >
          <Music size="20" className="text-white" />
          <SheetDescription className="text-lg font-medium title ">
            Gigs
          </SheetDescription>
        </Link>
        <Link
          href="/settings"
          className="flex flex-row items-center gap-4 min-w-[100%] px-4 py-2 text-white hover:bg-teal-600 hover:text-white rounded-md transition-all"
        >
          <Settings size="20" className="text-white" />
          <SheetDescription className="text-lg font-medium title ">
            Settings
          </SheetDescription>
        </Link>
      </SheetContent>
    </Sheet>
  );
};

export default MobileSheet;
