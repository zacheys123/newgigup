"use client";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import AvatarComponent from "./Avatar";
import FollowButton from "./FollowButton";
import { UserProps } from "@/types/userinterfaces";
import { FiUser, FiMail, FiAtSign } from "react-icons/fi";
import { useAllGigs } from "@/hooks/useAllGigs";
import { useCurrentUser } from "@/hooks/useCurrentUser";
import { useEffect, useState } from "react";
import { GigProps } from "@/types/giginterface";

const MainUser = ({
  _id,
  email,
  firstname,
  lastname,
  username,
  followers,
  picture,
  isClient,
  isMusician,
  organization,
}: UserProps) => {
  const router = useRouter();
  const { loading: gigsLoading, gigs } = useAllGigs();
  const { user, loading: userLoading } = useCurrentUser();

  const handleClick = () => {
    if (isMusician) {
      router.push(`/search/${username}`);
    } else if (isClient) {
      router.push(`/client/search/${username}`);
    }
  };

  const [musicianGigCount, setMusicianGigCount] = useState<number>(0);
  const [rating, setRating] = useState<number>(0);

  const calculateRating = (
    reviews: { rating: number }[],
    gigCount: number
  ): number => {
    if (!reviews || reviews.length === 0) return 0;

    const avgReviewRating =
      reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length;
    const experienceFactor = Math.log10(gigCount + 0.5) * 1.0;
    const finalRating = Math.min(
      5,
      avgReviewRating * 0.7 + experienceFactor * 0.3
    );

    return Math.round(finalRating * 10) / 10;
  };

  useEffect(() => {
    if (gigsLoading || userLoading || !user?._id || !gigs) return;

    const bookedGigs = gigs.filter(
      (gig: GigProps) => gig?.bookedBy?._id === user?._id
    ).length;

    setMusicianGigCount(bookedGigs);
    console.log(bookedGigs);
    if (user?.isMusician) {
      setRating(calculateRating(user?.allreviews || [], bookedGigs));
    }
  }, [
    user?._id,
    user?.isMusician,
    gigs,
    user?.allreviews,
    userLoading,
    gigsLoading,
  ]);

  if (userLoading) {
    return (
      <div className="rounded-2xl p-5 bg-gray-800/20 border border-white/10">
        Loading user data...
      </div>
    );
  }

  return (
    <motion.div
      onClick={handleClick}
      whileHover={{ y: -4, scale: 1.015 }}
      whileTap={{ scale: 0.97 }}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
      className={`
        relative overflow-hidden rounded-2xl p-5 cursor-pointer backdrop-blur-md border border-white/10 transition-all duration-300
        ${
          isMusician
            ? "bg-gradient-to-br from-amber-900/20 to-yellow-700/10 hover:shadow-amber-500/20"
            : "bg-gradient-to-br from-slate-800/20 to-slate-700/10 hover:shadow-slate-500/10"
        }
      `}
    >
      {/* Avatar + Basic Info */}
      <div className="flex items-center gap-4">
        <AvatarComponent
          picture={picture || ""}
          posts="rounded-full w-14 h-14 border border-white/20 shadow-md"
          firstname={firstname ? firstname : ""}
        />
        <div className="flex-1 min-w-0">
          <h3 className="text-base font-medium text-white truncate">
            {firstname} {lastname}
          </h3>
          <div className="flex items-center gap-2 text-xs text-gray-400 mt-0.5 truncate">
            {isClient ? (
              <>
                <FiUser className="text-xs" />
                <span>{organization || `${firstname}'s Org`}</span>
                <span>{organization ? `${organization}` : ""}</span>
              </>
            ) : (
              <>
                <FiMail className="text-xs" />
                <span>{email}</span>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Username & Follow */}
      <div className="flex items-center justify-between text-xs text-gray-400 mt-4 px-3 py-1.5 rounded-lg border border-white/5 bg-white/5">
        <div className="flex items-center gap-1.5">
          <FiAtSign className="text-xs" />
          <span className="font-mono">@{username}</span>
        </div>
        {_id && (
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <FollowButton _id={_id} followers={followers} />
          </motion.div>
        )}
      </div>

      {/* Stats for Musicians */}
      {isMusician && (
        <div className="grid grid-cols-2 gap-2.5 mt-3">
          {/* Gigs */}
          <div className="bg-white/5 border border-white/10 rounded-lg p-2 backdrop-blur-sm group hover:bg-amber-900/20 transition-all duration-200">
            <div className="flex flex-col items-center justify-center">
              <span className="text-amber-300 font-semibold text-base group-hover:text-amber-200 transition-colors">
                {gigsLoading ? (
                  <span className="text-amber-300 text-[10px]">
                    Processing...
                  </span>
                ) : (
                  musicianGigCount
                )}
              </span>
              <span className="text-[11px] text-gray-400 group-hover:text-amber-100/80 mt-0.5 transition-colors">
                Gigs Booked
              </span>
            </div>
          </div>

          {/* Rating */}
          <div className="bg-white/5 border border-white/10 rounded-lg p-2 backdrop-blur-sm group hover:bg-amber-900/20 transition-all duration-200">
            <div className="flex flex-col items-center justify-center">
              <div className="flex items-baseline gap-1">
                <span className="text-amber-300 font-semibold text-base group-hover:text-amber-200 transition-colors">
                  {rating.toFixed(1)}
                </span>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-3 w-3 text-amber-400 -mb-0.5"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
              </div>
              <span className="text-[11px] text-gray-400 group-hover:text-amber-100/80 mt-0.5 transition-colors">
                Rating
              </span>
            </div>
          </div>
        </div>
      )}
      {isClient && (
        <div className="flex h-[19px] my-6">
          <div className="h-full">
            <h1 className="text-[12px] text-gray-200">{organization}</h1>
          </div>
        </div>
      )}
    </motion.div>
  );
};

export default MainUser;
