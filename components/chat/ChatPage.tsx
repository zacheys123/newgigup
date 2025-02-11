import { useSocket } from "@/app/Context/SocketContext";
import useStore from "@/app/zustand/useStore";
import { useCurrentUser } from "@/hooks/useCurrentUser";
import { MessageProps } from "@/types/chatinterfaces";
import { useAuth } from "@clerk/nextjs";
import { useEffect, useState } from "react";

interface ChatPageProps {
  chatId: string;
}

const ChatPage: React.FC<ChatPageProps> = ({ chatId }) => {
  const { messages = [], fetchMessages, addMessage } = useStore();
  const { userId } = useAuth();
  const { user } = useCurrentUser(userId || null);
  const [loading, setLoading] = useState<boolean>(true);

  const { socket } = useSocket();

  useEffect(() => {
    const loadMessages = async () => {
      if (chatId) {
        await fetchMessages(chatId);
      }
      setLoading(false);
    };

    loadMessages();

    if (socket) {
      socket.emit("join_Chat", chatId);

      socket.on("receive_message", (message) => {
        console.log("Received message:", message);
        addMessage(message);
      });
    }

    return () => {
      if (socket) {
        socket.off("receive_message");
      }
    };
  }, [chatId, socket, addMessage]);

  if (loading) return <p>Loading messages...</p>;

  return (
    <div className="flex flex-col flex-1">
      {/* Messages List */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages
          .filter((msg: MessageProps) => msg.chatId === chatId)
          .map((msg: MessageProps) => (
            <div
              key={msg._id}
              className={`flex ${
                msg.sender?._id === user?._id ? "justify-end" : "justify-start"
              }`}
            >
              <div
                className={`max-w-xs px-4 py-3 text-sm md:text-base rounded-2xl shadow-md ${
                  msg.sender?._id === user?._id
                    ? "bg-blue-500 text-white rounded-br-none"
                    : "bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-gray-100 rounded-bl-none"
                }`}
              >
                {msg.text}
              </div>
            </div>
          ))}
      </div>
    </div>
  );
};

export default ChatPage;
