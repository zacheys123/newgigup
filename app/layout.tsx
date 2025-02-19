import type { Metadata } from "next";

import "./globals.css";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css"; // Import styles for Toastify

import { ClerkLoaded } from "@clerk/nextjs";
import { GlobalProvider } from "./Context/store";
import { Providers } from "./providers";
import { SocketProvider } from "./Context/socket";

// import "@/lib/cron";

export const metadata: Metadata = {
  title: "Gigup",
  description: "New Gigup",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <Providers>
      <GlobalProvider>
        <SocketProvider>
          <html lang="en">
            <body className="min-h-screen bg-gray-200 w-screen overflow-x-hidden ">
              {" "}
              <ToastContainer />
              <ClerkLoaded>{children} </ClerkLoaded>
            </body>
          </html>
        </SocketProvider>
      </GlobalProvider>
    </Providers>
  );
}
