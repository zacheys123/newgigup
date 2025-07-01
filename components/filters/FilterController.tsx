// components/filters/FilterController.tsx
"use client";

import React, { useState } from "react";
import FilterPanel from "./FilterPanel";
import { AnimatePresence, motion } from "framer-motion";
import { FiFilter } from "react-icons/fi";

const FilterController = ({
  activeFilterCount,
}: {
  activeFilterCount: number;
}) => {
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  return (
    <>
      <AnimatePresence>
        {!isFilterOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            transition={{ type: "spring", stiffness: 300, damping: 20 }}
            className="fixed bottom-6 right-6 z-40"
          >
            <button
              onClick={() => setIsFilterOpen(true)}
              className="flex items-center justify-center p-4 bg-gradient-to-r from-purple-600 to-pink-500 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 group"
            >
              <div className="relative">
                <FiFilter className="text-white text-xl" />
                {activeFilterCount > 0 && (
                  <span className="absolute -top-2 -right-2 bg-amber-500 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
                    {activeFilterCount}
                  </span>
                )}
              </div>
              <span className="ml-2 text-white font-medium hidden sm:inline-block">
                Filters
              </span>
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      <FilterPanel
        isOpen={isFilterOpen}
        onClose={() => setIsFilterOpen(false)}
      />
    </>
  );
};

export default FilterController;
