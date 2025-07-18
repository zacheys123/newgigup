"use client";
import DashboardNav from "@/components/gig/dashboard/DashboardNav";
import MobileDashboardNav from "@/components/gig/dashboard/MobileDashboardNav";
import { useParams } from "next/navigation";

import { ReactNode } from "react";

export default function DashboardLayout({ children }: { children: ReactNode }) {
  const { userId } = useParams();
  return (
    <div className="flex min-h-screen bg-gray-900">
      {/* Desktop Navigation - Hidden on mobile */}
      <div className="hidden md:block">
        <DashboardNav userId={userId as string} />
      </div>

      {/* Mobile Navigation - Hidden on desktop */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 z-50">
        <MobileDashboardNav userId={userId as string} />
      </div>

      {/* Main Content */}
      <main className="flex-1 p-4 md:p-6 pb-20 md:pb-6 overflow-y-auto">
        {children}
      </main>
    </div>
  );
}
