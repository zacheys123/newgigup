"use client";
import { useState } from "react";
import MobileSheet from "@/components/pages/MobileSheet";
import PagesNav from "@/components/pages/PagesNav";
import { UserButton } from "@clerk/nextjs";
import { Toaster } from "sonner";
import { Box } from "@mui/material";
import { HiMenuAlt3 } from "react-icons/hi";
export default function GigLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const [isVisible, setIsVisible] = useState(false);

  const toggleVisibility = (vis: boolean) => {
    setIsVisible(vis);
  };

  return (
    <div className="inset-0 backdrop-blur-xl  h-screen w-full overflow-hidden">
      {/* Subtle Fixed Action Button */}
      <button
        onClick={(ev) => {
          ev.stopPropagation();
          toggleVisibility(true);
        }}
        className="fixed bottom-[120px] right-6 bg-gray-800/50 text-white p-3 rounded-full shadow-sm hover:bg-gray-800/70 transition-all duration-200 z-50 animate-pulse bg-gradient-to-r from-red-400 to-blue-600 z-100"
      >
        <HiMenuAlt3
          size={18} // Replace with your desired icon size
          color="white" // Replace with your desired icon color
        />
      </button>

      {/* Slide Down Container */}
      <Box
        className={`fixed top-0 left-0 right-0 z-40 transition-transform duration-500 ease-in-out ${
          isVisible ? "translate-y-0" : "-translate-y-full"
        }`}
      >
        <div className="flex items-center justify-between mt-4 mx-6">
          <MobileSheet />
          <UserButton />
        </div>
      </Box>

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
      />
      {children}
      <PagesNav />
    </div>
    // </div>
  );
}
