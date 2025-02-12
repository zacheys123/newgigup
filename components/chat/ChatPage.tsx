import useStore from "@/app/zustand/useStore";
import { useCurrentUser } from "@/hooks/useCurrentUser";
import { MessageProps } from "@/types/chatinterfaces";
import { useAuth } from "@clerk/nextjs";
import { CircularProgress } from "@mui/material";
import moment from "moment";
import { useEffect, useState } from "react";

interface ChatPageProps {
  chatId: string;
}

const reactionOptions = ["👍", "😀", "😂", "🔥", "😢", "🎉", "😨", "😡"];

const ChatPage: React.FC<ChatPageProps> = ({ chatId }) => {
  const {
    messages = [],
    fetchMessages,
    addMessage,
    updateMessageReaction,
  } = useStore();
  const { userId } = useAuth();
  const { user } = useCurrentUser(userId || null);
  const [loading, setLoading] = useState<boolean>(true);
  const [reactionPopup, setReactionPopup] = useState<string>(""); // Track open popups
  const [isTyping] = useState<boolean>(false);
  const [messageReactions, setMessageReactions] = useState<{
    [key: string]: string;
  }>({});

  useEffect(() => {
    const loadMessages = async () => {
      if (chatId) {
        await fetchMessages(chatId);
      }
      setLoading(false);
    };

    loadMessages();
  }, [chatId, addMessage]);

  // Handle sending reaction
  const handleReaction = async (messageId: string, emoji: string) => {
    setMessageReactions((prev) => ({
      ...prev,
      [messageId]: emoji, // Update only this specific message
    }));

    await updateMessageReaction(messageId, emoji); // Send reaction to backend
    setReactionPopup(""); // Close popup after selection
  };
  console.log(reactionPopup);
  if (loading)
    return (
      <div className="text-center text-gray-500 flex justify-center items-center">
        <CircularProgress size="24px" className="animate-spin text-gray-500" />
      </div>
    );

  return (
    <div className="flex flex-col flex-1 p-4 bg-gray-100 dark:bg-gray-900 rounded-lg shadow-md">
      {/* Messages List */}
      <div className="flex-1 overflow-y-auto space-y-4 p-2">
        {messages
          .filter((msg) => msg.chatId === chatId)
          .map((msg: MessageProps) => (
            <div
              key={msg._id}
              className={`flex items-end  ${
                msg.sender?._id === user?._id ? "justify-end" : "justify-start"
              }`}
            >
              <div
                className={`relative max-w-xs md:max-w-sm px-4 py-3 text-sm md:text-base rounded-2xl shadow-xl transition-all duration-300 transform my-3 ${
                  msg.sender?._id === user?._id
                    ? "bg-gradient-to-r from-blue-500 to-blue-700 text-white rounded-br-md self-end"
                    : "bg-gradient-to-r from-amber-500 to-amber-700 text-white rounded-bl-md self-start"
                }`}
              >
                <span className="block">{msg.text}</span>

                {/* Timestamp */}
                <span className="text-[11px] text-gray-300 dark:text-gray-400 mt-1 block text-right">
                  {moment(msg?.createdAt || new Date()).calendar(null, {
                    sameDay: "[Today at] h:mm A",
                    lastDay: "[Yesterday at] h:mm A",
                    lastWeek: "dddd [at] h:mm A",
                    sameElse: "MMMM D [at] h:mm A",
                  })}
                </span>
                <div className="absolute -bottom-4 right-1">
                  <button
                    className="text-lg hover:scale-110 transition"
                    onClick={() =>
                      setReactionPopup(
                        reactionPopup === msg._id ? "" : msg?._id || ""
                      )
                    }
                  >
                    {msg?.reactions
                      ? msg?.reactions
                      : messageReactions[msg._id || ""] ||
                        (msg.reactions ?? [])[0] ||
                        "💗"}
                  </button>
                </div>

                {/* Reaction Popup */}
                {reactionPopup === msg._id && (
                  <div className="absolute bottom-[37px] right-2 bg-white dark:bg-gray-800 shadow-md p-2 rounded-lg flex  w-full space-x-2 z-50 overflow-x-auto">
                    {reactionOptions.map((emoji) => (
                      <button
                        key={emoji}
                        onClick={() => handleReaction(msg._id || "", emoji)}
                        className="text-lg hover:scale-125 transition"
                      >
                        {emoji}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>
          ))}

        {/* Typing Indicator */}
        {isTyping && (
          <div className="flex items-center space-x-1 text-gray-400">
            <span className="animate-bounce">•</span>
            <span className="animate-bounce delay-100">•</span>
            <span className="animate-bounce delay-200">•</span>
            <span className="text-sm">Typing...</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default ChatPage;
