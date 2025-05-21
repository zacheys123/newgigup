// import { useRouter } from "next/navigation";

// const CreateLimitOverlay = ({
//   showCreateLimitOverlay,
// }: {
//   showCreateLimitOverlay: boolean;
// }) => {
//   const router = useRouter(); // Use Next.js router for navigation
//   const handleUpgradeClick = () => {
//     router.push("/dashboard/billing");
//   };

//   return (
//     showCreateLimitOverlay && (
//       <div className="fixed inset-0 flex items-center justify-center p-6 bg-gray-900 bg-opacity-30 z-50 backdrop-blur-md">
//         <span
//           className="absolute right-2 top-4 text-white text-2xl font-bold md:cursor-pointer"
//           onClick={() => {
//             window.location.reload();
//           }}
//         >
//           &times;
//         </span>
//         <div className="bg-white bg-opacity-20 p-8 rounded-2xl shadow-lg backdrop-blur-sm max-w-lg w-full transform transition-all duration-500 ease-out scale-95 hover:scale-100 animate-fadeIn">
//           <p className="text-3xl font-semibold text-gray-300 text-center ">
//             You cannot create more gigs on the Free Plan.
//           </p>
//           <p className="text-lg text-red-300 mt-6 opacity-80 text-center">
//             Upgrade to Pro to unlock more gig creation opportunities.
//           </p>
//           <div className="mt-8 flex justify-center">
//             <button
//               onClick={handleUpgradeClick}
//               className="px-6 py-3 bg-blue-500 text-white font-medium rounded-full transition duration-300 ease-in-out hover:bg-blue-400 hover:scale-105"
//             >
//               Upgrade Now
//             </button>
//           </div>
//         </div>
//       </div>
//     )
//   );
// };

// export default CreateLimitOverlay;

import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";
import { X, Zap, Gem, InfinityIcon } from "lucide-react";
import useStore from "@/app/zustand/useStore";

const CreateLimitOverlay = ({
  showCreateLimitOverlay,
}: {
  showCreateLimitOverlay: boolean;
}) => {
  const router = useRouter();
  const { setisSchedulerOpen } = useStore();
  const handleUpgradeClick = () => {
    router.push("/dashboard/billing");
  };

  return (
    <AnimatePresence>
      {showCreateLimitOverlay && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3, ease: "easeInOut" }}
          className="fixed inset-0 flex items-center justify-center p-4 z-[999]"
        >
          {/* Background overlay */}
          <motion.div
            className="absolute inset-0 bg-gradient-to-br from-gray-900/80 to-blue-900/60 backdrop-blur-lg"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          />

          {/* Main card */}
          <motion.div
            initial={{ y: 20, opacity: 0, scale: 0.95 }}
            animate={{ y: 0, opacity: 1, scale: 1 }}
            exit={{ y: 20, opacity: 0 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="relative bg-white/5 border border-white/10 rounded-2xl shadow-2xl backdrop-blur-xl max-w-md w-full overflow-hidden"
          >
            {/* Close button */}
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => showCreateLimitOverlay && setisSchedulerOpen(true)}
              className="absolute right-4 top-4 p-1 rounded-full bg-white/5 hover:bg-white/10 transition-colors"
              aria-label="Close"
            >
              <X className="w-5 h-5 text-white/80" />
            </motion.button>

            {/* Content */}
            <div className="p-8 text-center">
              <motion.div
                animate={{
                  y: [0, -5, 0],
                  transition: { repeat: Infinity, duration: 3 },
                }}
                className="mx-auto w-16 h-16 flex items-center justify-center bg-gradient-to-br from-blue-500/20 to-purple-500/20 rounded-full mb-6"
              >
                <Gem className="w-8 h-8 text-blue-300" />
              </motion.div>

              <h3 className="text-2xl font-bold text-white mb-3">
                Gig Limit Reached
              </h3>
              <p className="text-white/80 mb-6">
                {`          You've reached the maximum number of gigs on the Free Plan.
            `}{" "}
              </p>

              {/* Features comparison */}
              <div className="bg-white/5 rounded-xl p-4 mb-8 border border-white/10">
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div className="text-left">
                    <p className="font-medium text-white/70 mb-2">Free Plan</p>
                    <ul className="space-y-2">
                      <li className="flex items-center text-white/60">
                        <X className="w-4 h-4 mr-2 text-red-400" />3 Gigs Max
                      </li>
                      <li className="flex items-center text-white/60">
                        <X className="w-4 h-4 mr-2 text-red-400" />
                        Basic Features
                      </li>
                    </ul>
                  </div>
                  <div className="text-left">
                    <p className="font-medium text-blue-300 mb-2">Pro Plan</p>
                    <ul className="space-y-2">
                      <li className="flex items-center text-white/80">
                        <InfinityIcon className="w-4 h-4 mr-2 text-green-400" />
                        Unlimited Gigs
                      </li>
                      <li className="flex items-center text-white/80">
                        <Zap className="w-4 h-4 mr-2 text-yellow-400" />
                        Premium Features
                      </li>
                    </ul>
                  </div>
                </div>
              </div>

              {/* CTA Button */}
              <motion.button
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleUpgradeClick}
                className="w-full py-3 px-6 bg-gradient-to-r from-blue-500 to-purple-600 text-white font-medium rounded-lg shadow-lg hover:shadow-xl transition-all relative overflow-hidden"
              >
                <span className="relative z-10 flex items-center justify-center">
                  Upgrade to Pro <Zap className="w-4 h-4 ml-2 fill-white" />
                </span>
                <motion.span
                  initial={{ x: -100, opacity: 0 }}
                  animate={{ x: 0, opacity: 0.1 }}
                  transition={{ repeat: Infinity, duration: 3 }}
                  className="absolute inset-0 bg-gradient-to-r from-white/30 to-transparent"
                />
              </motion.button>

              <p className="text-xs text-white/50 mt-4">
                {`1 month free "1/2 limited"  Access -Upgrade to Enjoy`}
              </p>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default CreateLimitOverlay;
