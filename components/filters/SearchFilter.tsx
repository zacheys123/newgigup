// components/filters/SearchFilter.tsx
"use client";

import React from "react";
import { motion, Variants } from "framer-motion";
import { Search } from "lucide-react";
import { useFilters } from "@/app/Context/FilterContext";

interface SearchFilterProps {
  variants: Variants;
}

const SearchFilter: React.FC<SearchFilterProps> = ({ variants }) => {
  const { state, dispatch } = useFilters();

  return (
    <motion.div className="relative group" variants={variants}>
      <div className="relative flex items-center bg-gray-800/60 px-3 py-2 rounded-md border border-gray-700/30 focus-within:border-cyan-400/50 transition-all duration-150">
        <Search size={14} className="text-gray-400 mr-2 flex-shrink-0" />
        <input
          placeholder="Search gigs..."
          className="flex-1 bg-transparent border-none outline-none text-gray-100 placeholder-gray-500 text-[13px] tracking-tight focus:ring-0"
          value={state.searchQuery}
          onChange={(ev) =>
            dispatch({ type: "SET_SEARCH_QUERY", payload: ev.target.value })
          }
        />
      </div>
    </motion.div>
  );
};

export default SearchFilter;
