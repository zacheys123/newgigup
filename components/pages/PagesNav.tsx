"use client";
import { IoIosAddCircle } from "react-icons/io";
import { usePathname } from "next/navigation";
import { useAuth } from "@clerk/nextjs";
import Link from "next/link";
import {
  MdOutlinePersonalInjury,
  MdEmojiEvents,
  MdComment,
} from "react-icons/md";
import { FaHome } from "react-icons/fa";
import { motion } from "framer-motion";
import { useCurrentUser } from "@/hooks/useCurrentUser";

const PagesNav = () => {
  const { userId } = useAuth();
  const pathname = usePathname();
  const { user } = useCurrentUser();

  const linkStyles = (isActive: boolean) =>
    isActive
      ? "text-amber-300 hover:text-yellow-500"
      : "text-gray-300 hover:text-yellow-400";

  const linkAnimation = {
    initial: { scale: 1, opacity: 0.8 },
    hover: { scale: 1.2, opacity: 1 },
    tap: { scale: 0.95, opacity: 0.9 },
  };

  const links = [];

  if (user?.user?.isMusician) {
    links.push({
      href: `/gigs/${userId}`,
      Icon: FaHome,
      label: "Home",
      size: 24,
      extraStyle: "",
    });
    links.push({
      href: `/av_gigs/${userId}`,
      Icon: MdComment,
      label: "Gigs",
      size: 24,
      extraStyle: "",
    });
    links.push({
      href: `/bookedgigs/${userId}`,
      Icon: MdEmojiEvents,
      label: "Booked",
      size: 24,
      extraStyle: "",
    });
  }

  if (user?.user?.isClient) {
    links.push({
      href: `/gigs/${userId}`,
      Icon: FaHome,
      label: "Home",
      size: 24,
      extraStyle: "",
    });
    links.push({
      href: `/create/${userId}`,
      Icon: IoIosAddCircle,
      label: "Create",
      size: 28,
      extraStyle: "text-purple-500",
    });
    links.push({
      href: `/my_gig/${userId}`,
      Icon: MdOutlinePersonalInjury,
      label: "My Gigs",
      size: 24,
      extraStyle: "",
    });
  }

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-gray-900 border-t border-gray-700 md:hidden">
      <div className="flex justify-around items-center h-16">
        {links.map(({ href, Icon, label, size = 24, extraStyle }, index) => (
          <Link key={index} href={href} className="flex flex-col items-center">
            <motion.div
              variants={linkAnimation}
              initial="initial"
              whileHover="hover"
              whileTap="tap"
              className={`flex flex-col items-center p-2 ${linkStyles(
                pathname === href
              )} ${extraStyle || ""}`}
            >
              <Icon size={size} />
              <span className="text-xs mt-1">{label}</span>
            </motion.div>
          </Link>
        ))}
      </div>
    </nav>
  );
};

export default PagesNav;
