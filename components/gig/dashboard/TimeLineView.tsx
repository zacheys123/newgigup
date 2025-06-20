"use client";
import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  FiCalendar,
  FiClock,
  FiMapPin,
  FiDollarSign,
  FiUser,
  FiInfo,
  FiMusic,
  FiCheckCircle,
  FiXCircle,
  FiChevronRight,
  FiChevronDown,
  FiTrash2,
  FiX,
} from "react-icons/fi";
import Image from "next/image";
import type { BookingHistoryItem } from "@/types/history";
import LoadingSpinner from "@/components/LoadingSpinner";

interface TimelineViewProps {
  gigs: BookingHistoryItem[];
  onDelete: (ids: string[]) => Promise<void>;
}

export default function TimelineView({ gigs, onDelete }: TimelineViewProps) {
  const [expandedGig, setExpandedGig] = useState<string | null>(null);
  const gigRefs = useRef<{ [key: string]: HTMLDivElement | null }>({});
  const [selectedGigs, setSelectedGigs] = useState<string[]>([]);
  const [isDeleting, setIsDeleting] = useState(false);
  const [selectAll, setSelectAll] = useState(false);
  const setGigRef = (id: string) => (el: HTMLDivElement | null) => {
    gigRefs.current[id] = el;
  };
  const toggleSelectGig = (gigId: string) => {
    setSelectedGigs((prev) =>
      prev.includes(gigId)
        ? prev.filter((id) => id !== gigId)
        : [...prev, gigId]
    );
  };
  const handleSelectAll = () => {
    if (selectAll) {
      setSelectedGigs([]);
    } else {
      setSelectedGigs(gigs.map((gig) => gig._id));
    }
    setSelectAll(!selectAll);
  };

  useEffect(() => {
    if (selectedGigs.length === gigs.length && gigs.length > 0) {
      setSelectAll(true);
    } else {
      setSelectAll(false);
    }
  }, [selectedGigs, gigs]);
  const handleDelete = async (gigId: string) => {
    setIsDeleting(true);
    try {
      await onDelete([gigId]);
      setSelectedGigs((prev) => prev.filter((id) => id !== gigId));
      // Close the expanded view if the deleted gig is currently expanded
      if (expandedGig === gigId) {
        setExpandedGig(null);
      }
    } catch (error) {
      console.error("Failed to delete gig:", error);
      // You might want to add error handling UI here
    } finally {
      setIsDeleting(false);
    }
  };

  const handleMultiDelete = async () => {
    if (selectedGigs.length === 0) return;

    // Add confirmation dialog
    const confirmed = window.confirm(
      `Are you sure you want to delete ${selectedGigs.length} selected gig(s)? This action cannot be undone.`
    );

    if (!confirmed) return;

    setIsDeleting(true);
    try {
      await onDelete(selectedGigs);
      setSelectedGigs([]);
      setSelectAll(false);
      if (expandedGig && selectedGigs.includes(expandedGig)) {
        setExpandedGig(null);
      }
    } catch (error) {
      console.error("Failed to delete gigs:", error);
      // Consider adding a toast notification here
    } finally {
      setIsDeleting(false);
    }
  };

  // Handle multi-delete

  const handleToggle = (gigId: string) => {
    const isExpanding = expandedGig !== gigId;
    setExpandedGig(isExpanding ? gigId : null);

    if (isExpanding && gigRefs.current[gigId]) {
      setTimeout(() => {
        gigRefs.current[gigId]?.scrollIntoView({
          behavior: "smooth",
          block: "nearest",
        });
      }, 100); // Small delay to allow animation to start
    }
  };

  const renderDeleteButton = (gigId: string) => (
    <button
      onClick={(e) => {
        e.stopPropagation();
        handleDelete(gigId);
      }}
      className={`text-red-400 hover:text-red-500 transition-colors p-1 ${
        isDeleting ? "opacity-50 cursor-not-allowed" : ""
      }`}
      disabled={isDeleting}
      aria-label="Delete gig"
    >
      {isDeleting && selectedGigs.includes(gigId) ? (
        <LoadingSpinner />
      ) : (
        <FiTrash2 size={18} />
      )}
    </button>
  );

  const renderCheckbox = (gigId: string) => (
    <div
      onClick={(e) => e.stopPropagation()}
      className="flex items-center mr-2"
    >
      <input
        type="checkbox"
        checked={selectedGigs.includes(gigId)}
        onChange={() => toggleSelectGig(gigId)}
        className="h-4 w-4 rounded border-gray-300 text-amber-500 focus:ring-amber-500"
      />
    </div>
  );

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "completed":
        return (
          <span className="bg-emerald-500/10 text-emerald-400 px-2 py-1 rounded-full text-xs flex items-center">
            <FiCheckCircle className="mr-1" /> Completed
          </span>
        );
      case "booked":
        return (
          <span className="bg-blue-500/10 text-blue-400 px-2 py-1 rounded-full text-xs flex items-center">
            <FiCheckCircle className="mr-1" /> Booked
          </span>
        );
      case "pending":
        return (
          <span className="bg-amber-500/10 text-amber-400 px-2 py-1 rounded-full text-xs flex items-center">
            <FiInfo className="mr-1" /> Pending
          </span>
        );
      case "cancelled":
        return (
          <span className="bg-red-500/10 text-red-400 px-2 py-1 rounded-full text-xs flex items-center">
            <FiXCircle className="mr-1" /> Cancelled
          </span>
        );
      default:
        return null;
    }
  };

  const getPaymentBadge = (paymentStatus?: string) => {
    switch (paymentStatus) {
      case "paid":
        return (
          <span className="bg-green-500/10 text-green-400 px-2 py-1 rounded-full text-xs">
            Paid
          </span>
        );
      case "pending":
        return (
          <span className="bg-amber-500/10 text-amber-400 px-2 py-1 rounded-full text-xs">
            Pending
          </span>
        );
      case "refunded":
        return (
          <span className="bg-blue-500/10 text-blue-400 px-2 py-1 rounded-full text-xs">
            Refunded
          </span>
        );
      default:
        return (
          <span className="bg-blue-500/10 text-blue-400 px-2 py-1 rounded-full text-xs">
            N/A
          </span>
        );
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      weekday: "short",
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  return (
    <div className="relative">
      {/* Timeline line */}
      {selectedGigs.length > 0 ? (
        <div className="sticky top-0 z-20 bg-gray-800 p-3 mb-4 rounded-lg shadow-lg flex justify-between items-center">
          <div className="flex items-center space-x-4">
            <div className="flex items-center">
              <input
                type="checkbox"
                checked={selectAll}
                onChange={handleSelectAll}
                className="h-4 w-4 rounded border-gray-300 text-amber-500 focus:ring-amber-500 mr-2"
              />
              <span className="text-gray-300">
                {selectedGigs.length} selected
              </span>
            </div>
            <button
              onClick={handleMultiDelete}
              disabled={isDeleting || selectedGigs.length === 0}
              className={`flex items-center ${
                selectedGigs.length === 0
                  ? "bg-gray-600/30 text-gray-500 cursor-not-allowed"
                  : "bg-red-500/20 text-red-400 hover:bg-red-500/30"
              } px-3 py-1 rounded-md transition-colors`}
            >
              {isDeleting ? (
                <>
                  <LoadingSpinner />
                  Deleting...
                </>
              ) : (
                <>
                  Delete Selected ({selectedGigs.length})
                  <FiTrash2 className="ml-2" />
                </>
              )}
            </button>
          </div>
          <button
            onClick={() => {
              setSelectedGigs([]);
              setSelectAll(false);
            }}
            className="text-gray-400 hover:text-gray-200"
          >
            <FiX size={20} />
          </button>
        </div>
      ) : (
        <div className="sticky top-0 z-10 bg-gray-900/80 backdrop-blur-sm p-3 mb-4 rounded-lg flex justify-between items-center">
          <div className="flex items-center">
            <input
              type="checkbox"
              checked={selectAll}
              onChange={handleSelectAll}
              className="h-4 w-4 rounded border-gray-300 text-amber-500 focus:ring-amber-500 mr-2"
            />
            <span className="text-gray-400 text-sm">
              {selectAll ? "All selected" : "Select all"}
            </span>
          </div>
          <span className="text-gray-400 text-sm">
            {gigs.length} gigs total
          </span>
        </div>
      )}
      <div className="absolute left-8 top-0 h-full w-0.5 bg-gradient-to-b from-gray-700 via-gray-600 to-gray-700" />

      <div className="space-y-8">
        {gigs.map((gig) => (
          <motion.div
            key={gig._id}
            ref={setGigRef(gig._id)}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3 }}
            className="relative pl-16"
          >
            {/* Timeline dot */}
            <div
              className={`absolute left-0 top-6 w-4 h-4 rounded-full border-4 border-gray-900 z-10 ${
                gig.status === "completed"
                  ? "bg-emerald-400"
                  : gig.status === "booked"
                  ? "bg-blue-400"
                  : gig.status === "pending"
                  ? "bg-amber-400"
                  : "bg-red-400"
              }`}
            />

            <motion.div
              layout
              className={`bg-gray-800/70 backdrop-blur-sm rounded-xl border ${
                selectedGigs.includes(gig._id)
                  ? "border-amber-400/40 ring-2 ring-amber-400/20"
                  : gig.status === "completed"
                  ? "border-emerald-400/20"
                  : gig.status === "booked"
                  ? "border-blue-400/20"
                  : gig.status === "pending"
                  ? "border-amber-400/20"
                  : "border-red-400/20"
              } overflow-hidden transition-all duration-200 shadow-lg`}
            >
              <div
                onClick={() => handleToggle(gig._id)}
                className="w-full flex items-start justify-between p-6 hover:bg-gray-700/30 transition-colors text-left cursor-pointer"
              >
                {renderCheckbox(gig._id)}
                <div className="flex-1">
                  <div className="flex items-start justify-between">
                    <h3 className="text-xl font-semibold text-white">
                      {gig.gigId.title}
                    </h3>
                    <div className="flex space-x-2">
                      {getStatusBadge(gig.status)}
                      {getPaymentBadge(gig.gigId.paymentStatus)}
                      {renderDeleteButton(gig._id)}
                    </div>
                  </div>

                  <div className="mt-3 grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="flex items-center text-gray-300">
                      <FiCalendar className="mr-2 text-amber-400" />
                      <span>{formatDate(gig.gigId.scheduleDate)}</span>
                    </div>
                    {gig.gigId.time && (
                      <div className="flex items-center text-gray-300">
                        <FiClock className="mr-2 text-amber-400" />
                        <span>
                          {gig.gigId.time.from} - {gig.gigId.time.to}
                        </span>
                      </div>
                    )}
                    {gig.gigId.location && (
                      <div className="flex items-center text-gray-300">
                        <FiMapPin className="mr-2 text-amber-400" />
                        <span>{gig.gigId.location}</span>
                      </div>
                    )}
                  </div>
                </div>
                <div className="ml-4">
                  {expandedGig === gig._id ? (
                    <FiChevronDown className="text-gray-400" />
                  ) : (
                    <FiChevronRight className="text-gray-400" />
                  )}
                </div>
              </div>
              <AnimatePresence>
                {expandedGig === gig._id && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "500px" }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.3 }}
                    className="px-6 pb-6"
                  >
                    {/* Scrollable container */}
                    <div className="h-full overflow-y-auto pr-2 space-y-4">
                      {/* Content container with padding to prevent content from touching scrollbar */}
                      <div className="pr-2 space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <div className="space-y-4">
                            <div className="bg-gray-700/50 p-4 rounded-lg">
                              <h4 className="flex items-center text-sm font-medium text-gray-300 mb-2">
                                <FiUser className="mr-2 text-amber-400" />
                                {gig.role === "musician"
                                  ? "Client"
                                  : "Musician"}{" "}
                                Details
                              </h4>
                              <div className="flex items-center space-x-3">
                                {gig.gigId.postedBy?.picture && (
                                  <Image
                                    src={gig.gigId.postedBy.picture}
                                    alt={gig.gigId.postedBy.username || "User"}
                                    className="w-10 h-10 rounded-full object-cover"
                                    width={40}
                                    height={40}
                                  />
                                )}
                                <div>
                                  <p className="text-white">
                                    {gig.gigId.postedBy?.username ||
                                      "Unknown User"}
                                  </p>
                                  <p className="text-gray-400 text-sm">
                                    {gig.gigId.postedBy?.email ||
                                      "No email provided"}
                                  </p>
                                </div>
                              </div>
                            </div>

                            {gig.notes && (
                              <div className="bg-gray-700/50 p-4 rounded-lg">
                                <h4 className="flex items-center text-sm font-medium text-gray-300 mb-2">
                                  <FiInfo className="mr-2 text-amber-400" />
                                  Booking Notes
                                </h4>
                                <p className="text-gray-300">{gig.notes}</p>
                              </div>
                            )}

                            {gig.gigId.description && (
                              <div className="bg-gray-700/50 p-4 rounded-lg">
                                <h4 className="flex items-center text-sm font-medium text-gray-300 mb-2">
                                  <FiInfo className="mr-2 text-amber-400" />
                                  Event Description
                                </h4>
                                <p className="text-gray-300">
                                  {gig.gigId.description}
                                </p>
                              </div>
                            )}
                          </div>

                          <div className="space-y-4">
                            <div className="bg-gray-700/50 p-4 rounded-lg">
                              <h4 className="flex items-center text-sm font-medium text-gray-300 mb-2">
                                <FiDollarSign className="mr-2 text-amber-400" />
                                Payment Details
                              </h4>
                              <div className="grid grid-cols-2 gap-3">
                                <div>
                                  <p className="text-xs text-gray-400">
                                    Amount
                                  </p>
                                  <p className="text-white">
                                    {gig.gigId.price || "N/A"}{" "}
                                    {gig.gigId.currency || ""}
                                  </p>
                                </div>
                                <div>
                                  <p className="text-xs text-gray-400">
                                    Status
                                  </p>
                                  {getPaymentBadge(gig.gigId.paymentStatus)}
                                </div>
                                <div>
                                  <p className="text-xs text-gray-400">
                                    Booking Date
                                  </p>
                                  <p className="text-white">
                                    {formatDate(gig.date)}
                                  </p>
                                </div>
                              </div>
                            </div>

                            <div className="bg-gray-700/50 p-4 rounded-lg">
                              <h4 className="flex items-center text-sm font-medium text-gray-300 mb-2">
                                <FiMusic className="mr-2 text-amber-400" />
                                Performance Details
                              </h4>
                              <div className="grid grid-cols-2 gap-3">
                                <div>
                                  <p className="text-xs text-gray-400">Genre</p>
                                  <p className="text-white">
                                    {gig.gigId.djGenre ||
                                      gig.gigId.vocalistGenre?.join(", ") ||
                                      "N/A"}
                                  </p>
                                </div>
                                <div>
                                  <p className="text-xs text-gray-400">
                                    Equipment
                                  </p>
                                  <p className="text-white">
                                    {gig.gigId.djEquipment || "Standard"}
                                  </p>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>

                        {gig.status === "cancelled" &&
                          gig.gigId.cancellationReason && (
                            <div className="bg-red-500/10 border border-red-500/20 p-4 rounded-lg">
                              <h4 className="text-sm font-medium text-red-400 mb-1">
                                Cancellation Reason
                              </h4>
                              <p className="text-red-300">
                                {gig.gigId.cancellationReason}
                              </p>
                            </div>
                          )}

                        <div className="mt-4">
                          <h4 className="text-sm font-medium text-gray-300 mb-2">
                            Booking Status Timeline
                          </h4>
                          <div className="flex items-center space-x-2">
                            <span
                              className={`px-2 py-1 rounded-full text-xs ${
                                [
                                  "pending",
                                  "booked",
                                  "completed",
                                  "cancelled",
                                ].includes(gig.status)
                                  ? "bg-blue-500/10 text-blue-400"
                                  : "bg-gray-500/10 text-gray-400"
                              }`}
                            >
                              Applied
                            </span>
                            <FiChevronRight className="text-gray-400" />
                            <span
                              className={`px-2 py-1 rounded-full text-xs ${
                                ["booked", "completed"].includes(gig.status)
                                  ? "bg-blue-500/10 text-blue-400"
                                  : "bg-gray-500/10 text-gray-400"
                              }`}
                            >
                              Booked
                            </span>
                            {gig.status === "completed" && (
                              <>
                                <FiChevronRight className="text-gray-400" />
                                <span className="px-2 py-1 rounded-full text-xs bg-emerald-500/10 text-emerald-400">
                                  Completed
                                </span>
                              </>
                            )}
                            {gig.status === "cancelled" && (
                              <>
                                <FiChevronRight className="text-gray-400" />
                                <span className="px-2 py-1 rounded-full text-xs bg-red-500/10 text-red-400">
                                  Cancelled
                                </span>
                              </>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
