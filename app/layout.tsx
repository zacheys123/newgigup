import type { Metadata } from "next";

import "./globals.css";

import { ClerkLoaded } from "@clerk/nextjs";
import { GlobalProvider } from "./Context/store";
import { Providers } from "./providers";

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
        <html lang="en">
          <body className="min-h-screen bg-gray-200 w-screen overflow-x-hidden ">
            {" "}
            <ClerkLoaded>{children} </ClerkLoaded>
          </body>
        </html>
      </GlobalProvider>
    </Providers>
  );
}
