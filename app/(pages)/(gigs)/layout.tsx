"use client";
import PagesNav from "@/components/pages/PagesNav";
import { useCurrentUser } from "@/hooks/useCurrentUser";
import { useAuth } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { Toaster } from "sonner";

type GigLayoutProps = {
  children: React.ReactNode;
  editpage: React.ReactNode;
};

export default function GigLayout({ children, editpage }: GigLayoutProps) {
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
    <div className="bg-black h-screen w-full flex flex-col">
      <Toaster position="top-center" toastOptions={{ duration: 3000 }} />
      {editpage}
      <div className="flex-1 overflow-auto">{children}</div>
      <PagesNav />
    </div>
  );
}
