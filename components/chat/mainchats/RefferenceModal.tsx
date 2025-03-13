"use client";
import useStore from "@/app/zustand/useStore";
import { UserProps } from "@/types/userinterfaces";
import { fonts } from "@/utils";
import { User } from "lucide-react";
import React from "react";
import { GiChatBubble } from "react-icons/gi";

interface ProfileModalProps {
  user: UserProps;
}
const RefferenceModal: React.FC<ProfileModalProps> = ({ user }) => {
  const { setRefferenceModalOpen } = useStore();
  return (
    <div className="bg-neutral-900 w-full max-w-md rounded-t-lg p-6 relative slide-up min-h-[300px] rounded-tl-[50px] rounded-tr-[50px]">
      {" "}
      <button
        onClick={() => setRefferenceModalOpen(false)}
        className="absolute top-2 right-12 text-gray-300  text-[20px]"
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
        Contact a list of {user?.firstname} former clients
      </p>
      {user?.refferences?.map((ref: UserProps) => {
        return (
          <div
            key={ref._id}
            className="w-full text-white bg-neutral-800 hover:bg-blue-600 rounded-md py-3 px-3 flex gap-2 items-center justify-between my-1"
          >
            <div>
              <span className="text-[18px] font-bold text-gray-500 mr-2">
                {ref.firstname}
              </span>
              <span className="text-[18px] font-bold text-gray-500 ">
                {ref.lastname}
              </span>
            </div>
            <div className="flex items-center h-[35px] w-[75px] justify-between">
              <User
                className="text-[24px] text-blue-600 "
                style={{ fontSize: "24px" }}
                onClick={() => setRefferenceModalOpen(false)}
              />
              <GiChatBubble
                className="text-[24px] text-blue-600"
                style={{ fontSize: "24px" }}
                onClick={() => setRefferenceModalOpen(false)}
              />
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default RefferenceModal;
