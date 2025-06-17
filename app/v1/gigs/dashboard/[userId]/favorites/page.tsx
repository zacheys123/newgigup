"use client";
import { useEffect, useState } from "react";
import FavouritesList from "@/components/gig/dashboard/FavouriteList";
import { GigProps } from "@/types/giginterface";
import { useAuth } from "@clerk/nextjs";
import { useParams, useRouter } from "next/navigation";
import LoadingSpinner from "@/components/LoadingSpinner";

export default function FavoritesPage() {
  const [favoriteGigs, setFavoriteGigs] = useState<GigProps[]>([]);
  const [loading, setLoading] = useState(true);
  const { userId: clerkId } = useAuth();
  const router = useRouter();
  const { userId } = useParams();
  useEffect(() => {
    const fetchFavoriteGigs = async () => {
      try {
        setLoading(true);
        // Verify the user is authorized to view this page
        if (userId !== clerkId) {
          router.push("/unauthorized");
          return;
        }

        const response = await fetch(
          `/api/gigs/dashboard/${userId}/getfavorites`
        );

        console.log(response);
        if (!response.ok) {
          throw new Error("Failed to fetch favorites");
        }

        const data = await response.json();
        setFavoriteGigs(data);
      } catch (error) {
        console.error("Error fetching favorite gigs:", error);
      } finally {
        setLoading(false);
      }
    };

    if (clerkId) {
      fetchFavoriteGigs();
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
      <h1 className="text-2xl font-bold text-white">Favorite Gigs</h1>
      {favoriteGigs.length > 0 ? (
        <FavouritesList gigs={favoriteGigs} />
      ) : (
        <div className="text-center py-12">
          <p className="text-gray-400">{`You haven't favorited any gigs yet.`}</p>
        </div>
      )}
    </div>
  );
}
