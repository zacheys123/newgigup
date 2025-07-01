// components/filters/InstrumentFilters.tsx
"use client";

import React from "react";
import { Variants, motion } from "framer-motion";
import { Piano } from "lucide-react";
import { FaGuitar } from "react-icons/fa";
import {
  GiGuitar,
  GiSaxophone,
  GiViolin,
  GiDrumKit,
  GiTrumpet,
  GiHarp,
  GiTrombone,
  GiTuba,
} from "react-icons/gi";
import { LuGuitar } from "react-icons/lu";
import { instruments } from "@/utils";
import { useFilters } from "@/app/Context/FilterContext";

interface InstrumentFiltersProps {
  variants: Variants;
}

const InstrumentFilters: React.FC<InstrumentFiltersProps> = ({ variants }) => {
  const { state, dispatch } = useFilters();

  const activeFilter = "text-white bg-gray-700/80 shadow-inner";
  const inactiveFilter =
    "text-gray-400 hover:text-gray-200 hover:bg-gray-800/50";

  return (
    <motion.div
      className="w-full overflow-x-auto scrollbar-hide py-1"
      variants={variants}
    >
      <div className="flex gap-1.5">
        {instruments.map((ins) => (
          <motion.button
            key={ins.value}
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            className={`flex items-center justify-center px-2 py-1 rounded text-[11px] tracking-tight font-medium transition-all 
              ${ins.value === state.category ? activeFilter : inactiveFilter}`}
            onClick={() =>
              dispatch({ type: "SET_CATEGORY", payload: ins.value })
            }
          >
            <span className="mr-1.5 text-[13px]">
              {ins.value === "piano" && <Piano size={13} />}
              {ins.value === "guitar" && <FaGuitar size={13} />}
              {ins.value === "bass" && <GiGuitar size={13} />}
              {ins.value === "sax" && <GiSaxophone size={13} />}
              {ins.value === "ukulele" && <LuGuitar size={13} />}
              {ins.value === "violin" && <GiViolin size={13} />}
              {ins.value === "drums" && <GiDrumKit size={13} />}
              {ins.value === "keyboard" && <Piano size={13} />}
              {ins.value === "trumpet" && <GiTrumpet size={13} />}
              {ins.value === "harp" && <GiHarp size={13} />}
              {ins.value === "trombone" && <GiTrombone size={13} />}
              {ins.value === "tuba" && <GiTuba size={13} />}
            </span>
            {ins.name}
          </motion.button>
        ))}
      </div>
    </motion.div>
  );
};

export default InstrumentFilters;
