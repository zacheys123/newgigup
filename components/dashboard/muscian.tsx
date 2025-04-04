"use client";
import useStore from "@/app/zustand/useStore";
import { RoleStatusCard } from "./RoleStatusCard";
import { motion } from "framer-motion";

export function MusicianDashboard({
  gigsBooked,
  earnings,
}: {
  gigsBooked: number;
  earnings: number;
}) {
  const { subscriptiondata: data } = useStore();
  console.log(data);
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="space-y-6 p-6 bg-gradient-to-br from-gray-900 to-gray-800 rounded-xl shadow-lg"
    >
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white">
            Your Performance Hub
          </h1>
          <p className="text-gray-400 mt-1">
            Track your gigs and earnings in real-time
          </p>
        </div>

        <motion.span
          whileHover={{ scale: 1.05 }}
          className="flex justify-center items-center"
        >
          <span className="text-red-500 title">current:</span>
          <h5
            className={`px-3 py-1 text-sm rounded-full font-medium ${
              data?.subscription?.isPro
                ? "bg-purple-900/30 text-purple-300 border border-purple-800/50"
                : "bg-gray-800 text-gray-400 border border-gray-700"
            }`}
          >
            {data?.subscription?.isPro ? "PRO" : "FREE"}
          </h5>
        </motion.span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
        <RoleStatusCard
          title="Gigs Booked"
          value={gigsBooked}
          trend="up"
          icon="🎸"
        />
        <RoleStatusCard
          title="Earnings (KES)"
          value={earnings}
          format="currency"
          icon="💰"
        />
        <RoleStatusCard
          title="Rating"
          value={4.8}
          format="stars"
          trend="steady"
          icon="⭐"
        />
      </div>
    </motion.div>
  );
}
