"use client";

import { OnboardingModal } from "@/components/dashboard/onboarding";
import { Sidebar } from "@/components/dashboard/SideBar";
import BallLoader from "@/components/loaders/BallLoader";

import { useAuth } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { DashboardData } from "@/types/dashboard";
import { getDashboardData } from "../actions/getDashBoardData";

import { ClientDashboard } from "@/components/dashboard/client";
import { MusicianDashboard } from "@/components/dashboard/muscian";

export default function Dashboard() {
  const { userId, isLoaded } = useAuth();
  const router = useRouter();
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!isLoaded) return;

    const fetchData = async () => {
      try {
        if (!userId) {
          router.push("/sign-in");
          return;
        }

        setLoading(true);
        const result = await getDashboardData(userId);
        setData(result);
      } catch (err) {
        console.error("Failed to load dashboard:", err);
        setError("Failed to load dashboard data");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [userId, isLoaded, router]);

  if (!isLoaded || loading) {
    return (
      <div className="flex h-screen items-center justify-center bg-black">
        <BallLoader />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex h-screen items-center justify-center bg-black">
        <div className="text-red-500">{error}</div>
      </div>
    );
  }

  if (!data) {
    return null; // or a "no data" state
  }

  return (
    <div className="flex h-screen bg-black">
      <Sidebar isPro={data.subscription.isPro} />

      <main className="flex-1 overflow-y-auto p-6">
        {data.user.isMusician ? (
          <MusicianDashboard
            gigsBooked={data.user.gigsBooked ?? 0} // Default to 0 if undefined
            earnings={data.user.earnings ?? 0} // Default to 0 if undefined
          />
        ) : (
          <ClientDashboard />
        )}

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
