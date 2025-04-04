"use client";

import { OnboardingModal } from "@/components/dashboard/onboarding";
import BallLoader from "@/components/loaders/BallLoader";
import { useAuth } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
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
        const result = await fetch(`/api/user/subscription?clerkId=${userId}`);
        const mydata = await result.json();
        // const result = await getDashboardData(userId);
        console.log(mydata);
        setData(mydata);
      } catch (err) {
        console.error("Failed to load dashboard:", err);
        setError("Failed to load dashboard data");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [userId, isLoaded, router]);

  console.log(data?.user?.isMusician);

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
      {data?.user?.isMusician === true ? (
        <MusicianDashboard
          gigsBooked={data?.user?.gigsBooked ?? 0}
          earnings={data?.user?.earnings ?? 0}
        />
      ) : data?.user?.isClient === true ? (
        <ClientDashboard
          gigsPosted={data?.user?.gigsPosted}
          total={data?.user?.total}
        />
      ) : null}

      {/* {!data.subscription.isPro && (
        <div className="mb-6 bg-gradient-to-r from-orange-900/50 to-amber-900/30 p-4 rounded-lg">
          <p className="text-orange-300 text-sm md:text-base">
            Upgrade to Pro for unlimited features
          </p>
        </div>
      )} */}

      {data?.user?.firstLogin === false && <OnboardingModal />}
    </>
  );
}
