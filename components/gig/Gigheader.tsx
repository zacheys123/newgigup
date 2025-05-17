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

interface BaseHeaderProps {
  typeOfGig: string;
  setTypeOfGig: (typeOfGig: string) => void;
  category: string;
  setCategory: (category: string) => void;
  gigQuery?: () => void;
  location: string;
  setLocation: (location: string) => void;
  myuser?: UserProps;
  scheduler?: string;
  setScheduler?: (location: string) => void;
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
  scheduler,
  setScheduler,
}: BaseHeaderProps) => {
  const container = {
    hidden: { opacity: 0, y: -8 },
    show: {
      opacity: 1,
      y: 0,
      transition: {
        staggerChildren: 0.04,
        delayChildren: 0.08,
      },
    },
  };

  const item = {
    hidden: { y: 4, opacity: 0 },
    show: {
      y: 0,
      opacity: 1,
      transition: { type: "spring", stiffness: 300, damping: 20 },
    },
  };

  const activeFilter = "text-white bg-gray-700/80 shadow-inner";
  const inactiveFilter =
    "text-gray-400 hover:text-gray-200 hover:bg-gray-800/50";

  return (
    <motion.div
      className="flex flex-col gap-2 p-3 bg-gray-900/90 rounded-lg shadow-xl border border-gray-700/40 backdrop-blur-lg w-[300px]"
      initial="hidden"
      animate="show"
      variants={container}
    >
      {/* Search Bar */}
      <motion.div className="relative group" variants={item}>
        <div className="relative flex items-center bg-gray-800/60 px-3 py-2 rounded-md border border-gray-700/30 focus-within:border-cyan-400/50 transition-all duration-150">
          <Search size={14} className="text-gray-400 mr-2 flex-shrink-0" />
          <input
            placeholder="Search gigs..."
            className="flex-1 bg-transparent border-none outline-none text-gray-100 placeholder-gray-500 text-[13px] tracking-tight focus:ring-0"
            value={typeOfGig}
            onChange={(ev) => setTypeOfGig(ev.target.value)}
            onKeyDown={gigQuery}
          />
        </div>
      </motion.div>

      {/* Dropdown Filters */}
      <motion.div className="flex gap-2" variants={item}>
        <select
          className={`flex-1 h-8 bg-gray-800/50 text-gray-300 px-2.5 rounded text-[11px] tracking-tight font-medium cursor-pointer 
            focus:outline-none border border-gray-700/40 hover:border-gray-600/50 transition-all`}
          value={location}
          onChange={(ev) => setLocation(ev.target.value)}
        >
          {!myuser?.city ? (
            <option>Loading...</option>
          ) : (
            <>
              <option value="all" className="bg-gray-800">
                All Locations
              </option>
              {dataCounties.map((d, idx) => (
                <option
                  key={idx}
                  value={d.toLowerCase()}
                  className="bg-gray-800"
                >
                  {d}
                </option>
              ))}
            </>
          )}
        </select>

        {setScheduler && (
          <select
            className={`flex-1 h-8 bg-gray-800/50 text-gray-300 px-2.5 rounded text-[11px] tracking-tight font-medium cursor-pointer 
              focus:outline-none border border-gray-700/40 hover:border-gray-600/50 transition-all`}
            value={scheduler || "all"}
            onChange={(ev) => setScheduler(ev.target.value)}
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
        )}
      </motion.div>

      {/* Instrument Chips */}
      <motion.div
        className="w-full overflow-x-auto scrollbar-hide py-1"
        variants={item}
      >
        <div className="flex gap-1.5">
          {instruments.map((ins) => (
            <motion.button
              key={ins.value}
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              className={`flex items-center justify-center px-2 py-1 rounded text-[11px] tracking-tight font-medium transition-all 
                ${ins.value === category ? activeFilter : inactiveFilter}`}
              onClick={() => setCategory(ins.value)}
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
    </motion.div>
  );
};

export default Gigheader;
