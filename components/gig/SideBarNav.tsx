"use client";
import { IoIosAddCircle } from "react-icons/io";
import { usePathname } from "next/navigation";
import { useAuth } from "@clerk/nextjs";
import Link from "next/link";
import {
  MdOutlinePersonalInjury,
  MdEmojiEvents,
  MdComment,
  MdAccountCircle,
  MdLogout,
  MdSettings,
} from "react-icons/md";
import { FaHome } from "react-icons/fa";
import { motion } from "framer-motion";
import { useCurrentUser } from "@/hooks/useCurrentUser";
import Image from "next/image";

const SidebarNav = () => {
  const { userId } = useAuth();
  const pathname = usePathname();
  const { user } = useCurrentUser();

  const signOut = async () => {
    // get all cookies and remove
    const cookies = document.cookie.split(";").map((c) => c.trim().split("="));
    cookies.forEach((c) => {
      document.cookie = `${c[0]}=;expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/`;
    });
    // remove clerk session
    localStorage.removeItem("user");
  };
  const linkStyles = (isActive: boolean) =>
    `p-3 rounded-lg transition-all flex items-center space-x-3 ${
      isActive
        ? "text-amber-300 bg-gray-800 font-medium"
        : "text-gray-300 hover:text-white hover:bg-gray-800"
    }`;

  const links = [];

  if (user?.user?.isMusician) {
    links.push({
      href: `/av_gigs/${userId}`,
      Icon: FaHome,
      label: "Home",
    });
    links.push({
      href: `/av_gigs/${userId}`,
      Icon: MdComment,
      label: "Available Gigs",
    });
    links.push({
      href: `/bookedgigs/${userId}`,
      Icon: MdEmojiEvents,
      label: "Booked Gigs",
    });
  }

  if (user?.user?.isClient) {
    links.push({
      href: `/create/${userId}`,
      Icon: FaHome,
      label: "Home",
    });
    links.push({
      href: `/create/${userId}`,
      Icon: IoIosAddCircle,
      label: "Create Gig",
      extraStyle: "text-purple-500 hover:text-purple-400",
    });
    links.push({
      href: `/my_gig/${userId}`,
      Icon: MdOutlinePersonalInjury,
      label: "My Gigs",
    });
  }

  // Add profile links
  const profileLinks = [
    {
      href: `/profile`,
      Icon: MdAccountCircle,
      label: "Profile",
    },
    {
      href: `/settings`,
      Icon: MdSettings,
      label: "Settings",
    },
    {
      action: () => signOut(),
      Icon: MdLogout,
      label: "Sign Out",
    },
  ];

  return (
    <aside className="hidden md:flex flex-col w-[180px] lg:w-[220px] h-screen fixed left-0 top-0 bg-gray-900 border-r border-gray-700 p-4 overflow-y-auto">
      {/* Navigation Links */}
      <div className="space-y-2 mt-4">
        {links.map(({ href, Icon, label, extraStyle }, index) => (
          <Link key={`nav-${index}`} href={href} className={extraStyle}>
            <motion.div
              whileHover={{ x: 5 }}
              whileTap={{ scale: 0.95 }}
              className={linkStyles(pathname === href)}
            >
              <Icon className="flex-shrink-0" size={20} />
              <span className="whitespace-nowrap text-sm lg:text-base">
                {label}
              </span>
            </motion.div>
          </Link>
        ))}
      </div>

      {/* Profile Section */}
      <div className="mt-auto pt-4 border-t border-gray-700">
        {/* User Profile Card */}
        <div className="flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-800 transition-colors mb-4">
          {user?.user?.picture ? (
            <Image
              src={user?.user.picture}
              alt="Profile"
              width={40}
              height={40}
              className="rounded-full"
            />
          ) : (
            <div className="w-10 h-10 rounded-full bg-gray-700 flex items-center justify-center">
              <MdAccountCircle size={24} className="text-gray-400" />
            </div>
          )}
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-white truncate">
              {user?.user?.firstname} {user?.user?.lastname}
            </p>
            <p className="text-xs text-gray-400 truncate">
              {user?.user?.isMusician ? "Musician" : "Client"}
            </p>
          </div>
        </div>

        {/* Profile Links */}
        <div className="space-y-1">
          {profileLinks.map((item, index) =>
            item.href ? (
              <Link key={`profile-${index}`} href={item.href}>
                <motion.div
                  whileHover={{ x: 3 }}
                  whileTap={{ scale: 0.98 }}
                  className="flex items-center p-2 rounded-lg text-gray-300 hover:text-white hover:bg-gray-800 transition-colors"
                >
                  <item.Icon className="flex-shrink-0 mr-3" size={18} />
                  <span className="text-sm">{item.label}</span>
                </motion.div>
              </Link>
            ) : (
              <motion.button
                key={`profile-${index}`}
                onClick={item.action}
                whileHover={{ x: 3 }}
                whileTap={{ scale: 0.98 }}
                className="w-full flex items-center p-2 rounded-lg text-gray-300 hover:text-white hover:bg-gray-800 transition-colors"
              >
                <item.Icon className="flex-shrink-0 mr-3" size={18} />
                <span className="text-sm">{item.label}</span>
              </motion.button>
            )
          )}
        </div>
      </div>
    </aside>
  );
};

export default SidebarNav;
