import React from "react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";

interface LoadingProps {
  loadingState: "loading" | "timeout" | "not-found" | "ready";
}

const GameLoadingPage = ({ loadingState }: LoadingProps) => {
  const router = useRouter();

  if (loadingState === "ready") {
    return null;
  }

  return (
    <motion.div
      className="fixed inset-0 bg-gradient-to-br from-gray-900 to-purple-900 flex items-center justify-center p-4 z-50"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
    >
      {/* Animated background */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-purple-900/20 to-gray-900/80"></div>
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-1/4 left-1/4 w-32 h-32 rounded-full bg-purple-500 blur-3xl"></div>
          <div className="absolute bottom-1/3 right-1/4 w-40 h-40 rounded-full bg-indigo-500 blur-3xl"></div>
        </div>
      </div>

      {/* Loading card */}
      <motion.div
        className="relative bg-gray-800/80 backdrop-blur-lg rounded-2xl p-8 w-full max-w-md shadow-2xl border border-gray-700/50 overflow-hidden"
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.1 }}
      >
        {/* Glow effect */}
        <div className="absolute -inset-1 bg-purple-500/10 rounded-2xl blur-md"></div>

        {/* Loading content */}
        <div className="relative z-10 text-center">
          {/* Loading State */}
          {loadingState === "loading" && (
            <>
              <div className="flex justify-center mb-6">
                <motion.div
                  className="w-16 h-16 rounded-full border-4 border-purple-500 border-t-transparent"
                  animate={{ rotate: 360 }}
                  transition={{
                    duration: 1,
                    repeat: Infinity,
                    ease: "linear",
                  }}
                />
              </div>
              <motion.h2
                className="text-2xl font-bold text-white mb-2"
                initial={{ y: -10, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.2 }}
              >
                Preparing Your Quiz
              </motion.h2>
              <motion.p
                className="text-gray-400 mb-6"
                initial={{ y: -10, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.3 }}
              >
                Loading questions and resources...
              </motion.p>
              <motion.div
                className="w-full bg-gray-700 rounded-full h-2"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4 }}
              >
                <motion.div
                  className="h-full bg-gradient-to-r from-purple-500 to-indigo-500 rounded-full"
                  initial={{ width: 0 }}
                  animate={{ width: "65%" }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    repeatType: "reverse",
                  }}
                />
              </motion.div>
            </>
          )}

          {/* Timeout State */}
          {loadingState === "timeout" && (
            <>
              <div className="mb-6">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-red-500/20 text-red-400">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <circle cx="12" cy="12" r="10"></circle>
                    <line x1="12" y1="8" x2="12" y2="12"></line>
                    <line x1="12" y1="16" x2="12.01" y2="16"></line>
                  </svg>
                </div>
              </div>
              <h2 className="text-2xl font-bold text-white mb-2">
                Loading Timeout
              </h2>
              <p className="text-gray-400 mb-6">
                The quiz is taking longer than expected to load.
              </p>
              <div className="grid grid-cols-2 gap-4">
                <motion.button
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => window.location.reload()}
                  className="px-6 py-3 bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-xl hover:from-purple-700 hover:to-indigo-700 transition-all font-medium shadow-lg"
                >
                  Try Again
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => router.push("/game")}
                  className="px-6 py-3 bg-gray-700/50 border border-gray-600 text-gray-200 rounded-xl hover:bg-gray-700 transition-all font-medium shadow-lg"
                >
                  Choose Topic
                </motion.button>
              </div>
            </>
          )}

          {/* Not Found State */}
          {loadingState === "not-found" && (
            <>
              <div className="mb-6">
                <motion.div
                  className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-purple-500/20 text-purple-400"
                  animate={{
                    rotate: [0, 10, -10, 0],
                    scale: [1, 1.1, 1],
                  }}
                  transition={{
                    duration: 1.5,
                    repeat: Infinity,
                  }}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path>
                    <line x1="12" y1="9" x2="12" y2="13"></line>
                    <line x1="12" y1="17" x2="12.01" y2="17"></line>
                  </svg>
                </motion.div>
              </div>
              <h2 className="text-2xl font-bold text-white mb-2">
                Topic Not Found
              </h2>
              <p className="text-gray-400 mb-6">
                {`We couldn't find the quiz you requested.`}
              </p>
              <div className="flex justify-center">
                <motion.div
                  className="flex items-center space-x-2 text-purple-400"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.3 }}
                >
                  <span>Redirecting</span>
                  <div className="flex space-x-1">
                    {[...Array(3)].map((_, i) => (
                      <motion.span
                        key={i}
                        animate={{ y: [0, -5, 0] }}
                        transition={{
                          duration: 1,
                          repeat: Infinity,
                          delay: i * 0.2,
                        }}
                        className="block w-2 h-2 bg-purple-400 rounded-full"
                      />
                    ))}
                  </div>
                </motion.div>
              </div>
            </>
          )}
        </div>
      </motion.div>
    </motion.div>
  );
};

export default GameLoadingPage;
