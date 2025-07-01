// components/filters/DropdownFilters.tsx
"use client";

import React from "react";
import { motion, Variants } from "framer-motion";
import { dataCounties } from "@/utils";
import { useFilters } from "@/app/Context/FilterContext";

interface DropdownFiltersProps {
  variants: Variants;
}

const DropdownFilters: React.FC<DropdownFiltersProps> = ({ variants }) => {
  const { state, dispatch } = useFilters();

  return (
    <motion.div className="flex gap-2" variants={variants}>
      <select
        className={`flex-1 h-8 bg-gray-800/50 text-gray-300 px-2.5 rounded text-[11px] tracking-tight font-medium cursor-pointer 
          focus:outline-none border border-gray-700/40 hover:border-gray-600/50 transition-all`}
        value={state.location}
        onChange={(ev) =>
          dispatch({ type: "SET_LOCATION", payload: ev.target.value })
        }
      >
        <option value="all" className="bg-gray-800">
          All Locations
        </option>
        {dataCounties.map((d, idx) => (
          <option key={idx} value={d.toLowerCase()} className="bg-gray-800">
            {d}
          </option>
        ))}
      </select>

      <select
        className={`flex-1 h-8 bg-gray-800/50 text-gray-300 px-2.5 rounded text-[11px] tracking-tight font-medium cursor-pointer 
          focus:outline-none border border-gray-700/40 hover:border-gray-600/50 transition-all`}
        value={state.scheduler}
        onChange={(ev) =>
          dispatch({ type: "SET_SCHEDULER", payload: ev.target.value })
        }
      >
        <option value="all" className="bg-gray-800">
          All Gigs
        </option>
        <option value="pending" className="bg-gray-800">
          Pending
        </option>
        <option value="notPending" className="bg-gray-800">
          Available
        </option>
      </select>
    </motion.div>
  );
};

export default DropdownFilters;
