import useStore from "@/app/zustand/useStore";
import { useForgetBookings } from "@/hooks/useForgetBooking";
import { useAuth } from "@clerk/nextjs";
import { CircularProgress } from "@mui/material";
import { EyeIcon, MessageCircle, X } from "lucide-react";
import Image from "next/image";
import React from "react";
import { MdAdd } from "react-icons/md";

const BookingPage = () => {
  const { currentgig } = useStore();
  const { userId } = useAuth();
  const { loading, forgetBookings } = useForgetBookings();

  const forget = () => forgetBookings(userId || "", currentgig);

  return (
    <div className="h-[83%] w-full overflow-y-auto relative">
      <div className="absolute w-[40px] h-[40px] flex  justify-center items-center right-5 top-[460px] opacity-85 rounded-md  animate-pulse  shadow shadow-slate-400   bg-gray-800">
        {" "}
        {!loading ? (
          <X
            size="24"
            style={{
              cursor: "pointer",
              color: "red",
              fontWeight: "bold",
            }}
            className="shadow shadow-red-200 "
            onClick={forget}
          />
        ) : (
          <CircularProgress
            size="20px"
            color="primary"
            style={{
              marginLeft: "10px",
              cursor: "pointer",
              color: "white",
              fontWeight: "bold",
            }}
          />
        )}
      </div>
      <div className="h-[130px] w-[90%] mx-auto p-4 bg-slate-700  shadow-md shadow-zinc-700 my-4 flex flex-col gap-3">
        <h4 className="text-gray-400 text-[13px] font-serif underline underline-offset-2">
          Personal
        </h4>
        <div className="w-full h-[30px] flex justify-end  items-center gap-[110px] ">
          {currentgig?.postedBy?.picture && (
            <Image
              src={currentgig.postedBy.picture}
              alt="Profile Pic"
              width={30}
              height={30}
              objectFit="cover"
              className="rounded-full text-center"
            />
          )}

          <div className="flex gap-4 items-center">
            <div className="flex items-center ">
              <h4 className="text-gray-400 text-[14px] font-mono font-bold">
                {currentgig?.viewCount?.length}
              </h4>
              <EyeIcon
                size="17"
                style={{
                  marginLeft: "5px",
                  cursor: "pointer",
                  color: "white",
                }}
              />
            </div>
            <div className="flex  items-center">
              <h4 className="text-gray-400 text-[13px] font-sans">follow</h4>
              <MdAdd
                size="21px"
                style={{
                  marginLeft: "5px",
                  cursor: "pointer",
                  color: "white",
                }}
              />
            </div>
            <MessageCircle
              size="21px"
              style={{
                marginLeft: "10px",
                cursor: "pointer",
                color: "white",
              }}
            />
          </div>
        </div>
        <div className="w-full  h-full flex justify-around">
          <h4 className="text-gray-300 text-[13px] font-bold">
            {currentgig?.postedBy?.firstname}
          </h4>{" "}
          <h4 className="text-gray-300 text-[13px] font-bold">
            {currentgig?.postedBy?.lastname}
          </h4>
        </div>
      </div>
      <div className="min-h-[130px] w-[90%] mx-auto p-4 bg-orange-900   shadow-md shadow-zinc-700 my-4">
        {" "}
        <h4 className="text-gray-400 text-[13px] font-serif underline underline-offset-2">
          GigInfo
        </h4>{" "}
        <div className="w-full  h-full flex flex-col justify-around">
          <h4 className="text-gray-300 text-[13px] font-bold">
            {currentgig?.title || "No Title Available"}
          </h4>
          <h4 className="text-gray-300 text-[13px] font-bold mt-2">
            {currentgig?.description}
          </h4>
          <h4 className="text-gray-300 text-[13px] font-bold mt-2">
            location: {currentgig?.location}
          </h4>{" "}
        </div>
      </div>
      <div className="min-h-[130px] w-[90%] mx-auto p-4 bg-rose-900  shadow-md shadow-zinc-700 my-4">
        {" "}
        <h4 className="text-gray-400 text-[13px] font-serif underline underline-offset-2">
          BussinessInfo
        </h4>
        <div className="w-full  h-full flex flex-col justify-around">
          <h4 className="text-gray-300 text-[13px] font-bold mt-2">
            price: {currentgig?.price}
          </h4>{" "}
          <h4 className="text-gray-300 text-[13px] font-bold mt-2">
            contact: {currentgig?.phone}
          </h4>{" "}
          <h4 className="text-gray-300 text-[13px] font-bold mt-2">
            email: {currentgig?.postedBy?.email}
          </h4>{" "}
        </div>
      </div>
      <div className="min-h-[130px] w-[90%] mx-auto p-4 bg-gray-300  shadow-md shadow-zinc-700 my-4">
        {" "}
        <h4 className="text-gray-500 text-[13px] font-serif underline underline-offset-2">
          More Info
        </h4>
        <div className="w-full  h-full flex flex-col justify-around">
          <h4 className="text-gray-600 text-[13px] font-bold mt-2">
            Gig type:{" "}
            {currentgig?.bussinesscat === "full"
              ? "Full Band"
              : currentgig?.bussinesscat === "personal"
              ? "Individual"
              : "Other"}
            {currentgig?.bussinesscat === "other" &&
              currentgig?.bandCategory &&
              currentgig?.bandCategory.map((bnd: string) => (
                <ul key={bnd}>
                  <li className="text-gray-600 text-[13px] font-bold mt-2">
                    {bnd}
                  </li>
                </ul>
              ))}
          </h4>{" "}
          <h4 className="text-gray-700 text-[13px] font-bold mt-2">
            Start time: {currentgig?.time?.from}
          </h4>{" "}
          <h4 className="text-gray-700 text-[13px] font-bold mt-2">
            Finish time: {currentgig?.time?.to}
          </h4>{" "}
        </div>
      </div>
    </div>
  );
};

export default BookingPage;
