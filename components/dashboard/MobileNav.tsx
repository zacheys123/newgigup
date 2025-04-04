"use client";
import { useCurrentUser } from "@/hooks/useCurrentUser";
import { useAuth, UserButton } from "@clerk/nextjs";
import {
  CalendarIcon,
  CreditCardIcon,
  DollarSignIcon,
  MusicIcon,
  PlusIcon,
  UsersIcon,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { MdDashboard } from "react-icons/md";

export function MobileNav() {
  const { userId } = useAuth();
  const { user } = useCurrentUser(userId || null);
  const pathname = usePathname();

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

  const links = user?.isMusician
    ? musicianLinks
    : user?.isClient
    ? clientLinks
    : [];

  // Improved active link detection
  const isActive = (href: string, exact: boolean = false) => {
    if (exact) {
      return pathname === href;
    }
    return (
      pathname.startsWith(href) &&
      (pathname === href || pathname.startsWith(`${href}/`))
    );
  };

  return (
    <div className="fixed inset-x-0 bottom-0 z-50 md:hidden">
      <nav className="flex items-center justify-around bg-background/95 backdrop-blur-lg border-t border-border px-1 py-2">
        {links.map((link) => {
          const active = isActive(link.href, link.exact);
          return (
            <Link
              key={link.name}
              href={link.href}
              className={`
                flex flex-col items-center w-full mx-1 rounded-lg transition-all
                ${
                  active
                    ? "text-primary"
                    : "text-blue-700 font-bold hover:text-primary"
                }
                group
              `}
              title={link.name}
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
                  active ? "text-primary" : "text-muted-foreground"
                }`}
              >
                {link.name}
              </span>
            </Link>
          );
        })}
        <UserButton />
      </nav>
    </div>
  );
}
