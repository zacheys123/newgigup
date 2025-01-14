"use client";
import { useCurrentUser } from "@/hooks/useCurrentUser";
import { useAuth } from "@clerk/nextjs";
import React from "react";

const ReviewComponent = () => {
  const { userId } = useAuth();
  const { user } = useCurrentUser(userId || null);
  console.log(user?.allreviews);
  return (
    <div>
      <h2 className="text-gray-300">user?.all</h2>
    </div>
  );
};

export default ReviewComponent;
