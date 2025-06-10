"use client";
import NotificationHandler from "@/components/NotificationHandler";
// import { useState } from "react";
import MobileSheet from "@/components/pages/MobileSheet";
import PagesNav from "@/components/pages/PagesNav";
import { useCurrentUser } from "@/hooks/useCurrentUser";
import { useAuth, UserButton, useUser } from "@clerk/nextjs";
import { motion } from "framer-motion";
import { Check, User, X } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useMemo } from "react";
import { Toaster } from "sonner";
import { mutate } from "swr";
import useStore from "../zustand/useStore";
import { useCheckTrial } from "@/hooks/useCheckTrials";
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
  useCheckTrial(myuser?.user);
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
  const { userId } = useAuth();
  const { showConfirmation, setShowConfirmation, lastBookedGigId } = useStore();
  const router = useRouter();
  return (
    <>
      <div className="inset-0 backdrop-blur-xl  bg-black  h-screen w-full overflow-hidden">
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
        <Toaster
          position="top-right"
          toastOptions={{
            duration: 3000,
          }}
        />{" "}
        <NotificationHandler />
        {children}
        {showConfirmation && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Backdrop with glass effect - covers entire screen */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/70 backdrop-blur-sm"
              onClick={() => setShowConfirmation(false)}
            />

            {/* Main modal container - responsive sizing */}
            <motion.div
              initial={{ opacity: 0, y: 20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 20, scale: 0.95 }}
              transition={{
                type: "spring",
                damping: 20,
                stiffness: 300,
              }}
              className="relative z-[9999] w-full max-w-md mx-4"
            >
              {/* Glass card with responsive padding */}
              <div className="bg-gray-900/95 backdrop-blur-lg rounded-2xl border border-gray-700 shadow-2xl overflow-hidden">
                {/* Decorative gradient border */}
                <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/20 to-emerald-500/20 rounded-2xl pointer-events-none" />

                <div className="p-4 sm:p-6">
                  {/* Header with responsive text */}
                  <div className="flex items-center justify-between mb-4 sm:mb-6">
                    <h3 className="text-xl sm:text-2xl font-bold text-yellow-400 font-[Inter] tracking-tight">
                      Booking Confirmed
                    </h3>
                    <button
                      onClick={() => {
                        mutate("/api/gigs/getgigs");
                        setShowConfirmation(false);
                      }}
                      className="p-1 text-gray-400 hover:text-white transition-colors rounded-full hover:bg-white/10"
                      aria-label="Close"
                    >
                      <X size={20} />
                    </button>
                  </div>

                  {/* Success icon with responsive sizing */}
                  <motion.div
                    initial={{ scale: 0, rotate: -30 }}
                    animate={{ scale: 1, rotate: 0 }}
                    transition={{ delay: 0.2 }}
                    className="mx-auto mb-4 sm:mb-6 w-16 h-16 sm:w-20 sm:h-20 bg-green-500/10 rounded-full flex items-center justify-center border border-green-500/20"
                  >
                    <Check
                      className="text-green-400"
                      size={28}
                      strokeWidth={2.5}
                    />
                  </motion.div>

                  {/* Content with responsive text */}
                  <p className="mb-6 sm:mb-8 text-center text-gray-300 font-[Inter] text-sm sm:text-md leading-relaxed">
                    Your booking was successful! Would you like to view the gig
                    details or continue browsing?
                  </p>

                  {/* Buttons with responsive layout */}
                  <div className="flex flex-col space-y-3 sm:flex-row sm:space-y-0 sm:space-x-3">
                    <motion.button
                      whileHover={{ scale: 1.03 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => {
                        mutate("/api/gigs/getgigs");
                        setShowConfirmation(false);
                        router.push("/av_gigs/" + userId);
                      }}
                      className="px-4 py-2 sm:px-6 sm:py-3 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-white transition-all duration-300 font-medium flex-1 text-sm sm:text-base"
                    >
                      Browse More
                    </motion.button>

                    <motion.button
                      whileHover={{ scale: 1.03 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => {
                        setShowConfirmation(false);
                        mutate("g");
                        router.push(`/execute/${lastBookedGigId}`);
                      }}
                      className="px-4 py-2 sm:px-6 sm:py-3 rounded-xl bg-gradient-to-r from-indigo-500 to-indigo-600 hover:from-indigo-600 hover:to-indigo-700 text-white transition-all duration-300 font-medium shadow-lg shadow-indigo-500/20 flex-1 text-sm sm:text-base"
                    >
                      View Details
                    </motion.button>
                  </div>
                </div>

                {/* Footer with responsive padding */}
                <div className="px-4 py-3 sm:px-6 sm:py-4 bg-white/5 border-t border-white/5 text-center">
                  <p className="text-xs text-gray-400 font-mono">
                    You can access this booking anytime in pending gigs page
                  </p>
                </div>
              </div>
            </motion.div>
          </div>
        )}
        <PagesNav />
      </div>
    </>
    // </div>
  );
}
