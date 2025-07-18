// app/layout.tsx
import type { Metadata } from "next";
import "./globals.css";
import { ClerkLoaded } from "@clerk/nextjs";
import { GlobalProvider } from "./Context/store";
import { Providers } from "./providers";
import { SocketProvider } from "./Context/socket";
import { NotificationProvider } from "./Context/NotificationContext";
import ToastWrapper from "@/components/ToastWrapper";
import { PendingGigsProvider } from "./Context/PendinContext";
import NetworkWrapper from "@/components/NetworkWrapper";
import ToasterShad from "@/components/ToasterShad";
import PWAProvider from "./PWAProvider";
import InstallButton from "@/components/pwa/InstallButton";

export const metadata: Metadata = {
  title: "Gigup",
  description: "New Gigup",
  manifest: "/manifest.json",
  themeColor: "#f59e0b",
  appleWebApp: {
    capable: true,
    title: "gigup",
    statusBarStyle: "default",
  },
  viewport: {
    width: "device-width",
    initialScale: 1,
    maximumScale: 1,
  },
};
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  if (process.env.NODE_ENV === "production") {
    fetch("/api/cron/init", { cache: "no-store" });
  }

  return (
    <html lang="en">
      <body className="min-h-screen bg-gray-200 w-screen overflow-x-hidden">
        <Providers>
          <GlobalProvider>
            <NotificationProvider>
              <SocketProvider>
                <PendingGigsProvider>
                  <ClerkLoaded>
                    <NetworkWrapper>
                      {children}
                      <PWAProvider />
                      <InstallButton />
                      <ToastWrapper />
                      <ToasterShad />
                    </NetworkWrapper>
                  </ClerkLoaded>
                </PendingGigsProvider>
              </SocketProvider>
            </NotificationProvider>
          </GlobalProvider>
        </Providers>
      </body>
    </html>
  );
}
