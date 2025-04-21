"use client";
import { IoIosAddCircle } from "react-icons/io";
import { usePathname } from "next/navigation";
import { useAuth } from "@clerk/nextjs";
import Link from "next/link";
import {
  MdOutlinePersonalInjury,
  MdEmojiEvents,
  MdComment,
  MdClose,
  MdMenu,
} from "react-icons/md";
import { FaHome } from "react-icons/fa";
import { motion, useAnimation, PanInfo } from "framer-motion";
import { useCurrentUser } from "@/hooks/useCurrentUser";
import { BsCart4 } from "react-icons/bs";
import { useAllGigs } from "@/hooks/useAllGigs";
import { useEffect, useRef, useState } from "react";

const PagesNav = () => {
  const { userId } = useAuth();
  const pathname = usePathname();
  const { user } = useCurrentUser();
  const { gigs } = useAllGigs();
  const [isOpen, setIsOpen] = useState(false);
  const controls = useAnimation();
  const navRef = useRef<HTMLDivElement>(null);

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
    links.push({
      href: `/pending/${userId}`,
      Icon: BsCart4,
      label: "Pending",
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
      href: `/my_gig/${user?._id}`,
      Icon: MdOutlinePersonalInjury,
      label: "My Gigs",
      size: 24,
      extraStyle: "",
    });
  }

  const pendingGigsCount =
    gigs?.filter((gig) =>
      gig?.bookCount?.some((bookedUser) => bookedUser?._id === user?._id)
    )?.length || 0;

  // Handle drag end
  const handleDragEnd = (
    event: MouseEvent | TouchEvent | PointerEvent,
    info: PanInfo
  ) => {
    const threshold = 50;
    if (info.offset.x < -threshold) {
      // Swiped left (close)
      controls.start({ x: "100%" });
      setIsOpen(false);
    } else if (info.offset.x > threshold) {
      // Swiped right (open)
      controls.start({ x: 0 });
      setIsOpen(true);
    } else {
      // Return to original position
      controls.start({ x: isOpen ? 0 : "100%" });
    }
  };

  // Handle click outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (navRef.current && !navRef.current.contains(event.target as Node)) {
        controls.start({ x: "100%" });
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen, controls]);

  // Toggle nav visibility
  const toggleNav = () => {
    if (isOpen) {
      controls.start({ x: "100%", y: "50%" });
    } else {
      controls.start({ x: 0, y: 0 });
    }
    setIsOpen(!isOpen);
  };

  return (
    <>
      {/* Handle for dragging */}
      <motion.div
        className="fixed right-0 top-1/2 -translate-y-1/2 z-50 bg-gray-800 p-3 rounded-l-lg cursor-grab active:cursor-grabbing md:hidden shadow-lg border-l border-y border-gray-700"
        drag="x"
        dragConstraints={{ left: 0, right: 0 }}
        dragElastic={0.1}
        onDragEnd={handleDragEnd}
        onClick={toggleNav}
        whileHover={{ backgroundColor: "rgba(31, 41, 55, 0.9)" }}
        whileTap={{
          scale: 0.95,
          backgroundColor: "rgba(17, 24, 39, 0.9)",
        }}
        animate={{
          backgroundColor: isOpen
            ? "rgba(17, 24, 39, 1)"
            : "rgba(131, 41, 55, 1)",
        }}
      >
        <motion.div
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{ type: "spring", stiffness: 500, damping: 30 }}
        >
          {isOpen ? (
            <MdClose className="text-white text-xl" />
          ) : (
            <MdMenu className="text-white text-xl" />
          )}
        </motion.div>
      </motion.div>

      {/* Navigation panel */}
      <motion.nav
        ref={navRef}
        className="fixed right-0 top-0 h-full w-64 bg-gray-900 border-l border-gray-700 z-40 md:hidden"
        initial={{ x: "100%" }}
        animate={controls}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
      >
        <div className="flex flex-col justify-start items-center h-full pt-20 space-y-8">
          {links.map(({ href, Icon, label, size = 24, extraStyle }, index) => (
            <Link key={index} href={href} className="w-full px-6">
              <motion.div
                variants={linkAnimation}
                initial="initial"
                whileHover="hover"
                whileTap="tap"
                className={`flex items-center p-4 relative rounded-lg ${linkStyles(
                  pathname === href
                )} ${extraStyle || ""}`}
                onClick={() => {
                  controls.start({ x: "100%" });
                  setIsOpen(false);
                }}
              >
                {label === "Pending" && pendingGigsCount > 0 && (
                  <span className="absolute -right-2 -top-2 bg-red-500 text-white text-xs font-bold h-5 w-5 rounded-full flex items-center justify-center">
                    {pendingGigsCount}
                  </span>
                )}
                <Icon size={size} className="mr-4" />
                <span className="text-lg">{label}</span>
              </motion.div>
            </Link>
          ))}
        </div>
      </motion.nav>

      {/* Overlay when nav is open */}
      {isOpen && (
        <motion.div
          className="fixed inset-0 bg-black bg-opacity-50 z-30 md:hidden"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={() => {
            controls.start({ x: "100%" });
            setIsOpen(false);
          }}
        />
      )}
    </>
  );
};

export default PagesNav;
