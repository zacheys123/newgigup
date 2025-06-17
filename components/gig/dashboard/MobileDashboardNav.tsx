"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  MdEmojiEvents,
  MdBookmark,
  MdFavorite,
  MdHistory,
  MdHome,
} from "react-icons/md";

const MobileDashboardNav = ({ userId }: { userId: string }) => {
  const pathname = usePathname();

  const links = [
    {
      href: `/v1/gigs/dashboard/${userId}/bookings`,
      Icon: MdEmojiEvents,
      label: "Bookings",
      activeColor: "text-blue-400", // Custom active color
    },
    {
      href: `/v1/gigs/dashboard/${userId}/saved`,
      Icon: MdBookmark,
      label: "Saved",
      activeColor: "text-purple-400", // Custom active color
    },
    {
      href: `/v1/gigs/dashboard/${userId}/favorites`,
      Icon: MdFavorite,
      label: "Favorites",
      activeColor: "text-red-400", // Custom active color
    },
    {
      href: `/v1/gigs/dashboard/${userId}/history`,
      Icon: MdHistory,
      label: "History",
      activeColor: "text-green-400", // Custom active color
    },
  ];

  const isActive = (href: string) => {
    return pathname.startsWith(href);
  };

  return (
    <nav className="bg-gray-900 border-t border-gray-700 shadow-lg fixed bottom-0 left-0 right-0 z-50">
      <div className="flex justify-around items-center p-2">
        <Link
          href="/"
          className={`flex flex-col items-center p-2 rounded-lg transition-colors ${
            pathname === "/"
              ? "text-amber-400" // Home active color
              : "text-gray-400 hover:text-white"
          }`}
        >
          <MdHome size={24} />
          <span className="text-xs mt-1">Home</span>
        </Link>

        {links.map(({ href, Icon, label, activeColor }) => (
          <Link
            key={href}
            href={href}
            className={`flex flex-col items-center p-2 rounded-lg transition-colors ${
              isActive(href)
                ? `${activeColor} font-medium` // Apply custom active color
                : "text-gray-400 hover:text-white"
            }`}
          >
            <Icon size={24} />
            <span className="text-xs mt-1">{label}</span>
            {isActive(href) && (
              <span className="absolute -top-1 left-1/2 transform -translate-x-1/2 w-2 h-2 bg-current rounded-full"></span>
            )}
          </Link>
        ))}
      </div>
    </nav>
  );
};

export default MobileDashboardNav;
