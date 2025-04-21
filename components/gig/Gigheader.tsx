// import { Piano, Search } from "lucide-react";
// import { motion } from "framer-motion";
// import React from "react";
// import { UserProps } from "@/types/userinterfaces";
// import { dataCounties, instruments } from "@/utils";
// import { FaGuitar } from "react-icons/fa";
// import {
//   GiGuitar,
//   GiSaxophone,
//   GiViolin,
//   GiDrumKit,
//   GiTrumpet,
//   GiHarp,
//   GiTrombone,
//   GiTuba,
// } from "react-icons/gi";
// import { LuGuitar } from "react-icons/lu";

// interface HeaderProps {
//   typeOfGig: string;
//   setTypeOfGig: (typeOfGig: string) => void;
//   category: string;
//   setCategory: (category: string) => void;
//   gigQuery?: () => void;
//   location: string;
//   setLocation: (location: string) => void;
//   myuser?: UserProps;
// }

// const Gigheader = ({
//   typeOfGig,
//   setTypeOfGig,
//   setCategory,
//   location,
//   category,
//   setLocation,
//   gigQuery,
//   myuser,
// }: HeaderProps) => {
//   // const variant = {
//   //   initial: { x: -200, opacity: 0 },
//   //   animate: {
//   //     x: 0,
//   //     opacity: 1,
//   //     transition: {
//   //       type: "spring",
//   //       damping: 15,
//   //       stiffness: 100,
//   //       duration: 0.8,
//   //     },
//   //   },
//   // };

//   const activeFilter =
//     "bg-gradient-to-r from-teal-500 to-emerald-600 text-white shadow-lg";
//   const inactiveFilter =
//     "bg-gradient-to-r from-gray-100 to-gray-200 text-gray-700 hover:from-gray-200 hover:to-gray-300";

//   return (
//     <div className="flex flex-col gap-6 p-6 bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 rounded-2xl shadow-2xl border border-gray-700/50 backdrop-blur-sm">
//       {/* Search Bar */}
//       <motion.div
//         className="flex items-center bg-gradient-to-r from-gray-800 to-gray-700 px-6 py-4 rounded-full shadow-inner border border-gray-600/30 w-full transition-all duration-500 hover:border-teal-400/30"
//         initial={{ opacity: 0, y: -20 }}
//         animate={{ opacity: 1, y: 0 }}
//         transition={{ delay: 0.1 }}
//       >
//         <Search size={18} className="text-teal-400 mr-3" />
//         <input
//           placeholder="Search gigs by title, time, or location..."
//           className="flex-1 bg-transparent border-none outline-none text-gray-200 placeholder-gray-400 text-sm font-medium focus:ring-0"
//           value={typeOfGig}
//           onChange={(ev) => setTypeOfGig(ev.target.value)}
//           onKeyDown={gigQuery}
//         />
//         <motion.div
//           whileHover={{ scale: 1.05 }}
//           whileTap={{ scale: 0.95 }}
//           className="p-2 bg-gradient-to-r from-teal-500 to-emerald-600 rounded-full shadow-md cursor-pointer"
//         >
//           <Search size={16} className="text-white" />
//         </motion.div>
//       </motion.div>

//       {/* Filters Section */}
//       <motion.div
//         className="flex flex-col md:flex-row gap-4 w-full p-4 bg-gray-800/60 rounded-xl border border-gray-700/50"
//         initial={{ opacity: 0 }}
//         animate={{ opacity: 1 }}
//         transition={{ delay: 0.2 }}
//       >
//         {/* Location Selector */}
//         <motion.div
//           whileHover={{ scale: 1.02 }}
//           className="relative flex items-center"
//         >
//           <select
//             className="appearance-none w-full md:w-40 h-12 bg-gray-700/80 text-gray-300 pl-4 pr-10 rounded-lg text-sm font-medium cursor-pointer focus:outline-none focus:ring-2 focus:ring-teal-500/50 border border-gray-600/50 transition-all"
//             value={location ? location : myuser?.city}
//             onChange={(ev) => setLocation(ev.target.value)}
//           >
//             <option value="" disabled className="text-gray-400">
//               Select Location
//             </option>
//             {dataCounties.map((d, idx) => (
//               <option key={idx} value={d} className="text-gray-200 bg-gray-800">
//                 {d}
//               </option>
//             ))}
//           </select>
//           <div className="absolute right-3 pointer-events-none text-gray-400">
//             <svg
//               width="16"
//               height="16"
//               viewBox="0 0 24 24"
//               fill="none"
//               stroke="currentColor"
//             >
//               <path
//                 d="M6 9l6 6 6-6"
//                 strokeWidth="2"
//                 strokeLinecap="round"
//                 strokeLinejoin="round"
//               />
//             </svg>
//           </div>
//         </motion.div>

//         {/* Instrument Filters */}
//         <div className="flex-1 overflow-x-auto scrollbar-hide">
//           <div className="flex gap-2">
//             {instruments.map((ins) => (
//               <motion.button
//                 key={ins.value}
//                 whileHover={{ scale: 1.05 }}
//                 whileTap={{ scale: 0.95 }}
//                 className={`flex items-center justify-center px-4 py-2 rounded-lg text-xs font-semibold transition-all duration-300 h-12 min-w-[100px] whitespace-nowrap ${
//                   ins.value === category ? activeFilter : inactiveFilter
//                 } shadow-md`}
//                 onClick={(ev) => {
//                   ev.preventDefault();
//                   setCategory(ins.value);
//                 }}
//               >
//                 <span className="mr-2 text-lg">
//                   {ins.value === "piano" && <Piano className="text-current" />}
//                   {ins.value === "guitar" && (
//                     <FaGuitar className="text-current" />
//                   )}
//                   {ins.value === "bass" && (
//                     <GiGuitar className="text-current" />
//                   )}
//                   {ins.value === "sax" && (
//                     <GiSaxophone className="text-current" />
//                   )}
//                   {ins.value === "ukulele" && (
//                     <LuGuitar className="text-current" />
//                   )}
//                   {ins.value === "violin" && (
//                     <GiViolin className="text-current" />
//                   )}
//                   {ins.value === "drums" && (
//                     <GiDrumKit className="text-current" />
//                   )}
//                   {ins.value === "keyboard" && (
//                     <Piano className="text-current" />
//                   )}
//                   {ins.value === "trumpet" && (
//                     <GiTrumpet className="text-current" />
//                   )}
//                   {ins.value === "harp" && <GiHarp className="text-current" />}
//                   {ins.value === "trombone" && (
//                     <GiTrombone className="text-current" />
//                   )}
//                   {ins.value === "tuba" && <GiTuba className="text-current" />}
//                 </span>
//                 <span
//                   className={`transition-all duration-300 ${
//                     ins.value === category ? "text-white" : "text-gray-700"
//                   }`}
//                 >
//                   {ins.name}
//                 </span>
//               </motion.button>
//             ))}
//           </div>
//         </div>
//       </motion.div>
//     </div>
//   );
// };

// export default Gigheader;

// import { Piano, Search } from "lucide-react";
// import { motion } from "framer-motion";
// import React from "react";
// import { UserProps } from "@/types/userinterfaces";
// import { dataCounties, instruments } from "@/utils";
// import { FaGuitar } from "react-icons/fa";
// import {
//   GiGuitar,
//   GiSaxophone,
//   GiViolin,
//   GiDrumKit,
//   GiTrumpet,
//   GiHarp,
//   GiTrombone,
//   GiTuba,
// } from "react-icons/gi";
// import { LuGuitar } from "react-icons/lu";

// interface HeaderProps {
//   typeOfGig: string;
//   setTypeOfGig: (typeOfGig: string) => void;
//   category: string;
//   setCategory: (category: string) => void;
//   gigQuery?: () => void;
//   location: string;
//   setLocation: (location: string) => void;
//   myuser?: UserProps;
// }

// const Gigheader = ({
//   typeOfGig,
//   setTypeOfGig,
//   setCategory,
//   location,
//   category,
//   setLocation,
//   gigQuery,
//   myuser,
// }: HeaderProps) => {
//   const containerVariants = {
//     hidden: { opacity: 0 },
//     show: {
//       opacity: 1,
//       transition: {
//         staggerChildren: 0.1,
//         delayChildren: 0.2,
//       },
//     },
//   };

//   const itemVariants = {
//     hidden: { y: 20, opacity: 0 },
//     show: {
//       y: 0,
//       opacity: 1,
//       transition: {
//         type: "spring",
//         stiffness: 100,
//         damping: 15,
//       },
//     },
//   };

//   const activeFilter =
//     "bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 text-white shadow-lg shadow-purple-500/30";
//   const inactiveFilter =
//     "bg-gray-900/50 text-gray-300 hover:bg-gray-800/80 border border-gray-700 hover:border-gray-600";

//   return (
//     <motion.div
//       className="flex flex-col gap-6 p-6 bg-gray-950 rounded-3xl shadow-2xl border border-gray-800/50 backdrop-blur-md"
//       initial="hidden"
//       animate="show"
//       variants={containerVariants}
//     >
//       {/* Search Bar */}
//       <motion.div className="relative group" variants={itemVariants}>
//         <div className="absolute inset-0 bg-gradient-to-r from-indigo-500/20 to-pink-500/20 rounded-2xl blur-md opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
//         <div className="relative flex items-center bg-gray-900/80 px-6 py-4 rounded-2xl shadow-inner border border-gray-800/50 group-hover:border-indigo-400/50 transition-all duration-500">
//           <Search size={18} className="text-indigo-400 mr-3" />
//           <input
//             placeholder="Search gigs by title, time, or location..."
//             className="flex-1 bg-transparent border-none outline-none text-gray-200 placeholder-gray-500 text-sm font-medium focus:ring-0"
//             value={typeOfGig}
//             onChange={(ev) => setTypeOfGig(ev.target.value)}
//             onKeyDown={gigQuery}
//           />
//           <motion.div
//             whileHover={{ scale: 1.1 }}
//             whileTap={{ scale: 0.95 }}
//             className="p-2 bg-gradient-to-br from-indigo-500 to-pink-500 rounded-xl shadow-md cursor-pointer"
//           >
//             <Search size={16} className="text-white" />
//           </motion.div>
//         </div>
//       </motion.div>

//       {/* Filters Section */}
//       <motion.div
//         className="flex flex-col md:flex-row gap-4 w-full"
//         variants={itemVariants}
//       >
//         {/* Location Selector */}
//         <motion.div
//           className="relative flex items-center min-w-[180px]"
//           whileHover={{ y: -2 }}
//         >
//           <div className="absolute inset-0 bg-gradient-to-r from-indigo-500/10 to-pink-500/10 rounded-xl blur-sm opacity-0 hover:opacity-100 transition-opacity duration-300"></div>
//           <select
//             className="relative w-full h-12 bg-gray-900/70 text-gray-300 pl-4 pr-10 rounded-xl text-sm font-medium cursor-pointer focus:outline-none focus:ring-2 focus:ring-indigo-500/50 border border-gray-800 hover:border-gray-700 transition-all backdrop-blur-sm"
//             value={location ? location : myuser?.city}
//             onChange={(ev) => setLocation(ev.target.value)}
//           >
//             <option value="" disabled className="text-gray-500">
//               Select Location
//             </option>
//             {dataCounties.map((d, idx) => (
//               <option key={idx} value={d} className="text-gray-200 bg-gray-900">
//                 {d}
//               </option>
//             ))}
//           </select>
//           <div className="absolute right-3 pointer-events-none text-gray-500">
//             <svg
//               width="16"
//               height="16"
//               viewBox="0 0 24 24"
//               fill="none"
//               stroke="currentColor"
//             >
//               <path
//                 d="M6 9l6 6 6-6"
//                 strokeWidth="2"
//                 strokeLinecap="round"
//                 strokeLinejoin="round"
//               />
//             </svg>
//           </div>
//         </motion.div>

//         {/* Instrument Filters */}
//         <div className="flex-1 overflow-x-auto scrollbar-hide">
//           <div className="flex gap-2 pb-2">
//             {instruments.map((ins) => (
//               <motion.button
//                 key={ins.value}
//                 variants={itemVariants}
//                 whileHover={{ y: -2, scale: 1.03 }}
//                 whileTap={{ scale: 0.97 }}
//                 className={`flex items-center justify-center px-4 py-3 rounded-xl text-xs font-semibold transition-all duration-300 h-12 min-w-[110px] whitespace-nowrap ${
//                   ins.value === category ? activeFilter : inactiveFilter
//                 } shadow-md backdrop-blur-sm`}
//                 onClick={(ev) => {
//                   ev.preventDefault();
//                   setCategory(ins.value);
//                 }}
//               >
//                 <span className="mr-2 text-lg">
//                   {ins.value === "piano" && <Piano className="text-current" />}
//                   {ins.value === "guitar" && (
//                     <FaGuitar className="text-current" />
//                   )}
//                   {ins.value === "bass" && (
//                     <GiGuitar className="text-current" />
//                   )}
//                   {ins.value === "sax" && (
//                     <GiSaxophone className="text-current" />
//                   )}
//                   {ins.value === "ukulele" && (
//                     <LuGuitar className="text-current" />
//                   )}
//                   {ins.value === "violin" && (
//                     <GiViolin className="text-current" />
//                   )}
//                   {ins.value === "drums" && (
//                     <GiDrumKit className="text-current" />
//                   )}
//                   {ins.value === "keyboard" && (
//                     <Piano className="text-current" />
//                   )}
//                   {ins.value === "trumpet" && (
//                     <GiTrumpet className="text-current" />
//                   )}
//                   {ins.value === "harp" && <GiHarp className="text-current" />}
//                   {ins.value === "trombone" && (
//                     <GiTrombone className="text-current" />
//                   )}
//                   {ins.value === "tuba" && <GiTuba className="text-current" />}
//                 </span>
//                 <span
//                   className={`transition-all duration-300 ${
//                     ins.value === category
//                       ? "text-white font-bold"
//                       : "text-gray-300"
//                   }`}
//                 >
//                   {ins.name}
//                 </span>
//               </motion.button>
//             ))}
//           </div>
//         </div>
//       </motion.div>
//     </motion.div>
//   );
// };

// export default Gigheader;

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

interface SchedulerProps {
  scheduler: string;
  setScheduler: (location: string) => void;
}

type HeaderProps = BaseHeaderProps & Partial<SchedulerProps>;
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
  console.log(myuser);
  const activeFilter =
    "bg-gradient-to-br from-cyan-400 to-blue-600 text-white shadow-lg shadow-cyan-500/30";
  const inactiveFilter =
    "bg-gray-900/40 text-gray-300 hover:bg-gray-800/60 border border-gray-800 hover:border-gray-700 backdrop-blur-md";

  return (
    <motion.div
      className="flex flex-col gap-5 -mt-4 p-5 bg-gray-950 rounded-3xl shadow-2xl border border-gray-800/60"
      initial="hidden"
      animate="show"
      variants={container}
    >
      {/* Search Bar */}
      <motion.div className="relative group" variants={item}>
        <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/10 to-blue-600/10 rounded-xl blur-lg opacity-0 group-hover:opacity-40 transition-all duration-700"></div>
        <div className="relative flex items-center bg-gray-900/50 px-5 py-3.5 rounded-xl border border-gray-800/50 group-hover:border-cyan-400/30 transition-all duration-500">
          <Search size={18} className="text-cyan-400 mr-3" />
          <input
            placeholder="Search Gig Title..."
            className="flex-1 bg-transparent border-none outline-none text-gray-200 placeholder-gray-500/70 text-sm font-medium focus:ring-0"
            value={typeOfGig}
            onChange={(ev) => setTypeOfGig(ev.target.value)}
            onKeyDown={gigQuery}
          />
          <motion.div
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            className="p-2 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-lg shadow cursor-pointer"
          >
            <Search size={16} className="text-white" />
          </motion.div>
        </div>
      </motion.div>

      {/* Filters Section */}
      <motion.div
        className="flex flex-col md:flex-row gap-3 w-full"
        variants={item}
      >
        {/* Location Selector */}
        <motion.div
          className="relative flex items-center min-w-[180px]"
          whileHover={{ y: -1 }}
          variants={item}
        >
          <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/10 to-blue-600/10 rounded-lg blur opacity-0 hover:opacity-30 transition-opacity duration-500"></div>

          <div className="flex items-center  gap-1 w-[100%]">
            <select
              className={`relative w-[55%]  h-11 bg-gray-900/60 text-gray-300 pl-4 pr-10 rounded-lg text-xs font-medium  md:text-md cursor-pointer focus:outline-none focus:ring-2 focus:ring-cyan-500/50 border border-gray-800 hover:border-gray-700 transition-all`}
              value={location || myuser?.city || "all"} // Fallback to "all" if nothing is set
              onChange={(ev) => setLocation(ev.target.value)}
            >
              {!myuser?.city ? (
                <option>Loading locations...</option>
              ) : (
                <>
                  <option value="all">All Locations</option>
                  {dataCounties.map((d, idx) => (
                    <option key={idx} value={d.toLowerCase()}>
                      {d}
                    </option>
                  ))}
                </>
              )}
            </select>

            <select
              className="relative w-[40%] text-xs  md:text-md  h-11 bg-gray-900/60 text-gray-300 pl-4 pr-10 rounded-lg  font-medium cursor-pointer focus:outline-none focus:ring-2 focus:ring-cyan-500/50 border border-gray-800 hover:border-gray-700 transition-all"
              value={scheduler ? scheduler : "all"}
              onChange={(ev) => setScheduler && setScheduler(ev.target.value)} // Added null check
            >
              {!myuser ? (
                <option>loading...</option>
              ) : (
                <>
                  <option value="all">All Gigs</option>
                  <option value={"pending"}>Pending Gigs</option>
                  <option value={"notPending"}>Available Gigs</option>
                </>
              )}
            </select>
          </div>
          <div className="absolute right-3 pointer-events-none text-gray-500">
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
            >
              <path
                d="M6 9l6 6 6-6"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>
        </motion.div>

        {/* Instrument Filters */}
        <div className="flex-1 overflow-x-auto scrollbar-hide">
          <div className="flex gap-2 pb-1">
            {instruments.map((ins) => (
              <motion.button
                key={ins.value}
                variants={item}
                whileHover={{ y: -1, scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className={`flex items-center justify-center px-4 py-2.5 rounded-lg text-xs font-semibold transition-all duration-300 h-11 min-w-[105px] whitespace-nowrap ${
                  ins.value === category ? activeFilter : inactiveFilter
                }`}
                onClick={(ev) => {
                  ev.preventDefault();
                  setCategory(ins.value);
                }}
              >
                <span className="mr-2 text-lg">
                  {ins.value === "piano" && <Piano className="text-current" />}
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
                  {ins.value === "harp" && <GiHarp className="text-current" />}
                  {ins.value === "trombone" && (
                    <GiTrombone className="text-current" />
                  )}
                  {ins.value === "tuba" && <GiTuba className="text-current" />}
                </span>
                <span
                  className={`transition-all duration-300 ${
                    ins.value === category
                      ? "text-white font-bold"
                      : "text-gray-300"
                  }`}
                >
                  {ins.name}
                </span>
              </motion.button>
            ))}
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default Gigheader;
