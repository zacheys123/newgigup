"use client";
import NotificationHandler from "@/components/NotificationHandler";
// import { useState } from "react";
import MobileSheet from "@/components/pages/MobileSheet";
import PagesNav from "@/components/pages/PagesNav";
import { useCurrentUser } from "@/hooks/useCurrentUser";
import { UserButton, useUser } from "@clerk/nextjs";
import { User } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useMemo } from "react";
import { Toaster } from "sonner";
// import { Box } from "@mui/material";
// import { HiMenuAlt3 } from "react-icons/hi";
export default function GigLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // const [isVisible, setIsVisible] = useState(false);

  // const toggleVisibility = (vis: boolean) => {
  //   setIsVisible(vis);
  // };

  const { user } = useUser();
  const { user: myuser } = useCurrentUser();
  const transformedUser = useMemo(() => {
    if (!user) return null;
    return {
      firstName: user.firstName ?? undefined,
      lastName: user.lastName ?? undefined,
      imageUrl: user.imageUrl ?? undefined,
      username: user.username ?? undefined,
      emailAddresses: user.emailAddresses,
      phoneNumbers: user.phoneNumbers,
    };
  }, [user]);
  useEffect(() => {
    if (!user || !myuser) return;

    // Transform the user data as needed
    if (
      myuser?.user?.isMusician === true ||
      (myuser?.user?.isClient === true &&
        myuser?.user?.city &&
        myuser?.user?.talentbio)
    ) {
      // Send to your backend API
      fetch("/api/user/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ transformedUser }),
      })
        .then((response) => {
          if (!response.ok) {
            console.error("Failed to register user");
          }
          return response.json();
        })
        .catch((error) => {
          console.error("Error registering user:", error);
        });
    }
  }, [user]); // This effect runs when the user object changes
  const router = useRouter();
  return (
    <div className="inset-0 backdrop-blur-xl  bg-black  h-screen w-full overflow-hidden">
      {/* Subtle Fixed Action Button */}
      {/* <button
        onClick={(ev) => {
          ev.stopPropagation();
          toggleVisibility(!isVisible);
        }}
        className="fixed bottom-[120px] right-6 bg-gray-800/50 text-white p-3 rounded-full shadow-sm hover:bg-gray-800/70 transition-all duration-200 z-50 animate-pulse bg-gradient-to-r from-red-400 to-blue-600 z-100"
      >
        <HiMenuAlt3
          size={18} // Replace with your desired icon size
          color="white" // Replace with your desired icon color
        />
      </button>

      Slide Down Container */}
      {/* <Box
        className={`fixed top-0 left-0 right-0 z-40 transition-transform duration-500 ease-in-out ${
          isVisible ? "translate-y-0" : "-translate-y-full"
        }`} */}
      <div className="flex items-center justify-between mt-4 mx-6 bg-inherit">
        {" "}
        {user ? (
          <>
            <MobileSheet />

            <UserButton />
          </>
        ) : (
          <div className="w-full justify-center">
            <div
              className="rounded-full w-7 h-7  bg-neutral-400 p-1 flex justify-center items-center"
              onClick={() => router.push("/")}
            >
              <User />
            </div>
          </div>
        )}
      </div>
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 3000,
        }}
      />
      {/* Dimmed Background */}
      {/* <div
        className={`transition-opacity duration-500 bg-neutral-700 ${
          isVisible ? "opacity-20" : "opacity-100"
        }`}
        onClick={(ev) => {
          ev.stopPropagation();
          toggleVisibility(false);
        }}
      > */}
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 3000,
        }}
      />{" "}
      <NotificationHandler />
      {children}
      <PagesNav />
    </div>
    // </div>
  );
}
