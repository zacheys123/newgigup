"use client";
import BallLoader from "@/components/loaders/BallLoader";
import ActionPage from "@/components/start/ActionPage";
import { useCurrentUser } from "@/hooks/useCurrentUser";
import { useAuth } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";

const Actions = () => {
  const router = useRouter();
  const { userId } = useAuth();
  const { user } = useCurrentUser(userId || "");
  const [isCheckingUser, setIsCheckingUser] = useState(true);

  // components/start/Actions.tsx
  useEffect(() => {
    if (!user) {
      setIsCheckingUser(false);
      return;
    }

    if (
      typeof user.isMusician === "boolean" &&
      typeof user.isClient === "boolean"
    ) {
      // Redirect to dashboard after registration instead of specific pages
      if (user.isMusician || user.isClient) {
        router.push(`/dashboard`);
        return;
      }
    }

    setIsCheckingUser(false);
  }, [user, userId, router]);

  if (!user || isCheckingUser) {
    return (
      <div className="h-full w-full bg-black">
        <span className="flex flex-col items-center">
          <BallLoader />
          Loading...
        </span>
      </div>
    );
  }

  // If user roles aren't properly defined, show ActionPage
  if (
    typeof user.isMusician !== "boolean" ||
    typeof user.isClient !== "boolean"
  ) {
    return (
      <div>
        <ActionPage />
      </div>
    );
  }

  // Default case - show ActionPage
  return (
    <div>
      <ActionPage />
    </div>
  );
};

export default Actions;
