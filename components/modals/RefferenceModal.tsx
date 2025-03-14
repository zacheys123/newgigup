"use client";
import useStore from "@/app/zustand/useStore";
import { Review, UserProps } from "@/types/userinterfaces";
import { fonts } from "@/utils";
import { useAuth } from "@clerk/nextjs";
import { User } from "lucide-react";
import { useRouter } from "next/navigation";
import React from "react";
import { FaComment } from "react-icons/fa";

interface ProfileModalProps {
  user: UserProps;
  getReviews: (reviewdata: Review[]) => void;
}
const RefferenceModal: React.FC<ProfileModalProps> = ({ user, getReviews }) => {
  const router = useRouter();
  const { userId } = useAuth();
  const { setRefferenceModalOpen, setReviewModalOpen } = useStore();

  return (
    <div className="bg-neutral-900 w-full max-w-md rounded-t-lg p-6 relative slide-up min-h-[340px] rounded-tl-[50px] rounded-tr-[50px] pt-12">
      {/* {[...Array(3)].map((i, index) => (
        <div key={index} className="w-full flex justify-center items-center">
          <span className="bg-neutral-400 w-[70%] mx-auto h-[1px] my-1"></span>
        </div>
      ))}{" "} */}
      <div className="w-full flex justify-center items-center flex-col absolute top-1">
        <span className="bg-neutral-600 w-[60%] mx-auto h-[1px] mb-2 rounded-full "></span>

        <span className="bg-neutral-600 w-[60%] mx-auto h-[1px] mb-2 rounded-full "></span>
        <span className="bg-neutral-600 w-[50%] mx-auto h-[1px] mb-2 rounded-full "></span>
      </div>
      <button
        onClick={() => setRefferenceModalOpen(false)}
        className="absolute top-2 right-7 text-gray-300  text-[20px]"
      >
        &times;
      </button>
      <h2
        className="text-2xl font-bold mb-1 text-[20px] text-neutral-300 "
        style={{ fontFamily: fonts[24] }}
      >
        Clients
      </h2>
      <p className="text-neutral-400 mb-3">
        Contact a list of {user?.username} former clients
      </p>
      {user?.refferences?.map(
        ({ _id, firstname, lastname, myreviews }: UserProps) => {
          return (
            <div
              key={_id}
              className="w-full text-white bg-neutral-800 hover:bg-blue-600 rounded-md py-3 px-3 flex gap-2 items-center justify-between my-1"
            >
              <div>
                <span className="text-[18px] font-bold text-gray-500 mr-2">
                  {firstname}
                </span>
                <span className="text-[18px] font-bold text-gray-500 ">
                  {lastname}
                </span>
              </div>
              <div className="flex items-center h-[35px] w-[75px] justify-between">
                <User
                  className="text-[24px] text-blue-600"
                  style={{ fontSize: "24px" }}
                  onClick={() => {
                    setRefferenceModalOpen(false);
                    router.push(`/client/profile/${userId}`);
                  }}
                />
                <FaComment
                  className="text-[24px] text-blue-600"
                  style={{ fontSize: "24px" }}
                  onClick={() => {
                    setRefferenceModalOpen(false);
                    setReviewModalOpen(true);
                    getReviews(myreviews);
                  }}
                />
              </div>
            </div>
          );
        }
      )}
    </div>
  );
};

export default RefferenceModal;
