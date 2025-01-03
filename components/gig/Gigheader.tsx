import { Piano, Search } from "lucide-react";

import { motion } from "framer-motion";
import React from "react";
import { UserProps } from "@/types/userinterfaces";
import { Button } from "../ui/button";
import { instruments } from "@/utils";
import { FaGuitar } from "react-icons/fa";
import { GiGuitar } from "react-icons/gi";
import { LuGuitar } from "react-icons/lu";
import { GiSaxophone } from "react-icons/gi";
import { GiViolin } from "react-icons/gi";
import { GiDrumKit } from "react-icons/gi";
import { GiTrumpet } from "react-icons/gi";
import { GiHarp } from "react-icons/gi";
import { GiTrombone } from "react-icons/gi";
import { GiTuba } from "react-icons/gi";
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
}: HeaderProps) => {
  console.log(category);
  const variant = {
    initial: {
      x: ["-200px"],
      opacity: 0,
    },
    animate: {
      opacity: 1,

      x: ["-200px", "-100px", "-50px", "0px", "50px", "0px"],
    },
    transition: {
      duration: 1.3,
    },
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
  // random id

  // const randomId = "123456789";

  const activeFilter =
    "gigtitle h-[20px] w-[70px] !text-[8px] mx-2 mb-1 !bg-orange-600 text-white";
  const inactiveFilter = "gigtitle h-[20px] w-[70px] !text-[8px] mx-2 mb-1 ";
  return (
    <div className="flex flex-col gap-4 h-[107px]  p-3 shadow-md shadow-slate-400">
      <div className="flex items-center justify-around gap-3">
        <motion.div
          className="flex gap-3 items-center bg-zinc-600 px-2 rounded-full h-[40px]  w-[210px] "
          variants={variant}
        >
          <input
            placeholder="SearchBy: title,time('from' or 'to'),"
            className="h-[28px] w-[60px]  flex-1 ml-2 text-orange-300 placeholder-orange-200 bg-inherit   text-[11px] focus-within:right-0 outline-none placeholder-muted-foreground"
            value={typeOfGig}
            onChange={(ev) => {
              setTypeOfGig(ev.target.value);
            }}
            // onKeyDown={gigQuery}
          />
          <div className="bg-gray-300 p-1 rounded-full">
            <Search
              size="12px"
              style={{
                color: "gray",
              }}
            />
          </div>
        </motion.div>

        <select
          className=" w-[66px] bg-zinc-700 text-gray-300 pl-2 element-with-overflow  h-[30px] rounded-md  text-[10px] font-bold  font-mono"
          value={location}
          onChange={(ev) => {
            setLocation(ev.target.value);
          }}
        >
          {dataCounties?.map((d, idx) => (
            <option key={idx} value={d}>
              {d}
            </option>
          ))}
        </select>
      </div>
      {/* <select
        className=" w-[50px] bg-white pl-2  h-[20px] rounded-md  text-[9px] font-bold  font-mono"
        value={category}
        onChange={(ev) => {
          setCategory(ev.target.value);
        }}
      > */}
      <div className="overflow-x-auto w-full overflow-y-hidden">
        <div className="flex gap-2 whitespace-nowrap">
          {instruments.map((ins) => (
            <Button
              type="button"
              variant="secondary"
              className={ins.value === category ? activeFilter : inactiveFilter}
              key={ins.value}
              onClick={(ev) => {
                ev.preventDefault();
                setCategory(ins.value);
              }}
            >
              {" "}
              <span>
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
                {ins.value === "tuba" && <GiTuba />}{" "}
              </span>
              <span
                className={
                  ins.value === category
                    ? "  text-white font-bold"
                    : "text-black font-bold"
                }
              >
                {ins.name}
              </span>
            </Button>
          ))}
        </div>
      </div>
      {/* </select> */}
    </div>
  );
};

export default Gigheader;
