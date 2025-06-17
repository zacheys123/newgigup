"use client";
import { useState } from "react";
import {
  FaHeart,
  FaRegHeart,
  FaBookmark,
  FaRegBookmark,
  FaEllipsisV,
} from "react-icons/fa";
import { MdLocationOn, MdCalendarToday, MdAccessTime } from "react-icons/md";
import { toast } from "react-hot-toast";
import { GigProps } from "@/types/giginterface";
import Image from "next/image";
import Link from "next/link";

interface GigCardProps {
  gig: GigProps;
  initialFavorite?: boolean;
  initialSaved?: boolean;
  showActions?: boolean;
}

export default function GigCard({
  gig,
  initialFavorite = false,
  initialSaved = false,
  showActions = true,
}: GigCardProps) {
  const [isFavorite, setIsFavorite] = useState(initialFavorite);
  const [isSaved, setIsSaved] = useState(initialSaved);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleFavorite = async (action: "add" | "remove") => {
    const previousState = isFavorite;
    setIsFavorite(action === "add");

    try {
      const response = await fetch(`/api/gigs/${gig._id}/favorite`, {
        method: action === "add" ? "POST" : "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        setIsFavorite(previousState);
        throw new Error("Failed to update favorite");
      }

      toast.success(
        action === "add" ? "Added to favorites" : "Removed from favorites"
      );
    } catch (error) {
      setIsFavorite(previousState);
      console.error("Error updating favorite:", error);
      toast.error("Failed to update favorite");
    }
  };

  const handleSave = async (action: "add" | "remove") => {
    const previousState = isSaved;
    setIsSaved(action === "add");

    try {
      const response = await fetch(`/api/gigs/${gig._id}/save`, {
        method: action === "add" ? "POST" : "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        setIsSaved(previousState);
        throw new Error("Failed to update saved gigs");
      }

      toast.success(action === "add" ? "Gig saved" : "Gig unsaved");
    } catch (error) {
      setIsSaved(previousState);
      console.error("Error updating saved gig:", error);
      toast.error("Failed to update saved gig");
    }
  };

  const formatDate = (dateString: string | Date) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  return (
    <div className="bg-gray-800 rounded-lg overflow-hidden border border-gray-700 hover:border-amber-500/50 transition-all relative group">
      {/* Gig Image/Thumbnail */}
      <Link
        href={`/gigs/${gig._id}`}
        className="block h-48 bg-gray-700 relative overflow-hidden"
      >
        {gig.logo ? (
          <Image
            src={gig.logo}
            alt={gig.title || "Gig image"}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-gray-500">
            <span>No Image</span>
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
      </Link>

      {/* Quick Actions */}
      {showActions && (
        <div className="absolute top-2 right-2 flex gap-2 z-10">
          <button
            onClick={() => handleFavorite(isFavorite ? "remove" : "add")}
            className="p-2 bg-gray-800/80 rounded-full hover:bg-amber-500/80 transition-colors"
            aria-label={
              isFavorite ? "Remove from favorites" : "Add to favorites"
            }
          >
            {isFavorite ? (
              <FaHeart className="text-amber-500" />
            ) : (
              <FaRegHeart className="text-white" />
            )}
          </button>
          <button
            onClick={() => handleSave(isSaved ? "remove" : "add")}
            className="p-2 bg-gray-800/80 rounded-full hover:bg-amber-500/80 transition-colors"
            aria-label={isSaved ? "Remove from saved" : "Save gig"}
          >
            {isSaved ? (
              <FaBookmark className="text-amber-500" />
            ) : (
              <FaRegBookmark className="text-white" />
            )}
          </button>
        </div>
      )}

      {/* Gig Details */}
      <div className="p-4">
        <div className="flex justify-between items-start">
          <div>
            <Link href={`/gigs/${gig._id}`}>
              <h3 className="text-lg font-semibold text-white line-clamp-1 hover:text-amber-400 transition-colors">
                {gig.title || "Untitled Gig"}
              </h3>
            </Link>
            {gig.location && (
              <p className="text-gray-400 text-sm flex items-center mt-1">
                <MdLocationOn className="mr-1" size={14} />
                {gig.location}
              </p>
            )}
          </div>
          {gig.price && (
            <div className="text-amber-400 font-medium whitespace-nowrap">
              {gig.price} {gig.currency}
            </div>
          )}
        </div>

        {/* Categories/Tags */}
        <div className="mt-3 flex flex-wrap gap-2">
          {gig.category && (
            <span className="px-2 py-1 bg-gray-700 text-xs rounded-full text-gray-300">
              {gig.category}
            </span>
          )}
          {gig.bandCategory?.map((cat) => (
            <span
              key={cat}
              className="px-2 py-1 bg-gray-700 text-xs rounded-full text-gray-300"
            >
              {cat}
            </span>
          ))}
        </div>

        {/* Date and Time */}
        <div className="mt-4 pt-4 border-t border-gray-700">
          {gig.scheduleDate && (
            <div className="flex items-center text-sm text-gray-400 mb-2">
              <MdCalendarToday className="mr-2" size={16} />
              {formatDate(gig.scheduleDate)}
            </div>
          )}
          {gig.time && (
            <div className="flex items-center text-sm text-gray-400">
              <MdAccessTime className="mr-2" size={16} />
              {gig.time.from} - {gig.time.to}
            </div>
          )}
        </div>

        {/* More Options Menu */}
        <div className="mt-4 flex justify-end">
          <div className="relative">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="p-2 text-gray-400 hover:text-white rounded-full hover:bg-gray-700 transition-colors"
              aria-label="More options"
            >
              <FaEllipsisV />
            </button>

            {isMenuOpen && (
              <div className="absolute right-0 bottom-full mb-2 w-48 bg-gray-800 rounded-md shadow-lg border border-gray-700 z-10">
                <button
                  className="w-full text-left px-4 py-2 text-sm text-white hover:bg-gray-700 flex items-center gap-2"
                  onClick={() => {
                    navigator.clipboard.writeText(
                      window.location.origin + `/gigs/${gig._id}`
                    );
                    toast.success("Link copied to clipboard");
                    setIsMenuOpen(false);
                  }}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-4 w-4"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3"
                    />
                  </svg>
                  <span>Copy Link</span>
                </button>
                <button
                  className="w-full text-left px-4 py-2 text-sm text-red-500 hover:bg-gray-700 flex items-center gap-2"
                  onClick={() => {
                    // Implement report functionality
                    setIsMenuOpen(false);
                  }}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-4 w-4"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                    />
                  </svg>
                  <span>Report</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
