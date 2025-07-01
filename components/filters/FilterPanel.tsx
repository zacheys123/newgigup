// components/filters/FilterPanel.tsx
"use client";

import React, { useEffect, useRef } from "react";
import { motion, AnimatePresence, Variants } from "framer-motion";
import { X, RotateCcw } from "lucide-react";
import { useFilters } from "@/app/Context/FilterContext";
import SearchFilter from "./SearchFilter";
import DropdownFilters from "./DropDownFilter";
import InstrumentFilters from "./InstrumentFilters";
import SortControls from "./SortControl";

const backdropVariants: Variants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.2 } },
};

const modalVariants: Variants = {
  hidden: { opacity: 0, y: 20, scale: 0.98 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      type: "spring",
      stiffness: 300,
      damping: 25,
      when: "beforeChildren",
      staggerChildren: 0.05,
    },
  },
  exit: {
    opacity: 0,
    y: 20,
    scale: 0.98,
    transition: { duration: 0.15 },
  },
};

const itemVariants: Variants = {
  hidden: { y: 10, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: { type: "spring", stiffness: 300, damping: 20 },
  },
};

interface FilterPanelProps {
  isOpen: boolean;
  onClose: () => void;
}

const FilterPanel = ({ isOpen, onClose }: FilterPanelProps) => {
  const { dispatch } = useFilters();
  const modalRef = useRef<HTMLDivElement>(null);
  const lastActiveElement = useRef<HTMLElement | null>(null);

  // Focus trap
  useEffect(() => {
    if (isOpen) {
      lastActiveElement.current = document.activeElement as HTMLElement;
      modalRef.current?.focus();

      const handleKeyDown = (e: KeyboardEvent) => {
        if (e.key === "Escape") {
          onClose();
        }

        // Tab key navigation
        if (e.key === "Tab") {
          const focusableElements = modalRef.current?.querySelectorAll(
            'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
          ) as NodeListOf<HTMLElement>;

          if (focusableElements?.length) {
            const firstElement = focusableElements[0];
            const lastElement = focusableElements[focusableElements.length - 1];

            if (!e.shiftKey && document.activeElement === lastElement) {
              firstElement.focus();
              e.preventDefault();
            } else if (e.shiftKey && document.activeElement === firstElement) {
              lastElement.focus();
              e.preventDefault();
            }
          }
        }
      };

      document.addEventListener("keydown", handleKeyDown);
      return () => {
        document.removeEventListener("keydown", handleKeyDown);
        lastActiveElement.current?.focus();
      };
    }
  }, [isOpen, onClose]);

  const resetFilters = () => {
    dispatch({ type: "RESET_FILTERS" });
  };

  const handleApply = () => {
    // Add any apply transition effects here
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          // Add this to your main container
          className="fixed inset-0 z-50 flex items-start justify-center p-4 bg-black/60 backdrop-blur-sm overflow-y-auto"
          initial="hidden"
          animate="visible"
          exit="hidden"
          variants={backdropVariants}
          onClick={onClose}
        >
          <motion.div
            ref={modalRef}
            className="relative bg-gray-900/95 rounded-xl shadow-2xl border border-gray-700/50 backdrop-blur-lg w-full max-w-md mt-16 overflow-hidden focus:outline-none"
            variants={modalVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            onClick={(e) => e.stopPropagation()}
            tabIndex={-1}
            aria-modal="true"
            aria-labelledby="filter-modal-title"
            role="dialog"
          >
            {/* Close button */}
            <button
              onClick={onClose}
              className="absolute top-3 right-3 p-1 rounded-full text-gray-400 hover:text-white hover:bg-gray-800 transition-colors focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 focus:ring-offset-gray-900"
              aria-label="Close filters"
            >
              <X size={20} />
            </button>

            {/* Modal header */}
            <div className="px-6 pt-5 pb-3 border-b border-gray-800">
              <h2
                id="filter-modal-title"
                className="text-xl font-semibold text-white"
              >
                Filter Gigs
              </h2>
              <p className="text-sm text-gray-400 mt-1">
                Refine your search results
              </p>
            </div>

            {/* Modal content */}
            <div className="p-6 overflow-y-auto max-h-[60vh] md:max-h-[70vh]">
              <motion.div className="flex flex-col gap-4">
                <SearchFilter variants={itemVariants} />
                <DropdownFilters variants={itemVariants} />
                <InstrumentFilters variants={itemVariants} />
                <SortControls variants={itemVariants} />
              </motion.div>
            </div>

            {/* Modal footer */}
            <div className="px-6 py-4 border-t border-gray-800 flex flex-col sm:flex-row justify-between gap-3">
              <button
                onClick={resetFilters}
                className="px-4 py-2 text-sm text-gray-300 hover:text-white transition-colors flex items-center justify-center gap-2 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 focus:ring-offset-gray-900 rounded-md"
              >
                <RotateCcw size={16} />
                Reset Filters
              </button>
              <div className="flex gap-3">
                <button
                  onClick={onClose}
                  className="px-4 py-2 text-sm text-gray-300 hover:text-white transition-colors focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 focus:ring-offset-gray-900 rounded-md"
                >
                  Cancel
                </button>
                <motion.button
                  onClick={handleApply}
                  className="px-4 py-2 text-sm bg-gradient-to-r from-purple-600 to-pink-500 text-white rounded-md hover:brightness-110 transition-all focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 focus:ring-offset-gray-900"
                  whileTap={{ scale: 0.95 }}
                  transition={{ type: "spring", stiffness: 400, damping: 17 }}
                >
                  Apply Filters
                </motion.button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default FilterPanel;
