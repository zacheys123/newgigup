"use client";
import { GigProps } from "@/types/giginterface";
import { useState } from "react";
import { toast } from "react-hot-toast";
import { useAuth } from "@clerk/nextjs";
import { FaTrash } from "react-icons/fa";

export default function FavouritesList({
  gigs: initialGigs,
}: {
  gigs: GigProps[];
}) {
  const { userId } = useAuth();
  const [localGigs, setLocalGigs] = useState<GigProps[]>(initialGigs);

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

  if (localGigs.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-400">{`You haven't liked any gigs yet.`}</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {localGigs.map((gig) => (
        <div
          key={gig._id}
          className="bg-gray-800 rounded-lg p-4 border border-gray-700 hover:border-amber-500/50 transition-colors relative group"
        >
          {/* Trash icon button */}
          <button
            onClick={() => handleRemoveSaved(gig._id ? gig?._id : "")}
            className="absolute top-3 right-3 p-2 bg-gray-900/80 rounded-full hover:bg-red-500 transition-colors opacity-0 group-hover:opacity-100"
            aria-label="Remove from saved"
          >
            <FaTrash className="text-white text-sm" />
          </button>

          <h3 className="text-lg font-semibold text-white pr-10">
            {gig.title}
          </h3>
          {gig.location && <p className="text-gray-400 mt-1">{gig.location}</p>}
          {gig.price && (
            <p className="text-amber-400 mt-2">
              {gig.price} {gig.currency}
            </p>
          )}
          {gig.scheduleDate && (
            <p className="text-sm text-gray-500 mt-2">
              {new Date(gig.scheduleDate).toLocaleDateString()}
            </p>
          )}
        </div>
      ))}
    </div>
  );
}
