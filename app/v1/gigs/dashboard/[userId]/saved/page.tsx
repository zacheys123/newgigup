"use client";
import { useEffect, useState } from "react";
import { GigProps } from "@/types/giginterface";
import { useAuth } from "@clerk/nextjs";
import { useParams, useRouter } from "next/navigation";
import LoadingSpinner from "@/components/LoadingSpinner";
import SavedList from "@/components/gig/dashboard/SavedList";

export default function SavedPage() {
  const [savedGigs, setSavedGigs] = useState<GigProps[]>([]);
  const [loading, setLoading] = useState(true);
  const { userId: clerkId } = useAuth();
  const router = useRouter();
  const { userId } = useParams();
  useEffect(() => {
    const fetchSavedGigs = async () => {
      try {
        setLoading(true);
        // Verify the user is authorized to view this page
        if (userId !== clerkId) {
          router.push("/unauthorized");
          return;
        }

        const response = await fetch(`/api/gigs/dashboard/${userId}/getsaved`);

        if (!response.ok) {
          throw new Error("Failed to fetch saved gigs");
        }

        const data = await response.json();
        setSavedGigs(data);
      } catch (error) {
        console.error("Error fetching saved gigs:", error);
      } finally {
        setLoading(false);
      }
    };

    if (clerkId) {
      fetchSavedGigs();
    }
  }, [userId, clerkId, router]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <LoadingSpinner />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-white">Saved Gigs</h1>
      {savedGigs.length > 0 ? (
        <SavedList gigs={savedGigs} />
      ) : (
        <div className="text-center py-12">
          <p className="text-gray-400">{`You haven't saved any gigs yet.`}</p>
          <button
            onClick={() => router.push("/gigs")}
            className="mt-4 px-4 py-2 bg-amber-500 text-white rounded-md hover:bg-amber-600 transition-colors"
          >
            Browse Gigs
          </button>
        </div>
      )}
    </div>
  );
}
