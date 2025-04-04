import { Piano, Search } from "lucide-react";
import { motion } from "framer-motion";
import React from "react";
import { dataCounties, instruments } from "@/utils";
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
import { UserProps } from "@/types/userinterfaces";

interface HeaderProps {
  typeOfGig: string;
  setTypeOfGig: (typeOfGig: string) => void;
  category: string;
  setCategory: (category: string) => void;
  gigQuery?: () => void;
  location: string;
  setLocation: (location: string) => void;
  myuser?: UserProps;
}

const Gigheader = ({
  typeOfGig,
  setTypeOfGig,
  setCategory,
  location,
  category,
  setLocation,
  gigQuery,
  myuser,
}: HeaderProps) => {
  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.08,
        delayChildren: 0.15,
      },
    },
  };

  const item = {
    hidden: { y: 12, opacity: 0 },
    show: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 120,
        damping: 12,
      },
    },
  };

  const activeFilter =
    "bg-blue-600/20 text-blue-300 border border-blue-500/50 shadow-lg shadow-blue-500/10";
  const inactiveFilter =
    "bg-gray-800/50 text-gray-300 hover:bg-gray-700/60 border border-gray-700/50";

  return (
    <motion.div
      className="flex flex-col gap-5 p-5 bg-gradient-to-br from-gray-900/80 to-gray-800/90 rounded-xl shadow-xl border border-gray-700/50 backdrop-blur-sm"
      initial="hidden"
      animate="show"
      variants={container}
    >
      {/* Premium Search Bar */}
      <motion.div className="relative group" variants={item}>
        <div className="absolute inset-0 bg-blue-500/10 rounded-lg blur-lg opacity-0 group-hover:opacity-30 transition-all duration-500"></div>
        <div className="relative flex items-center bg-gray-800/50 px-5 py-3.5 rounded-lg border border-gray-700/50 group-hover:border-blue-400/40 transition-all duration-300">
          <Search size={20} className="text-blue-400 mr-4 flex-shrink-0" />
          <input
            placeholder="Search premium gigs..."
            className="flex-1 bg-transparent border-none outline-none text-gray-200 placeholder-gray-500 text-sm font-medium tracking-wide focus:ring-0 min-w-0"
            value={typeOfGig}
            onChange={(ev) => setTypeOfGig(ev.target.value)}
            onKeyDown={gigQuery}
          />
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="p-2.5 bg-blue-600/90 rounded-lg shadow-md cursor-pointer flex-shrink-0 hover:bg-blue-500 transition-colors"
            aria-label="Search"
          >
            <Search size={18} className="text-white" />
          </motion.button>
        </div>
      </motion.div>

      {/* Premium Filters Section */}
      <motion.div
        className="flex flex-col gap-4 w-full md:flex-row md:items-center"
        variants={item}
      >
        {/* Premium Location Selector */}
        <motion.div
          className="relative w-full md:w-auto md:min-w-[220px]"
          variants={item}
        >
          <select
            className="w-full h-11 bg-gray-800/50 text-gray-300 pl-4 pr-10 rounded-lg text-sm font-medium tracking-wide cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-500/30 border border-gray-700/50 hover:border-gray-600/60 transition-all"
            value={location || myuser?.city || "all"}
            onChange={(ev) => setLocation(ev.target.value)}
          >
            {!myuser ? (
              <option>Loading locations...</option>
            ) : (
              <>
                <option value="all">All Locations</option>
                {dataCounties.map((d, idx) => (
                  <option key={idx} value={d}>
                    {d}
                  </option>
                ))}
              </>
            )}
          </select>
          <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-gray-500">
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
            >
              <path
                d="M6 9l6 6 6-6"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>
        </motion.div>

        {/* Premium Instrument Filters */}
        <div className="flex-1 overflow-x-auto scrollbar-hide">
          <div className="flex gap-3 pb-1 min-w-max">
            {instruments.map((ins) => (
              <motion.button
                key={ins.value}
                variants={item}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className={`flex items-center justify-center px-4 py-2.5 rounded-lg text-xs font-semibold tracking-wide transition-all duration-300 h-11 min-w-[110px] whitespace-nowrap ${
                  ins.value === category ? activeFilter : inactiveFilter
                }`}
                onClick={(ev) => {
                  ev.preventDefault();
                  setCategory(ins.value);
                }}
              >
                <span className="mr-2.5 text-lg">
                  {ins.value === "piano" && <Piano className="text-current" />}
                  {/* Other instrument icons */}
                  <span className="mr-2 text-base">
                    {ins.value === "piano" && (
                      <Piano className="text-current" />
                    )}
                    {ins.value === "guitar" && (
                      <FaGuitar className="text-current" />
                    )}
                    {ins.value === "bass" && (
                      <GiGuitar className="text-current" />
                    )}
                    {ins.value === "sax" && (
                      <GiSaxophone className="text-current" />
                    )}
                    {ins.value === "ukulele" && (
                      <LuGuitar className="text-current" />
                    )}
                    {ins.value === "violin" && (
                      <GiViolin className="text-current" />
                    )}
                    {ins.value === "drums" && (
                      <GiDrumKit className="text-current" />
                    )}
                    {ins.value === "keyboard" && (
                      <Piano className="text-current" />
                    )}
                    {ins.value === "trumpet" && (
                      <GiTrumpet className="text-current" />
                    )}
                    {ins.value === "harp" && (
                      <GiHarp className="text-current" />
                    )}
                    {ins.value === "trombone" && (
                      <GiTrombone className="text-current" />
                    )}
                    {ins.value === "tuba" && (
                      <GiTuba className="text-current" />
                    )}
                  </span>
                </span>
                <span className="sr-only md:not-sr-only">{ins.name}</span>
              </motion.button>
            ))}
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default Gigheader;
