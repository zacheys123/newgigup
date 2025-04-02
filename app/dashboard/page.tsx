"use client";

import { OnboardingModal } from "@/components/dashboard/onboarding";
import BallLoader from "@/components/loaders/BallLoader";
import { useAuth } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { getDashboardData } from "../actions/getDashBoardData";
import { ClientDashboard } from "@/components/dashboard/client";
import { MusicianDashboard } from "@/components/dashboard/muscian";
import useStore from "../zustand/useStore";

export default function Dashboard() {
  const { userId, isLoaded } = useAuth();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { subscriptiondata: data, setData } = useStore();

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
    return null;
  }

  return (
    <>
      {data.user.isMusician ? (
        <MusicianDashboard
          gigsBooked={data.user.gigsBooked ?? 0}
          earnings={data.user.earnings ?? 0}
        />
      ) : (
        <ClientDashboard />
      )}

      {/* {!data.subscription.isPro && (
        <div className="mb-6 bg-gradient-to-r from-orange-900/50 to-amber-900/30 p-4 rounded-lg">
          <p className="text-orange-300 text-sm md:text-base">
            Upgrade to Pro for unlimited features
          </p>
        </div>
      )} */}

      {data.user.firstLogin && <OnboardingModal />}
    </>
  );
}
