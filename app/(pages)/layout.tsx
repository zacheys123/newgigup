"use client";
import NotificationHandler from "@/components/NotificationHandler";
// import { useState } from "react";
import MobileSheet from "@/components/pages/MobileSheet";
import PagesNav from "@/components/pages/PagesNav";
import { useCurrentUser } from "@/hooks/useCurrentUser";
import { useAuth, UserButton, useUser } from "@clerk/nextjs";
import { motion } from "framer-motion";
import { ArrowRight, Check, Clock, Eye, User, X } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useMemo } from "react";
import { Toaster } from "sonner";
import { mutate } from "swr";
import useStore from "../zustand/useStore";
import { useCheckTrial } from "@/hooks/useCheckTrials";
// import { BookingSuccessModal } from "@/components/gig/BookingSuccessModal";
import { ConfettiExplosion } from "@/components/gig/ConfettiExplosion";
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
  const {
    showConfirmation,
    setShowConfirmation,
    lastBookedGigId,
    showConfetti,
  } = useStore();
  const router = useRouter();
  return (
    <>
      {showConfetti && <ConfettiExplosion />}
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

        <NotificationHandler />
        {children}
        {/* <BookingSuccessModal gigId={lastBookedGigId} /> */}
        {showConfirmation && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Enhanced backdrop with subtle gradient and smoother transition */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
              className="fixed inset-0 bg-gradient-to-br from-gray-900/80 to-indigo-900/60 backdrop-blur-md"
              onClick={() => setShowConfirmation(false)}
            />

            {/* Main modal container with refined animations */}
            <motion.div
              initial={{ opacity: 0, y: 40, scale: 0.97 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 40, scale: 0.97 }}
              transition={{
                type: "spring",
                damping: 25,
                stiffness: 350,
                mass: 0.5,
              }}
              className="relative z-[9999] w-full max-w-md mx-4"
            >
              {/* Premium glass card with refined styling */}
              <div className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-2xl border border-gray-700/70 shadow-2xl shadow-indigo-500/10 overflow-hidden relative">
                {/* Animated decorative particles */}
                <div className="absolute inset-0 overflow-hidden rounded-2xl">
                  {[...Array(8)].map((_, i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, y: -20, x: Math.random() * 100 }}
                      animate={{
                        opacity: [0, 0.3, 0],
                        y: [0, Math.random() * 60 - 30],
                        x: [0, Math.random() * 40 - 20],
                      }}
                      transition={{
                        duration: 4 + Math.random() * 4,
                        repeat: Infinity,
                        repeatType: "reverse",
                        delay: i * 0.3,
                      }}
                      className="absolute w-1 h-1 rounded-full bg-indigo-400/40"
                      style={{
                        top: `${Math.random() * 100}%`,
                        left: `${Math.random() * 100}%`,
                      }}
                    />
                  ))}
                </div>

                {/* Shimmering border animation */}
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.4 }}
                  className="absolute inset-0 rounded-2xl pointer-events-none overflow-hidden"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-indigo-500/10 via-emerald-500/10 to-purple-500/10 animate-[shimmer_6s_linear_infinite] bg-[length:200%_100%]" />
                </motion.div>

                <div className="relative z-10 p-6 sm:p-8">
                  {/* Header with refined typography */}
                  <div className="flex items-center justify-between mb-6">
                    <motion.h3
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.2 }}
                      className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-amber-300 font-[Inter] tracking-tight"
                    >
                      Booking Confirmed
                    </motion.h3>
                    <motion.button
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.3 }}
                      onClick={() => {
                        mutate("/api/gigs/getgigs");
                        setShowConfirmation(false);
                      }}
                      className="p-1.5 rounded-lg hover:bg-white/10 transition-all duration-200 group"
                      aria-label="Close"
                    >
                      <X
                        size={20}
                        className="text-gray-300 group-hover:text-white transition-colors"
                      />
                    </motion.button>
                  </div>

                  {/* Success animation with more polish */}
                  {/* Success animation with more polish */}
                  <motion.div
                    initial={{ scale: 0, rotate: -30, opacity: 0 }}
                    animate={{ scale: 1, rotate: 0, opacity: 1 }}
                    transition={{
                      type: "spring",
                      stiffness: 500,
                      damping: 20,
                      delay: 0.4,
                    }}
                    className="mx-auto mb-6 w-20 h-20 sm:w-24 sm:h-24 bg-gradient-to-br from-green-500/10 to-emerald-500/10 rounded-full flex items-center justify-center border border-emerald-500/30 relative"
                  >
                    {/* Pulsing ring effect with rotation */}
                    <motion.div
                      initial={{ scale: 0.5, opacity: 0, rotate: 0 }}
                      animate={{
                        scale: 1.3,
                        opacity: 0,
                        rotate: 45,
                        transition: {
                          duration: 2,
                          repeat: Infinity,
                          repeatType: "reverse",
                          delay: 0.8,
                        },
                      }}
                      className="absolute inset-0 border-2 border-emerald-400/30 rounded-full"
                    />

                    {/* Checkmark with bounce-in rotation */}
                    <motion.div
                      initial={{ scale: 0, rotate: -45 }}
                      animate={{
                        scale: [0, 1.2, 1],
                        rotate: [0, 5, 0],
                        transition: {
                          duration: 0.8,
                          delay: 0.5,
                          ease: [0.175, 0.885, 0.32, 1.275],
                        },
                      }}
                    >
                      <Check
                        className="text-emerald-400"
                        size={32}
                        strokeWidth={2.5}
                      />
                    </motion.div>
                  </motion.div>

                  {/* Content with refined typography */}
                  <motion.p
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.6 }}
                    className="mb-8 text-center text-gray-300 font-[Inter] text-base leading-relaxed"
                  >
                    Your booking was successfully processed!{" "}
                    <br className="hidden sm:block" />
                    Would you like to view the gig details or continue browsing?
                  </motion.p>

                  {/* Enhanced buttons with refined interactions */}
                  <div className="flex flex-col space-y-4 sm:flex-row sm:space-y-0 sm:space-x-4">
                    <motion.button
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 1.7 }}
                      whileHover={{
                        scale: 1.03,
                        backgroundColor: "rgba(255, 255, 255, 0.1)",
                      }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => {
                        mutate("/api/gigs/getgigs");
                        setShowConfirmation(false);
                        router.push("/av_gigs/" + userId);
                      }}
                      className="px-6 py-3 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-white transition-all duration-300 font-medium flex-1 flex items-center justify-center space-x-2"
                    >
                      <span>Browse More</span>
                      <ArrowRight size={16} className="opacity-70" />
                    </motion.button>

                    <motion.button
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 1.5 }}
                      whileHover={{
                        scale: 1.03,
                        boxShadow: "0 10px 25px -5px rgba(99, 102, 241, 0.3)",
                      }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => {
                        setShowConfirmation(false);
                        mutate("g");
                        router.push(`/execute/${lastBookedGigId}`);
                      }}
                      className="px-6 py-3 rounded-xl bg-gradient-to-r from-indigo-500 to-indigo-600 hover:from-indigo-600 hover:to-indigo-700 text-white transition-all duration-300 font-medium shadow-lg shadow-indigo-500/20 flex-1 flex items-center justify-center space-x-2 relative overflow-hidden"
                    >
                      {/* Button shine effect */}
                      <motion.div
                        initial={{ x: -100, opacity: 0 }}
                        animate={{ x: 300, opacity: 0.4 }}
                        transition={{
                          delay: 1.2,
                          duration: 1.5,
                          repeat: Infinity,
                          repeatDelay: 3,
                        }}
                        className="absolute top-0 left-0 w-20 h-full bg-white/30 transform skew-x-12"
                      />
                      <span>View Details</span>
                      <Eye size={16} className="opacity-80" />
                    </motion.button>
                  </div>
                </div>

                {/* Enhanced footer with subtle animation */}
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 1 }}
                  className="px-6 py-4 bg-black/20 border-t border-white/5 text-center"
                >
                  <p className="text-xs text-gray-400 font-mono flex items-center justify-center">
                    <Clock size={14} className="mr-1.5" />
                    {"You can access this booking anytime in your pending gigs"
                      .split("")
                      .map((char, i) => (
                        <motion.span
                          key={i}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{
                            opacity: 1,
                            y: 0,
                            transition: {
                              delay: 0.4 + i * 0.05,
                              repeat: Infinity,
                              repeatDelay: 8,
                              repeatType: "reverse",
                            },
                          }}
                          style={{ display: "inline-block", fontSize: "10px" }}
                        >
                          {char === " " ? "\u00A0" : char}
                        </motion.span>
                      ))}
                  </p>
                </motion.div>
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
