"use client";
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

export function MobileNav() {
  const { userId } = useAuth();
  const { user } = useCurrentUser(userId || null);

  const musicianLinks = [
    {
      name: "Gigs",
      href: "/dashboard/gigs",
      icon: <MusicIcon className="w-5 h-5" />,
    },
    {
      name: "Bookings",
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
    }, // Add this
  ];

  const clientLinks = [
    {
      name: "Post",
      href: "/dashboard/create",
      icon: <PlusIcon className="w-5 h-5" />,
    },
    {
      name: "Events",
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
    }, // Add this
  ];

  return (
    <div className="fixed bottom-4 left-0 right-0 px-4 z-10 md:hidden">
      <nav className="flex justify-around">
        {(user?.isMusician ? musicianLinks : clientLinks).map((link) => (
          <Link
            key={link.name}
            href={link.href}
            className="flex flex-col items-center p-2 rounded-lg text-gray-300 hover:bg-gray-800 transition-colors"
            title={link.name}
          >
            {link.icon}
            <span className="text-xs mt-1">{link.name}</span>
          </Link>
        ))}
      </nav>
    </div>
  );
}
