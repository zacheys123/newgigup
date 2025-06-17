// components/dashboard/DashboardNav.tsx
"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  MdEmojiEvents,
  MdBookmark,
  MdFavorite,
  MdHistory,
} from "react-icons/md";

const DashboardNav = ({ userId }: { userId: string }) => {
  const pathname = usePathname();

  const links = [
    {
      href: `/dashboard/${userId}/bookings`,
      Icon: MdEmojiEvents,
      label: "My Bookings",
    },
    {
      href: `/dashboard/${userId}/saved`,
      Icon: MdBookmark,
      label: "Saved Gigs",
    },
    {
      href: `/dashboard/${userId}/favorites`,
      Icon: MdFavorite,
      label: "Favorites",
    },
    {
      href: `/dashboard/${userId}/history`,
      Icon: MdHistory,
      label: "Booking History",
    },
  ];

  return (
    <nav className="w-64 bg-gray-800 border-r border-gray-700 p-4">
      <div className="space-y-2">
        {links.map(({ href, Icon, label }) => (
          <Link
            key={href}
            href={href}
            className={`flex items-center p-3 rounded-lg transition-colors ${
              pathname === href
                ? "bg-gray-700 text-amber-400"
                : "text-gray-300 hover:bg-gray-700 hover:text-white"
            }`}
          >
            <Icon className="mr-3" size={20} />
            <span>{label}</span>
          </Link>
        ))}
      </div>
    </nav>
  );
};

export default DashboardNav;
