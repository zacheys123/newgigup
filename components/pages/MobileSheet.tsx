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
import { useTheme } from "@/hooks/useTheme";
import { ThemeToggle } from "../admin/theme/ThemeToggler";
import { cn } from "@/lib/utils";

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
  const { theme, resolvedTheme, isMounted, toggleTheme, useSystemTheme } =
    useTheme();

  if (!isMounted) {
    return (
      <header className="sticky top-0 z-40 border-b bg-white dark:bg-gray-900">
        {/* Loading skeleton */}
        <div className="container flex h-16 items-center justify-between">
          <div className="h-8 w-24 rounded bg-gray-200 dark:bg-gray-700" />
          <div className="h-8 w-8 rounded-full bg-gray-200 dark:bg-gray-700" />
        </div>
      </header>
    );
  }

  return (
    <Sheet>
      <SheetTrigger>
        <Menu
          className={cn(
            "text-3xl hover:text-teal-300 transition-colors duration-200",
            resolvedTheme === "dark"
              ? "text-white"
              : resolvedTheme === "light"
              ? "text-gray-900"
              : "text-gray-200"
          )}
        />
      </SheetTrigger>
      <SheetContent
        side="left"
        className={cn(
          "w-[80%] sm:w-[60%] md:w-[40%] h-full backdrop-blur-2xl border-r px-6 py-6 flex flex-col gap-4 z-[999] rounded-br-[120px] shadow-2xl",
          resolvedTheme === "dark"
            ? "bg-gray-900/80 border-gray-800"
            : "bg-white/80 border-gray-200"
        )}
      >
        {!isFirstMonthEnd ? (
          <>
            <SheetTitle
              className={cn(
                "text-2xl font-bold mb-4",
                resolvedTheme === "dark" ? "text-white" : "text-gray-900"
              )}
            >
              Access More Info
            </SheetTitle>
            {navLinks(userId as string, user?.user)
              .filter((link) => pathname !== link.href)
              .map((link, index) => (
                <Link
                  key={index}
                  href={link.href}
                  className={cn(
                    "flex items-center gap-4 w-full px-4 py-3 rounded-lg transition-all duration-200",
                    resolvedTheme === "dark"
                      ? "text-white bg-gray-800 hover:bg-teal-600"
                      : "text-gray-900 bg-gray-100 hover:bg-teal-500 hover:text-white"
                  )}
                >
                  <span
                    className={
                      resolvedTheme === "dark" ? "text-white" : "text-gray-900"
                    }
                  >
                    {link.icon}
                  </span>
                  <span
                    className={cn(
                      "md:text-lg font-medium title",
                      resolvedTheme === "dark"
                        ? "text-neutral-300"
                        : "text-gray-700"
                    )}
                  >
                    {link.label}
                  </span>
                </Link>
              ))}
            <div
              className={cn(
                "mt-6 p-2 w-fit text-sm rounded-md font-semibold shadow-md",
                resolvedTheme === "dark"
                  ? "bg-gradient-to-br from-purple-400 via-emerald-400 to-orange-500 text-white"
                  : "bg-gradient-to-br from-purple-600 via-emerald-600 to-orange-600 text-white"
              )}
            >
              {tier} Version
            </div>{" "}
            <ThemeToggle
              theme={theme}
              resolvedTheme={resolvedTheme}
              toggleTheme={toggleTheme}
              useSystemTheme={useSystemTheme}
            />
          </>
        ) : (
          <>
            <SheetTitle
              className={cn(
                "text-2xl font-bold mb-4",
                resolvedTheme === "dark" ? "text-white" : "text-gray-900"
              )}
            >
              Try Gigup Now!!!!
            </SheetTitle>
            <div className="flex h-[80%] my-auto flex-col justify-between">
              <Link
                href={"/experience/v1/trial"}
                className={cn(
                  "flex items-center gap-4 w-full px-4 py-3 rounded-lg transition-all duration-200",
                  resolvedTheme === "dark"
                    ? "text-white bg-gray-800 hover:bg-teal-600"
                    : "text-gray-900 bg-gray-100 hover:bg-teal-500 hover:text-white"
                )}
              >
                <span
                  className={
                    resolvedTheme === "dark" ? "text-white" : "text-gray-900"
                  }
                >
                  <Video />
                </span>
                <div
                  className={cn(
                    "p-3 rounded-lg shadow-lg",
                    resolvedTheme === "dark"
                      ? "bg-gradient-to-r from-gray-900 via-indigo-900 to-green-800"
                      : "bg-gradient-to-r from-gray-200 via-indigo-200 to-green-200"
                  )}
                >
                  <span
                    className={cn(
                      "md:text-lg font-semibold bg-clip-text drop-shadow-md",
                      resolvedTheme === "dark"
                        ? "bg-gradient-to-r from-cyan-400 via-purple-400 to-yellow-300 text-transparent"
                        : "bg-gradient-to-r from-cyan-600 via-purple-600 to-yellow-500 text-transparent"
                    )}
                  >
                    Experience GiGup
                  </span>
                </div>
              </Link>

              {/* New informational text */}
              <p
                className={cn(
                  "text-sm mt-4 mb-2 px-2 leading-relaxed",
                  resolvedTheme === "dark" ? "text-gray-300" : "text-gray-600"
                )}
              >
                Unlock the full potential of GiGup with premium features such
                as:
              </p>
              <ul
                className={cn(
                  "list-disc list-inside text-sm mb-4 px-4 space-y-1",
                  resolvedTheme === "dark" ? "text-gray-400" : "text-gray-500"
                )}
              >
                <li>Unlimited gigs & chats</li>
                <li>Advanced analytics & insights</li>
                <li>Priority support</li>
                <li>Exclusive video tools</li>
              </ul>

              {/* Trial days remaining or encourage upgrade */}
              {subscription?.subscription?.tier === "free" && (
                <div
                  className={cn(
                    "p-2 w-fit text-sm rounded-md font-semibold shadow-md",
                    resolvedTheme === "dark"
                      ? "bg-gradient-to-br from-purple-400 via-emerald-400 to-orange-500 text-white"
                      : "bg-gradient-to-br from-purple-600 via-emerald-600 to-orange-600 text-white"
                  )}
                >
                  <span>Upgrade to Pro</span> Version
                </div>
              )}

              {/* Optional: add a clear CTA button */}
              <Link
                href="/dashboard/billing"
                className={cn(
                  "mt-4 inline-block w-full text-center px-6 py-3 text-sm font-semibold rounded-lg hover:brightness-110 transition duration-200",
                  resolvedTheme === "dark"
                    ? "bg-gradient-to-r from-purple-600 via-pink-500 to-yellow-400"
                    : "bg-gradient-to-r from-purple-700 via-pink-600 to-yellow-500 text-white"
                )}
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
