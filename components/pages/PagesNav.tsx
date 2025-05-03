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
import { usePendingGigs } from "@/app/Context/PendinContext";

const PagesNav = () => {
  const { userId } = useAuth();
  const pathname = usePathname();
  const { user } = useCurrentUser();
  const { gigs } = useAllGigs();
  const [isOpen, setIsOpen] = useState(false);
  const controls = useAnimation();
  const { pendingGigsCount } = usePendingGigs();
  const navRef = useRef<HTMLDivElement>(null);

  const linkStyles = (isActive: boolean) =>
    isActive
      ? "bg-gray-800 text-amber-300"
      : "text-gray-300 hover:bg-gray-800 hover:text-white";

  const linkAnimation = {
    initial: { scale: 1, opacity: 0.9 },
    hover: { scale: 1.02, opacity: 1 },
    tap: { scale: 0.98, opacity: 0.9 },
  };

  const links = [];

  if (user?.user?.isMusician) {
    links.push({
      href: `/gigs/${userId}`,
      Icon: FaHome,
      label: "Home",
      size: 20,
      extraStyle: "",
    });
    links.push({
      href: `/av_gigs/${userId}`,
      Icon: MdComment,
      label: "Gigs",
      size: 20,
      extraStyle: "",
    });
    links.push({
      href: `/bookedgigs/${userId}`,
      Icon: MdEmojiEvents,
      label: "Booked",
      size: 20,
      extraStyle: "",
    });
    links.push({
      href: `/pending/${userId}`,
      Icon: BsCart4,
      label: "Pending",
      size: 20,
      extraStyle: "",
    });
  }

  if (user?.user?.isClient) {
    links.push({
      href: `/gigs/${userId}`,
      Icon: FaHome,
      label: "Home",
      size: 20,
      extraStyle: "",
    });
    links.push({
      href: `/create/${userId}`,
      Icon: IoIosAddCircle,
      label: "Create",
      size: 22,
      extraStyle: "text-purple-400",
    });
    links.push({
      href: `/my_gig/${user?._id}`,
      Icon: MdOutlinePersonalInjury,
      label: "My Gigs",
      size: 20,
      extraStyle: "",
    });
  }

  // const pendingGigsCount =
  //   gigs?.filter((gig: GigProps) =>
  //     gig?.bookCount?.some((bookedUser) => bookedUser?.clerkId === userId)
  //   )?.length || 0;
  // console.log(pendingGigsCount);

  const handleDragEnd = (
    event: MouseEvent | TouchEvent | PointerEvent,
    info: PanInfo
  ) => {
    const threshold = 50;
    const velocityThreshold = 500;

    // Close if swiped left quickly or past threshold
    if (info.offset.x < -threshold || info.velocity.x < -velocityThreshold) {
      controls.start({ x: "100%" });
      setIsOpen(false);
    }
    // Open if swiped right quickly or past threshold
    else if (info.offset.x > threshold || info.velocity.x > velocityThreshold) {
      controls.start({ x: 0 });
      setIsOpen(true);
    }
    // Return to current state if not enough movement
    else {
      controls.start({ x: isOpen ? 0 : "100%" });
    }
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (navRef.current && !navRef.current.contains(event.target as Node)) {
        controls.start({
          x: "100%",
          transition: { type: "spring", stiffness: 300, damping: 30 },
        });
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
      document.body.style.overflow = "hidden";
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
      document.body.style.overflow = "auto";
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.body.style.overflow = "auto";
    };
  }, [isOpen, controls]);

  const toggleNav = () => {
    if (isOpen) {
      controls.start({
        x: "100%",
        transition: { type: "spring", stiffness: 300, damping: 30 },
      });
    } else {
      controls.start({
        x: 0,
        transition: { type: "spring", stiffness: 300, damping: 30 },
      });
    }
    setIsOpen(!isOpen);
  };

  return (
    <>
      {/* Modern Drag Handle */}
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

      {/* Modern Navigation Panel */}
      <motion.nav
        ref={navRef}
        className="fixed right-0 top-0 h-full w-72 bg-gray-900 border-l border-gray-700 z-40 md:hidden shadow-2xl"
        initial={{ x: "100%" }}
        animate={controls}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
      >
        <div className="h-full flex flex-col">
          {/* Header */}
          <div className="p-4 border-b border-gray-700 flex justify-between items-center bg-gray-800">
            <h2 className="text-xl font-bold text-white">Menu</h2>
            <button
              onClick={toggleNav}
              className="p-2 rounded-full hover:bg-gray-700 transition-colors"
            >
              <MdClose className="text-white text-lg" />
            </button>
          </div>

          {/* Navigation Links */}
          <div className="flex-1 overflow-y-auto p-4 space-y-2">
            {links.map(
              ({ href, Icon, label, size = 20, extraStyle }, index) => (
                <Link key={index} href={href} className="block">
                  <motion.div
                    variants={linkAnimation}
                    initial="initial"
                    whileHover="hover"
                    whileTap="tap"
                    className={`flex items-center p-3 relative rounded-lg transition-all ${linkStyles(
                      pathname === href
                    )} ${extraStyle || ""}`}
                    onClick={() => {
                      controls.start({ x: "100%" });
                      setIsOpen(false);
                    }}
                  >
                    <div className="relative">
                      <Icon size={size} className="mr-3" />
                      {gigs?.length > 0 && label === "Pending" && (
                        <span className="absolute -right-2 -top-2 bg-red-500 text-white text-xs font-bold h-5 w-5 rounded-full flex items-center justify-center">
                          {pendingGigsCount}
                        </span>
                      )}
                    </div>
                    <span className="text-base">{label}</span>
                  </motion.div>
                </Link>
              )
            )}
          </div>

          {/* Footer */}
          <div className="p-4 border-t border-gray-700 text-center text-gray-400 text-sm">
            {user?.user?.username || "User"}
          </div>
        </div>
      </motion.nav>

      {/* Modern Overlay */}
      {isOpen && (
        <motion.div
          className="fixed inset-0 bg-black bg-opacity-60 z-30 md:hidden backdrop-blur-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={toggleNav}
          transition={{ duration: 0.2 }}
        />
      )}
    </>
  );
};

export default PagesNav;
