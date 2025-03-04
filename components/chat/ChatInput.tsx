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
      className="w-full flex items-center gap-2 bg-white dark:bg-gray-800 rounded-lg "
    >
      <div className="flex-1 flex items-center gap-2 bg-gray-100 dark:bg-gray-700 rounded-full p-1">
        <input
          type="text"
          placeholder="Type a message..."
          className="flex-1 px-4 py-2 text-sm md:text-base rounded-full border-none focus:outline-none focus:ring-2 focus:ring-blue-400 bg-transparent text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 transition-all"
          value={newMessage}
          onChange={(e) => {
            handleTyping(e);
            setNewMessage(e.target.value);
          }}
        />
        <button
          type="submit"
          className="px-4 py-2 text-sm md:text-base font-semibold bg-blue-500 text-white rounded-full hover:bg-blue-600 active:bg-blue-700 transition-all transform hover:scale-105 active:scale-95 shadow-md "
        >
          Send
        </button>
      </div>
    </form>
  );
};

export default ChatInput;
