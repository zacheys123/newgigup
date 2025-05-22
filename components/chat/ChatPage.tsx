import { useEffect, useRef, useState } from "react";
import useStore from "@/app/zustand/useStore";
import { useCurrentUser } from "@/hooks/useCurrentUser";
import { MessageProps } from "@/types/chatinterfaces";

import { CircularProgress } from "@mui/material";
import moment from "moment";
import useSocket from "@/hooks/useSocket";
import { unstable_batchedUpdates } from "react-dom";
import { v4 as uuidv4 } from "uuid"; // Install uuid: npm install uuid
import { motion } from "framer-motion";

interface ChatPageProps {
  chatId: string;
  modal: string;
  otherUserTyping: boolean;
}
interface ReactionsProps {
  success: boolean;
  message: string;
}
const reactionOptions = [
  { emoji: "👍", name: "Thumbs Up" },
  { emoji: "😀", name: "Grinning Face" },
  { emoji: "😂", name: "Tears of Joy" },
  { emoji: "🔥", name: "Fire" },
  { emoji: "😢", name: "Crying Face" },
  { emoji: "🎉", name: "Party Popper" },
  { emoji: "😨", name: "Fearful Face" },
  { emoji: "😡", name: "Angry Face" },
];
const ChatPage: React.FC<ChatPageProps> = ({ chatId, otherUserTyping }) => {
  const { messages, fetchMessages, updateMessageReaction } = useStore();

  const { user } = useCurrentUser();
  const [loading, setLoading] = useState<boolean>(true);
  const [reactionPopup, setReactionPopup] = useState<string>("");

  const [messageReactions, setMessageReactions] = useState<{
    [key: string]: string;
  }>({});
  const messagesContainerRef = useRef<HTMLDivElement | null>(null);
  const lastMessageRef = useRef<HTMLDivElement | null>(null);
  const [showReaction, setShowReaction] = useState<ReactionsProps>();
  const { socket } = useSocket();
  useEffect(() => {
    const loadMessages = async () => {
      if (chatId) {
        await fetchMessages(chatId);
      }
      setLoading(false);
    };

    loadMessages();
  }, [chatId]);

  const handleReaction = (messageId: string, emoji: string) => {
    if (!socket) return;
    setMessageReactions((prev) => ({
      ...prev,
      [messageId]: emoji,
    }));
    updateMessageReaction(messageId, emoji, setShowReaction);
    socket.emit("messageReaction", { messageId, emoji });

    setReactionPopup("");
  };
  // Listen for real-time reaction updates
  useEffect(() => {
    if (!socket) return;
    socket.on("updateMessageReaction", ({ messageId, emoji }) => {
      unstable_batchedUpdates(() => {
        setMessageReactions((prev) => ({
          ...prev,
          [messageId]: emoji,
        }));
      });
    });

    return () => {
      socket.off("updateMessageReaction");
    };
  }, [socket]);
  // Smooth Auto-Scrolling
  useEffect(() => {
    const container = messagesContainerRef.current;
    if (!container) return;

    // Only scroll if user is near bottom
    const isNearBottom =
      container.scrollHeight - container.scrollTop - container.clientHeight <
      100;

    if (isNearBottom) {
      setTimeout(() => {
        container.scrollTo({
          top: container.scrollHeight,
          behavior: "smooth",
        });
      }, 100);
    }
  }, [messages, otherUserTyping]);

  useEffect(() => {
    fetchMessages(chatId); // Fetch messages when chatId changes
  }, [chatId]);

  // Filter messages for the current chat
  const chatMessages = (messages ?? []).filter((msg) => msg.chatId === chatId);
  if (loading)
    return (
      <div className="h-full w-full text-gray-500 flex justify-center items-center ">
        <CircularProgress size="24px" className="animate-spin text-gray-500" />
      </div>
    );

  return (
    <div className="flex-1 flex flex-col p-2 sm:p-4 rounded-sm relative h-full">
      {messages && messages?.length === 0 && (
        <div className="flex p-2 h-[70vh] justify-center items-center bg-inherit">
          <p className="text-sm sm:text-md font-semibold text-neutral-500 text-center">
            Send a message to start a chat.
          </p>
        </div>
      )}

      <div
        ref={messagesContainerRef}
        className="h-[calc(100vh-180px)] sm:h-[calc(100vh-160px)] overflow-y-auto px-1 sm:px-3"
        style={{
          scrollbarWidth: "none",
          msOverflowStyle: "none",
        }}
      >
        {chatMessages
          .filter((msg: MessageProps) => msg.chatId === chatId)
          .map((msg: MessageProps, index, arr) => {
            const isLastMessage = index === arr.length - 1;
            return (
              <div
                key={msg._id || msg.tempId || uuidv4()}
                className={`flex items-end relative ${
                  msg.sender?._id === user?.user?._id ||
                  msg.tempId === user?.user?._id
                    ? "justify-end"
                    : "justify-start"
                }`}
                ref={isLastMessage ? lastMessageRef : null}
              >
                {showReaction?.success === true &&
                  messageReactions[msg._id || ""] && (
                    <div className="absolute top-[8px] sm:top-[12px] z-50 right-0 px-2 sm:px-3 py-1 bg-gray-800 text-white text-[10px] sm:text-xs rounded-md shadow-md animate-fadeIn">
                      {showReaction?.message
                        ? `'${showReaction?.message}'`
                        : `Reacted with ${reactionOptions[0].emoji}`}
                    </div>
                  )}
                <div
                  className={`relative max-w-[85%] xs:max-w-xs sm:max-w-md px-2 sm:px-3 py-1 sm:py-2 text-xs sm:text-sm md:text-base rounded-lg my-1 ${
                    msg.sender?._id === user?.user?._id
                      ? "bg-[#D9FDD3] ml-auto rounded-tr-none"
                      : "bg-white mr-auto rounded-tl-none"
                  }`}
                  style={{
                    boxShadow: "0 1px 0.5px rgba(0,0,0,0.13)",
                    wordBreak: "break-word",
                  }}
                >
                  <span className="block text-neutral-600">{msg.content}</span>

                  <div className="flex justify-end items-center mt-0.5 sm:mt-1 space-x-1">
                    <span className="text-[10px] sm:text-xs text-gray-500 opacity-80">
                      {moment(msg?.createdAt || new Date()).format("h:mm A")}
                    </span>
                    {msg.sender?._id === user?.user?._id && (
                      <span
                        className={`text-[10px] sm:text-xs ${
                          !msg.read ? "text-gray-500" : "text-blue-500"
                        }`}
                      >
                        ✓✓
                      </span>
                    )}
                  </div>

                  <div className="absolute -bottom-2.5 sm:-bottom-3 right-0 flex items-center">
                    <button
                      className={`text-xs sm:text-sm rounded-full p-0.5 sm:p-1 transition-all duration-200 ${
                        reactionPopup === msg._id
                          ? "bg-gray-200 dark:bg-gray-700 scale-110"
                          : "bg-white dark:bg-gray-800 shadow-sm hover:scale-110"
                      }`}
                      onClick={() =>
                        setReactionPopup(
                          reactionPopup === msg._id ? "" : msg?._id || ""
                        )
                      }
                    >
                      {msg?.reactions ? (
                        <span className="flex items-center justify-center w-4 h-4 sm:w-5 sm:h-5">
                          {msg.reactions}
                        </span>
                      ) : (
                        <span className="text-gray-500 text-[10px] sm:text-xs">
                          •••
                        </span>
                      )}
                    </button>
                  </div>

                  {reactionPopup === msg._id && (
                    <div className="absolute bottom-6 sm:bottom-8 right-0 bg-white dark:bg-gray-800 shadow-xl rounded-full flex px-1 sm:px-2 py-0.5 sm:py-1 z-50 border border-gray-100 dark:border-gray-600">
                      <div className="flex space-x-0.5 sm:space-x-1">
                        {reactionOptions.map(({ emoji, name }) => (
                          <button
                            key={emoji}
                            onClick={() => {
                              handleReaction(msg._id || "", emoji);
                              setReactionPopup("");
                            }}
                            className={`text-lg sm:text-xl w-6 h-6 sm:w-8 sm:h-8 flex items-center justify-center rounded-full transition-all duration-100 ${
                              msg.reactions === emoji ||
                              messageReactions[msg._id || ""] === emoji
                                ? "bg-blue-100 dark:bg-blue-900 scale-110 sm:scale-125"
                                : "hover:bg-gray-100 dark:hover:bg-gray-700 hover:scale-105 sm:hover:scale-110"
                            }`}
                            title={name}
                            aria-label={`React with ${name}`}
                          >
                            {emoji}
                            {(msg.reactions === emoji ||
                              messageReactions[msg._id || ""] === emoji) && (
                              <span className="absolute -bottom-1 text-[8px] sm:text-[10px] text-blue-500 dark:text-blue-300">
                                ✓
                              </span>
                            )}
                          </button>
                        ))}
                      </div>
                      <button
                        className="ml-1 sm:ml-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 text-xs sm:text-sm"
                        onClick={() => setReactionPopup("")}
                      >
                        ×
                      </button>
                    </div>
                  )}
                </div>
              </div>
            );
          })}

        {otherUserTyping && (
          <motion.div
            initial={{ y: 10, opacity: 0, scale: 0.9 }}
            animate={{
              y: 0,
              opacity: 1,
              scale: 1,
              transition: {
                type: "spring",
                stiffness: 500,
                damping: 30,
              },
            }}
            exit={{
              y: 10,
              opacity: 0,
              scale: 0.9,
              transition: { duration: 0.2 },
            }}
            className="flex justify-start mb-2"
          >
            <div className="relative">
              <div className="absolute -left-1 bottom-0 w-2 h-2 sm:w-3 sm:h-3 bg-gray-700 transform -skew-x-12" />
              <motion.div
                className="bg-gradient-to-r from-purple-600 via-cyan-500 to-yellow-500 px-3 py-1 sm:px-4 sm:py-2 rounded-xl rounded-bl-none shadow-lg"
                whileHover={{ scale: 1.02 }}
                transition={{ type: "spring", stiffness: 400 }}
              >
                <div className="flex space-x-1 sm:space-x-1.5">
                  <motion.span
                    animate={{ y: [0, -3, 0] }}
                    transition={{ repeat: Infinity, duration: 0.8 }}
                    className="block w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full bg-white"
                  />
                  <motion.span
                    animate={{ y: [0, -3, 0] }}
                    transition={{
                      repeat: Infinity,
                      duration: 0.8,
                      delay: 0.2,
                    }}
                    className="block w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full bg-white"
                  />
                  <motion.span
                    animate={{ y: [0, -3, 0] }}
                    transition={{
                      repeat: Infinity,
                      duration: 0.8,
                      delay: 0.4,
                    }}
                    className="block w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full bg-white"
                  />
                </div>
              </motion.div>
            </div>
          </motion.div>
        )}
      </div>
      <style jsx>{`
        .overflow-y-auto::-webkit-scrollbar {
          display: none;
          width: 0;
          height: 0;
          background: transparent;
        }
      `}</style>
    </div>
  );
};

export default ChatPage;
