"use client";
import MobileSheet from "@/components/pages/MobileSheet";
import UserNav from "@/components/user/UsersNav";
import { useCurrentUser } from "@/hooks/useCurrentUser";
import { useAuth, UserButton } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { Toaster } from "sonner";

export default function ProfileLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const { userId } = useAuth();
  const { user } = useCurrentUser(userId || null);
  const router = useRouter();

  useEffect(() => {
    if (user) {
      console.log("User:", user); // Debugging

      // Ensure that the user object has the necessary properties
      if (user.isMusician !== undefined && user.isClient !== undefined) {
        if (user.isMusician === true && user.isClient === false) {
          router.push(`/gigs/${userId}`);
        } else if (user.isClient === true && user.isMusician === false) {
          router.push(`/create/${userId}`);
        }
      }
    }
  }, [user, userId, router]);
  return (
    <div className="bg-black h-full w-full overflow-scroll">
      <div className="flex items-center justify-between mt-4 mx-6  ">
        <MobileSheet />
        <UserButton />
      </div>
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 3000,
        }}
      />
      {children} <UserNav />
    </div>
  );
}
