"use client";
import BallLoader from "@/components/loaders/BallLoader";
import FloatingNotesLoader from "@/components/loaders/FloatingNotes";
import ActionPage from "@/components/start/ActionPage";
import { useCurrentUser } from "@/hooks/useCurrentUser";
import { useAuth } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";

const Actions = () => {
  const router = useRouter();
  const { isLoaded: isAuthLoaded, userId } = useAuth();
  const { user, loading } = useCurrentUser();
  const [status, setStatus] = useState<
    "loading" | "unregistered" | "registered"
  >("loading");

  console.log(user);
  useEffect(() => {
    // Only proceed when auth and user data are loaded
    if (!isAuthLoaded || loading) return;
    if (user) {
      router.push("/");
    }
    // No user logged in (shouldn't happen due to middleware)
    if (!userId) {
      router.push("/sign-in");
      return;
    }

    // User exists but no MongoDB record
    if (!user && loading) {
      setStatus("unregistered");
      return;
    }
    console.log(user);
    // User has completed registration
    if (
      typeof user?.user?.isMusician === "boolean" &&
      typeof user?.user?.isClient === "boolean"
    ) {
      if (user?.user?.isMusician || user?.user?.isClient) {
        setStatus("registered");
        if (
          user?.user?.firstLogin === true &&
          user?.user?.onboardingComplete === false
        ) {
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

  if (!user) {
    return (
      <div className="h-full w-full bg-black">
        <span className="flex flex-col items-center justify-center">
          Loading...
        </span>
      </div>
    );
  }

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
  // Default fallback (should redirect in useEffect)
  if (!user?.user?.firstname) {
    return (
      <div className="h-full backdrop-blur-0 bg-black/90 flex justify-center items-center">
        <div className="">
          <FloatingNotesLoader />
        </div>
      </div>
    );
  }
  // Show registration page if user needs to complete profile
  if (status === "unregistered") {
    return <ActionPage />;
  }

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
