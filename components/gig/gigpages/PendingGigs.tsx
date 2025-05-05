"use client";
import { useAllGigs } from "@/hooks/useAllGigs";
import { useRouter } from "next/navigation";
import React, { useEffect, useMemo, useState } from "react";
import ColorLoading from "@/components/loaders/ColorLoading";
import { motion } from "framer-motion";
import {
  Calendar,
  CalendarCheck,
  Clock,
  MapPin,
  Mic2,
  Music,
  RefreshCw,
  Search,
  User,
} from "lucide-react";
import { searchPending } from "@/utils/index";
import { GigProps } from "@/types/giginterface";
import { useAuth } from "@clerk/nextjs";
import { useDebounce } from "./Published";
import { usePendingGigs } from "@/app/Context/PendinContext";
import CountUp from "react-countup";

const PendingGigs = () => {
  const { userId } = useAuth();
  const router = useRouter();
  const { loading: gigsLoading, gigs, error } = useAllGigs();
  const [typeOfGig, setTypeOfGig] = useState<string>("");
  const [localGigs, setLocalGigs] = useState<GigProps[]>([]);
  const { pendingGigsCount, setPendingGigsCount } = usePendingGigs();

  const debouncedSearch = useDebounce(typeOfGig, 300);
  const [isLocalLoading, setIsLocalLoading] = useState(true);

  useEffect(() => {
    const savedGigs = localStorage.getItem("pendingGigs");
    setIsLocalLoading(false);
    if (savedGigs) {
      setLocalGigs(JSON.parse(savedGigs));
    }
  }, []);

  useEffect(() => {
    if (gigs && gigs.length > 0) {
      const userPendingGigs = gigs.filter((gig: GigProps) =>
        gig?.bookCount?.some((bookedUser) => bookedUser?.clerkId === userId)
      );

      if (userPendingGigs.length !== pendingGigsCount) {
        setPendingGigsCount(userPendingGigs.length);
      }

      localStorage.setItem("pendingGigs", JSON.stringify(userPendingGigs));
      setLocalGigs(userPendingGigs);
    }
  }, [gigs, userId, pendingGigsCount, setPendingGigsCount]);

  const filteredGigs = useMemo(() => {
    if (!localGigs || localGigs.length === 0) return [];

    let results = localGigs;

    if (typeOfGig) {
      results = searchPending(results, debouncedSearch) || [];
    }

    results = results.filter(
      (gig) => gig?.isTaken === false && gig?.isPending === false
    );

    return results;
  }, [debouncedSearch, localGigs, typeOfGig]);

  const isLoading = gigsLoading || !userId || isLocalLoading;

  const item = {
    hidden: { y: 12, opacity: 0 },
    show: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 120,
        damping: 12,
      },
    },
  };

  const formatDate = (date?: Date | string) => {
    if (!date) return "Date not specified";

    try {
      const dateObj = typeof date === "string" ? new Date(date) : date;
      return dateObj.toLocaleDateString("en-US", {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
      });
    } catch {
      return "Invalid date";
    }
  };

  const handleRefresh = () => {
    if (gigs && gigs.length > 0) {
      const userPendingGigs = gigs.filter((gig: GigProps) =>
        gig?.bookCount?.some((bookedUser) => bookedUser?.clerkId === userId)
      );
      localStorage.setItem("pendingGigs", JSON.stringify(userPendingGigs));
    }
    window.location.reload();
  };

  const renderCategorySpecificContent = (gig: GigProps) => {
    switch (gig.bussinesscat?.toLowerCase()) {
      case "DJ":
        return (
          <div className="mt-3 space-y-2">
            <div className="flex items-center gap-2">
              <Music size={16} className="text-purple-400" />
              <span className="text-sm font-medium text-purple-300">
                Genres:
              </span>
            </div>
            <div className="flex flex-wrap gap-2">
              {gig.djGenre?.split(",").map((genre, idx) => (
                <span
                  key={idx}
                  className="px-2 py-1 text-xs rounded-full bg-purple-900/50 text-purple-200"
                >
                  {genre.trim()}
                </span>
              ))}
            </div>
            {gig.djEquipment && (
              <div className="mt-2">
                <div className="flex items-center gap-2">
                  <Mic2 size={16} className="text-amber-400" />
                  <span className="text-sm font-medium text-amber-300">
                    Equipment:
                  </span>
                </div>
                <p className="text-sm text-amber-200">{gig.djEquipment}</p>
              </div>
            )}
          </div>
        );
      case "MC":
        return (
          <div className="mt-3 space-y-2">
            <div className="flex items-center gap-2">
              <User size={16} className="text-blue-400" />
              <span className="text-sm font-medium text-blue-300">
                MC Type:
              </span>
              <span className="text-sm text-blue-200">{gig.mcType}</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium text-blue-300">
                Languages:
              </span>
              <div className="flex flex-wrap gap-2">
                {gig.mcLanguages?.split(",").map((lang, idx) => (
                  <span
                    key={idx}
                    className="px-2 py-1 text-xs rounded-full bg-blue-900/50 text-blue-200"
                  >
                    {lang.trim()}
                  </span>
                ))}
              </div>
            </div>
          </div>
        );
      case "Vocalist":
        return (
          <div className="mt-3 space-y-2">
            <div className="flex items-center gap-2">
              <Mic2 size={16} className="text-rose-400" />
              <span className="text-sm font-medium text-rose-300">
                Vocal Genres:
              </span>
            </div>
            <div className="flex flex-wrap gap-2">
              {[...new Set(gig.vocalistGenre)].map((genre, idx) => (
                <span
                  key={idx}
                  className="px-2 py-1 text-xs rounded-full bg-rose-900/50 text-rose-200 animate-pulse"
                >
                  {genre}
                </span>
              ))}
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  const renderTimelineInfo = (gig: GigProps) => {
    switch (gig.gigtimeline) {
      case "once":
        return (
          <div className="flex items-center gap-2 mt-2">
            <CalendarCheck size={16} className="text-green-400" />
            <span className="text-sm text-green-300">
              One-time event on {formatDate(gig.date)}
            </span>
          </div>
        );
      case "weekly":
        return (
          <div className="flex items-center gap-2 mt-2">
            <RefreshCw size={16} className="text-blue-400" />
            <span className="text-sm text-blue-300">Weekly on {gig.day}</span>
          </div>
        );
      case "other":
        return gig.otherTimeline ? (
          <div className="flex items-center gap-2 mt-2">
            <Calendar size={16} className="text-purple-400" />
            <span className="text-sm text-purple-300">
              Custom schedule: {gig.otherTimeline}
            </span>
          </div>
        ) : null;
      default:
        return null;
    }
  };
  return (
    <div className="fixed inset-0 flex flex-col py-8">
      <div className="w-full mx-auto px-4 py-6 max-w-7xl flex-1 flex flex-col overflow-hidden">
        {error && (
          <div className="p-4 mb-4 text-red-400 bg-red-900/20 rounded-xl">
            Error loading gigs
          </div>
        )}

        <motion.div
          className="relative group mb-8"
          variants={item}
          initial="hidden"
          animate="show"
        >
          <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/10 to-blue-600/10 rounded-xl blur-lg opacity-0 group-hover:opacity-40 transition-all duration-700"></div>
          <div className="relative flex items-center bg-gray-900/50 px-5 py-3.5 rounded-xl border border-gray-800/50 group-hover:border-cyan-400/30 transition-all duration-500">
            <Search size={18} className="text-cyan-400 mr-3" />
            <input
              placeholder="Search Gig Title/Location/Time etc..."
              className="flex-1 bg-transparent border-none outline-none text-gray-100 placeholder-gray-400 text-sm font-medium focus:ring-0"
              value={typeOfGig}
              onChange={(ev) => setTypeOfGig(ev.target.value)}
              autoFocus
            />
            <motion.div
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              className="p-2 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-lg shadow cursor-pointer"
            >
              <Search size={16} className="text-white" />
            </motion.div>
          </div>
        </motion.div>

        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-white">
            {" "}
            <CountUp
              end={filteredGigs?.length || 0}
              duration={1.5}
              delay={0.2}
            />{" "}
            Pending Gigs
          </h2>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleRefresh}
            className="px-3 py-1.5 text-sm rounded-full bg-gray-700 text-gray-200 hover:bg-gray-600 transition-all flex items-center gap-2"
          >
            <RefreshCw size={14} />
            Refresh
          </motion.button>
        </div>

        {isLoading ? (
          <div className="flex-1 flex justify-center items-center">
            <ColorLoading />
          </div>
        ) : filteredGigs?.length === 0 ? (
          <div className="flex-1 flex justify-center items-center">
            <span className="text-neutral-400 font-mono text-lg">
              No Pending Gigs Available
            </span>
          </div>
        ) : (
          <div className="flex-1 overflow-y-auto smooth-scroll">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 pb-6 pr-2">
              {filteredGigs?.map((gig: GigProps) => {
                const showPriceRangeAndCurrency =
                  gig?.pricerange === "thousands"
                    ? `${gig?.price}k ${gig?.currency} `
                    : gig?.pricerange === "hundreds"
                    ? `${gig?.price},00 ${gig?.currency} `
                    : gig?.pricerange === "tensofthousands"
                    ? `${gig?.price}0000 ${gig?.currency} `
                    : gig?.pricerange === "hundredsofthousands"
                    ? `${gig?.price},00000 ${gig?.currency} `
                    : `${gig?.price} ${gig?.currency} `;
                return (
                  <motion.div
                    key={gig?._id}
                    variants={item}
                    initial="hidden"
                    animate="show"
                    className="relative bg-gradient-to-br from-gray-800/50 to-gray-900/70 rounded-xl overflow-hidden border border-gray-700/50 hover:border-cyan-400/30 transition-all duration-300 shadow-lg"
                  >
                    <div className="p-5">
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="text-xl font-bold text-white mb-1">
                            {gig.title}
                          </h3>
                          <p className="text-sm text-gray-300 line-clamp-2">
                            {gig.description}
                          </p>
                        </div>
                        <span className="px-3 py-1 text-xs rounded-full bg-gradient-to-r from-cyan-600 to-blue-600 text-white shadow-md">
                          {showPriceRangeAndCurrency}
                        </span>
                      </div>

                      <div className="mt-4 space-y-3">
                        <div className="flex items-center gap-2">
                          <MapPin size={16} className="text-amber-400" />
                          <span className="text-sm text-amber-200">
                            {gig.location}
                          </span>
                        </div>
                        {renderTimelineInfo(gig)}

                        <div className="flex items-center gap-2">
                          <Clock size={16} className="text-indigo-400" />
                          <span className="text-sm text-indigo-200">
                            {gig.time?.from} - {gig.time?.to}
                          </span>
                        </div>
                      </div>

                      {renderCategorySpecificContent(gig)}

                      <div className="mt-6 pt-4 border-t border-gray-700/50 flex justify-end">
                        <motion.button
                          whileHover={{ scale: 1.03 }}
                          whileTap={{ scale: 0.97 }}
                          onClick={() => router.push(`/execute/${gig._id}`)}
                          className="px-4 py-2 bg-gradient-to-r from-cyan-600 to-blue-600 text-white rounded-lg text-sm font-medium shadow-lg hover:shadow-cyan-500/20 transition-all"
                        >
                          View Gig
                        </motion.button>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default PendingGigs;
