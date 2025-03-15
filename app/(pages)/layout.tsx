"use client";
import { useState } from "react";
import MobileSheet from "@/components/pages/MobileSheet";
import PagesNav from "@/components/pages/PagesNav";
import { UserButton } from "@clerk/nextjs";
import { Toaster } from "sonner";
import { motion, useScroll } from "framer-motion";

export default function GigLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const [isVisible, setIsVisible] = useState(false);
  const { scrollYProgress } = useScroll();

  const toggleVisibility = (vis: boolean) => {
    setIsVisible(vis);
  };

  return (
    <div className="inset-0 backdrop-blur-xl bg-opacity-40 bg-black h-screen w-full overflow-hidden">
      {/* Subtle Fixed Action Button */}
      <motion.button
        onClick={(ev) => {
          ev.stopPropagation();
          toggleVisibility(true);
        }}
        className="fixed bottom-[120px] right-6 bg-gray-800/50 text-white p-3 rounded-full shadow-sm hover:bg-gray-800/70 transition-all duration-200 z-50 animate-pulse bg-gradient-to-r from-red-400 to-blue-600"
        initial={{ opacity: 0, scale: 0.6 }}
        animate={{ opacity: scrollYProgress.get() > 0.1 ? 1 : 0, scale: 1 }}
        transition={{ duration: 0.3 }}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-5 w-5"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M4 6h16M4 12h16m-7 6h7"
          />
        </svg>
      </motion.button>

      {/* Slide Down Container */}
      <div
        className={`fixed top-0 left-0 right-0 z-40 transition-transform duration-500 ease-in-out ${
          isVisible ? "translate-y-0" : "-translate-y-full"
        }`}
      >
        <div className="flex items-center justify-between mt-4 mx-6">
          <MobileSheet />
          <UserButton />
        </div>
      </div>

      <Toaster
        position="top-right"
        toastOptions={{
          duration: 3000,
        }}
      />
      {/* Dimmed Background */}
      <div
        className={`transition-opacity duration-500 bg-neutral-700 ${
          isVisible ? "opacity-20" : "opacity-100"
        }`}
        onClick={(ev) => {
          ev.stopPropagation();
          toggleVisibility(false);
        }}
      >
        <Toaster
          position="top-right"
          toastOptions={{
            duration: 3000,
          }}
        />
        {children}
        <PagesNav />
      </div>
    </div>
  );
}
