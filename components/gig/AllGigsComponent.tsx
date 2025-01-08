// components/gig/AllGigsComponent.ts
import { GigProps } from "@/types/giginterface";
import { Box, Divider } from "@mui/material";
import React, { useState } from "react";
import ButtonComponent from "../ButtonComponent";
import { PiDotsThreeVerticalBold } from "react-icons/pi";
import GigDescription from "./GigDescription";
import useStore from "@/app/zustand/useStore";
import { useRouter } from "next/navigation";
import { bookGig } from "@/hooks/bookGig";
import { useAllGigs } from "@/hooks/useAllGigs";
import { toast } from "react-toastify";
import { useAuth } from "@clerk/nextjs";
// import { ArrowRight } from "lucide-react";
import Image from "next/image";
interface FetchResponse {
  success: boolean;
  message?: string;
  // Add other fields as per your API response
}
interface AllGigsComponentProps {
  gig: GigProps;
}

const AllGigsComponent: React.FC<AllGigsComponentProps> = ({ gig }) => {
  const { userId } = useAuth();
  const [loadingPostId, setLoadingPostId] = useState<string>("");
  const [gigdesc, setGigdesc] = useState<boolean>(false);
  const [open, setOpen] = useState<boolean>(false);
  const { gigs } = useAllGigs() || { gigs: [] }; // Default to empty array if null or undefined

  const handleClose = () => {
    setOpen(false);
    console.log("close", gigdesc);
  };
  const { currentUser } = useStore();
  const myId = currentUser?._id;
  const router = useRouter();
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
  // Booking function it updates the isPending state
  const handleEditBooked = async (id: string) => {
    router.push(`/execute/${id}`);
  };
  const handleEdit = async (id: string) => {
    router.push(`/editpage/edit/${id}`);
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
          {gig && (
            <div>
              <div className="flex flex-col gap-3">
                {/* <ButtonComponent
                onclick={() => console.log("edit gig")}
                classname="!bg-red-400 w-[60px] h-[22px] font-sans text-[9px] text-white"
                variant="secondary"
                title="Edit gig"
                loading={true}
                loadingtitle="Edit gig"
              /> */}

                {gig.bookedBy?._id &&
                  gig.bookedBy._id.includes(myId) &&
                  gig?.isPending && (
                    <div className="w-full text-right ">
                      <ButtonComponent
                        variant="secondary"
                        classname="!bg-purple-600 h-[20px] text-[8px]   font-bold whitespace-nowrap text-red-200  mt-5"
                        onclick={() => {
                          setLoadingPostId(gig?._id || "");

                          setTimeout(() => {
                            handleEditBooked(gig?._id || "");
                            setLoadingPostId("");
                          }, 2000);
                        }}
                        title={
                          loadingPostId === gig._id
                            ? "viewing....!!"
                            : "View Booked Gig!!!"
                        }
                      />
                    </div>
                  )}

                {gig.postedBy?._id &&
                  gig?.isPending === false &&
                  gig.postedBy?._id.includes(myId) &&
                  gig?.isTaken === false && (
                    <div className="w-full text-right ">
                      <ButtonComponent
                        variant="secondary"
                        classname="!bg-gray-200 h-[20px] text-[8px]  font-bold w-[60px] text-gray-700 mt-5 "
                        onclick={() => {
                          setLoadingPostId(gig?._id || "");

                          setTimeout(() => {
                            handleEdit(gig?._id || "");
                            setLoadingPostId("");
                          }, 2000);
                        }}
                        title={
                          loadingPostId === gig._id
                            ? "editing gig..."
                            : "Edit Gig!!!!!!"
                        }
                      />
                    </div>
                  )}
              </div>

              <Box className="flex flex-col gap-3 ">
                <PiDotsThreeVerticalBold
                  style={{
                    color: "lightgray",
                    position: "absolute",
                    right: 10,
                    top: -6,
                  }}
                  onClick={() => handleModal(gig)}
                />
                {gig.postedBy?._id &&
                  !gig.postedBy._id.includes(myId) &&
                  !gig?.isPending &&
                  gig?.isTaken === false && (
                    <div className="w-full text-right p-1  ">
                      <ButtonComponent
                        variant="secondary"
                        classname="!bg-red-400 h-[20px] text-[8px]  font-bold w-[60px] text-white  mt-5"
                        onclick={() => {
                          setLoadingPostId(gig?._id || "");
                          setTimeout(() => {
                            // After the operation, you can handle the logic for reading the post
                            bookGig(
                              gig,
                              myId,
                              gigs?.gigs || [],
                              userId || "",
                              toast,
                              router
                            );

                            // Reset the loading state after reading
                            setLoadingPostId("");
                          }, 2000);
                        }}
                        title={
                          loadingPostId === gig?._id ? "Booking..." : "Book Gig"
                        }
                      />
                    </div>
                  )}

                {gig.postedBy?._id &&
                  gig?.postedBy?._id.includes(myId) &&
                  gig?.isPending === true && (
                    <div className="w-full text-right">
                      <ButtonComponent
                        variant="secondary"
                        classname=" h-[20px] text-[8px] m-2 font-bold"
                        onclick={() => {
                          setLoadingPostId(gig?._id || "");

                          setTimeout(() => {
                            router.push(`/execute/${gig?._id}`);
                            setLoadingPostId("");
                          }, 2000);
                        }}
                        title={
                          loadingPostId === gig._id
                            ? "viewing..."
                            : "View Gig Details!!"
                        }
                      />
                    </div>
                  )}
              </Box>
            </div>
          )}
        </div>
        {/* {gig?.isTaken === false ? (
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
        ) : (
          <Box className="bg-green-700 shadow-sm shadow-zinc-400 flex items-center justify-around h-[30px] py-4 mt-2">
            {" "}
            <div className="flex gap-2 items-center ">
              <span className="gigtitle text-orange-300"> status:</span>
              <span className="gigtitle text-red-300">
                {" "}
                {gig?.isTaken && "Taken"}
              </span>
            </div>{" "}
            <div className="flex gap-2">
              <span className="gigtittle text-gray-300">By:</span>
              <span className="flex gigtittle">{gig?.bookedBy?.firstname}</span>
              <ArrowRight />
            </div>
          </Box> */}
        {/* )} */}
        <Divider />{" "}
        <div className="flex justify-between items-center mt-2">
          <div className={gig?.isPending ? " flex " : "flex w-[60%]"}>
            {" "}
            <div className=" w-[80%] flex">
              <span
                className={
                  !gig?.isPending
                    ? " tracking-tighter font-bold text-red-400 text-[11px] mr-1"
                    : " "
                }
              >
                {gig?.isPending == false ? "    Status:" : ""}
              </span>
              <div className="titler text-red-700 font-bold line-clamp-1 no-underline ">
                {!gig?.isTaken ? (
                  <span
                    className={
                      gig?.isPending == false
                        ? " track-tighter bg-sky-500  p-2 rounded-full text-[11px]  text-white "
                        : ""
                    }
                  >
                    {gig?.isPending == false ? "Avaliable" : ""}
                  </span>
                ) : (
                  <span className=" bg-green-500 p-2 rounded-full text-[11px]  text-white">
                    Taken
                  </span>
                )}
              </div>
            </div>
            {!gig?.bookedBy?.clerkId.includes(userId || "") && (
              <>
                {gig?.isPending && (
                  <h6 className="titler bg-red-700 h-[24px] font-bold whitespace-nowrap text-white p-1 flex">
                    Not Available for now
                  </h6>
                )}
              </>
            )}
          </div>
          {gig?.isTaken ? (
            <div
              className="flex-1 bg-gray-300 px-3  rounded-tl-sm rounded-r-3xl rounded-b-2xl"
              onClick={() => router.push(`/execute/${gig?._id}`)}
            >
              <h4 className="text-[10px] !text-orange-500 font-bold ">
                Review Musician
              </h4>
            </div>
          ) : (
            <div>
              <span className="titler text-red-700 font-bold line-clamp-1 ">
                {gig?.bookedBy?.picture && (
                  <Image
                    src={gig?.bookedBy?.picture}
                    alt="p"
                    width={25}
                    height={25}
                    className="w-[25px] h-[25px] rounded-full"
                  />
                )}
              </span>
            </div>
          )}
        </div>
      </section>
    </>
  ); // Example: Displaying the title
};

export default AllGigsComponent;
