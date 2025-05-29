"use client";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";

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
import { Button } from "@/components/ui/button";
import { AdminNavbarProps } from "@/types/admininterfaces";

interface NavbarProps {
  user: AdminNavbarProps;
}
const AdminNavbar = ({ user }: NavbarProps) => {
  const pathname = usePathname();
  const router = useRouter();
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
  ];
  console.log("admin data now", user.adminRole);
  // Filter nav items based on user role
  const filteredNavItems = navItems.filter((item) =>
    item.allowedRoles.includes(user?.adminRole || "")
  );

  return (
    <header className="sticky top-0 z-40 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between">
        {/* Logo and Main Nav */}
        <div className="flex items-center gap-8">
          <Link href="/admin/dashboard" className="flex items-center gap-2">
            <span className="text-lg font-semibold mx-3">GigAdmin</span>
          </Link>

          <nav className="hidden md:flex items-center gap-1">
            {filteredNavItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-2 px-3 py-2 text-sm font-medium rounded-md transition-colors ${
                  pathname.startsWith(item.href)
                    ? "bg-accent text-accent-foreground"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                <item.icon className="h-4 w-4" />
                <span>{item.label}</span>
              </Link>
            ))}
          </nav>
        </div>

        {/* User Dropdown */}
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" className="rounded-full">
            <HelpCircle className="h-4 w-4" />
            <span className="sr-only">Help</span>
          </Button>

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
            <DropdownMenuContent className="w-56" align="end" forceMount>
              <DropdownMenuLabel className="font-normal">
                <div className="flex flex-col space-y-1">
                  <p className="text-sm font-medium leading-none">
                    {user?.firstname}
                    {user?.lastname}
                  </p>
                  <p className="text-xs leading-none text-muted-foreground">
                    {user?.email}
                  </p>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem asChild>
                <Link href="/admin/settings/profile">
                  <UserIcon className="mr-2 h-4 w-4" />
                  Profile
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link href="/admin/settings/account">
                  <Settings className="mr-2 h-4 w-4" />
                  Settings
                </Link>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                className="text-red-600 focus:text-red-600"
                onClick={() => router.push("/sign-out")}
              >
                <LogOut className="mr-2 h-4 w-4" />
                Sign out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {/* Mobile Nav (for smaller screens) */}
      <div className="md:hidden border-t">
        <nav className="container flex overflow-x-auto py-2">
          {filteredNavItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`flex flex-col items-center px-4 py-2 text-xs rounded-md transition-colors ${
                pathname.startsWith(item.href)
                  ? "bg-accent text-accent-foreground"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <item.icon className="h-4 w-4" />
              <span className="mt-1">{item.label}</span>
            </Link>
          ))}
        </nav>
      </div>
    </header>
  );
};

export default AdminNavbar;
