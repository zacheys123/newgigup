import type { Metadata } from "next";
import "./globals.css";
import { ClerkLoaded } from "@clerk/nextjs";
import { GlobalProvider } from "./Context/store";
import { Providers } from "./providers";
import { SocketProvider } from "./Context/socket";
import { NotificationProvider } from "./Context/NotificationContext";
import ToastWrapper from "@/components/ToastWrapper";
import { PendingGigsProvider } from "./Context/PendinContext";
import { useNetworkStatus } from "@/hooks/useNetwork";
import OfflinePage from "@/components/offline/Offline";

export const metadata: Metadata = {
  title: "Gigup",
  description: "New Gigup",
};

// Create a client component wrapper since hooks can't be used directly in server components
function NetworkAwareLayout({ children }: { children: React.ReactNode }) {
  const isOnline = useNetworkStatus();

  if (!isOnline) {
    return <OfflinePage />;
  }

  return (
    <Providers>
      <GlobalProvider>
        <NotificationProvider>
          <SocketProvider>
            <PendingGigsProvider>
              <ClerkLoaded>
                {children}
                <ToastWrapper />
              </ClerkLoaded>
            </PendingGigsProvider>
          </SocketProvider>
        </NotificationProvider>
      </GlobalProvider>
    </Providers>
  );
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-gray-200 w-screen overflow-x-hidden">
        <NetworkAwareLayout>{children}</NetworkAwareLayout>
      </body>
    </html>
  );
}
