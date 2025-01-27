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

const PagesNav = () => {
  const { userId } = useAuth();
  const pathname = usePathname();

  const linkStyles = (isActive: boolean) =>
    isActive
      ? "text-amber-300 hover:text-yellow-500"
      : "text-gray-300 hover:text-yellow-400";

  const linkAnimation = {
    initial: { scale: 1, opacity: 0.8 },
    hover: { scale: 1.2, opacity: 1 },
    tap: { scale: 1, opacity: 0.9 },
  };

  return (
    <div className="fixed bottom-0 w-full z-50 bg-gradient-to-t from-zinc-900 via-blue-900 to-yellow-750  shadow-xl shadow-teal-600 py-2">
      <div className="grid grid-cols-5 items-center w-full h-[60px] px-1 mx-auto">
        {[
          { href: `/gigs/${userId}`, Icon: FaHome },
          { href: `/av_gigs/${userId}`, Icon: MdComment },
          {
            href: `/create/${userId}`,
            Icon: IoIosAddCircle,
            size: 43,
            extraStyle: "text-purple-500",
          },
          { href: `/my_gig/${userId}`, Icon: MdOutlinePersonalInjury },
          { href: `/bookedgigs/${userId}`, Icon: MdEmojiEvents },
        ].map(({ href, Icon, size = 26, extraStyle }, index) => (
          <Link key={index} href={href}>
            <motion.div
              variants={linkAnimation}
              initial="initial"
              whileHover="hover"
              whileTap="tap"
              className={` ml-4 cursor-pointer duration-200 ${linkStyles(
                pathname === href
              )} ${extraStyle || ""}`}
            >
              <Icon size={size} />
            </motion.div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default PagesNav;
