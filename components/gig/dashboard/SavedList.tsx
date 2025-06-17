"use client";
import { GigProps } from "@/types/giginterface";

import { useState } from "react";
import { toast } from "react-hot-toast";
import GigCard from "./GigCard";
import { useAuth } from "@clerk/nextjs";

interface SavedListProps {
  gigs: GigProps[];
}

export default function SavedList({ gigs }: SavedListProps) {
  const [localGigs, setLocalGigs] = useState(gigs);
  const { userId } = useAuth();
  const handleRemoveSaved = async (gigId: string) => {
    try {
      const response = await fetch(
        `/api/gigs/dashboard/${userId}/postsaved/${gigId}`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (!response.ok) {
        throw new Error("Failed to remove from saved");
      }

      setLocalGigs(localGigs.filter((gig) => gig._id !== gigId));
      toast.success("Gig removed from saved");
    } catch (error) {
      console.error("Error removing saved gig:", error);
      toast.error("Failed to remove from saved");
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {localGigs.map((gig) => (
        <div key={gig._id} className="relative group">
          <GigCard gig={gig} initialSaved={true} />
          <button
            onClick={() => handleRemoveSaved(gig._id ? gig?._id : "")}
            className="absolute top-2 left-2 p-2 bg-gray-800/80 rounded-full hover:bg-red-500/80 transition-colors z-10 opacity-0 group-hover:opacity-100"
          >
            <span className="sr-only">Remove from saved</span>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-4 w-4 text-white"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>
      ))}
    </div>
  );
}
