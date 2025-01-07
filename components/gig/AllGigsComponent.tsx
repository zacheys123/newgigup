// components/gig/AllGigsComponent.ts
import { GigProps } from "@/types/giginterface";
import { Avatar, Box } from "@mui/material";
import React, { useState } from "react";
import ButtonComponent from "../ButtonComponent";
import { PiDotsThreeVerticalBold } from "react-icons/pi";
import GigDescription from "./GigDescription";
import useStore from "@/app/zustand/useStore";
interface FetchResponse {
  success: boolean;
  message?: string;
  // Add other fields as per your API response
}
interface AllGigsComponentProps {
  gig: GigProps;
}

const AllGigsComponent: React.FC<AllGigsComponentProps> = ({ gig }) => {
  console.log(gig?.postedBy?.picture);

  const [gigdesc, setGigdesc] = useState<boolean>(false);
  const [open, setOpen] = useState<boolean>(false);
  const handleClose = () => {
    setOpen(false);
    console.log("close", gigdesc);
  };
  const { currentUser } = useStore();
  console.log(currentUser?._id);
  // conditionsl styling
  const handleModal = async (gig: GigProps) => {
    try {
      const res = await fetch(`/api/gigs/addview/${gig?._id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ userid: currentUser?._id }),
      });
      const data: FetchResponse = await res.json();
      setOpen(true);
      setGigdesc(true);

      console.log(data);
    } catch (error) {
      console.log("error adding count for gigs", error);
    }
  };
  return (
    <>
      {gigdesc && (
        <GigDescription gig={gig} open={open} handleClose={handleClose} />
      )}
      <section
        className=" flex flex-col rounded-md   w-[95%] mx-auto shadow-md  shadow-zinc-600 bg-zinc-700 py-3
  h-[98x] my-4  px-3"
      >
        <div className="flex items-center justify-between h-full w-full relative ">
          <Box>
            <div className="flex gap-2">
              <span className="gigtitle text-orange-300"> gigtitle:</span>
              <span className="gigtitle text-gray-300"> {gig?.title}</span>
            </div>
            <div className="flex gap-2">
              <span className="gigtitle text-orange-300"> location:</span>
              <span className="gigtitle text-gray-300"> {gig?.location}</span>
            </div>{" "}
            <div className="flex gap-2">
              <span className="gigtitle text-orange-300"> price:</span>
              <span className="gigtitle text-gray-300"> {gig?.price}</span>
            </div>{" "}
          </Box>
          {gig?.postedBy?._id?.includes(currentUser?._id) ? (
            <div className="flex flex-col gap-3">
              <ButtonComponent
                onclick={() => console.log("edit gig")}
                classname="!bg-red-400 w-[60px] h-[22px] font-sans text-[9px] text-white"
                variant="secondary"
                title="Edit gig"
                loading={true}
                loadingtitle="Edit gig"
              />
            </div>
          ) : (
            <Box className="flex flex-col gap-3">
              <PiDotsThreeVerticalBold
                style={{
                  color: "lightgray",
                  position: "absolute",
                  right: 10,
                  top: -6,
                }}
                onClick={() => handleModal(gig)}
              />
              <ButtonComponent
                onclick={() => console.log("book gig")}
                classname="!bg-red-400 w-[60px] h-[22px] font-sans text-[9px] text-white"
                variant="secondary"
                title="Book gig"
                loading={true}
                loadingtitle="Book gig"
              />
            </Box>
          )}
        </div>
        <Box className="bg-zinc-700 shadow-sm shadow-zinc-400 flex items-center justify-around h-[30px] py-4 mt-2">
          <div className="flex gap-2">
            <span className="gigtitle text-orange-300"> status:</span>
            <span className="gigtitle text-red-300">
              {" "}
              {gig?.isPending ? "Pending" : "Available"}
            </span>
          </div>{" "}
          <div className="flex gap-2">
            {gig?.postedBy?.picture && (
              <Avatar
                src={gig?.postedBy?.picture}
                className="!w-[24px] !h-[24px]"
              />
            )}
          </div>
        </Box>
      </section>
    </>
  ); // Example: Displaying the title
};

export default AllGigsComponent;
