"use client";
import ActionPage from "@/components/start/ActionPage";
import { useCurrentUser } from "@/hooks/useCurrentUser";
import { useAuth } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import React, { useEffect } from "react";

const Actions = () => {
  const router = useRouter();
  const { userId } = useAuth();
  const { user } = useCurrentUser(userId || "");

  useEffect(() => {
    if (user) {
      console.log("User:", user); // Debugging

      // Ensure that the user object has the necessary properties
      if (user.isMusician !== undefined && user.isClient !== undefined) {
        if (user.isMusician && !user.isClient) {
          router.push(`/gigs/${userId}`);
        } else if (user.isClient && !user.isMusician) {
          router.push(`/create/${userId}`);
        }
      }
    }
  }, [user, userId, router]);

  if (!user) {
    return <div>Loading...</div>; // Or some loading spinner
  }

  // If the user object doesn't have the necessary properties, stay on the current page
  if (user.isMusician === undefined || user.isClient === undefined) {
    return (
      <div>
        <ActionPage />
      </div>
    );
  }

  // If the user is neither a musician nor a client, stay on the current page
  if (user.isMusician === false && user.isClient === false) {
    return (
      <div>
        <ActionPage />
      </div>
    );
  }

  return null; // Default return statement
};

export default Actions;
