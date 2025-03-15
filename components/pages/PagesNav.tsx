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
  const { user } = useCurrentUser(userId || "");
  const linkStyles = (isActive: boolean) =>
    isActive
      ? "text-amber-300 hover:text-yellow-500"
      : "text-gray-300 hover:text-yellow-400";

  const linkAnimation = {
    initial: { scale: 1, opacity: 0.8 },
    hover: { scale: 1.2, opacity: 1 },
    tap: { scale: 1, opacity: 0.9 },
  };

  const links = [];

  if (user?.isMusician) {
    links.push({
      href: `/gigs/${userId}`,
      Icon: FaHome,
      size: 29,
      extraStyle: "",
    });
    links.push({
      href: `/av_gigs/${userId}`,
      Icon: MdComment,
      size: 24,
      extraStyle: "",
    });
    links.push({
      href: `/bookedgigs/${userId}`,
      Icon: MdEmojiEvents,
      size: 33,
      extraStyle: "",
    });
  }

  if (user?.isClient) {
    links.push({
      href: `/gigs/${userId}`,
      Icon: FaHome,
      size: 29,
      extraStyle: "",
    });
    links.push({
      href: `/create/${userId}`,
      Icon: IoIosAddCircle,
      size: 36,
      extraStyle: "text-purple-500 ",
    });
    links.push({
      href: `/my_gig/${userId}`,
      Icon: MdOutlinePersonalInjury,
      size: 24,
      extraStyle: "",
    });
  }
  // if (!user?.isClient && !user?.isMusician) {
  //   links.push({
  //     href: `/create/${userId}`,
  //     Icon: IoIosAddCircle,
  //     size: 33,
  //     extraStyle: "text-purple-500",
  //   });
  //   links.push({
  //     href: `/my_gig/${userId}`,
  //     Icon: MdOutlinePersonalInjury,
  //     size: 24,
  //     extraStyle: "",
  //   });
  //   links.push({
  //     href: `/av_gigs/${userId}`,
  //     Icon: MdComment,
  //     size: 24,
  //     extraStyle: "",
  //   });
  //   links.push({
  //     href: `/bookedgigs/${userId}`,
  //     Icon: MdEmojiEvents,
  //     size: 33,
  //     extraStyle: "",
  //   });
  // }

  return (
    <div className="fixed bottom-0 w-full z-50 bg-gradient-to-t from-zinc-900 via-blue-900 to-yellow-750 shadow-xl shadow-teal-600 py-2">
      <div
        className={
          user?.isClient
            ? "flex justify-center items-center w-full h-[60px] px-1 mx-auto gap-[90px]"
            : user?.isMusician
            ? "flex justify-center items-center w-full h-[60px] px-1 mx-auto gap-[90px]"
            : !user?.isClient && !user?.isMusician
            ? "flex justify-center items-center w-full h-[60px] px-1 mx-auto gap-[90px]"
            : ""
        }
      >
        {links.map(({ href, Icon, size = 24, extraStyle }, index) => (
          <Link key={index} href={href}>
            <motion.div
              variants={linkAnimation}
              initial="initial"
              whileHover="hover"
              whileTap="tap"
              className={`ml-4 cursor-pointer duration-200 ${linkStyles(
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
