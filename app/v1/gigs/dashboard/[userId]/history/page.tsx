"use client";
import { useState, useEffect } from "react";
import { useAuth } from "@clerk/nextjs";
import { useRouter, useParams } from "next/navigation";
import LoadingSpinner from "@/components/LoadingSpinner";
import { motion } from "framer-motion";

import TimelineView from "@/components/gig/dashboard/TimeLineView";
import { BookingHistoryItem } from "@/types/history";

export default function HistoryPage() {
  const [historyGigs, setHistoryGigs] = useState<BookingHistoryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const { userId: clerkId } = useAuth();
  const router = useRouter();
  const params = useParams();
  const userId = params.userId as string;

  useEffect(() => {
    const fetchHistoryGigs = async () => {
      try {
        setLoading(true);
        if (userId !== clerkId) {
          router.push("/unauthorized");
          return;
        }

        const response = await fetch(`/api/gigs/dashboard/${userId}/history`, {
          next: { tags: ["booking-history"] },
        });
        if (!response.ok) throw new Error("Failed to fetch history");

        const data = await response.json();
        setHistoryGigs(data);
      } catch (error) {
        console.error("Error fetching history:", error);
      } finally {
        setLoading(false);
      }
    };

    if (clerkId) fetchHistoryGigs();
  }, [userId, clerkId, router]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <LoadingSpinner />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <motion.h1
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-3xl font-bold text-white bg-gradient-to-r from-amber-400 to-amber-600 bg-clip-text text-transparent"
      >
        Booking History
      </motion.h1>

      {historyGigs.length === 0 ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center py-16"
        >
          <p className="text-gray-400 text-lg">No booking history yet</p>
          <button
            onClick={() => router.push(`/av_gigs${userId}`)}
            className="mt-4 px-6 py-2 bg-amber-500 hover:bg-amber-600 text-white rounded-lg transition-colors"
          >
            Browse Available Gigs
          </button>
        </motion.div>
      ) : (
        <TimelineView gigs={historyGigs} />
      )}
    </div>
  );
}
