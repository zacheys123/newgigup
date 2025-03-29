import useStore from "@/app/zustand/useStore";
import { motion } from "framer-motion";

const AlreadyReviewModal = () => {
  const { setShowModal, selectedReview, currentgig } = useStore();

  if (!selectedReview || !currentgig) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="relative bg-white dark:bg-zinc-800 rounded-xl shadow-lg w-full max-w-md mx-auto my-8 border border-gray-200 dark:border-zinc-700"
    >
      <div className="p-5 border-b border-gray-100 dark:border-zinc-700">
        <div className="flex justify-between items-center">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            Review Details
          </h3>
          <button
            className="text-gray-400 hover:text-gray-500 dark:hover:text-gray-300 transition-colors"
            onClick={() => setShowModal(false)}
          >
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>
        <p className="text-sm text-gray-500 dark:text-zinc-400 mt-1">
          {`For gig: ${currentgig?.title}`}
        </p>
      </div>

      <div className="p-5 space-y-4">
        <div className="space-y-2">
          <h4 className="text-sm font-medium text-gray-500 dark:text-zinc-400">
            Gig Description
          </h4>
          <p className="text-gray-700 dark:text-zinc-300">
            {currentgig?.description || "No description available"}
          </p>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <h4 className="text-sm font-medium text-gray-500 dark:text-zinc-400">
              Status
            </h4>
            <p
              className={`text-sm ${
                currentgig?.isTaken
                  ? "text-green-600 dark:text-green-400"
                  : "text-blue-600 dark:text-blue-400"
              }`}
            >
              {currentgig?.isTaken ? "Taken" : "Available"}
            </p>
          </div>

          <div>
            <h4 className="text-sm font-medium text-gray-500 dark:text-zinc-400">
              Rating
            </h4>
            <div className="flex items-center">
              {[...Array(5)].map((_, i) => (
                <span
                  key={i}
                  className={`text-lg ${
                    i < Math.floor(selectedReview.rating)
                      ? "text-yellow-500"
                      : "text-gray-300 dark:text-zinc-600"
                  }`}
                >
                  {i < Math.floor(selectedReview.rating) ? "★" : "☆"}
                </span>
              ))}
              <span className="text-sm text-gray-700 dark:text-zinc-300 ml-2">
                ({selectedReview.rating?.toFixed(1)})
              </span>
            </div>
          </div>
        </div>

        <div>
          <h4 className="text-sm font-medium text-gray-500 dark:text-zinc-400">
            Review Comment
          </h4>
          <p className="text-gray-700 dark:text-zinc-300 mt-1 p-3 bg-gray-50 dark:bg-zinc-700/50 rounded-lg">
            {selectedReview.comment || "No comment provided"}
          </p>
        </div>
      </div>

      <div className="p-5 border-t border-gray-100 dark:border-zinc-700 flex justify-end">
        <button
          onClick={() => setShowModal(false)}
          className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
        >
          Close
        </button>
      </div>
    </motion.div>
  );
};

export default AlreadyReviewModal;
