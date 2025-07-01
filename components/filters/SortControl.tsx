// components/filters/SortControls.tsx
"use client";

import React from "react";
import { Variants, motion } from "framer-motion";
import { useFilters } from "@/app/Context/FilterContext";

interface SortControlsProps {
  variants: Variants;
}

const SortControls: React.FC<SortControlsProps> = ({ variants }) => {
  const { state, dispatch } = useFilters();

  return (
    <motion.div className="flex items-center space-x-3" variants={variants}>
      <div className="flex items-center space-x-3">
        <span className="text-xs text-gray-400">Sort:</span>
        <select
          value={state.sortOption}
          onChange={(e) =>
            dispatch({ type: "SET_SORT_OPTION", payload: e.target.value })
          }
          className="text-xs bg-gray-600 border-gray-700 rounded-lg focus:ring-amber-500 focus:border-amber-500 text-white p-2"
        >
          <option value="relevance">Relevance</option>
          <option value="newest">Newest First</option>
          <option value="highest">Highest Budget</option>
          <option value="popular">Most Viewed</option>
        </select>
      </div>
      <select
        value={state.timelineOption}
        onChange={(e) =>
          dispatch({ type: "SET_TIMELINE_OPTION", payload: e.target.value })
        }
        className="text-xs bg-gray-600 border-gray-700 rounded-lg focus:ring-amber-500 focus:border-amber-500 text-white p-2"
      >
        <option value="once">Once Gigs/Functions</option>
        <option value="weekly">Weekly Gigs</option>
        <option value="other">Other Timeline</option>
      </select>
    </motion.div>
  );
};

export default SortControls;
