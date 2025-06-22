"use client";
import {
  Home,
  Users,
  Calendar,
  BarChart,
  Settings,
  MessageSquare,
  FileText,
  HelpCircle,
  LogOut,
  User as UserIcon,
  Ban,
} from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { AdminNavbarProps } from "@/types/admininterfaces";
import { cn } from "@/lib/utils";
import { usePathname, useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "../ui/button";
import { useTheme } from "@/hooks/useTheme";
import { ThemeToggle } from "./theme/ThemeToggler";
import { MdDangerous } from "react-icons/md";

interface NavbarProps {
  user: AdminNavbarProps;
}

const AdminNavbar = ({ user }: NavbarProps) => {
  const pathname = usePathname();
  const router = useRouter();

  const { theme, resolvedTheme, isMounted, toggleTheme, useSystemTheme } =
    useTheme();

  if (!isMounted) {
    return (
      <header className="sticky top-0 z-40 border-b bg-white dark:bg-gray-900">
        {/* Loading skeleton */}
        <div className="container flex h-16 items-center justify-between">
          <div className="h-8 w-24 rounded bg-gray-200 dark:bg-gray-700" />
          <div className="h-8 w-8 rounded-full bg-gray-200 dark:bg-gray-700" />
        </div>
      </header>
    );
  }

  // Navigation items based on admin role
  const navItems = [
    {
      href: "/admin/dashboard",
      icon: Home,
      label: "Dashboard",
      allowedRoles: ["super", "content", "support", "analytics"],
    },
    {
      href: "/admin/users",
      icon: Users,
      label: "Users",
      allowedRoles: ["super", "support"],
    },
    {
      href: "/admin/gigs",
      icon: Calendar,
      label: "Gigs",
      allowedRoles: ["super", "support"],
    },
    {
      href: "/admin/messages",
      icon: MessageSquare,
      label: "Messages",
      allowedRoles: ["super", "support"],
    },
    {
      href: "/admin/analytics",
      icon: BarChart,
      label: "Analytics",
      allowedRoles: ["super", "analytics"],
    },
    {
      href: "/admin/mpesa-transactions",
      icon: FileText,
      label: "M-Pesa Transactions",
      allowedRoles: ["super", "support"],
      isMpesa: true,
    },
    {
      href: "/admin/content",
      icon: FileText,
      label: "Content",
      allowedRoles: ["super", "content"],
    },
    {
      href: "/admin/settings",
      icon: Settings,
      label: "Settings",
      allowedRoles: ["super"],
    },
    {
      href: "/admin/banned-users",
      icon: Ban,
      label: "Banned Users",
      allowedRoles: ["super"],
    },
    {
      href: "/admin/reports",
      icon: MdDangerous,
      label: "Reported Users",
      allowedRoles: ["super", "support"],
    },
  ];

  // Filter nav items based on user role
  const filteredNavItems = navItems.filter((item) =>
    item.allowedRoles.includes(user?.adminRole || "")
  );

  return (
    <header
      className={cn(
        "sticky top-0 z-40 border-b transition-colors duration-300",
        resolvedTheme === "dark"
          ? "bg-gray-900 border-gray-800"
          : "bg-white border-gray-200"
      )}
    >
      <div className="container flex h-16 items-center justify-between">
        {/* Logo and Main Nav */}
        <div className="flex items-center gap-8">
          <Link href="/admin/dashboard" className="flex items-center gap-2">
            <span
              className={cn(
                "text-lg font-semibold mx-3",
                resolvedTheme === "dark" ? "text-white" : "text-gray-900"
              )}
            >
              GigAdmin
            </span>
          </Link>

          <nav className="hidden md:flex items-center gap-1">
            {filteredNavItems.map((item) => {
              const isActive = pathname.startsWith(item.href);
              const isMpesa = item.isMpesa;

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "flex items-center gap-2 px-3 py-2 text-sm font-medium rounded-md transition-colors",
                    isMpesa
                      ? "bg-[#1C8F45] text-white hover:bg-[#157A38]"
                      : isActive
                      ? resolvedTheme === "dark"
                        ? "bg-gray-800 text-white shadow-sm ring-1 ring-gray-700"
                        : "bg-accent text-accent-foreground shadow-sm ring-1 ring-accent"
                      : resolvedTheme === "dark"
                      ? "text-gray-300 hover:text-white hover:bg-gray-800"
                      : "text-gray-600 hover:text-gray-900 hover:bg-gray-100"
                  )}
                >
                  <item.icon className="h-[18px] w-[18px]" />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Right Side Controls */}
        <div className="flex items-center gap-4">
          {/* Dark Mode Toggle */}
          <ThemeToggle
            theme={theme}
            resolvedTheme={resolvedTheme}
            toggleTheme={toggleTheme}
            useSystemTheme={useSystemTheme}
          />

          {/* Help Button */}
          <Button
            variant={resolvedTheme === "dark" ? "ghost" : "outline"}
            size="icon"
            className="rounded-full"
          >
            <HelpCircle className="h-4 w-4" />
            <span className="sr-only">Help</span>
          </Button>

          {/* User Dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                className="relative h-8 w-8 rounded-full mx-3"
              >
                <Avatar className="h-8 w-8">
                  <AvatarImage
                    src={user?.picture}
                    alt={user?.firstname as string}
                  />
                  <AvatarFallback>
                    {user?.firstname?.charAt(0)}
                    {user?.lastname?.charAt(0)}
                  </AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              className={cn(
                "w-56",
                resolvedTheme === "dark"
                  ? "bg-gray-800 border-gray-700"
                  : "bg-white border-gray-200"
              )}
              align="end"
              forceMount
            >
              <DropdownMenuLabel className="font-normal">
                <div className="flex flex-col space-y-1">
                  <p
                    className={cn(
                      "text-sm font-medium leading-none",
                      resolvedTheme === "dark" ? "text-white" : "text-gray-900"
                    )}
                  >
                    {user?.firstname} {user?.lastname}
                  </p>
                  <p
                    className={cn(
                      "text-xs leading-none",
                      resolvedTheme === "dark"
                        ? "text-gray-400"
                        : "text-gray-500"
                    )}
                  >
                    {user?.email}
                  </p>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator
                className={
                  resolvedTheme === "dark" ? "bg-gray-700" : "bg-gray-200"
                }
              />
              <DropdownMenuItem
                className={cn(
                  "cursor-pointer",
                  resolvedTheme === "dark"
                    ? "hover:bg-gray-700 focus:bg-gray-700"
                    : "hover:bg-gray-100 focus:bg-gray-100"
                )}
                asChild
              >
                <Link href="/admin/settings/profile">
                  <UserIcon className="mr-2 h-4 w-4" />
                  <span
                    className={
                      resolvedTheme === "dark" ? "text-white" : "text-gray-900"
                    }
                  >
                    Profile
                  </span>
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem
                className={cn(
                  "cursor-pointer",
                  resolvedTheme === "dark"
                    ? "hover:bg-gray-700 focus:bg-gray-700"
                    : "hover:bg-gray-100 focus:bg-gray-100"
                )}
                asChild
              >
                <Link href="/admin/settings/account">
                  <Settings className="mr-2 h-4 w-4" />
                  <span
                    className={
                      resolvedTheme === "dark" ? "text-white" : "text-gray-900"
                    }
                  >
                    Settings
                  </span>
                </Link>
              </DropdownMenuItem>
              <DropdownMenuSeparator
                className={
                  resolvedTheme === "dark" ? "bg-gray-700" : "bg-gray-200"
                }
              />
              <DropdownMenuItem
                className={cn(
                  "text-red-600 focus:text-red-600 cursor-pointer",
                  resolvedTheme === "dark"
                    ? "hover:bg-gray-700"
                    : "hover:bg-gray-100"
                )}
                onClick={() => router.push("/sign-out")}
              >
                <LogOut className="mr-2 h-4 w-4" />
                Sign out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {/* Mobile Nav */}
      <div
        className={cn(
          "md:hidden border-t",
          resolvedTheme === "dark" ? "border-gray-800" : "border-gray-200"
        )}
      >
        <nav className="container flex overflow-x-auto py-2 space-x-2">
          {filteredNavItems.map((item) => {
            const isActive = pathname.startsWith(item.href);
            const isMpesa = item.isMpesa;

            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex whitespace-nowrap flex-col items-center justify-center px-4 py-2 rounded-md transition-all duration-200",
                  isMpesa
                    ? "bg-[#1C8F45] text-white hover:bg-[#157A38]"
                    : isActive
                    ? resolvedTheme === "dark"
                      ? "bg-gray-800 text-white shadow ring-1 ring-gray-700"
                      : "bg-accent text-accent-foreground shadow ring-1 ring-accent"
                    : resolvedTheme === "dark"
                    ? "text-gray-300 hover:text-white hover:bg-gray-800"
                    : "text-gray-600 hover:text-gray-900 hover:bg-gray-100"
                )}
              >
                <item.icon className="h-5 w-5 mb-1" />
                <span className="text-[11px] font-medium">{item.label}</span>
              </Link>
            );
          })}
        </nav>
      </div>
    </header>
  );
};

export default AdminNavbar;
