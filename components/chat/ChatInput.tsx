import { Send } from "lucide-react";
import React, { ChangeEvent } from "react";

interface ChatInputProps {
  newMessage: string;
  setNewMessage: (message: string) => void;
  sendMessage: (e: React.FormEvent) => void;
  handleTyping: () => void;
}

const ChatInput = ({
  newMessage,
  setNewMessage,
  sendMessage,
  handleTyping,
}: ChatInputProps) => {
  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setNewMessage(e.target.value);
    if (e.target.value) {
      handleTyping();
    }
  };

  return (
    <form
      onSubmit={sendMessage}
      className="w-full flex items-center gap-2 bg-inherit rounded-lg"
    >
      <div className="flex-1 flex items-center gap-2 rounded-full p-1">
        <input
          autoFocus
          type="text"
          placeholder="Type a message..."
          className="flex-1 px-4 py-2 text-sm md:text-base rounded-full border-none focus:outline-none focus:ring-2 focus:ring-blue-400 bg-transparent text-gray-200 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 transition-all shadow-sm shadow-slate-600"
          value={newMessage}
          onChange={handleChange}
        />
        <button
          type="submit"
          className="text-sm md:text-base font-semibold text-white rounded-full transition-all transform hover:scale-105 active:scale-95 shadow-md"
        >
          <Send className="w-25 h-25 text-yellow-500" />
        </button>
      </div>
    </form>
  );
};

export default ChatInput;
