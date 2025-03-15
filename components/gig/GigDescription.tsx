import React from "react";
import { GigProps } from "@/types/giginterface";
import { motion } from "framer-motion";
import useStore from "@/app/zustand/useStore";
import { Box } from "@mui/material";
import { X } from "lucide-react"; // Modern close icon

interface DescriptionProps {
  gig: GigProps;
}

const GigDescription = ({ gig }: DescriptionProps) => {
  const { setIsDescriptionModal } = useStore();

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-md">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        transition={{ duration: 0.4, ease: "easeInOut" }}
        className="relative bg-gray-900 text-white w-[300px] md:w-[450px] lg:w-[550px] rounded-lg shadow-lg p-5"
      >
        {/* Close Button */}
        <button
          onClick={() => setIsDescriptionModal(false)}
          className="absolute top-3 right-3 text-gray-400 hover:text-gray-200 transition duration-300"
        >
          <X size={20} />
        </button>

        {/* Modal Header */}
        <h2 className="text-lg font-medium text-center text-blue-400 mb-3">
          Gig Details
        </h2>

        <Box className="space-y-2">
          {/* Gig Type */}
          <div className="flex items-center text-sm">
            <span className="font-medium text-gray-300">Gig Type:</span>
            <span className="ml-2 text-blue-300">{gig?.bussinesscat}</span>
          </div>

          {/* Time */}
          <div className="flex items-center text-sm">
            <span className="font-medium text-gray-300">Time:</span>
            <span className="ml-2 text-blue-300">
              {gig?.time?.from} - {gig?.time?.to}
            </span>
          </div>

          {/* Contact (Blurred for privacy) */}
          <div className="flex items-center text-sm">
            <span className="font-medium text-gray-300">Contact:</span>
            <span className="ml-2 text-blue-300 blur-sm">{gig?.phone}</span>
          </div>

          {/* Pay */}
          <div className="flex items-center text-sm">
            <span className="font-medium text-gray-300">Pay:</span>
            <span className="ml-2 text-blue-300">{gig?.price}</span>
          </div>

          {/* Description */}
          <div className="text-sm">
            <span className="font-medium text-gray-300">Description:</span>
            <p className="text-blue-300 mt-1 line-clamp-4">
              {gig?.description}
            </p>
          </div>

          {/* Posted By */}
          <div className="text-sm">
            <span className="font-medium text-gray-300">Posted By:</span>
            <span className="ml-2 text-blue-300">{gig?.postedBy?.email}</span>
          </div>
          <div className="text-sm">
            <span className="font-medium text-gray-300">Username:</span>
            <span className="ml-2 text-blue-300">
              {gig?.postedBy?.username}
            </span>
          </div>

          {/* Band Category */}
          {gig?.bussinesscat === "personal" && gig?.category && (
            <div className="text-sm">
              <span className="font-medium text-gray-300">Instrument:</span>
              <span className="ml-2 text-blue-300">{gig?.category}</span>
            </div>
          )}

          {gig?.bussinesscat === "full" && (
            <div className="text-sm text-gray-300">
              <span className="font-medium">Full Band Required</span>{" "}
              (Vocalists, Instrumentalists, etc.)
            </div>
          )}

          {gig?.bussinesscat === "other" &&
            gig?.bandCategory &&
            gig?.bandCategory?.length > 0 && (
              <div className="text-sm">
                <h6 className="text-gray-300 font-medium underline">
                  Band Selection
                </h6>
                <ul className="list-disc list-inside text-blue-300">
                  {gig.bandCategory.map((band, idx) => (
                    <li key={idx}>{band}</li>
                  ))}
                </ul>
              </div>
            )}
        </Box>
      </motion.div>
    </div>
  );
};

export default GigDescription;
