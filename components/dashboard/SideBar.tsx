"use client";

import { useCurrentUser } from "@/hooks/useCurrentUser";
import { useAuth } from "@clerk/nextjs";
import {
  CalendarIcon,
  DollarSignIcon,
  MusicIcon,
  PlusIcon,
  UsersIcon,
} from "lucide-react";
import Link from "next/link";

// components/Sidebar.tsx
export function Sidebar({ isPro }: { isPro: boolean }) {
  const { userId } = useAuth();
  const { user } = useCurrentUser(userId || null);
  const musicianLinks = [
    { name: "Gig Feed", href: "/gigs", icon: <MusicIcon /> },
    { name: "My Bookings", href: "/bookings", icon: <CalendarIcon /> },
    { name: "Earnings", href: "/earnings", icon: <DollarSignIcon /> },
  ];

  const clientLinks = [
    { name: "Post Gig", href: "/create", icon: <PlusIcon /> },
    { name: "My Events", href: "/events", icon: <CalendarIcon /> },
    { name: "Artists", href: "/artists", icon: <UsersIcon /> },
  ];

  return (
    <div className="w-64 bg-gray-900 p-4 border-r border-gray-800">
      <div className="mb-8">
        <h2 className="text-xl font-bold text-orange-500">GigUp</h2>
        <div className="flex items-center gap-2 mt-1">
          <span
            className={`px-2 py-1 text-xs rounded-full ${
              isPro
                ? "bg-purple-900/30 text-purple-400"
                : "bg-gray-700 text-gray-400"
            }`}
          >
            {isPro ? "PRO" : "FREE"}
          </span>
          <span className="text-xs text-gray-400">
            {user?.IsMusician ? "Artist" : "Client"}
          </span>
        </div>
      </div>

      <nav className="space-y-1">
        {(user?.IsMusician ? musicianLinks : clientLinks).map((link) => (
          <Link
            key={link.name}
            href={link.href}
            className="flex items-center gap-3 p-2 rounded-lg text-gray-300 hover:bg-gray-800"
          >
            {link.icon}
            {link.name}
          </Link>
        ))}
      </nav>
    </div>
  );
}
