// app/layout.tsx
import type { Metadata } from "next";
import "./globals.css";
import { ClerkLoaded } from "@clerk/nextjs";
import { GlobalProvider } from "./Context/store";
import { Providers } from "./providers";
import { SocketProvider } from "./Context/socket";
import { NotificationProvider } from "./Context/NotificationContext";
import ToastWrapper from "@/components/ToastWrapper";

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
    <html lang="en">
      <body className="min-h-screen bg-gray-200 w-screen overflow-x-hidden">
        <Providers>
          <GlobalProvider>
            <NotificationProvider>
              <SocketProvider>
                <ClerkLoaded>
                  {children}
                  <ToastWrapper />
                </ClerkLoaded>
              </SocketProvider>
            </NotificationProvider>
          </GlobalProvider>
        </Providers>
      </body>
    </html>
  );
}
