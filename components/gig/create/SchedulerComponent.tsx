"use client";

import React, { FormEvent, useState, useEffect } from "react";
import Modal from "./Modal";
import { useSubscription } from "@/hooks/useSubscription";
import { useUser } from "@clerk/nextjs";
import { useAllGigs } from "@/hooks/useAllGigs"; // Assuming this is the hook to get gigs
import { GigProps } from "@/types/giginterface";
import CreateLimitOverlay from "./CreateLimitOverlay";

interface SubmitProps {
  onSubmit: (e: FormEvent<HTMLFormElement>) => void;
  getScheduleData: (
    type: "automatic" | "regular" | "create",
    date?: Date
  ) => void;
  isLoading?: boolean;
  isSchedulerOpen: boolean;
  setisSchedulerOpen: (isSchedulerOpen: boolean) => void;
}

type TypeProps = {
  type: "automatic" | "regular" | "create";
};

const SchedulerComponent = ({
  onSubmit,
  getScheduleData,
  isLoading = false,
  isSchedulerOpen,
  setisSchedulerOpen,
}: SubmitProps) => {
  const { user } = useUser();
  const { subscription } = useSubscription(user?.id as string);
  const { gigs } = useAllGigs(); // Get all gigs
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [activeOption, setActiveOption] = useState<
    "automatic" | "regular" | "create" | null
  >(null);

  // Filter gigs created by the logged-in user
  const userGigs = gigs.filter(
    (gig: GigProps) => gig.postedBy?.clerkId === user?.id
  );

  const isSubscribed = subscription?.subscription?.isPro;
  const canCreateGig = isSubscribed || userGigs.length < 3; // Free users can create up to 3 gigs
  console.log(isSubscribed);
  // Show overlay if the user can't create more gigs
  const showCreateLimitOverlay = !canCreateGig && !isSubscribed;

  const handleSubmit = (type: "automatic" | "regular" | "create") => {
    if (isLoading || (!isSubscribed && type !== "create")) return;

    const e = { preventDefault: () => {} } as FormEvent<HTMLFormElement>;

    if (type === "automatic" && selectedDate) {
      getScheduleData("automatic", selectedDate);
    } else {
      getScheduleData(type);
    }

    onSubmit(e);
    setisSchedulerOpen(false);
  };

  const schedulerStyles = {
    automatic: {
      border: "border-blue-400",
      bg: "bg-turqoise-500",
      activeBorder: "border-blue-600",
      activeBg: "bg-blue-100",
      button:
        "bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700",
      text: "text-yellow-500",
      icon: "text-blue-500",
    },
    regular: {
      border: "border-emerald-400",
      bg: "bg-emerald-50",
      activeBorder: "border-emerald-600",
      activeBg: "bg-emerald-100",
      button:
        "bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700",
      text: "text-emerald-800",
      icon: "text-emerald-500",
    },
    create: {
      border: "border-amber-400",
      bg: "bg-amber-50",
      activeBorder: "border-amber-600",
      activeBg: "bg-amber-100",
      button:
        "bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700",
      text: "text-amber-800",
      icon: "text-amber-500",
    },
  };

  const SubscriptionOverlay = (type: TypeProps) =>
    !isSubscribed && (
      <div className="absolute inset-0 bg-white bg-opacity-50 backdrop-blur-lg z-20 flex items-center justify-center rounded-xl text-center p-6">
        <div className="bg-white bg-opacity-30 p-4 rounded-xl shadow-lg backdrop-blur-sm max-w-xs w-full">
          <p className="text-sm font-semibold text-red-400">
            Upgrade to Pro to {type.type} scheduling options.
          </p>
          <p className="text-xs text-white mt-2">
            Unlock more features with a Pro subscription.
          </p>
        </div>
      </div>
    );

  const optionsToRender: ("automatic" | "regular" | "create")[] = [
    "automatic",
    "regular",
    "create",
  ];

  useEffect(() => {
    if (showCreateLimitOverlay) {
      // Here you can show the overlay when the page loads if the user is on a free plan
    }
  }, [showCreateLimitOverlay]);

  return (
    <Modal
      isOpen={isSchedulerOpen}
      onClose={() => !isLoading && setisSchedulerOpen(false)}
      title="Final Step: Delivery Scheduling"
      description="Select how you'd like to schedule your content delivery"
    >
      <div className="space-y-4 md:space-y-6 p-2 md:p-4 w-full relative">
        {isLoading && (
          <div className="absolute inset-0 bg-white bg-opacity-70 flex items-center justify-center z-30 rounded-xl">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
          </div>
        )}

        <CreateLimitOverlay showCreateLimitOverlay={showCreateLimitOverlay} />

        {optionsToRender.map((type) => {
          const isActive = activeOption === type;
          const styles = schedulerStyles[type];
          const isDisabled =
            !isSubscribed && type !== "create" && !canCreateGig;

          const handleCardClick = () => {
            if (!isDisabled) setActiveOption(type);
          };

          const commonButton = (
            <button
              onClick={(e) => {
                e.stopPropagation();
                if (type === "automatic" && !selectedDate) return;
                handleSubmit(type);
              }}
              disabled={
                isDisabled ||
                isLoading ||
                (type === "automatic" && !selectedDate)
              }
              className={`mt-3 w-full md:w-auto px-4 py-2 text-sm md:text-base rounded-lg text-white font-medium transition-all flex items-center justify-center ${
                !isDisabled && (type === "automatic" ? selectedDate : true)
                  ? `${styles.button} shadow-md`
                  : "bg-gray-300 text-gray-500 cursor-not-allowed"
              }`}
            >
              {isLoading ? (
                <>
                  <svg
                    className="animate-spin -ml-1 mr-2 h-4 w-4"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    />
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    />
                  </svg>
                  Processing...
                </>
              ) : type === "automatic" ? (
                "Confirm Automatic Scheduling"
              ) : type === "regular" ? (
                "Use Regular Scheduling"
              ) : (
                "Create Gig"
              )}
            </button>
          );

          return (
            <div
              key={type}
              className={`p-4 md:p-6 border-2 rounded-xl transition-all duration-300 cursor-pointer relative ${
                isActive
                  ? `${styles.activeBorder} ${styles.activeBg} shadow-lg`
                  : `${styles.border} ${styles.bg} hover:shadow-md`
              } ${isDisabled ? "opacity-50 pointer-events-none" : ""}`}
              onClick={handleCardClick}
            >
              <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                <div className="flex-1">
                  <div className="flex items-center mb-2">
                    <svg
                      className={`w-5 h-5 mr-2 ${styles.icon}`}
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      {type === "automatic" && (
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                        />
                      )}
                      {type === "regular" && (
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                        />
                      )}
                      {type === "create" && (
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                        />
                      )}
                    </svg>
                    <h3
                      className={`text-base md:text-lg font-semibold ${styles.text}`}
                    >
                      {type === "automatic"
                        ? "Automatic Scheduling"
                        : type === "regular"
                        ? "Regular Scheduling"
                        : "Immediate Creation"}
                    </h3>
                  </div>
                  <p className={`text-sm md:text-base ${styles.text}`}>
                    {type === "automatic"
                      ? "Set a specific date to automatically post publicly."
                      : type === "regular"
                      ? "Gig will be created but disabled until you activate it."
                      : "Create gig immediately without scheduling."}
                  </p>
                </div>

                {isActive && type === "automatic" && (
                  <div className="mt-2 md:mt-0 md:ml-4 w-full md:w-auto">
                    <label
                      className={`block text-xs md:text-sm font-medium ${styles.text} mb-1`}
                    >
                      Post Date
                    </label>
                    <input
                      type="datetime-local"
                      className="w-full p-2 text-xs md:text-sm border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                      onChange={(e) =>
                        setSelectedDate(new Date(e.target.value))
                      }
                      min={new Date().toISOString().slice(0, 16)}
                      required
                      disabled={isDisabled}
                    />
                  </div>
                )}

                {isActive && commonButton}
                {!isSubscribed && type !== "create" && (
                  <SubscriptionOverlay type={type} />
                )}
              </div>
            </div>
          );
        })}
      </div>
    </Modal>
  );
};

export default SchedulerComponent;
