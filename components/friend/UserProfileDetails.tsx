// components/UserProfileDetails.tsx
"use client";

import { UserProps } from "@/types/userinterfaces";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";

import { motion } from "framer-motion";

import {
  FaAward,
  FaThumbsUp,
  FaThumbsDown,
  FaFrownOpen,
  FaStar,
  FaCrown,
  FaFire,
  FaHeart,
  FaRegClock,
  FaExclamationTriangle,
  FaTimes,
  FaCheck,
} from "react-icons/fa";
import { IoShieldCheckmark, IoRibbon, IoSparkles } from "react-icons/io5";
import { GiAchievement } from "react-icons/gi";
import { Button } from "../ui/button";
import useSocket from "@/hooks/useSocket";
import { mutate } from "swr";

interface Badge {
  name: string;
  icon: React.ReactNode;
  description: string;
  condition: (user: UserProps) => boolean;
  upcomingCondition?: (user: UserProps) => boolean;
  tier?: "bronze" | "silver" | "gold" | "platinum";
}

const UserProfileDetails = ({
  friend,
  error,
  isLoading,
}: {
  friend: UserProps;
  error: string;
  isLoading: boolean;
}) => {
  const router = useRouter();
  const { socket } = useSocket();
  const [showNotification, setShowNotification] = useState(false);
  const [notification, setNotification] = useState({ title: "", message: "" });

  useEffect(() => {
    // Initialize Socket.IO connection
    if (!socket) return;
    // Listen for badge achievement notifications
    socket.on("badgeAchieved", (data) => {
      if (data.userId === friend?._id) {
        setNotification({
          title: "New Badge Unlocked!",
          message: `You've earned the ${data.badgeName} badge!`,
        });
        setShowNotification(true);
        mutate(`/api/user/getuser/${friend.username}`); // Revalidate the user data

        // Hide notification after 5 seconds
        setTimeout(() => setShowNotification(false), 5000);
      }
    });

    return () => {
      socket.disconnect();
    };
  }, [friend?._id, mutate]);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
          className="w-12 h-12 border-4 border-indigo-500 border-t-transparent rounded-full shadow-lg"
        />
        <h6 className="ml-4 text-xl font-semibold text-gray-700 animate-pulse">
          Loading user details...
        </h6>
      </div>
    );
  }

  if (error || !friend) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
        <div className="bg-white p-10 rounded-2xl shadow-xl border border-gray-100 text-center">
          <p className="text-gray-700 text-xl font-medium mb-4">
            {`Oops! Couldn't load user details.`}
          </p>
          <Button
            onClick={() => router.back()}
            className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-2 px-6 rounded-lg transition-colors duration-300"
          >
            Go Back
          </Button>
        </div>
      </div>
    );
  }

  // Calculate reliability score
  const totalGigs =
    (friend.completedGigsCount || 0) + (friend.cancelgigCount || 0);
  const reliabilityScore =
    totalGigs > 0 ? ((friend.completedGigsCount || 0) / totalGigs) * 100 : 100;

  // Calculate average rating
  const averageRating = friend.allreviews?.length
    ? friend.allreviews.reduce((sum, review) => sum + review.rating, 0) /
      friend.allreviews.length
    : 0;

  // Define all possible badges with conditions
  const ALL_BADGES: Badge[] = [
    {
      name: "Newcomer",
      icon: <IoSparkles className="text-gray-400" />,
      description: "Completed first gig",
      condition: (user) => (user.completedGigsCount || 0) >= 1,
      upcomingCondition: (user) => (user.completedGigsCount || 0) === 0,
      tier: "bronze",
    },
    {
      name: "Reliable Gigster",
      icon: <IoShieldCheckmark className="text-blue-500" />,
      description: "Completed 5+ gigs with 90%+ reliability",
      condition: (user) =>
        (user.completedGigsCount || 0) >= 5 && reliabilityScore >= 90,
      upcomingCondition: (user) =>
        (user.completedGigsCount || 0) >= 3 && reliabilityScore >= 85,
      tier: "silver",
    },
    {
      name: "Top Performer",
      icon: <FaAward className="text-yellow-500" />,
      description: "Completed 10+ gigs with 95%+ reliability",
      condition: (user) =>
        (user.completedGigsCount || 0) >= 10 && reliabilityScore >= 95,
      upcomingCondition: (user) =>
        (user.completedGigsCount || 0) >= 7 && reliabilityScore >= 90,
      tier: "gold",
    },
    {
      name: "Gig Champion",
      icon: <FaCrown className="text-purple-500" />,
      description: "Completed 25+ gigs with 98%+ reliability",
      condition: (user) =>
        (user.completedGigsCount || 0) >= 25 && reliabilityScore >= 98,
      upcomingCondition: (user) =>
        (user.completedGigsCount || 0) >= 18 && reliabilityScore >= 95,
      tier: "platinum",
    },
    {
      name: "Highly Rated",
      icon: <FaStar className="text-amber-400" />,
      description: "Maintained 4.5+ average rating across 5+ gigs",
      condition: (user) =>
        averageRating >= 4.5 && (user.completedGigsCount || 0) >= 5,
      upcomingCondition: (user) =>
        averageRating >= 4.3 && (user.completedGigsCount || 0) >= 3,
      tier: "gold",
    },
    {
      name: "Client Favorite",
      icon: <FaHeart className="text-pink-500" />,
      description: "Received 10+ positive reviews (4.8+ rating)",
      condition: (user) =>
        averageRating >= 4.8 && (user.allreviews?.length || 0) >= 10,
      upcomingCondition: (user) =>
        averageRating >= 4.6 && (user.allreviews?.length || 0) >= 7,
      tier: "gold",
    },
    {
      name: "Early Bird",
      icon: <FaRegClock className="text-green-500" />,
      description: "Consistently arrives early to gigs (tracked via check-ins)",
      condition: (user) => user.completedGigsCount >= 90,
      upcomingCondition: (user) => user.completedGigsCount >= 80,
      tier: "silver",
    },
    {
      name: "Cancellation Risk",
      icon: <FaThumbsDown className="text-red-500" />,
      description: "Cancelled 3+ gigs",
      condition: (user) => (user.cancelgigCount || 0) >= 3,
      upcomingCondition: (user) => (user.cancelgigCount || 0) >= 2,
      tier: "bronze",
    },
    {
      name: "Frequent Canceller",
      icon: <FaFrownOpen className="text-red-700" />,
      description: "Cancelled 5+ gigs",
      condition: (user) => (user.cancelgigCount || 0) >= 5,
      upcomingCondition: (user) => (user.cancelgigCount || 0) >= 4,
      tier: "bronze",
    },
    {
      name: "Gig Streak",
      icon: <FaFire className="text-orange-500" />,
      description: "Completed 5 gigs in a row without cancellations",
      condition: (user) => user.completedGigsCount >= 5,
      upcomingCondition: (user) => user.completedGigsCount >= 3,
      tier: "silver",
    },
    {
      name: "Seasoned Performer",
      icon: <GiAchievement className="text-blue-600" />,
      description: "Completed 50+ gigs with 90%+ reliability",
      condition: (user) =>
        (user.completedGigsCount || 0) >= 50 && reliabilityScore >= 90,
      upcomingCondition: (user) =>
        (user.completedGigsCount || 0) >= 35 && reliabilityScore >= 85,
      tier: "platinum",
    },
    {
      name: "Perfect Attendance",
      icon: <IoRibbon className="text-green-600" />,
      description: "100% reliability with 10+ gigs",
      condition: (user) =>
        reliabilityScore === 100 && (user.completedGigsCount || 0) >= 10,
      upcomingCondition: (user) =>
        reliabilityScore === 100 && (user.completedGigsCount || 0) >= 7,
      tier: "platinum",
    },
  ];

  // Get earned badges
  const getEarnedBadges = () => {
    return ALL_BADGES.filter((badge) => badge.condition(friend));
  };

  // Get upcoming badges (ones the user is close to earning)
  const getUpcomingBadges = () => {
    return ALL_BADGES.filter(
      (badge) => !badge.condition(friend) && badge.upcomingCondition?.(friend)
    );
  };

  const earnedBadges = getEarnedBadges();
  const upcomingBadges = getUpcomingBadges();

  // Determine progress toward next badge (example for Top Performer)
  const progressToNextBadge = () => {
    if (earnedBadges.some((b) => b.name === "Top Performer")) return null;

    const completed = friend.completedGigsCount || 0;
    if (completed < 7) return null;

    const progress = Math.min(100, ((completed - 7) / (10 - 7)) * 100);
    return {
      badgeName: "Top Performer",
      progress,
      remaining: 10 - completed,
      description: "Complete 10 gigs with 95%+ reliability",
    };
  };

  const nextBadgeProgress = progressToNextBadge();

  return (
    <div className="overflow-y-auto h-screen w-full bg-gradient-to-b from-gray-50 to-gray-100 p-6">
      {/* Notification Toast */}
      {showNotification && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 20 }}
          className="fixed top-4 right-4 bg-white p-4 rounded-lg shadow-xl border-l-4 border-green-500 z-50 max-w-sm"
        >
          <div className="flex items-start">
            <div className="flex-shrink-0 text-green-500 text-xl">
              <FaAward />
            </div>
            <div className="ml-3">
              <h3 className="font-bold text-gray-900">{notification.title}</h3>
              <p className="text-gray-700">{notification.message}</p>
            </div>
            <button
              onClick={() => setShowNotification(false)}
              className="ml-auto text-gray-400 hover:text-gray-500"
            >
              ✕
            </button>
          </div>
        </motion.div>
      )}

      <div className="max-w-3xl mx-auto bg-white rounded-xl shadow-lg p-8 mt-10 border border-gray-100">
        {/* ... (previous header code remains the same) ... */}

        {/* Progress to Next Badge */}
        {nextBadgeProgress && (
          <div className="bg-indigo-50 p-6 rounded-lg shadow-sm mb-8">
            <h3 className="text-lg font-semibold text-indigo-800 mb-3">
              {`         On Your Way to "${nextBadgeProgress.badgeName}" Badge!
            `}
            </h3>
            <div className="w-full bg-gray-200 rounded-full h-4 mb-2">
              <div
                className="bg-gradient-to-r from-indigo-400 to-purple-500 h-4 rounded-full"
                style={{ width: `${nextBadgeProgress.progress}%` }}
              ></div>
            </div>
            <p className="text-sm text-gray-700">
              {nextBadgeProgress.remaining} more gigs needed (
              {nextBadgeProgress.description})
            </p>
          </div>
        )}

        {/* Badges Section */}
        <div className="bg-gray-50 p-6 rounded-lg shadow-sm mb-8">
          <h2 className="text-xl font-bold text-gray-800 mb-4 border-b border-gray-200 pb-3">
            Achievements & Status Badges
          </h2>

          {earnedBadges.length > 0 ? (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
                {earnedBadges.map((badge, index) => (
                  <motion.div
                    key={index}
                    whileHover={{ scale: 1.03 }}
                    className={`relative bg-white p-4 rounded-xl shadow-sm border-l-4 ${
                      badge.tier === "bronze"
                        ? "border-amber-700"
                        : badge.tier === "silver"
                        ? "border-gray-400"
                        : badge.tier === "gold"
                        ? "border-yellow-500"
                        : "border-purple-600"
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <div
                        className={`text-2xl ${
                          badge.tier === "bronze"
                            ? "text-amber-700"
                            : badge.tier === "silver"
                            ? "text-gray-500"
                            : badge.tier === "gold"
                            ? "text-yellow-500"
                            : "text-purple-600"
                        }`}
                      >
                        {badge.icon}
                      </div>
                      <div>
                        <h3 className="font-bold text-gray-800 flex items-center gap-2">
                          {badge.name}
                          {badge.tier === "platinum" && (
                            <span className="text-xs bg-purple-100 text-purple-800 px-2 py-0.5 rounded-full">
                              PLATINUM
                            </span>
                          )}
                        </h3>
                        <p className="text-sm text-gray-600 mt-1">
                          {badge.description}
                        </p>
                      </div>
                    </div>
                    {badge.tier && (
                      <div
                        className="absolute top-2 right-2 text-xs font-medium ${
                        badge.tier === 'bronze' ? 'text-amber-700' :
                        badge.tier === 'silver' ? 'text-gray-500' :
                        badge.tier === 'gold' ? 'text-yellow-500' :
                        'text-purple-600'
                      }"
                      >
                        {badge.tier.toUpperCase()}
                      </div>
                    )}
                  </motion.div>
                ))}
              </div>

              {/* Upcoming Badges */}
              {upcomingBadges.length > 0 && (
                <div className="mt-10">
                  <h3 className="text-lg font-semibold text-gray-700 mb-4 flex items-center gap-2">
                    <FaRegClock className="text-blue-500" />
                    {`Upcoming Badges You're Close To Earning`}
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {upcomingBadges.map((badge, index) => {
                      // Calculate progress for each upcoming badge
                      let progress = 0;
                      let remaining = "";

                      if (badge.name === "Top Performer") {
                        const completed = friend.completedGigsCount || 0;
                        progress = Math.min(
                          100,
                          ((completed - 7) / (10 - 7)) * 100
                        );
                        remaining = `${10 - completed} more gigs`;
                      } else if (badge.name === "Highly Rated") {
                        const neededReviews =
                          5 - (friend.completedGigsCount || 0);
                        progress = Math.min(
                          100,
                          ((friend.completedGigsCount || 0) / 5) * 100
                        );
                        remaining =
                          neededReviews > 0
                            ? `${neededReviews} more gigs`
                            : "Need higher rating";
                      }
                      // Add similar conditions for other badges

                      return (
                        <div
                          key={index}
                          className="bg-white p-4 rounded-lg border-2 border-dashed border-gray-300 hover:border-blue-300 transition-colors"
                        >
                          <div className="flex items-start gap-3">
                            <div className="text-gray-400 text-2xl">
                              {badge.icon}
                            </div>
                            <div className="flex-1">
                              <h4 className="font-medium text-gray-700">
                                {badge.name}
                              </h4>
                              <p className="text-xs text-gray-500 mt-1">
                                {badge.description}
                              </p>
                              {progress > 0 && (
                                <div className="mt-2">
                                  <div className="w-full bg-gray-100 rounded-full h-2">
                                    <div
                                      className="bg-blue-400 h-2 rounded-full"
                                      style={{ width: `${progress}%` }}
                                    ></div>
                                  </div>
                                  <p className="text-xs text-gray-600 mt-1">
                                    {remaining} to unlock
                                  </p>
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </>
          ) : (
            <div className="text-center py-8">
              <div className="mx-auto w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                <FaAward className="text-gray-400 text-2xl" />
              </div>
              <h3 className="text-lg font-medium text-gray-700 mb-2">
                No badges earned yet
              </h3>
              <p className="text-gray-500 max-w-md mx-auto">
                Complete gigs, maintain good ratings, and build your reliability
                to start earning badges.
              </p>
              <Button
                variant="outline"
                className="mt-4 border-blue-500 text-blue-600 hover:bg-blue-50"
                onClick={() => router.push("/how-it-works#badges")}
              >
                Learn how to earn badges
              </Button>
            </div>
          )}
        </div>

        {/* Performance Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <div className="bg-blue-50 p-5 rounded-lg border border-blue-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-blue-600 font-medium">Completed</p>
                <p className="text-3xl font-bold text-blue-800 mt-1">
                  {friend.completedGigsCount || 0}
                </p>
              </div>
              <div className="bg-blue-100 p-2 rounded-full">
                <FaCheck className="text-blue-600" />
              </div>
            </div>
          </div>

          <div className="bg-red-50 p-5 rounded-lg border border-red-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-red-600 font-medium">Canceled</p>
                <p className="text-3xl font-bold text-red-800 mt-1">
                  {friend.cancelgigCount || 0}
                </p>
              </div>
              <div className="bg-red-100 p-2 rounded-full">
                <FaTimes className="text-red-600" />
              </div>
            </div>
          </div>

          <div className="bg-green-50 p-5 rounded-lg border border-green-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-green-600 font-medium">
                  Reliability
                </p>
                <p className="text-3xl font-bold text-green-800 mt-1">
                  {reliabilityScore.toFixed(0)}%
                </p>
              </div>
              <div className="bg-green-100 p-2 rounded-full">
                <IoShieldCheckmark className="text-green-600" />
              </div>
            </div>
          </div>
        </div>

        {/* Rating Breakdown */}
        {friend.allreviews && friend.allreviews?.length > 0 && (
          <div className="bg-white border border-gray-200 rounded-lg p-6 mb-8">
            <h3 className="text-lg font-bold text-gray-800 mb-4">
              Rating Breakdown
            </h3>
            <div className="space-y-4">
              <div className="flex items-center">
                <span className="w-24 text-gray-600">Overall</span>
                <div className="flex-1 flex items-center">
                  <div className="flex mr-2">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <FaStar
                        key={star}
                        className={`${
                          star <= Math.round(averageRating)
                            ? "text-yellow-400"
                            : "text-gray-300"
                        }`}
                      />
                    ))}
                  </div>
                  <span className="text-gray-700 font-medium">
                    {averageRating.toFixed(1)} ({friend.allreviews.length}{" "}
                    reviews)
                  </span>
                </div>
              </div>

              {[5, 4, 3, 2, 1].map((rating) => {
                const count =
                  friend?.allreviews &&
                  friend?.allreviews.filter((r) => r.rating === rating).length;
                const percentage =
                  count &&
                  friend.allreviews &&
                  (count / friend.allreviews.length) * 100;

                return (
                  <div key={rating} className="flex items-center">
                    <span className="w-24 text-gray-600">
                      {rating} star{rating !== 1 ? "s" : ""}
                    </span>
                    <div className="flex-1 flex items-center">
                      <div className="w-full bg-gray-100 rounded-full h-2.5 mr-3">
                        <div
                          className="bg-yellow-400 h-2.5 rounded-full"
                          style={{ width: `${percentage}%` }}
                        ></div>
                      </div>
                      <span className="text-sm text-gray-600 w-10">
                        {count}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Incentives & Consequences */}
        <div className="bg-gradient-to-r from-indigo-50 to-purple-50 p-6 rounded-xl border border-indigo-100 mb-8">
          <h3 className="text-xl font-bold text-indigo-800 mb-4">
            Performance Impact
          </h3>

          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-semibold text-green-600 mb-3 flex items-center gap-2">
                <FaThumbsUp /> Benefits for Good Performance
              </h4>
              <ul className="space-y-3">
                <li className="flex items-start gap-2">
                  <FaCheck className="text-green-500 mt-1 flex-shrink-0" />
                  <span>Higher search ranking</span>
                </li>
                <li className="flex items-start gap-2">
                  <FaCheck className="text-green-500 mt-1 flex-shrink-0" />
                  <span>Access to premium gigs</span>
                </li>
                <li className="flex items-start gap-2">
                  <FaCheck className="text-green-500 mt-1 flex-shrink-0" />
                  <span>Verified badge on profile</span>
                </li>
                <li className="flex items-start gap-2">
                  <FaCheck className="text-green-500 mt-1 flex-shrink-0" />
                  <span>Reduced platform fees</span>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold text-red-600 mb-3 flex items-center gap-2">
                <FaExclamationTriangle /> Consequences for Poor Performance
              </h4>
              <ul className="space-y-3">
                <li className="flex items-start gap-2">
                  <FaTimes className="text-red-500 mt-1 flex-shrink-0" />
                  <span>Lower search visibility</span>
                </li>
                <li className="flex items-start gap-2">
                  <FaTimes className="text-red-500 mt-1 flex-shrink-0" />
                  <span>Temporary gig restrictions</span>
                </li>
                <li className="flex items-start gap-2">
                  <FaTimes className="text-red-500 mt-1 flex-shrink-0" />
                  <span>Warning labels on profile</span>
                </li>
                <li className="flex items-start gap-2">
                  <FaTimes className="text-red-500 mt-1 flex-shrink-0" />
                  <span>Increased platform fees</span>
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-8 pt-6 border-t border-gray-200 text-center text-sm text-gray-500">
          {friend.createdAt && friend.updatedAt && (
            <p>
              Last updated: {new Date(friend.updatedAt).toLocaleDateString()} •
              Member since: {new Date(friend.createdAt).toLocaleDateString()}
            </p>
          )}
          <p className="mt-1">
            &copy; {new Date().getFullYear()} GigConnect. All rights reserved.
          </p>
        </div>
      </div>
    </div>
  );
};

export default UserProfileDetails;
