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
  Home,
  Menu,
  MessageCircle,
  Music,
  Search,
  Settings,
  User,
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
        <Menu className={`font-extrabold  text-neutral-400 `} />
      </SheetTrigger>

      <SheetContent
        side="left"
        className="w-[60%] flex flex-col gap-2 justify-evenly items-center"
      >
        <SheetTitle>Access More Info here</SheetTitle>
        {pathname === `/gigs/${userId}` ? (
          ""
        ) : (
          <Link
            href={`/gigs/${userId}`}
            className="flex flex-row  items-center gap-2 min-w-[30%] mx-auto whitespace-pre-line"
          >
            <Home size="20" />
            <SheetDescription>Home</SheetDescription>
          </Link>
        )}
        <Link
          href={`/gig/allreviews/${user?._id}`}
          className="flex flex-row  items-center gap-2 min-w-[30%] mx-auto whitespace-pre-line"
        >
          {" "}
          <MdDashboard size="20" />
          <SheetDescription>All Reviews</SheetDescription>
        </Link>
        <Link
          href={`/search`}
          className="flex flex-row  items-center gap-2 min-w-[30%] mx-auto whitespace-pre-line"
        >
          <Search size="20" /> <SheetDescription>Search</SheetDescription>
        </Link>{" "}
        <Link
          href={`/v1/profile/${userId}`}
          className="flex flex-row  items-center gap-2 min-w-[30%] mx-auto whitespace-pre-line"
        >
          <User size="20" /> <SheetDescription>Profile</SheetDescription>
        </Link>
        <Link
          href={`/gigme/gigs/${userId}`}
          className="flex flex-row  items-center gap-2 min-w-[30%] mx-auto whitespace-pre-line"
        >
          <Music size="20" /> <SheetDescription>My Reviews</SheetDescription>
        </Link>{" "}
        <Link
          href="/gigme/chat"
          className="flex flex-row  items-center gap-2 min-w-[30%] mx-auto whitespace-pre-line"
        >
          <MessageCircle size="20" /> <SheetDescription>Chat</SheetDescription>
        </Link>{" "}
        <Link
          href="/settings"
          className="flex flex-row  items-center gap-2 min-w-[30%] mx-auto whitespace-pre-line"
        >
          <Settings size="20" /> <SheetDescription>Settings</SheetDescription>
        </Link>{" "}
      </SheetContent>
    </Sheet>
  );
};

export default MobileSheet;
