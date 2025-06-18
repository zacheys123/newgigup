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
import { motion } from "framer-motion";

const DashboardNav = ({ userId }: { userId: string }) => {
  const pathname = usePathname();

  const links = [
    {
      href: `/dashboard/${userId}/bookings`,
      Icon: MdEmojiEvents,
      label: "My Bookings",
      matchPattern: `/dashboard/${userId}/bookings`,
      color: "text-blue-400",
    },
    {
      href: `/dashboard/${userId}/saved`,
      Icon: MdBookmark,
      label: "Saved Gigs",
      matchPattern: `/dashboard/${userId}/saved`,
      color: "text-purple-400",
    },
    {
      href: `/dashboard/${userId}/favorites`,
      Icon: MdFavorite,
      label: "Favorites",
      matchPattern: `/dashboard/${userId}/favorites`,
      color: "text-pink-400",
    },
    {
      href: `/dashboard/${userId}/history`,
      Icon: MdHistory,
      label: "History",
      matchPattern: `/dashboard/${userId}/history`,
      color: "text-emerald-400",
    },
  ];

  const isActive = (href: string, matchPattern?: string) => {
    if (matchPattern) return pathname.startsWith(matchPattern);
    return pathname === href;
  };

  return (
    <nav className="w-64 h-full bg-gradient-to-b from-gray-900 to-gray-800 border-r border-gray-700/50 flex flex-col font-sans">
      {/* Header */}
      <div className="p-6 border-b border-gray-700/50">
        <motion.div
          className="flex items-center space-x-3"
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.3 }}
        >
          <MdAccountCircle className="text-3xl text-amber-400/90" />
          <div>
            <h2 className="text-xl font-medium text-white tracking-tight">
              Dashboard
            </h2>
            <p className="text-xs text-gray-400/80 font-light">Welcome back</p>
          </div>
        </motion.div>
      </div>

      {/* Main Links */}
      <div className="flex-1 overflow-y-auto px-3 py-4 space-y-1">
        {links.map(({ href, Icon, label, matchPattern, color }) => (
          <motion.div
            key={href}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <Link
              href={href}
              className={`flex items-center p-3 rounded-xl transition-all duration-200 ${
                isActive(href, matchPattern)
                  ? `bg-gray-700/50 ${color} shadow-lg`
                  : "text-gray-300 hover:bg-gray-700/30 hover:text-white"
              }`}
            >
              <Icon
                className={`mr-3 transition-colors ${
                  isActive(href, matchPattern) ? "opacity-100" : "opacity-70"
                }`}
                size={22}
              />
              <span className="font-medium tracking-wide">{label}</span>
              {isActive(href, matchPattern) && (
                <motion.div
                  layoutId="nav-active-indicator"
                  className="ml-auto w-2 h-2 rounded-full bg-current"
                  transition={{ type: "spring", stiffness: 500, damping: 30 }}
                />
              )}
            </Link>
          </motion.div>
        ))}
      </div>

      {/* Footer Links */}
      <div className="p-4 border-t border-gray-700/50">
        <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
          <Link
            href={`/dashboard/${userId}/settings`}
            className={`flex items-center p-3 rounded-xl transition-all ${
              isActive(`/dashboard/${userId}/settings`)
                ? "bg-gray-700/50 text-amber-400 shadow-lg"
                : "text-gray-300 hover:bg-gray-700/30 hover:text-white"
            }`}
          >
            <MdSettings className="mr-3 opacity-80" size={22} />
            <span className="font-medium tracking-wide">Settings</span>
          </Link>
        </motion.div>
      </div>
    </nav>
  );
};

export default DashboardNav;
