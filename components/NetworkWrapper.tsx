// components/NetworkWrapper.tsx
"use client";

import { useNetworkStatus } from "@/hooks/useNetwork";
import OfflinePage from "./offline/Offline";

export default function NetworkWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  const isOnline = useNetworkStatus();

  if (!isOnline) {
    return <OfflinePage />;
  }

  return <>{children}</>;
}
