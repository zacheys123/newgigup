"use client";

import useStore from "@/app/zustand/useStore";
import { useCurrentUser } from "@/hooks/useCurrentUser";
import { useAuth } from "@clerk/nextjs";
import {
  CalendarIcon,
  CreditCardIcon,
  DollarSignIcon,
  MusicIcon,
  PlusIcon,
  UsersIcon,
} from "lucide-react";
import Link from "next/link";

export function Sidebar() {
  const { userId } = useAuth();
  const { user } = useCurrentUser(userId || null);
  const { subscriptiondata: data } = useStore();

  const musicianLinks = [
    {
      name: "Gig Feed",
      href: "/dashboard/gigs",
      icon: <MusicIcon className="w-5 h-5" />,
    },
    {
      name: "My Bookings",
      href: "/dashboard/bookings",
      icon: <CalendarIcon className="w-5 h-5" />,
    },
    {
      name: "Earnings",
      href: "/dashboard/earnings",
      icon: <DollarSignIcon className="w-5 h-5" />,
    },
    {
      name: "Billing",
      href: "/dashboard/billing",
      icon: <CreditCardIcon className="w-5 h-5" />,
    }, // Add this line
  ];

  const clientLinks = [
    {
      name: "Post Gig",
      href: "/dashboard/create",
      icon: <PlusIcon className="w-5 h-5" />,
    },
    {
      name: "My Events",
      href: "/dashboard/events",
      icon: <CalendarIcon className="w-5 h-5" />,
    },
    {
      name: "Artists",
      href: "/dashboard/artists",
      icon: <UsersIcon className="w-5 h-5" />,
    },
    {
      name: "Billing",
      href: "/dashboard/billing",
      icon: <CreditCardIcon className="w-5 h-5" />,
    }, // Add this line
  ];

  return (
    <div className="w-full md:w-56 lg:w-64 bg-gray-900 p-4 border-r border-gray-800 h-full">
      <div className="mb-8">
        <h2 className="text-xl font-bold text-orange-500">GigUp</h2>
        <div className="flex items-center gap-2 mt-1">
          <span
            className={`px-2 py-1 text-xs rounded-full ${
              data?.subscription?.isPro
                ? "bg-purple-900/30 text-purple-400"
                : "bg-gray-700 text-gray-400"
            }`}
          >
            {data?.subscription?.isPro ? "PRO" : "FREE"}
          </span>
          <span className="text-xs text-gray-400">
            {user?.IsMusician ? "Artist" : "Client"}
          </span>
        </div>
      </div>

      <nav className="space-y-2">
        {(user?.IsMusician ? musicianLinks : clientLinks).map((link) => (
          <Link
            key={link.name}
            href={link.href}
            className="flex items-center gap-3 p-2 md:p-3 rounded-lg text-gray-300 hover:bg-gray-800 transition-colors"
          >
            <span className="flex-shrink-0">{link.icon}</span>
            <span className="hidden md:inline">{link.name}</span>
          </Link>
        ))}
      </nav>
    </div>
  );
}
