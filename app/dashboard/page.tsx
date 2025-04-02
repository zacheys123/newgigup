"use client";
import { ClientDashboard } from "@/components/dashboard/client";
import { MusicianDashboard } from "@/components/dashboard/muscian";
import { OnboardingModal } from "@/components/dashboard/onboarding";
import { Sidebar } from "@/components/dashboard/SideBar";
import BallLoader from "@/components/loaders/BallLoader";
import { useAuth } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function Dashboard() {
  const { userId } = useAuth();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<{
    isMusician: boolean;
    firstLogin: boolean;
  } | null>(null);
  const [isPro, setIsPro] = useState(false);

  useEffect(() => {
    if (!userId) {
      router.push("/sign-in");
      return;
    }

    const fetchData = async () => {
      try {
        setLoading(true);

        // Fetch user data and subscription status in parallel
        const [userRes, subscriptionRes] = await Promise.all([
          fetch(`/api/users/getuser/${userId}`),
          fetch(`/api/subscription}`),
        ]);

        if (!userRes.ok || !subscriptionRes.ok) {
          throw new Error("Failed to fetch data");
        }

        const userData = await userRes.json();
        const subscriptionData = await subscriptionRes.json();

        setUser(userData);
        setIsPro(subscriptionData.isPro);
      } catch (error) {
        console.error("Dashboard data fetch error:", error);
        router.push("/error");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [userId, router]);

  if (loading || !user) {
    return (
      <div className="flex h-screen items-center justify-center bg-black">
        <BallLoader />
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-black">
      <Sidebar isPro={isPro} />

      <main className="flex-1 overflow-y-auto p-6">
        {user.isMusician ? <MusicianDashboard /> : <ClientDashboard />}

        {user.firstLogin && <OnboardingModal />}
      </main>
    </div>
  );
}
