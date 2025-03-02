import { useEffect, useRef, useState } from "react";
import useStore from "@/app/zustand/useStore";
import { useCurrentUser } from "@/hooks/useCurrentUser";
import { MessageProps } from "@/types/chatinterfaces";
import { useAuth } from "@clerk/nextjs";
import { CircularProgress } from "@mui/material";
import moment from "moment";
import useSocket from "@/hooks/useSocket";
import { unstable_batchedUpdates } from "react-dom";
import { v4 as uuidv4 } from "uuid"; // Install uuid: npm install uuid

interface ChatPageProps {
  chatId: string;
  modal: string;
}
interface ReactionsProps {
  success: boolean;
  message: string;
}

const reactionOptions = ["👍", "😀", "😂", "🔥", "😢", "🎉", "😨", "😡"];

const ChatPage: React.FC<ChatPageProps> = ({ chatId }) => {
  const { messages, fetchMessages, updateMessageReaction } = useStore();
  const { userId } = useAuth();
  const { user } = useCurrentUser(userId || null);
  const [loading, setLoading] = useState<boolean>(true);
  const [reactionPopup, setReactionPopup] = useState<string>("");
  const [
    isTyping,
    //  setIsTyping
  ] = useState<boolean>(false);
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
    const scrollToBottom = () => {
      if (messagesContainerRef.current && lastMessageRef.current) {
        setTimeout(() => {
          lastMessageRef.current?.scrollIntoView({
            behavior: "smooth",
            block: "end",
          });
        }, 100); // Small delay to allow UI to update
      }
    };

    scrollToBottom();
  }, [messages]);

  // // Handle typing status updates
  // useEffect(() => {
  //   if (!socket) return;
  //   socket.on("userTyping", ({}) => {
  //     setIsTyping(true);
  //   });

  //   socket.on("userStoppedTyping", ({}) => {
  //     setIsTyping(false);
  //   });

  //   return () => {
  //     socket.off("userTyping");
  //     socket.off("userStoppedTyping");
  //   };
  // }, []);
  // console.log("Component re-rendered");

  // const [, forceUpdate] = useState(0);

  // useEffect(() => {
  //   forceUpdate((prev) => prev + 1);
  // }, [messages]); // ✅ Forces re-render on message update
  // useEffect(() => {
  //   console.log("Messages updated:", messages);
  // }, [messages]);

  useEffect(() => {
    fetchMessages(chatId); // Fetch messages when chatId changes
  }, [chatId]);

  // Filter messages for the current chat
  const chatMessages = (messages ?? []).filter((msg) => msg.chatId === chatId);
  if (loading)
    return (
      <div className="h-full w-full text-gray-500 flex justify-center items-center">
        <CircularProgress size="24px" className="animate-spin text-gray-500" />
      </div>
    );

  return (
    <div className="flex-1 flex flex-col p-4 bg-gray-100 z-50  rounded-sm shadow-md">
      {messages?.length === 0 && (
        <div className="flex p-2 h-full justify-center items-center bg-inherit">
          <p className="text-md font-semibold text-neutral-500">
            Send a message to start a chat.
          </p>
        </div>
      )}

      <div
        ref={messagesContainerRef}
        className="h-[400px]  overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 dark:scrollbar-thumb-gray-700"
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
                  msg.sender?._id === user?._id || msg.tempId === user?._id // Ensure compatibility with different message structures
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
                    msg.sender?._id === user?._id
                      ? "bg-gradient-to-r from-blue-500 to-blue-700 text-white rounded-br-md self-end"
                      : "bg-gradient-to-r from-amber-500 to-amber-700 text-white rounded-bl-md self-start"
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
                      {msg?.reactions && msg?.sender?._id !== user?._id
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
        {isTyping && (
          <div className="flex items-center space-x-1 text-gray-200 bg-neutral-300 rounded-full w-fit px-2">
            <span className="animate-bounce">•</span>
            <span className="animate-bounce delay-100">•</span>
            <span className="animate-bounce delay-200">•</span>
          </div>
        )}

        {/* Auto-scroll reference */}
        <div ref={lastMessageRef} />
      </div>
    </div>
  );
};

export default ChatPage;
