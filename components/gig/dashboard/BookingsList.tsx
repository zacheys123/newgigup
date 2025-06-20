"use client";
import { useState } from "react";
import { GigProps } from "@/types/giginterface";
import { UserProps } from "@/types/userinterfaces";
import Image from "next/image";

interface BookingsListProps {
  gigs: GigProps[];
  getRatings: (
    gigId: string,
    postedBy: UserProps
  ) => {
    average: number;
    count: number;
  } | null;
}

export default function BookingsList({ gigs, getRatings }: BookingsListProps) {
  const [expandedGig, setExpandedGig] = useState<string | null>(null);

  if (gigs.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-400">{`You haven't booked any gigs yet.`}</p>
      </div>
    );
  }

  const toggleExpand = (gigId: string) => {
    setExpandedGig(expandedGig === gigId ? null : gigId);
  };

  return (
    <div className="relative">
      {/* Scrollable container */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 pb-4 overflow-y-auto max-h-[calc(100vh-200px)]">
        {gigs.map((gig) => {
          if (!gig?._id) return null;
          const ratings = getRatings(gig._id.toString(), gig.postedBy);

          return (
            <div
              key={gig._id}
              className="bg-gray-800 rounded-lg p-4 border border-gray-700 hover:border-amber-400 transition-colors"
            >
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="text-lg font-semibold text-white line-clamp-1">
                    {gig.title}
                  </h3>
                  <p className="text-gray-400 line-clamp-1">{gig.location}</p>
                </div>
                <button
                  onClick={() =>
                    toggleExpand(gig._id ? gig._id.toString() : "")
                  }
                  className="text-gray-400 hover:text-white shrink-0"
                  aria-label="Toggle gig details"
                >
                  {expandedGig === gig._id.toString() ? (
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path
                        fillRule="evenodd"
                        d="M14.707 12.707a1 1 0 01-1.414 0L10 9.414l-3.293 3.293a1 1 0 01-1.414-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 010 1.414z"
                        clipRule="evenodd"
                      />
                    </svg>
                  ) : (
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path
                        fillRule="evenodd"
                        d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                        clipRule="evenodd"
                      />
                    </svg>
                  )}
                </button>
              </div>

              <div className="mt-2">
                <p className="text-amber-400">
                  {gig.price} {gig.currency}
                </p>
                <p className="text-sm text-gray-500">
                  {new Date(gig.scheduleDate).toLocaleDateString()}
                </p>
                {ratings ? (
                  <div className="mt-2 flex items-center">
                    <StarRating rating={ratings.average} />
                    <span className="ml-1 text-sm text-gray-400">
                      ({ratings.average} • {ratings.count} reviews)
                    </span>
                  </div>
                ) : (
                  <p className="text-sm text-gray-500 mt-2">No reviews yet</p>
                )}
              </div>

              {/* Expanded details section with scrollable content if needed */}
              {expandedGig === gig._id.toString() && (
                <div className="mt-4 pt-4 border-t border-gray-700">
                  <h4 className="font-medium text-white mb-2">Gig Details</h4>
                  <div className="max-h-[200px] overflow-y-auto pr-2">
                    <p className="text-sm text-gray-300 mb-3">
                      {gig.description}
                    </p>
                  </div>

                  <h4 className="font-medium text-white mb-2">
                    Artist Information
                  </h4>
                  <div className="flex items-center space-x-3 mb-3">
                    {gig.postedBy.picture && (
                      <Image
                        src={gig.postedBy.picture}
                        alt={
                          gig.postedBy.firstname ? gig.postedBy.firstname : ""
                        }
                        className="w-10 h-10 rounded-full object-cover"
                        height={40}
                        width={40}
                      />
                    )}
                    <div>
                      <p className="text-white line-clamp-1">
                        {gig.postedBy.firstname} {gig.postedBy.lastname}
                      </p>
                      <p className="text-sm text-gray-400 line-clamp-1">
                        {gig.postedBy.email}
                      </p>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <div>
                      <p className="text-gray-400">Category</p>
                      <p className="text-white line-clamp-1">{gig.category}</p>
                    </div>
                    <div>
                      <p className="text-gray-400">Duration</p>
                      {gig.time && (
                        <p className="text-white">
                          {gig.time.from} - {gig.time.to}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

const StarRating = ({ rating }: { rating: number }) => (
  <div className="flex">
    {[...Array(5)].map((_, i) => (
      <svg
        key={i}
        className={`w-4 h-4 ${
          i < Math.floor(rating) ? "text-amber-400" : "text-gray-600"
        }`}
        fill="currentColor"
        viewBox="0 0 20 20"
      >
        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
      </svg>
    ))}
  </div>
);
