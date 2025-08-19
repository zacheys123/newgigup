"use client";
import { GigProps } from "@/types/giginterface";
import { useState } from "react";
import { toast } from "react-hot-toast";
import { useAuth } from "@clerk/nextjs";
import { FaTrash, FaRegBookmark } from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";

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

      if (!response.ok) throw new Error("Failed to remove from saved");

      setLocalGigs(localGigs.filter((gig) => gig._id !== gigId));
      toast.success("Removed from your collection");
    } catch (error) {
      console.error("Error removing saved gig:", error);
      toast.error("Failed to remove gig");
    }
  };

  if (localGigs.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 space-y-4">
        <FaRegBookmark className="text-4xl text-gray-500/50" />
        <p className="text-lg font-light text-gray-400">
          Your Favourite gigs will appear here.
        </p>
        <p className="text-sm text-gray-500/80">
          Browse gigs and save your favorites
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <AnimatePresence>
        {localGigs.map((gig) => (
          <motion.div
            key={gig._id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, x: -50 }}
            transition={{ duration: 0.3 }}
            className="relative bg-gradient-to-br from-gray-800/50 to-gray-900 rounded-xl border border-gray-700/50 hover:border-amber-400/30 transition-all overflow-hidden shadow-lg"
          >
            {/* Background Glow */}
            <div className="absolute inset-0 bg-gradient-to-br from-transparent via-gray-900/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

            {/* Image/Thumbnail Placeholder */}
            {gig.logo ? (
              <div className="h-40 w-full bg-gray-800 relative overflow-hidden">
                <img
                  src={gig.logo}
                  alt={gig.title || "Gig image"}
                  className="w-full h-full object-cover"
                  width={100}
                  height={100}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
              </div>
            ) : (
              <div className="h-40 w-full bg-gradient-to-br from-gray-800 to-gray-700 flex items-center justify-center">
                <FaRegBookmark className="text-3xl text-gray-500/30" />
              </div>
            )}

            {/* Content */}
            <div className="p-5">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="text-xl font-medium text-white font-sans tracking-tight line-clamp-1">
                    {gig.title}
                  </h3>
                  {gig.location && (
                    <p className="text-gray-400/90 text-sm mt-1 flex items-center">
                      <span className="w-1.5 h-1.5 bg-amber-400/80 rounded-full mr-2" />
                      {gig.location}
                    </p>
                  )}
                </div>
                {gig.price && (
                  <span className="bg-amber-400/10 text-amber-400 px-3 py-1 rounded-full text-sm font-medium">
                    {gig.price} {gig.currency}
                  </span>
                )}
              </div>

              {gig.scheduleDate && (
                <div className="mt-4 pt-4 border-t border-gray-700/50 flex items-center">
                  <span className="text-xs text-gray-400/80 font-light">
                    {new Date(gig.scheduleDate).toLocaleDateString("en-US", {
                      weekday: "short",
                      month: "short",
                      day: "numeric",
                    })}
                  </span>
                </div>
              )}
            </div>

            {/* Delete Button */}
            <motion.button
              onClick={() => handleRemoveSaved(gig._id ? gig?._id : "")}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              className="absolute top-4 right-4 p-2 bg-gray-900/80 backdrop-blur-sm rounded-full hover:bg-red-500/90 transition-all shadow-lg"
              aria-label="Remove from saved"
            >
              <FaTrash className="text-white/90 text-sm" />
            </motion.button>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}
