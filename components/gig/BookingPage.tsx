import useStore from "@/app/zustand/useStore";
import { useCurrentUser } from "@/hooks/useCurrentUser";
import { useForgetBookings } from "@/hooks/useForgetBooking";
import { useAuth } from "@clerk/nextjs";
import { CircularProgress } from "@mui/material";
import { MessageCircle, X } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { MdAdd } from "react-icons/md";
import Modal from "../Modal";
import { UserProps } from "@/types/userinterfaces";

const BookingPage = () => {
  const { currentgig } = useStore();
  const { userId } = useAuth();
  const { loading, forgetBookings } = useForgetBookings();
  const { user } = useCurrentUser(userId || null);
  const router = useRouter();

  const forget = () => forgetBookings(user?._id || "", currentgig);
  useEffect(() => {
    if (currentgig?.isTaken === true) {
      router.push(`/gigs/${userId}/`);
    }
    if (
      currentgig?.bookCount?.some((myuser) => myuser._id === user?._id) &&
      currentgig?.isTaken === false
    ) {
      router.push(`/execute/${currentgig?._id}`);
    }
  }, [currentgig?.isTaken, currentgig?.isPending]);
  const postedByUser = currentgig?.postedBy;

  const [modal, setModal] = useState<{
    type: "chat" | "video";
    user: UserProps;
  } | null>(null);
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
      <div className="min-h-[130px] w-[90%] mx-auto p-4 bg-zinc-800  shadow-md shadow-zinc-700 my-2 flex flex-col gap-3 rounded-md">
        <h4 className="text-gray-400 text-[13px] font-serif underline underline-offset-2">
          Personal
        </h4>
        <div className="w-full h-[30px] flex justify-end  items-center gap-[86px] ">
          {currentgig?.logo && (
            <Image
              src={currentgig.logo}
              alt="Profile Pic"
              width={30}
              height={30}
              objectFit="cover"
              className="rounded-full text-center"
            />
          )}

          <div className="flex gap-4 items-center">
            <div className="flex items-center ">
              <h4 className="text-gray-300 text-[14px] font-mono font-bold flex items-center gap-1">
                {currentgig?.viewCount?.length}{" "}
                <span className="text-gray-400">views</span>
              </h4>
            </div>
            <div className="flex  items-center bg-neutral-500 py-1 px-2 rounded-md">
              <h4 className="text-gray-300 text-[13px] font-sans">follow</h4>
              <MdAdd
                size="13px"
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
              onClick={() => setModal({ type: "chat", user: postedByUser })}
            />
          </div>
        </div>
        <div className="w-full  h-full flex gap-2 mt-3">
          <h4 className="text-gray-300 text-[13px] font-bold">
            {currentgig?.postedBy?.firstname}
          </h4>{" "}
          <h4 className="text-gray-300 text-[13px] font-bold">
            {currentgig?.postedBy?.lastname}
          </h4>
        </div>
        <div className="w-full  h-full flex gap-2 ">
          <h4 className="text-gray-300 text-[13px] font-bold">
            {currentgig?.postedBy?.username}
          </h4>{" "}
        </div>
      </div>
      <div className="min-h-[160px] w-[90%] mx-auto p-4    shadow-md shadow-zinc-700 my-2">
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
      <div className="min-h-[160px] w-[90%] mx-auto p-4   shadow-md shadow-zinc-700 my-2">
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
      <div className="min-h-[160px] w-[90%] mx-auto p-4   shadow-md shadow-zinc-700 my-2">
        {" "}
        <h4 className="text-gray-400 text-[13px] font-serif underline underline-offset-2">
          More Info
        </h4>
        <div className="w-full  h-full flex flex-col justify-around">
          <h4 className="text-gray-300 text-[13px] font-bold mt-2">
            Gig type:{" "}
            {currentgig?.bussinesscat === "full"
              ? "Full Band"
              : currentgig?.bussinesscat === "personal"
              ? "Individual"
              : currentgig?.bussinesscat === "other"
              ? "Musicians Cocktail"
              : ""}
          </h4>
          {currentgig?.bussinesscat === "other" &&
            currentgig?.bandCategory &&
            currentgig?.bandCategory.length > 0 && (
              <ul className="mt-1">
                {[...new Set(currentgig.bandCategory)].map(
                  (bnd: string, i: number) => (
                    <li key={i} className="text-red-500 text-[13px] font-bold">
                      {bnd}
                    </li>
                  )
                )}
              </ul>
            )}
          <h4 className="text-gray-500 text-[13px] font-bold mt-2">
            Start time: {currentgig?.time?.from}
          </h4>{" "}
          <h4 className="text-gray-500 text-[13px] font-bold mt-2">
            Finish time: {currentgig?.time?.to}
          </h4>{" "}
        </div>
      </div>
      {/* Modal */}
      {modal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm w-[100%] mx-auto h-full">
          <Modal onClose={() => setModal(null)} modal={modal} user={user} />
        </div>
      )}
    </div>
  );
};

export default BookingPage;
