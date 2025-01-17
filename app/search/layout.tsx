import React from "react";
import { Toaster } from "sonner";

export default function FriendLayout({
  reviews,
  children,
}: Readonly<{
  children: React.ReactNode;
  reviews: React.ReactNode; // Add Review type here
}>) {
  return (
    <div className="bg-black shadow-md shadow-gray-300 h-screen w-full overflow-hidden">
      <div className="flex items-center justify-between mt-4 mx-6  "></div>
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 3000,
        }}
      />
      {reviews}
      {children}
    </div>
  );
}
