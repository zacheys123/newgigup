"use client";
import { Toaster } from "sonner";
import Nav from "../../components/Nav";
import React, { useEffect } from "react";
import { useAuth } from "@clerk/nextjs";
import { useCurrentUser } from "@/hooks/useCurrentUser";
import { useRouter } from "next/navigation";

const MainLayout = ({
  contact,

  children,
}: Readonly<{
  children: React.ReactNode;
  contact: React.ReactNode; // Add Chat type here
}>) => {
  // Add your custom logic here
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
    <div className="h-screen overflow-x-hidden">
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 2000,
          className: "toast",
        }}
      />
      <Nav />
      {contact}
      {children}
    </div>
  );
};

export default MainLayout;
