import { UserProps } from "@/types/userinterfaces";
import React from "react";

interface ChatPageProps {
  onClose: () => void;
  modal: {
    user: UserProps;
  };
  messages: { senderId: string; text: string }[];
  user: UserProps;
  newMessage: string;
  setNewMessage: (message: string) => void;
  sendMessage: (e: React.FormEvent) => void;
}

const ChatPage: React.FC<ChatPageProps> = ({
  onClose,
  modal,
  messages,
  user,
  newMessage,
  setNewMessage,
  sendMessage,
}) => {
  return (
    <section className="w-full max-w-lg sm:max-w-xl h-[500px] flex flex-col border border-gray-300 dark:border-gray-700 rounded-2xl shadow-2xl bg-white dark:bg-gray-900">
      {/* Header */}
      <header className="p-4 border-b border-gray-200 dark:border-gray-700 bg-gray-100 dark:bg-gray-800 text-lg font-bold flex justify-between items-center rounded-t-2xl">
        <span className="text-gray-900 dark:text-gray-200">{`Chat with ${modal.user.firstname}`}</span>
        <button
          onClick={onClose}
          className="text-gray-500 dark:text-gray-400 hover:text-red-500 transition-colors"
        >
          ✖
        </button>
      </header>

      {/* Chat Messages Container */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 scrollbar-thin scrollbar-thumb-gray-400 scrollbar-track-gray-200 dark:scrollbar-thumb-gray-600 dark:scrollbar-track-gray-800">
        {messages.map((msg, index) => (
          <div
            key={index}
            className={`flex ${
              msg.senderId === user._id ? "justify-end" : "justify-start"
            }`}
          >
            <div
              className={`max-w-xs px-4 py-3 text-sm md:text-base rounded-2xl shadow-md ${
                msg.senderId === user._id
                  ? "bg-blue-500 text-white rounded-br-none"
                  : "bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-gray-100 rounded-bl-none"
              }`}
            >
              {msg.text}
            </div>
          </div>
        ))}
      </div>

      {/* Input Box */}
      <form
        onSubmit={sendMessage}
        className="p-3 border-t border-gray-200 dark:border-gray-700 flex items-center gap-3 bg-gray-100 dark:bg-gray-800 rounded-b-2xl"
      >
        <input
          type="text"
          placeholder="Type a message..."
          className="flex-1 px-4 py-2 text-sm md:text-base rounded-lg border border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-400 bg-white dark:bg-gray-900 dark:text-gray-200 transition-all"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
        />
        <button
          type="submit"
          className="px-4 py-2 text-sm md:text-base font-semibold bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-all"
        >
          Send
        </button>
      </form>
    </section>
  );
};

export default ChatPage;
