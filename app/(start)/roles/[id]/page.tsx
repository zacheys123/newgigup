"use client";
import BallLoader from "@/components/loaders/BallLoader";
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
        if (user.isMusician === true && user.isClient === false) {
          router.push(`/gigs/${userId}`);
        } else if (user.isClient === true && user.isMusician === false) {
          router.push(`/create/${userId}`);
        }
      }
    }
  }, [user, userId, router]);

  if (!user) {
    return (
      <div className="h-full w-full bg-black">
        <span className="flex flex-col items-center">
          <BallLoader />
          Loading...
        </span>
      </div>
    ); // Or some loading spinner
  }

  // If the user object doesn't have the necessary properties, stay on the current page
  if (user.isMusician === undefined || user.isClient === undefined) {
    return (
      <div>
        <ActionPage />
      </div>
    );
  }

  // If the user is neither a musician nor a client, render the ActionPage
  // if (!user.isMusician && !user.isClient) {
  //   return (
  //     <div>
  //       <ActionPage />
  //     </div>
  //   );
  // }

  return (
    <div>
      <ActionPage />
    </div>
  );
};

export default Actions;
