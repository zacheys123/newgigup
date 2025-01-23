"use client";
import { usePathname } from "next/navigation";
import { useAuth } from "@clerk/nextjs";
import Link from "next/link";
import { FaHome } from "react-icons/fa";
import { User } from "lucide-react";

const UserNav = () => {
  const { userId } = useAuth();
  const pathname = usePathname();
  const inactivelink = "text-gray-300 ml-6 hover:text-yellow-400 text-[23px]";
  const activelink =
    "text-yellow-400 hover:text-yellow ml-6 transition duration-200";

  return (
    <div className="fixed bottom-0 w-full z-50 bg-zinc-900 border-t border-slate-600">
      <div className="flex justify-around items-center w-full h-[60px] px-5 mx-auto ">
        <Link href={`/profile`}>
          <FaHome
            className={pathname === `/profile` ? activelink : inactivelink}
            style={{ cursor: "pointer" }}
            size={pathname === `/profile` ? 26 : 25}
          />
        </Link>

        <Link href={`/profile/${userId}/user`}>
          <User
            className={
              pathname === `/profile/${userId}/user` ? activelink : inactivelink
            }
            size={pathname === `/profile/${userId}/user` ? 26 : 25}
            style={{ cursor: "pointer" }}
          />
        </Link>
      </div>
    </div>
  );
};

export default UserNav;
