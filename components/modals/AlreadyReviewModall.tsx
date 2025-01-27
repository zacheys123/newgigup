import useStore from "@/app/zustand/useStore";
import { GigProps } from "@/types/giginterface";
import { Review } from "@/types/userinterfaces";
import { motion } from "framer-motion";

const AlreadyReviewModal = ({
  bookedBy,
  description,
  isTaken,
  setSelectedReview,
  selectedReview,
}: GigProps & { setSelectedReview: (review: null) => void } & {
  selectedReview: Review;
}) => {
  const { setShowModal } = useStore();

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
      className="bg-white shadow-lg rounded-lg p-6 w-[280px] h-[360px] max-h-[80vh] overflow-auto absolute flex flex-col right-10 gap-4 border border-gray-200 z-50 overflow-y-auto"
    >
      <button
        className="absolute top-6 right-5 text-xl text-gray-500 hover:text-gray-700"
        onClick={() => {
          setSelectedReview(null);
          setShowModal(false);
        }}
      >
        &times;
      </button>
      <h6 className="text-xl font-semibold text-gray-800">
        {bookedBy?.firstname}
      </h6>
      <p className="text-sm text-gray-600">
        {description || "No description available"}
      </p>
      <div className="flex gap-2 mt-3">
        <div className="text-sm text-gray-500">Booked by:</div>
        <div className="text-sm text-gray-500 gigtitle">
          {bookedBy?.firstname}
        </div>
      </div>
      <div className="flex gap-2 mt-2 flex-col">
        <div className="flex gap-2">
          <div className="text-sm text-gray-500">Gig Status:</div>
          <div className="text-green-600 title">
            {isTaken ? "Taken" : "Available"}
          </div>
        </div>
        <div className="flex gap-2 mt-2">
          <div className="text-sm text-gray-500">Review:</div>
          <div className="text-sm text-gray-500 gigtitle">
            {selectedReview?.comment}
          </div>
        </div>{" "}
        <div className="text-md text-gray-500 title font-bold">
          {selectedReview?.rating}⭐Rating
        </div>
      </div>
    </motion.div>
  );
};

export default AlreadyReviewModal;
