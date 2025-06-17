"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  MdEmojiEvents,
  MdBookmark,
  MdFavorite,
  MdHistory,
  MdAccountCircle,
  MdSettings,
} from "react-icons/md";

const DashboardNav = ({ userId }: { userId: string }) => {
  const pathname = usePathname();

  const links = [
    {
      href: `/dashboard/${userId}/bookings`,
      Icon: MdEmojiEvents,
      label: "My Bookings",
      matchPattern: `/dashboard/${userId}/bookings`,
    },
    {
      href: `/dashboard/${userId}/saved`,
      Icon: MdBookmark,
      label: "Saved Gigs",
      matchPattern: `/dashboard/${userId}/saved`,
    },
    {
      href: `/dashboard/${userId}/favorites`,
      Icon: MdFavorite,
      label: "Favorites",
      matchPattern: `/dashboard/${userId}/favorites`,
    },
    {
      href: `/dashboard/${userId}/history`,
      Icon: MdHistory,
      label: "History",
      matchPattern: `/dashboard/${userId}/history`,
    },
  ];

  const isActive = (href: string, matchPattern?: string) => {
    if (matchPattern) {
      return pathname.startsWith(matchPattern);
    }
    return pathname === href;
  };

  return (
    <nav className="w-64 h-full bg-gray-800 border-r border-gray-700 flex flex-col">
      {/* Header */}
      <div className="p-4 border-b border-gray-700">
        <div className="flex items-center space-x-3">
          <MdAccountCircle className="text-2xl text-gray-300" />
          <h2 className="text-lg font-semibold text-white">Dashboard</h2>
        </div>
      </div>

      {/* Main Links */}
      <div className="flex-1 overflow-y-auto p-4 space-y-1">
        {links.map(({ href, Icon, label, matchPattern }) => (
          <Link
            key={href}
            href={href}
            className={`flex items-center p-3 rounded-lg transition-colors ${
              isActive(href, matchPattern)
                ? "bg-gray-700 text-amber-400"
                : "text-gray-300 hover:bg-gray-700 hover:text-white"
            }`}
          >
            <Icon className="mr-3" size={20} />
            <span>{label}</span>
          </Link>
        ))}
      </div>

      {/* Footer Links */}
      <div className="p-4 border-t border-gray-700">
        <Link
          href={`/dashboard/${userId}/settings`}
          className={`flex items-center p-3 rounded-lg transition-colors ${
            isActive(`/dashboard/${userId}/settings`)
              ? "bg-gray-700 text-amber-400"
              : "text-gray-300 hover:bg-gray-700 hover:text-white"
          }`}
        >
          <MdSettings className="mr-3" size={20} />
          <span>Settings</span>
        </Link>
      </div>
    </nav>
  );
};

export default DashboardNav;
