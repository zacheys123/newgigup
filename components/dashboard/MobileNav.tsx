"use client";
import { useCurrentUser } from "@/hooks/useCurrentUser";
import { useAuth, UserButton } from "@clerk/nextjs";
import {
  CalendarIcon,
  CreditCardIcon,
  DollarSignIcon,
  HomeIcon,
  MusicIcon,
  PlusIcon,
  UsersIcon,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { MdDashboard } from "react-icons/md";
import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";

export function MobileNav() {
  const { userId } = useAuth();
  const { user } = useCurrentUser();
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const navRef = useRef<HTMLDivElement>(null);

  const musicianLinks = [
    {
      name: "Dashboard",
      href: "/dashboard",
      icon: <MdDashboard className="w-5 h-5" />,
      exact: true,
    },
    {
      name: "Gigs",
      href: `/gigs/${userId}`,
      icon: <MusicIcon className="w-5 h-5" />,
    },
    {
      name: "Bookings",
      href: "/dashboard/bookings",
      icon: <CalendarIcon className="w-5 h-5" />,
    },
    {
      name: "Earnings",
      href: "/dashboard/earnings",
      icon: <DollarSignIcon className="w-5 h-5" />,
    },
    {
      name: "Billing",
      href: "/dashboard/billing",
      icon: <CreditCardIcon className="w-5 h-5" />,
    },
  ];

  const clientLinks = [
    {
      name: "Dashboard",
      href: "/dashboard",
      icon: <MdDashboard className="w-5 h-5" />,
      exact: true,
    },
    {
      name: "Create ",
      href: "/gigs/create",
      icon: <PlusIcon className="w-5 h-5" />,
    },
    {
      name: "Gigs",
      href: "/dashboard/gigs",
      icon: <CalendarIcon className="w-5 h-5" />,
    },
    {
      name: "Talent",
      href: "/dashboard/artists",
      icon: <UsersIcon className="w-5 h-5" />,
    },
    {
      name: "Billing",
      href: "/dashboard/billing",
      icon: <CreditCardIcon className="w-5 h-5" />,
    },
  ];

  const baseLinks = [
    {
      name: "Home",
      href: "/",
      icon: <HomeIcon className="w-5 h-5" />,
      exact: true,
    },
  ];

  const roleLinks =
    user?.isMusician && user?.firstLogin === false
      ? musicianLinks
      : user?.isClient && user?.firstLogin === false
      ? clientLinks
      : [];

  // Filter out the current route's link
  const filteredLinks = roleLinks.filter((link) => {
    if (link.exact) {
      return pathname !== link.href;
    }
    return !pathname.startsWith(link.href);
  });

  const allLinks = [...baseLinks, ...filteredLinks];

  const isActive = (href: string, exact: boolean = false) => {
    if (exact) {
      return pathname === href;
    }
    return (
      pathname.startsWith(href) &&
      (pathname === href || pathname.startsWith(`${href}/`))
    );
  };

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (navRef.current && !navRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div className="fixed inset-x-0 bottom-0 z-50 md:hidden" ref={navRef}>
      {user && (
        <div className="relative h-16">
          {/* Navigation Links - Positioned above the trigger */}
          <AnimatePresence>
            {isOpen && (
              <motion.div
                initial={{
                  scale: 0,
                  rotate: -360,
                  opacity: 0,
                  y: 50,
                }}
                animate={{
                  scale: 1,
                  rotate: [0, 15, -25, 15, 5, 0],
                  opacity: 1,
                  y: [20, 10, 0, 10, 0],
                }}
                exit={{ opacity: 0 }}
                transition={{
                  duration: 0.4,
                }}
                className="absolute bottom-full left-0 right-0 mb-2 px-4"
              >
                <div className="bg-white rounded-xl shadow-lg p-2">
                  <div className="grid grid-cols-6 mx-2 last:-mr-5">
                    {allLinks.map((link, index) => {
                      const active = isActive(link.href, link.exact);
                      return (
                        <motion.div
                          key={link.name}
                          initial={{
                            scale: 0,
                            rotate: -180,
                            opacity: 0,
                            y: 50,
                          }}
                          animate={{
                            scale: 1,
                            rotate: [0, 15, -15, 5, -5, 0],
                            opacity: 1,
                            y: 0,
                          }}
                          exit={{
                            scale: 0,
                            rotate: 180,
                            opacity: 0,
                            y: 50,
                          }}
                          transition={{
                            type: "spring",
                            stiffness: 300,
                            damping: 20,
                            delay: index * 0.02,
                            rotate: {
                              duration: 1.9,
                              repeat: 0,
                            },
                          }}
                          whileHover={{
                            scale: 1.1,
                            rotate: [0, 10, -10, 0],
                            transition: { duration: 0.3 },
                          }}
                          whileTap={{ scale: 0.95 }}
                        >
                          <Link
                            href={link.href}
                            className={`
                            flex flex-col items-center w-full p-2 rounded-lg transition-all
                            ${
                              active
                                ? "text-primary"
                                : "text-blue-700 font-bold hover:text-primary"
                            }
                            group
                          `}
                            title={link.name}
                            onClick={() => setIsOpen(false)}
                          >
                            <div
                              className={`
                              p-2 rounded-full transition-all
                              ${
                                active
                                  ? "bg-primary/10 text-primary"
                                  : "group-hover:bg-accent/50 text-muted-foreground"
                              }
                            `}
                            >
                              {link.icon}
                            </div>
                            <span
                              className={`text-xs font-medium mt-1 transition-colors ${
                                active
                                  ? "text-primary"
                                  : "text-muted-foreground"
                              }`}
                            >
                              {link.name}
                            </span>
                          </Link>
                        </motion.div>
                      );
                    })}
                    <UserButton />
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Main Trigger Button - Centered with white background */}
          <div className="absolute left-1/2 bottom-0 transform -translate-x-1/2 z-50 flex justify-center w-full">
            <div className="relative">
              <button
                onClick={() => setIsOpen(!isOpen)}
                className="relative flex items-center justify-center w-14 h-14 rounded-full bg-primary text-white shadow-lg hover:bg-primary/90 transition-all z-10"
              >
                <motion.div
                  animate={{ rotate: isOpen ? 45 : 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <PlusIcon className="w-6 h-6" />
                </motion.div>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
