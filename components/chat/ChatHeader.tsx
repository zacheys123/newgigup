import { UserProps } from "@/types/userinterfaces";
import Image from "next/image";
import React from "react";

interface ChatPageProps {
  onClose: () => void;
  modal: {
    user: UserProps;
  };
  user: UserProps;
  // newMessage: string;
  // setNewMessage: (message: string) => void;
  // sendMessage: (e: React.FormEvent) => void;
}
const ChatHeader = ({ onClose, modal }: ChatPageProps) => {
  const isOnline = true;
  const online = "text-green-500 link";
  const offline = "text-red-500 link";
  return (
    <header className="p-4 border-b border-gray-200 dark:border-gray-700 bg-gray-100 dark:bg-gray-800 text-lg font-bold flex justify-between items-center rounded-t-2xl shadow-xl shadow-amber-500">
      <div className="flex flex-col gap-0 justify-center">
        {" "}
        <div className="flex items-center gap-1">
          <div className="relative h-30 w-30 p-[5px] bg-neutral-400  rounded-full">
            <Image
              src={modal.user.picture ? modal.user.picture : ""}
              alt="Profile Pic"
              width={30}
              height={30}
              objectFit="cover"
              className="rounded-full text-center"
            />
            {isOnline === true && (
              <span className="absolute left-2 bottom-1 bg-green-300 animate-pulse w-2 h-2 z-55 rounded-full"></span>
            )}
          </div>
          <span className="text-neutral-500 dark:text-gray-200">{`Chat with ${modal.user.firstname}`}</span>
        </div>
        <span className={isOnline ? online : offline}>
          {isOnline ? "Online" : "Offline"}
        </span>
      </div>
      <button
        onClick={onClose}
        className="text-gray-500 dark:text-gray-400 hover:text-red-500 transition-colors"
      >
        ✖
      </button>
    </header>
  );
};

export default ChatHeader;
