"use client";

import { OnboardingModal } from "@/components/dashboard/onboarding";
import { Sidebar } from "@/components/dashboard/SideBar";
import { DashboardData } from "@/types/dashboard";
import { useEffect, useState } from "react";
import BallLoader from "../loaders/BallLoader";
import { MusicianDashboard } from "./muscian";
import { ClientDashboard } from "./client";

export default function DashboardClient({ data }: { data: DashboardData }) {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    // Client-side only logic
    setIsClient(true);
  }, []);

  if (!isClient) {
    return (
      <div className="flex h-screen items-center justify-center bg-black">
        <BallLoader />
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-black">
      <Sidebar isPro={data.subscription.isPro} />

      <main className="flex-1 overflow-y-auto p-6">
        {data.user.isMusician ? <MusicianDashboard /> : <ClientDashboard />}

        {!data.subscription.isPro && (
          <div className="mb-6 bg-gradient-to-r from-orange-900/50 to-amber-900/30 p-4 rounded-lg">
            <p className="text-orange-300 text-sm">
              Upgrade to Pro for unlimited features
            </p>
          </div>
        )}

        {data.user.firstLogin && <OnboardingModal />}
      </main>
    </div>
  );
}
