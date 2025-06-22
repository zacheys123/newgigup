"use client";

import { UserButton, useAuth } from "@clerk/nextjs";
import Link from "next/link";
import Logo from "./Logo";
import { User, User2Icon } from "lucide-react";
import { Button } from "./ui/button";
import { useRouter } from "next/navigation";
import { useCurrentUser } from "@/hooks/useCurrentUser";
import { MdEmail } from "react-icons/md";
import { Settings } from "react-feather";
import { useCheckTrial } from "@/hooks/useCheckTrials";
import MobileSheet from "./pages/MobileSheet";

const Nav = () => {
  const { userId } = useAuth();
  const router = useRouter();
  const { user } = useCurrentUser();
  const { isFirstMonthEnd } = useCheckTrial(user?.user);
  const isAdmin = user?.user?.isAdmin;

  return (
    <nav className="sticky top-0 z-50 w-full bg-gradient-to-r from-[#0f0f0f]/80 to-[#1a1a1a]/80 backdrop-blur-md border-b border-white/10 shadow-md">
      <div className="flex flex-wrap items-center justify-between gap-4 px-4 sm:px-8 py-3 max-w-screen-2xl mx-auto overflow-x-auto">
        {/* Logo or MobileSheet */}
        <div className="flex items-center min-w-[100px] max-w-[150px] overflow-hidden">
          {isFirstMonthEnd ? <MobileSheet /> : <Logo />}
        </div>

        {/* Action Links */}
        <div className="flex items-center gap-3 flex-wrap justify-end overflow-x-auto text-sm font-medium tracking-wide">
          {userId ? (
            <>
              <Link
                href="/contact"
                className="flex items-center gap-2 px-3 py-1.5 text-white hover:text-teal-300 transition hover:scale-105"
              >
                <MdEmail size={18} />
                <span className="hidden sm:inline">Gigs</span>
              </Link>

              {!isFirstMonthEnd && !isAdmin && (
                <Link
                  href="/profile"
                  className="flex items-center gap-2 px-3 py-1.5 text-white hover:text-purple-300 transition hover:scale-105"
                >
                  <User size={18} />
                  <span className="hidden sm:inline">Profile</span>
                </Link>
              )}

              <Link
                href="/settings"
                className="flex items-center gap-2 px-3 py-1.5 text-white hover:text-blue-300 transition hover:scale-105"
              >
                <Settings size={18} />
                <span className="hidden sm:inline">FAQ</span>
              </Link>

              {isAdmin && (
                <Link
                  href="/admin/dashboard"
                  className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-rose-600/20 text-rose-100 hover:bg-rose-600/30 transition"
                >
                  <User2Icon size={16} />
                  <span className="hidden sm:inline">Admin</span>
                </Link>
              )}

              <div className="min-w-[36px]">
                <UserButton afterSignOutUrl="/" />
              </div>
            </>
          ) : (
            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                className="rounded-full px-4 py-1.5 border border-yellow-400 text-yellow-400 hover:bg-yellow-400/10 hover:text-white transition-all duration-150"
                onClick={() => router.push("/sign-up")}
              >
                Sign Up
              </Button>
              <Button
                variant="ghost"
                className="rounded-full px-4 py-1.5 border border-yellow-400 text-yellow-400 hover:bg-yellow-400/10 hover:text-white transition-all duration-150"
                onClick={() => router.push("/sign-in")}
              >
                Sign In
              </Button>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Nav;
