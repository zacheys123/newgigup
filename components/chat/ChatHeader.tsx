import { UserProps } from "@/types/userinterfaces";
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
  return (
    <header className="p-4 border-b border-gray-200 dark:border-gray-700 bg-gray-100 dark:bg-gray-800 text-lg font-bold flex justify-between items-center rounded-t-2xl">
      <span className="text-gray-900 dark:text-gray-200">{`Chat with ${modal.user.firstname}`}</span>
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
