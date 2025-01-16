import React, { useState } from "react";
import { motion } from "framer-motion";
import { Textarea } from "flowbite-react";

interface videosProps {
  setShowVideo: (showvideo: boolean) => void;
}
const Videos = ({ setShowVideo }: videosProps) => {
  const [addvideo, setAddVideo] = useState<boolean>();
  return (
    <motion.div className=" bg-neutral-300 h-[450px] rounded-md p-3">
      {!addvideo ? (
        <div className="h-[360px]">
          <h6 className="text-neutral-800 text-xl">Adding Videos guideline</h6>.
          <span
            className="absolute top-2 right-4 text-[15px] font-bold"
            onClick={() => setShowVideo(false)}
          >
            &times;
          </span>
          <ul className="custom-list ml-4">
            <h6 className="text black font-bold -ml-2">
              By Adding videos to your profile you:
            </h6>
            <li>You create a portfolio for future jobs</li>
            <li>
              Depending on reviews this can make people see if reviews are true
              or not
            </li>
            <li>you create a following of clients that like your work</li>
            <li>You also allow clients to judge you by your work</li>
            <li>It adds alot to your online presence</li>
          </ul>
        </div>
      ) : (
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.4 }}
          onClick={() => setShowVideo(true)}
          className="h-[360px]"
        >
          <form>
            <input
              autoComplete="off"
              name="title"
              type="text"
              placeholder="Enter any title"
              className="font-mono  h-[35px] text-[12px]  bg-zinc-700 border-2 border-neutral-400 mb-2  focus-within:ring-0 outline-none rounded-xl  px-3 text-neutral-300"
            />{" "}
            <Textarea
              name="description"
              style={{ resize: "none", height: "fit-content" }}
              className="min-h-[70px] py-2 mb-2 font-mono  bg-zinc-700 border-2 border-neutral-400 text-neutral-300 px-3 "
              placeholder=" Enter description e.g what songs or the vybe expected in the event/show"
            />
            <input
              autoComplete="off"
              type="text"
              placeholder="Enter phone no: "
              className="font-mono  h-[35px] text-[12px]  bg-zinc-700 border-2 border-neutral-400 mb-2  focus-within:ring-0 outline-none rounded-xl  px-3 text-neutral-300"
              name="phoneNo"
            />{" "}
          </form>
        </motion.div>
      )}
      <div className="bg-amber-600 w0-[70%] mx-auto my-5 rounded-sm">
        {!addvideo ? (
          <h6
            className="text-white text-1xl font-bold flex justify-center font-sans"
            onClick={() => setAddVideo(true)}
          >
            Add Videos{" "}
          </h6>
        ) : (
          <h6
            className="text-white text-1xl font-bold flex justify-center font-sans"
            onClick={() => setAddVideo(false)}
          >
            Upload Video{" "}
          </h6>
        )}
      </div>
    </motion.div>
  );
};

export default Videos;
