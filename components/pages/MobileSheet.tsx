"use client";
import React from "react";
import {
  Sheet,
  SheetContent,
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
import { MdDashboard } from "react-icons/md";
import { useAuth } from "@clerk/nextjs";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { useCurrentUser } from "@/hooks/useCurrentUser";
import { useSubscription } from "@/hooks/useSubscription";
import { UserProps } from "@/types/userinterfaces";
import { useCheckTrial } from "@/hooks/useCheckTrials";
import { Video } from "react-feather";

const navLinks = (userId: string | undefined, user: UserProps) => [
  { label: "Home", href: "/", icon: <Home size={20} /> },
  { label: "Dashboard", href: "/dashboard", icon: <MdDashboard size={20} /> },
  {
    label: "Reviews",
    href: `/allreviews/${user?._id}/*${user?.firstname}${user?.lastname}`,
    icon: <BookA size={20} />,
  },
  { label: "Search", href: "/search", icon: <Search size={20} /> },
  { label: "Profile", href: "/profile", icon: <User size={20} /> },
  {
    label: "Personal Reviews",
    href: `/reviews/${user?._id}/*${user?.firstname}${user?.lastname}`,
    icon: <BookCopy size={20} />,
  },
  { label: "My Chats", href: "/chats", icon: <MessageCircle size={20} /> },
  ...(user?.isMusician && !user?.isClient
    ? [
        {
          label: "My Videos",
          href: `/search/allvideos/${user?._id}/*${user?.firstname}/${user?.lastname}`,
          icon: <VideoIcon size={20} />,
        },
      ]
    : []),
  {
    label: "Gigs",
    href: `/gigs/${userId}`,
    icon: <Music size={20} />,
  },
  { label: "Settings", href: "/settings", icon: <Settings size={20} /> },
];

const MobileSheet = () => {
  const { userId } = useAuth();
  const pathname = usePathname();
  const { user } = useCurrentUser();
  const { subscription } = useSubscription(userId as string);
  const { isFirstMonthEnd } = useCheckTrial(user?.user);
  const tier = localStorage.getItem("tier");
  return (
    <Sheet>
      <SheetTrigger>
        <Menu className="text-white text-3xl hover:text-teal-300 transition-colors duration-200" />
      </SheetTrigger>

      <SheetContent
        side="left"
        className="w-[80%] sm:w-[60%] md:w-[40%] h-full bg-black/60 backdrop-blur-2xl border-r border-white/10 px-6 py-6 flex flex-col gap-4 z-[999] rounded-br-[120px] shadow-2xl"
      >
        {!isFirstMonthEnd ? (
          <>
            <SheetTitle className="text-2xl font-bold text-white mb-4">
              Access More Info
            </SheetTitle>

            {navLinks(userId as string, user?.user)
              .filter((link) => pathname !== link.href)
              .map((link, index) => (
                <Link
                  key={index}
                  href={link.href}
                  className="flex items-center gap-4 w-full px-4 py-3 rounded-lg text-white bg-white/5 hover:bg-teal-600 transition-all duration-200"
                >
                  <span className="text-white">{link.icon}</span>
                  <span className="md:text-lg font-medium text-neutral-300 title">
                    {link.label}
                  </span>
                </Link>
              ))}

            <div className="mt-6 p-2 w-fit text-sm bg-gradient-to-br from-purple-400 via-emerald-400 to-orange-500 rounded-md text-white font-semibold shadow-md">
              {tier} Version
            </div>
          </>
        ) : (
          <>
            <SheetTitle className="text-2xl font-bold text-white mb-4">
              Try Gigup Now!!!!
            </SheetTitle>
            <div className="flex h-[80%] my-auto flex-col justify-between">
              <Link
                href={"/experience/v1/trial"}
                className="flex items-center gap-4 w-full px-4 py-3 rounded-lg text-white bg-white/5 hover:bg-teal-600 transition-all duration-200"
              >
                <span className="text-white">
                  <Video />
                </span>
                <div className="bg-gradient-to-r from-gray-900 via-indigo-900 to-green-800 p-3 rounded-lg shadow-lg">
                  <span className="md:text-lg font-semibold bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 via-purple-400 to-yellow-300 drop-shadow-md">
                    Experience GiGup
                  </span>
                </div>
              </Link>

              {/* New informational text */}
              <p className="text-sm text-gray-300 mt-4 mb-2 px-2 leading-relaxed">
                Unlock the full potential of GiGup with premium features such
                as:
              </p>
              <ul className="list-disc list-inside text-gray-400 text-sm mb-4 px-4 space-y-1">
                <li>Unlimited gigs & chats</li>
                <li>Advanced analytics & insights</li>
                <li>Priority support</li>
                <li>Exclusive video tools</li>
              </ul>

              {/* Trial days remaining or encourage upgrade */}
              {subscription?.subscription?.tier === "free" && (
                <div className="p-2 w-fit text-sm bg-gradient-to-br from-purple-400 via-emerald-400 to-orange-500 rounded-md text-white font-semibold shadow-md">
                  <span>Upgrade to Pro</span> Version
                </div>
              )}

              {/* Optional: add a clear CTA button */}
              <Link
                href="/dashboard/billing"
                className="mt-4 inline-block w-full text-center px-6 py-3 text-sm font-semibold rounded-lg bg-gradient-to-r from-purple-600 via-pink-500 to-yellow-400 hover:brightness-110 transition duration-200"
              >
                Upgrade Now
              </Link>
            </div>
          </>
        )}
      </SheetContent>
    </Sheet>
  );
};

export default MobileSheet;
