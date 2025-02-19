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
      className="p-3  border-gray-300 dark:border-gray-700 flex items-center gap-3 bg-gray-100 dark:bg-gray-800 rounded-b-2xl"
    >
      <div className=" bg-neutral-100 rounded-full -px-2 w-full   flex items-center gap-1">
        <span className="hover:cursor-pointer w-[26px]">🙂</span>
        <input
          type="text"
          placeholder="Type a message..."
          className="flex-1 px-4 py-2 text-sm md:text-base rounded-lg border border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-400 bg-white dark:bg-gray-900 text-gray-600 transition-all"
          value={newMessage}
          onChange={(e) => {
            handleTyping(e);
            setNewMessage(e.target.value);
          }}
        />
        <button
          type="submit"
          className="px-4 py-2 text-sm md:text-base font-semibold bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-all"
        >
          Send
        </button>
      </div>
    </form>
  );
};

export default ChatInput;
