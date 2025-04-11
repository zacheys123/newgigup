"use client";
import { UserButton, useAuth } from "@clerk/nextjs";
import Link from "next/link";
import Logo from "./Logo";
import { User, MessageCircleQuestion } from "lucide-react";
import { Button } from "./ui/button";
import { useRouter } from "next/navigation";
import { useCurrentUser } from "@/hooks/useCurrentUser";
import { MdEmail } from "react-icons/md";

const Nav = () => {
  const { userId } = useAuth();
  const router = useRouter();
  const { user } = useCurrentUser();

  return (
    <nav className="sticky top-0 w-full bg-neutral-900 text-white shadow-md py-4 px-6 flex items-center justify-between  shadow-slate-700 ">
      {/* Logo on the left side */}
      <div className="flex items-center">
        <Logo />
      </div>
      {/* Navigation items aligned to the right */}
      <div className="flex items-center gap-3 ml-auto">
        {userId ? (
          <div className="flex items-center gap-6">
            <Link
              href={`/contact`}
              className="flex items-center gap-2 p-3 rounded-full transition-all hover:bg-neutral-700 hover:scale-105"
            >
              <MdEmail size="21" />
              <span className="hidden md:inline">Gigs</span>
            </Link>
            {user?.user?.firstname && (
              <>
                <Link
                  href={"/profile"}
                  className="flex items-center gap-2 p-3 rounded-full transition-all hover:bg-neutral-700 hover:scale-105"
                >
                  <User size="21" />
                  <span className="hidden md:inline">Profile</span>
                </Link>

                <Link
                  href="/about"
                  className="flex items-center gap-2 p-3 rounded-full transition-all hover:bg-neutral-700 hover:scale-105"
                >
                  <MessageCircleQuestion size="21" />
                  <span className="hidden md:inline">FAQ</span>
                </Link>
              </>
            )}
            <UserButton afterSignOutUrl="/" />
          </div>
        ) : (
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              className="px-4 py-2 rounded-full text-white border border-yellow-500 hover:bg-slate-700"
              onClick={() => router.push("/sign-up")}
            >
              SignUp
            </Button>
            <Button
              variant="ghost"
              className="px-4 py-2 rounded-full text-white border border-yellow-500 hover:bg-slate-700"
              onClick={() => router.push("/sign-in")}
            >
              SignIn
            </Button>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Nav;
