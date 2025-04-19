"use client";

import React, { FormEvent, useState } from "react";
import Modal from "./Modal";

interface SubmitProps {
  onSubmit: (e: FormEvent<HTMLFormElement>) => void;
  getScheduleData: (
    type: "automatic" | "regular" | "create",
    date?: Date
  ) => void;
  isLoading?: boolean; // Added loading state prop
  isSchedulerOpen: boolean;
  setisSchedulerOpen: (isSchedulerOpen: boolean) => void;
}

const SchedulerComponent = ({
  onSubmit,
  getScheduleData,
  isLoading = false,
  isSchedulerOpen,
  setisSchedulerOpen,
}: SubmitProps) => {
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [activeOption, setActiveOption] = useState<
    "automatic" | "regular" | "create" | null
  >(null);

  const handleSubmit = (type: "automatic" | "regular" | "create") => {
    if (isLoading) return; // Prevent submission while loading

    const e = {
      preventDefault: () => {},
    } as FormEvent<HTMLFormElement>;

    if (type === "automatic" && selectedDate) {
      getScheduleData("automatic", selectedDate);
    } else {
      getScheduleData(type);
    }

    onSubmit(e);
    setisSchedulerOpen(false);
  };

  // Color configurations for each scheduler type
  const schedulerStyles = {
    automatic: {
      border: "border-blue-400",
      bg: "bg-turqoise-500",
      activeBorder: "border-blue-600",
      activeBg: "bg-blue-100",
      button:
        "bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700",
      text: "text-yellow-800",
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

  return (
    <Modal
      isOpen={isSchedulerOpen}
      onClose={() => !isLoading && setisSchedulerOpen(false)} // Prevent closing while loading
      title="Final Step: Delivery Scheduling"
      description="Select how you'd like to schedule your content delivery"
    >
      <div className="space-y-4 md:space-y-6 p-2 md:p-4 w-[210px]">
        {/* Loading overlay */}
        {isLoading && (
          <div className="absolute inset-0 bg-white bg-opacity-70 flex items-center justify-center z-10 rounded-xl">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
          </div>
        )}

        {/* Automatic Scheduling Option */}
        <div
          className={`p-4 md:p-6 border-2 rounded-xl transition-all duration-300 cursor-pointer relative ${
            isLoading ? "opacity-70 pointer-events-none" : ""
          } ${
            activeOption === "automatic"
              ? `${schedulerStyles.automatic.activeBorder} ${schedulerStyles.automatic.activeBg} shadow-lg`
              : `${schedulerStyles.automatic.border} ${schedulerStyles.automatic.bg} hover:shadow-md`
          }`}
          onClick={() => !isLoading && setActiveOption("automatic")}
        >
          <div className="flex flex-col md:flex-row md:items-center md:justify-between">
            <div className="flex-1">
              <div className="flex items-center mb-2">
                <svg
                  className={`w-5 h-5 mr-2 ${schedulerStyles.automatic.icon}`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                <h3
                  className={`text-base md:text-lg font-semibold ${schedulerStyles.automatic.text}`}
                >
                  Automatic Scheduling
                </h3>
              </div>
              <p
                className={`text-sm md:text-base ${schedulerStyles.automatic.text}`}
              >
                Set a specific date to automatically post publicly to all
                musicians.
              </p>
            </div>
            <div className="mt-2 md:mt-0 md:ml-4">
              {activeOption === "automatic" && (
                <div className="w-full">
                  <label
                    className={`block text-xs md:text-sm font-medium ${schedulerStyles.automatic.text} mb-1`}
                  >
                    Post Date
                  </label>
                  <input
                    type="datetime-local"
                    className="w-full p-2 text-xs md:text-sm border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                    onChange={(e) => setSelectedDate(new Date(e.target.value))}
                    min={new Date().toISOString().slice(0, 16)}
                    required
                    disabled={isLoading}
                  />
                </div>
              )}
            </div>
          </div>

          {activeOption === "automatic" && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                if (selectedDate) {
                  handleSubmit("automatic");
                }
              }}
              disabled={!selectedDate || isLoading}
              className={`mt-3 w-full md:w-auto px-4 py-2 text-sm md:text-base rounded-lg bg-neutral-500 text-white font-medium transition-all flex items-center justify-center ${
                selectedDate && !isLoading
                  ? `${schedulerStyles.automatic.button} shadow-md`
                  : "bg-gray-300 text-gray-500 cursor-not-allowed"
              }`}
            >
              {isLoading ? (
                <>
                  <svg
                    className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
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
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                  Processing...
                </>
              ) : (
                "Confirm Automatic Scheduling"
              )}
            </button>
          )}
        </div>

        {/* Regular Scheduling Option */}
        <div
          className={`p-4 md:p-6 border-2 rounded-xl transition-all duration-300 cursor-pointer relative ${
            isLoading ? "opacity-70 pointer-events-none" : ""
          } ${
            activeOption === "regular"
              ? `${schedulerStyles.regular.activeBorder} ${schedulerStyles.regular.activeBg} shadow-lg`
              : `${schedulerStyles.regular.border} ${schedulerStyles.regular.bg} hover:shadow-md`
          }`}
          onClick={() => !isLoading && setActiveOption("regular")}
        >
          <div className="flex flex-col md:flex-row md:items-center md:justify-between">
            <div className="flex-1">
              <div className="flex items-center mb-2">
                <svg
                  className={`w-5 h-5 mr-2 ${schedulerStyles.regular.icon}`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                  />
                </svg>
                <h3
                  className={`text-base md:text-lg font-semibold ${schedulerStyles.regular.text}`}
                >
                  Regular Scheduling
                </h3>
              </div>
              <p
                className={`text-sm md:text-base ${schedulerStyles.regular.text}`}
              >
                By choosing this scheduler the gig will be created but disabled
                untill you activate it.
              </p>
            </div>
            {activeOption === "regular" && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleSubmit("regular");
                }}
                disabled={isLoading}
                className={`mt-2 md:mt-0 w-full md:w-auto px-4 py-2 text-sm md:text-base rounded-lg bg-amber-700 text-white font-medium transition-all flex items-center justify-center ${schedulerStyles.regular.button} shadow-md`}
              >
                {isLoading ? (
                  <>
                    <svg
                      className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
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
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      ></path>
                    </svg>
                    Processing...
                  </>
                ) : (
                  "Use Regular Scheduling"
                )}
              </button>
            )}
          </div>
        </div>

        {/* Immediate Creation Option */}
        <div
          className={`p-4 md:p-6 border-2 rounded-xl transition-all duration-300 cursor-pointer relative ${
            isLoading ? "opacity-70 pointer-events-none" : ""
          } ${
            activeOption === "create"
              ? `${schedulerStyles.create.activeBorder} ${schedulerStyles.create.activeBg} shadow-lg`
              : `${schedulerStyles.create.border} ${schedulerStyles.create.bg} hover:shadow-md`
          }`}
          onClick={() => !isLoading && setActiveOption("create")}
        >
          <div className="flex flex-col md:flex-row md:items-center md:justify-between">
            <div className="flex-1">
              <div className="flex items-center mb-2">
                <svg
                  className={`w-5 h-5 mr-2 ${schedulerStyles.create.icon}`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                  />
                </svg>
                <h3
                  className={`text-base md:text-lg font-semibold ${schedulerStyles.create.text}`}
                >
                  Immediate Creation
                </h3>
              </div>
              <p
                className={`text-sm md:text-base ${schedulerStyles.create.text}`}
              >
                Create gig immediately without scheduling for future
                posting/update.
              </p>
            </div>
            {activeOption === "create" && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleSubmit("create");
                }}
                disabled={isLoading}
                className={`mt-2 md:mt-0 w-full md:w-auto px-4 py-2 text-sm md:text-base bg-blue-700 rounded-lg text-white font-medium transition-all flex items-center justify-center ${schedulerStyles.create.button} shadow-md`}
              >
                {isLoading ? (
                  <>
                    <svg
                      className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
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
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      ></path>
                    </svg>
                    Processing...
                  </>
                ) : (
                  "Create Gig"
                )}
              </button>
            )}
          </div>
        </div>
      </div>
    </Modal>
  );
};

export default SchedulerComponent;
