import { Piano, Search } from "lucide-react";
import { motion } from "framer-motion";
import React from "react";
import { UserProps } from "@/types/userinterfaces";
import { Button } from "../ui/button";
import { instruments } from "@/utils";
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
}: HeaderProps) => {
  const variant = {
    initial: { x: ["-200px"], opacity: 0 },
    animate: {
      opacity: 1,
      x: ["-200px", "-100px", "-50px", "0px", "50px", "0px"],
    },
    transition: { duration: 1.2, ease: "easeInOut" },
  };

  const dataCounties = [
    "Nairobi",
    "Mombasa",
    "Kisumu",
    "Meru",
    "Kakamega",
    "Kiambu",
    "Bungoma",
    "Voi",
    "Machakos",
    "Kilifi",
    "Mandera",
    "Tharaka-Nithi",
    "Kajiado",
    "Kericho",
    "Lamu",
    "Nyeri",
    "Nakuru",
    "Kisii",
    "Muranga",
    "Garissa",
    "Kilimanjaro",
    "Elgeyo-Marakwet",
    "Mugumu",
    "Bomet",
    "Siaya",
    "Kakuma",
    "Isiolo",
    "Kitui",
    "Vihiga",
    "All",
  ];

  const activeFilter =
    "link h-[27px] w-[90px] text-[9px] mx-2 mb-2 bg-teal-500 text-white rounded-md shadow-md whitespace-nowrap";

  const inactiveFilter =
    "link h-[27px] w-[90px] text-[9x] mx-2 mb-2 text-gray-700 rounded-md hover:bg-gray-100 transition duration-300";

  return (
    <div className="flex flex-col gap-6 p-2 shadow-lg shadow-zinc-700 bg-gradient-to-r from-zinc-800 via-neutral-700 to-black rounded-xl">
      <div className="flex flex-wrap items-center justify-between gap-6 -mb-3">
        <motion.div
          className="flex gap-4 items-center bg-zinc-700 px-6 py-3 rounded-full shadow-xl w-full md:w-[320px] transition-all duration-300"
          variants={variant}
        >
          <input
            placeholder="Search by title, time ('from' or 'to')"
            className="h-[27px] gigtitle  w-full pl-4 pr-6 rounded-lg text-sm text-gray-200 placeholder:text-gray-500 bg-transparent focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-opacity-50 transition-all duration-300"
            value={typeOfGig}
            onChange={(ev) => setTypeOfGig(ev.target.value)}
            onKeyDown={gigQuery}
          />
          <div className="bg-gray-300 p-2 rounded-full transition-all hover:bg-gray-200">
            <Search size="18px" className="text-gray-600" />
          </div>
        </motion.div>
      </div>

      <div className="overflow-x-hidden w-full flex items-center justify-between p-4 bg-neutral-800 rounded-lg">
        <select
          className="w-[85px] h-[35px] bg-neutral-800 text-gray-300 pl-4 pr-2 rounded-md text-[11px] font-semibold cursor-pointer focus:outline-none focus:ring-2 focus:ring-teal-500 transition-all duration-300"
          value={location || ""}
          onChange={(ev) => setLocation(ev.target.value)}
        >
          {/* Disabled first option as a placeholder */}
          <option value="" disabled className="text-gray-500">
            Select County/State
          </option>
          {dataCounties.map((d, idx) => (
            <option key={idx} value={d} className="text-sm">
              {d}
            </option>
          ))}
        </select>

        <div className="flex gap-3 whitespace-nowrap overflow-x-auto scrollbar-hide">
          {instruments.map((ins) => (
            <Button
              type="button"
              variant="secondary"
              className={`${
                ins.value === category ? activeFilter : inactiveFilter
              } group relative flex items-center justify-center px-6 py-3 rounded-lg text-sm font-semibold transition-all duration-300 transform hover:scale-105 hover:shadow-xl h-[27px] max-w-[100px] whitespace-nowrap`}
              key={ins.value}
              onClick={(ev) => {
                ev.preventDefault();
                setCategory(ins.value);
              }}
            >
              <span className="absolute left-2 transition-all group-hover:scale-110 group-hover:text-teal-500">
                {ins.value === "piano" && <Piano />}
                {ins.value === "guitar" && <FaGuitar />}
                {ins.value === "bass" && <GiGuitar />}
                {ins.value === "sax" && <GiSaxophone />}
                {ins.value === "ukulele" && <LuGuitar />}
                {ins.value === "violin" && <GiViolin />}
                {ins.value === "drums" && <GiDrumKit />}
                {ins.value === "keyboard" && <Piano />}
                {ins.value === "trumpet" && <GiTrumpet />}
                {ins.value === "harp" && <GiHarp />}
                {ins.value === "trombone" && <GiTrombone />}
                {ins.value === "tuba" && <GiTuba />}
              </span>
              <span
                className={`ml-10 transition-all duration-300 gigtitle ${
                  ins.value === category ? "text-white" : "text-gray-700"
                } group-hover:text-teal-500 whitespace-nowrap`}
              >
                {ins.name}
              </span>
            </Button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Gigheader;
