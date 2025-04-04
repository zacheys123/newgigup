"use client";
import BallLoader from "@/components/loaders/BallLoader";
import ActionPage from "@/components/start/ActionPage";
import { useCurrentUser } from "@/hooks/useCurrentUser";
import { useAuth } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";

const Actions = () => {
  const router = useRouter();
  const { isLoaded: isAuthLoaded, userId } = useAuth();
  const { user, loading } = useCurrentUser(userId || "");
  const [status, setStatus] = useState<
    "loading" | "unregistered" | "registered"
  >("loading");

  useEffect(() => {
    // Only proceed when auth and user data are loaded
    if (!isAuthLoaded || loading) return;

    // No user logged in (shouldn't happen due to middleware)
    if (!userId) {
      router.push("/sign-in");
      return;
    }

    // User exists but no MongoDB record
    if (!user) {
      setStatus("unregistered");
      return;
    }

    // User has completed registration
    if (
      typeof user.isMusician === "boolean" &&
      typeof user.isClient === "boolean"
    ) {
      if (user?.isMusician || user?.isClient) {
        setStatus("registered");
        if (user?.firstLogin === true) {
          router.push("/dashboard");
        }
      } else {
        router.push("/");

        return;
      }
    }

    // User record exists but roles aren't set
    setStatus("unregistered");
  }, [isAuthLoaded, loading, user, userId, router]);

  // Loading state
  if (status === "loading" || !isAuthLoaded || loading) {
    return (
      <div className="h-full w-full bg-black">
        <span className="flex flex-col items-center">
          <BallLoader />
          Loading...
        </span>
      </div>
    );
  }

  // Show registration page if user needs to complete profile
  if (status === "unregistered") {
    return <ActionPage />;
  }

  // Default fallback (should redirect in useEffect)
  return (
    <div className="h-full w-full bg-black">
      <span className="flex flex-col items-center">
        <BallLoader />
        Redirecting...
      </span>
    </div>
  );
};

export default Actions;
