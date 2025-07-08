"use client";

import { Review, UserProps } from "@/types/userinterfaces";
import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Button } from "../ui/button";
import useSocket from "@/hooks/useSocket";
import { mutate } from "swr";
import { useAllGigs } from "@/hooks/useAllGigs";
import { GigProps } from "@/types/giginterface";
import { NotificationToast } from "./user-reliability/Notification";
import { UserProfileHeader } from "./user-reliability/UserProfileHeader";
import { RatingOverview } from "./user-reliability/RatingOverview";
import { PerformanceMetrics } from "./user-reliability/PerformanceMetrics";
import { BadgesSection } from "./user-reliability/BadgesSection";
import { PerformanceImpact } from "./user-reliability/PerformanceImapact";
import { useRouter } from "next/navigation";
import { IoRibbon, IoShieldCheckmark, IoSparkles } from "react-icons/io5";
import {
  FaAward,
  FaCrown,
  FaFire,
  FaFrownOpen,
  FaHeart,
  FaRegClock,
  FaStar,
  FaThumbsDown,
} from "react-icons/fa";
import { GiAchievement } from "react-icons/gi";

interface Badge {
  name: string;
  icon: React.ReactNode;
  description: string;
  condition: (user: UserProps) => boolean;
  upcomingCondition?: (user: UserProps) => boolean;
  tier?: "bronze" | "silver" | "gold" | "platinum";
}

// Utility functions
// --- Helper Functions (keep these defined as in the previous response) ---
interface CombinedRatingOptions {
  directReviewsWeight: number;
  gigBasedWeight: number;
}

const combineRatings = (
  directRating: number,
  gigBasedRating: number,
  options: CombinedRatingOptions
): number => {
  const { directReviewsWeight, gigBasedWeight } = options;
  if (directRating === 0 && gigBasedRating === 0) return 0;
  if (gigBasedRating === 0) return directRating;
  if (directRating === 0) return gigBasedRating;
  const totalWeight = directReviewsWeight + gigBasedWeight;
  return (
    (directRating * directReviewsWeight + gigBasedRating * gigBasedWeight) /
    totalWeight
  );
};

type RatingSource = Review | number;

interface RatingBreakdown {
  "5": number;
  "4": number;
  "3": number;
  "2": number;
  "1": number;
  [key: string]: number;
}

const getRatingBreakdown = (ratings: RatingSource[]): RatingBreakdown => {
  const breakdown: RatingBreakdown = { "5": 0, "4": 0, "3": 0, "2": 0, "1": 0 };
  ratings.forEach((item) => {
    let ratingValue: number;
    if (typeof item === "number") {
      ratingValue = item;
    } else {
      ratingValue = item.rating;
    }
    const roundedRating = Math.round(ratingValue);
    if (roundedRating >= 1 && roundedRating <= 5) {
      breakdown[roundedRating.toString()]++;
    }
  });
  return breakdown;
};

// --- Main calculateAverageRating Function ---

interface CalculateRatingResult {
  directRating: number;
  gigBasedRating: number;
  combinedRating: number;
  totalReviews: number;
  ratingBreakdown: RatingBreakdown;
}

const calculateAverageRating = (
  user: UserProps,
  allGigs: GigProps[] = []
): CalculateRatingResult => {
  const directReviews = user.allreviews ? user?.allreviews : [];
  const directRating =
    directReviews.length > 0
      ? directReviews.reduce((sum, review) => sum + review.rating, 0) /
        directReviews.length
      : 0;

  const userGigs = allGigs.filter(
    (gig) =>
      gig.bookedBy === user._id &&
      gig.musicianConfirmPayment?.confirmPayment && // Use optional chaining
      gig.clientConfirmPayment?.confirmPayment // Use optional chaining
  );

  // --- KEY CHANGE HERE ---
  // Only include gigRating if it's a valid number.
  const gigRatings = userGigs.flatMap((gig) =>
    typeof gig.gigRating === "number" ? [gig.gigRating] : []
  );
  // -----------------------

  const gigBasedRating =
    gigRatings.length > 0
      ? gigRatings.reduce((sum, rating) => sum + rating, 0) / gigRatings.length
      : 0;

  const combinedRating = combineRatings(directRating, gigBasedRating, {
    directReviewsWeight: 0.7,
    gigBasedWeight: 0.3,
  });

  // Prepare all individual ratings for the breakdown calculation
  const allIndividualRatings: RatingSource[] = [
    ...directReviews, // Review objects from direct reviews
    ...gigRatings, // Numbers from gig.gigRating
  ];

  return {
    directRating,
    gigBasedRating,
    combinedRating,
    totalReviews: directReviews.length + gigRatings.length,
    ratingBreakdown: getRatingBreakdown(allIndividualRatings),
  };
};

const UserProfileDetails = ({
  friend,
  error,
  isLoading,
  setShow,
}: {
  friend: UserProps;
  error: string;
  isLoading: boolean;
  setShow: (show: boolean) => void;
}) => {
  const router = useRouter();
  const { socket } = useSocket();
  const [showNotification, setShowNotification] = useState(false);
  const [notification, setNotification] = useState({ title: "", message: "" });
  const { gigs: allGigs } = useAllGigs();

  useEffect(() => {
    if (!socket) return;

    socket.on("badgeAchieved", (data) => {
      if (data.userId === friend?._id) {
        setNotification({
          title: "New Badge Unlocked!",
          message: `You've earned the ${data.badgeName} badge!`,
        });
        setShowNotification(true);
        mutate(`/api/user/getuser/${friend.username}`);

        setTimeout(() => setShowNotification(false), 5000);
      }
    });

    return () => {
      socket.disconnect();
    };
  }, [friend?._id, friend?.username, socket]);

  const {
    directRating,
    gigBasedRating,
    combinedRating,
    totalReviews,
    ratingBreakdown,
  } = calculateAverageRating(friend || {}, allGigs || []);

  const totalGigs =
    (friend.completedGigsCount || 0) + (friend.cancelgigCount || 0);
  const reliabilityScore =
    totalGigs > 0 ? ((friend.completedGigsCount || 0) / totalGigs) * 100 : 100;

  // Calculate average rating for badge conditions
  const averageRating = combinedRating;

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
      icon: <IoShieldCheckmark className="text-blue-400" />,
      description: "Completed 5+ gigs with 90%+ reliability",
      condition: (user) =>
        (user.completedGigsCount || 0) >= 5 && reliabilityScore >= 90,
      upcomingCondition: (user) =>
        (user.completedGigsCount || 0) >= 3 && reliabilityScore >= 85,
      tier: "silver",
    },
    {
      name: "Top Performer",
      icon: <FaAward className="text-yellow-400" />,
      description: "Completed 10+ gigs with 95%+ reliability",
      condition: (user) =>
        (user.completedGigsCount || 0) >= 10 && reliabilityScore >= 95,
      upcomingCondition: (user) =>
        (user.completedGigsCount || 0) >= 7 && reliabilityScore >= 90,
      tier: "gold",
    },
    {
      name: "Gig Champion",
      icon: <FaCrown className="text-purple-400" />,
      description: "Completed 25+ gigs with 98%+ reliability",
      condition: (user) =>
        (user.completedGigsCount || 0) >= 25 && reliabilityScore >= 98,
      upcomingCondition: (user) =>
        (user.completedGigsCount || 0) >= 18 && reliabilityScore >= 95,
      tier: "platinum",
    },
    {
      name: "Highly Rated",
      icon: <FaStar className="text-amber-300" />,
      description: "Maintained 4.5+ average rating across 5+ gigs",
      condition: (user) =>
        averageRating >= 4.5 && (user.completedGigsCount || 0) >= 5,
      upcomingCondition: (user) =>
        averageRating >= 4.3 && (user.completedGigsCount || 0) >= 3,
      tier: "gold",
    },
    {
      name: "Client Favorite",
      icon: <FaHeart className="text-pink-400" />,
      description: "Received 10+ positive reviews (4.8+ rating)",
      condition: (user) =>
        averageRating >= 4.8 && (user.allreviews?.length || 0) >= 10,
      upcomingCondition: (user) =>
        averageRating >= 4.6 && (user.allreviews?.length || 0) >= 7,
      tier: "gold",
    },
    {
      name: "Early Bird",
      icon: <FaRegClock className="text-green-400" />,
      description: "Consistently arrives early to gigs (tracked via check-ins)",
      condition: (user) => (user.completedGigsCount || 0) >= 90,
      upcomingCondition: (user) => (user.completedGigsCount || 0) >= 80,
      tier: "silver",
    },
    {
      name: "Cancellation Risk",
      icon: <FaThumbsDown className="text-red-400" />,
      description: "Cancelled 3+ gigs",
      condition: (user) => (user.cancelgigCount || 0) >= 3,
      upcomingCondition: (user) => (user.cancelgigCount || 0) >= 2,
      tier: "bronze",
    },
    {
      name: "Frequent Canceller",
      icon: <FaFrownOpen className="text-red-500" />,
      description: "Cancelled 5+ gigs",
      condition: (user) => (user.cancelgigCount || 0) >= 5,
      upcomingCondition: (user) => (user.cancelgigCount || 0) >= 4,
      tier: "bronze",
    },
    {
      name: "Gig Streak",
      icon: <FaFire className="text-orange-400" />,
      description: "Completed 5 gigs in a row without cancellations",
      condition: (user) => (user.completedGigsCount || 0) >= 5,
      upcomingCondition: (user) => (user.completedGigsCount || 0) >= 3,
      tier: "silver",
    },
    {
      name: "Seasoned Performer",
      icon: <GiAchievement className="text-blue-400" />,
      description: "Completed 50+ gigs with 90%+ reliability",
      condition: (user) =>
        (user.completedGigsCount || 0) >= 50 && reliabilityScore >= 90,
      upcomingCondition: (user) =>
        (user.completedGigsCount || 0) >= 35 && reliabilityScore >= 85,
      tier: "platinum",
    },
    {
      name: "Perfect Attendance",
      icon: <IoRibbon className="text-green-400" />,
      description: "100% reliability with 10+ gigs",
      condition: (user) =>
        reliabilityScore === 100 && (user.completedGigsCount || 0) >= 10,
      upcomingCondition: (user) =>
        reliabilityScore === 100 && (user.completedGigsCount || 0) >= 7,
      tier: "platinum",
    },
  ];

  const earnedBadges = ALL_BADGES.filter((badge) => badge.condition(friend));
  const upcomingBadges = ALL_BADGES.filter(
    (badge) => !badge.condition(friend) && badge.upcomingCondition?.(friend)
  );

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gradient-to-br from-gray-900 to-gray-800">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
          className="w-12 h-12 border-4 border-indigo-400 border-t-transparent rounded-full shadow-lg"
        />
        <h6 className="ml-4 text-xl font-semibold text-gray-300 animate-pulse">
          Loading user details...
        </h6>
      </div>
    );
  }

  if (error || !friend) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gradient-to-br from-gray-900 to-gray-800">
        <div className="bg-gray-800 p-10 rounded-2xl shadow-xl border border-gray-700 text-center">
          <p className="text-gray-300 text-xl font-medium mb-4">
            {error || "Couldn't load user details"}
          </p>
          <Button
            onClick={() => router.back()}
            className="bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white font-semibold py-2 px-6 rounded-lg transition-all duration-300 shadow-lg"
          >
            Go Back
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="overflow-y-auto h-screen w-full bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 p-6">
      {showNotification && (
        <NotificationToast
          title={notification.title}
          message={notification.message}
          onClose={() => setShowNotification(false)}
        />
      )}

      <div className="max-w-3xl mx-auto bg-gradient-to-br from-gray-800 to-gray-900 rounded-xl shadow-2xl p-8 mt-10 border border-gray-700">
        <UserProfileHeader username={friend.username} setShow={setShow} />

        <RatingOverview
          directRating={directRating}
          gigBasedRating={gigBasedRating}
          combinedRating={combinedRating}
          totalReviews={totalReviews}
          ratingBreakdown={ratingBreakdown}
          completedGigsCount={friend.completedGigsCount || 0}
        />

        <PerformanceMetrics
          completedGigsCount={friend.completedGigsCount || 0}
          cancelgigCount={friend.cancelgigCount || 0}
          reliabilityScore={reliabilityScore}
        />

        <BadgesSection
          earnedBadges={earnedBadges}
          upcomingBadges={upcomingBadges}
        />

        <PerformanceImpact />

        <div className="mt-8 pt-6 border-t border-gray-700 text-center text-sm text-gray-400">
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
