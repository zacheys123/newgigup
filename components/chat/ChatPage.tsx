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

const reactionOptions = ["👍", "😀", "😂", "🔥", "😢", "🎉", "😨", "😡"];

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
    <div className="flex-1 flex flex-col p-4   rounded-sm relative">
      {messages && messages?.length === 0 && (
        <div className="flex p-2 h-[70%] justify-center items-center bg-inherit">
          <p className="text-md font-semibold text-neutral-500">
            Send a message to start a chat.
          </p>
        </div>
      )}

      <div
        ref={messagesContainerRef}
        className="h-[430px] overflow-y-auto px-3"
        style={{
          scrollbarWidth: "none", // Firefox
          msOverflowStyle: "none", // IE/Edge
        }}
      >
        {chatMessages
          .filter((msg: MessageProps) => msg.chatId === chatId)
          .map((msg: MessageProps, index, arr) => {
            const isLastMessage = index === arr.length - 1;
            // const key = msg._id || msg.tempId || uuidv4();
            // console.log("Rendering message with key:", key); // Log the key
            return (
              <div
                key={msg._id || msg.tempId || uuidv4()}
                className={`flex items-end relative ${
                  msg.sender?._id === user?.user?._id ||
                  msg.tempId === user?.user?._id // Ensure compatibility with different message structures
                    ? "justify-end"
                    : "justify-start"
                }`}
                ref={isLastMessage ? lastMessageRef : null}
              >
                {showReaction?.success === true &&
                  messageReactions[msg._id || ""] && (
                    <div className="absolute top-[12px] z-50 right-0 px-3 py-1 bg-gray-800 text-white text-xs rounded-md shadow-md animate-fadeIn">
                      {showReaction?.message
                        ? `'${showReaction?.message}'`
                        : `Reacted with ${reactionOptions[0]}`}
                    </div>
                  )}
                <div
                  className={`relative max-w-xs md:max-w-sm px-4 py-3 text-sm md:text-base rounded-2xl shadow-xl transition-all duration-300 transform my-3 ${
                    msg.sender?._id === user?.user?._id
                      ? "bg-gradient-to-bl from-green-900 via-gray-600 to-blue-700 text-white rounded-br-md self-end"
                      : "bg-gradient-to-r from-amber-900 via-zinc-600  to-amber-400 text-white rounded-bl-md self-start"
                  }`}
                >
                  <span className="block">{msg.content}</span>

                  {/* Timestamp */}
                  <span className="text-[11px] text-gray-300 dark:text-gray-400 mt-1 block text-right">
                    {moment(msg?.createdAt || new Date()).calendar(null, {
                      sameDay: "[Today at] h:mm A",
                      lastDay: "[Yesterday at] h:mm A",
                      lastWeek: "dddd [at] h:mm A",
                      sameElse: "MMMM D [at] h:mm A",
                    })}
                  </span>

                  {/* Reaction Button */}
                  <div className="absolute -bottom-4 right-1">
                    <button
                      className="text-lg hover:scale-110 transition"
                      onClick={() =>
                        setReactionPopup(
                          reactionPopup === msg._id ? "" : msg?._id || ""
                        )
                      }
                    >
                      {msg?.reactions && msg?.sender?._id !== user?.user?._id
                        ? msg?.reactions
                        : messageReactions[msg._id || ""] ||
                          (msg.reactions ?? [])[0] ||
                          "💗"}
                    </button>
                  </div>

                  {/* Reaction Popup */}
                  {reactionPopup === msg._id && (
                    <div className="absolute bottom-[37px] right-2 bg-white dark:bg-gray-800 shadow-md p-2 rounded-lg flex w-full space-x-2 z-50 overflow-x-auto">
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
            );
          })}

        {/* Typing Indicator */}
        {/* {isTyping && !otherUserTyping && (
          <div className="flex items-center space-x-1 text-gray-200 bg-neutral-300 rounded-full w-fit px-2">
            <span className="animate-bounce">•</span>
            <span className="animate-bounce delay-100">•</span>
            <span className="animate-bounce delay-200">•</span>
          </div>
        )}
         */}
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
              {/* Speech bubble tip */}
              <div className="absolute -left-1 bottom-0 w-3 h-3 bg-gray-700 transform -skew-x-12" />

              {/* Bubble body */}
              <motion.div
                className="bg-gradient-to-r from-purple-600 via-cyan-500 to-yellow-500 text-green-500 px-4 py-2 rounded-xl rounded-bl-none shadow-lg"
                whileHover={{ scale: 1.02 }}
                transition={{ type: "spring", stiffness: 400 }}
              >
                <div className="flex space-x-1.5">
                  <motion.span
                    animate={{ y: [0, -4, 0] }}
                    transition={{ repeat: Infinity, duration: 0.8 }}
                    className="block w-2 h-2 rounded-full bg-white"
                  />
                  <motion.span
                    animate={{ y: [0, -4, 0] }}
                    transition={{ repeat: Infinity, duration: 0.8, delay: 0.2 }}
                    className="block w-2 h-2 rounded-full bg-white"
                  />
                  <motion.span
                    animate={{ y: [0, -4, 0] }}
                    transition={{ repeat: Infinity, duration: 0.8, delay: 0.4 }}
                    className="block w-2 h-2 rounded-full bg-white"
                  />
                </div>
              </motion.div>
            </div>
          </motion.div>
        )}
        {/* {otherUserTyping && (
          <div className="text-xs text-gray-400 italic">typing...</div>
        )} */}

        {/* Auto-scroll reference */}
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
