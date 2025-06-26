"use client";
import useStore from "@/app/zustand/useStore";
import { RoleStatusCard } from "./RoleStatusCard";
import { motion, AnimatePresence } from "framer-motion";
import {
  FiAlertCircle,
  FiStar,
  FiTrendingUp,
  FiDollarSign,
  FiMusic,
  FiX,
  FiUserPlus,
} from "react-icons/fi";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export function MusicianDashboard({
  gigsBooked,
  earnings,
  firstLogin,
  onboarding,
}: {
  gigsBooked: number;
  earnings: number;
  firstLogin: boolean;
  onboarding: boolean;
}) {
  const { subscriptiondata: data } = useStore();

  const router = useRouter();
  const [showUpgradeModal, setShowUpgradeModal] = useState(false);

  useEffect(() => {
    if (!firstLogin && onboarding) {
      // Wait for onboarding to complete and then show upgrade modal after 2 seconds
      const timer = setTimeout(() => {
        setShowUpgradeModal(true);
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [firstLogin, onboarding]);
  const handleUpgradeProfile = () => {
    router.push("/profile");
    setShowUpgradeModal(false);
  };
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
      className="space-y-6 p-6 bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 rounded-xl shadow-2xl border border-gray-800 overflow-hidden"
    >
      {/* Header Section */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <motion.h1
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
            className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-purple-400 via-pink-300 to-blue-400 bg-clip-text text-transparent"
          >
            Your Performance Hub
          </motion.h1>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-gray-400 mt-1 text-sm md:text-base"
          >
            Track your gigs and earnings in real-time
          </motion.p>
        </div>

        <motion.div
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.98 }}
          className="flex items-center gap-2 bg-gray-800/50 px-3 py-1.5 rounded-full border border-gray-700"
        >
          <span className="text-gray-400 text-sm">Current plan:</span>
          <span
            className={`px-2 py-1 text-xs font-semibold rounded-full ${
              data?.subscription?.isPro
                ? "bg-purple-900/40 text-purple-300 border border-purple-500/30"
                : "bg-gray-700/50 text-gray-300 border border-gray-600/50"
            }`}
          >
            {data?.subscription?.isPro ? "PRO" : "FREE"}
          </span>
        </motion.div>
      </div>

      {/* Content Section */}
      <AnimatePresence mode="wait">
        {data?.subscription?.isPro ? (
          <motion.div
            key="pro-content"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <RoleStatusCard
              title="Gigs Booked"
              value={gigsBooked}
              trend="up"
              icon={<FiMusic className="text-purple-400" />}
            />
            <RoleStatusCard
              title="Earnings (KES)"
              value={earnings}
              format="currency"
              icon={<FiDollarSign className="text-green-400" />}
            />
            <RoleStatusCard
              title="Rating"
              value={4.8}
              format="stars"
              trend="steady"
              icon={<FiStar className="text-yellow-400" />}
            />
          </motion.div>
        ) : (
          <motion.div
            key="free-content"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="flex flex-col items-center justify-center p-8 rounded-lg bg-gray-800/30 border border-dashed border-gray-700 text-center"
          >
            <FiAlertCircle className="text-yellow-500 text-4xl mb-4" />
            <h3 className="text-lg font-medium text-gray-200 mb-2">
              Upgrade to Pro
            </h3>
            <p className="text-gray-400 text-sm max-w-md">
              Unlock your full performance analytics and track your gigs,
              earnings, and ratings in real-time with our Pro version.
            </p>
            <motion.button
              onClick={() => router.push("/dashboard/billing")}
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.98 }}
              className="mt-4 px-4 py-2 bg-gradient-to-r from-purple-600 to-blue-600 text-white text-sm font-medium rounded-full shadow-lg"
            >
              Upgrade Now
            </motion.button>
          </motion.div>
        )}
      </AnimatePresence>
      <AnimatePresence>
        {showUpgradeModal && (
          <motion.div
            initial={{ opacity: 0, backdropFilter: "blur(0px)" }}
            animate={{ opacity: 1, backdropFilter: "blur(4px)" }}
            exit={{ opacity: 0, backdropFilter: "blur(0px)" }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
          >
            <motion.div
              initial={{ scale: 0.95, y: 10, opacity: 0 }}
              animate={{ scale: 1, y: 0, opacity: 1 }}
              exit={{ scale: 0.95, y: 10, opacity: 0 }}
              transition={{
                duration: 0.3,
                ease: [0.16, 1, 0.3, 1],
                bounce: 0.4,
              }}
              className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl w-[85%] max-w-md overflow-hidden border border-gray-700/50 shadow-2xl"
            >
              {/* Header with close button */}
              <div className="flex justify-end p-4">
                <button
                  onClick={handleUpgradeProfile}
                  className="text-gray-400 hover:text-white transition-colors duration-200 p-1 rounded-full hover:bg-gray-700/50"
                >
                  <FiX className="h-5 w-5" />
                </button>
              </div>

              {/* Content */}
              <div className="px-8 pb-8 pt-2">
                <div className="flex flex-col items-center text-center space-y-5">
                  <div className="p-3 bg-yellow-500/10 rounded-full">
                    <FiAlertCircle className="h-8 w-8 text-yellow-400" />
                  </div>

                  <div className="space-y-2">
                    <h3 className="text-2xl font-bold bg-gradient-to-r from-purple-300 to-blue-300 bg-clip-text text-transparent">
                      Complete Your Profile
                    </h3>
                    <p className="text-gray-400 text-sm leading-relaxed">
                      Showcase your talent! A complete profile with skills,
                      experience, and portfolio receives{" "}
                      <span className="text-yellow-300">3× more bookings</span>{" "}
                      and better visibility.
                    </p>
                  </div>

                  <button
                    onClick={handleUpgradeProfile}
                    className="mt-4 px-6 py-3 bg-gradient-to-r from-purple-500 to-blue-500 text-white font-medium rounded-full shadow-lg hover:shadow-purple-500/20 hover:scale-[1.02] transition-all duration-300 relative overflow-hidden group"
                  >
                    <span className="relative z-10 flex items-center gap-2">
                      <FiUserPlus className="h-4 w-4" />
                      Update Profile Now
                    </span>
                    <span className="absolute inset-0 bg-gradient-to-r from-purple-600 to-blue-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  </button>
                </div>
              </div>

              {/* Subtle footer */}
              <div className="px-6 py-3 bg-gray-900/50 border-t border-gray-800 text-center">
                <p className="text-xs text-gray-500">
                  Only takes 2 minutes • Your profile is 67% complete
                </p>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Footer */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4 }}
        className="pt-4 border-t border-gray-800/50"
      >
        <div className="flex items-center justify-between text-xs text-gray-500">
          <span>Last updated: {new Date().toLocaleString()}</span>
          {data?.subscription?.isPro && (
            <span className="flex items-center gap-1">
              <FiTrendingUp className="text-green-400" />
              <span className="text-green-400">+12% from last month</span>
            </span>
          )}
        </div>
      </motion.div>
    </motion.div>
  );
}
