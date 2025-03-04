import { Feather } from "lucide-react";
import React, { ChangeEvent } from "react";

interface ChatInputProps {
  newMessage: string;
  setNewMessage: (message: string) => void;
  sendMessage: (e: React.FormEvent) => void;
  handleTyping: (e: ChangeEvent<HTMLInputElement>) => void;
}

const ChatInput = ({
  newMessage,
  setNewMessage,
  sendMessage,
  handleTyping,
}: ChatInputProps) => {
  return (
    <form
      onSubmit={sendMessage}
      className="w-full flex items-center gap-2 bg-inherit rounded-lg "
    >
      <div className="flex-1 flex items-center gap-2  rounded-full  p-1">
        <input
          type="text"
          placeholder="Type a message..."
          className="flex-1 px-4 py-2 text-sm md:text-base rounded-full border-none focus:outline-none focus:ring-2 focus:ring-blue-400 bg-transparent text-gray-200 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 transition-all shadow-sm shadow-slate-600"
          value={newMessage}
          onChange={(e) => {
            handleTyping(e);
            setNewMessage(e.target.value);
          }}
        />
        <button
          type="submit"
          className="px-4 py-2 text-sm md:text-base font-semibold  text-white rounded-full transition-all transform hover:scale-105 active:scale-95 shadow-md "
        >
          <Feather />
        </button>
      </div>
    </form>
  );
};

export default ChatInput;
