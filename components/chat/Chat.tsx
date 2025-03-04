"use client";
import { UserProps } from "@/types/userinterfaces";
import React, { useState, useEffect } from "react";
import ChatPage from "./ChatPage";
import ChatHeader from "./ChatHeader";
import ChatInput from "./ChatInput";
import useStore from "@/app/zustand/useStore";
import { useCurrentUser } from "@/hooks/useCurrentUser";
import { useAuth } from "@clerk/nextjs";
import useSocket from "@/hooks/useSocket";

interface ChatProps {
  myuser: UserProps;
  modal: { user: UserProps };
  onClose: () => void;
  onOpenX: () => void;
}

const Chat: React.FC<ChatProps> = ({ myuser, modal, onClose, onOpenX }) => {
  const [chatId, setChatId] = useState<string | null>(null);
  const { userId } = useAuth();
  const [loading, setLoading] = useState(true);
  const [newMessage, setNewMessage] = useState("");
  const { sendMessage, addMessage, onlineUsers } = useStore();
  const { user: myuserd } = useCurrentUser(userId || null);
  const { socket } = useSocket();

  useEffect(() => {
    const fetchChat = async () => {
      if (!myuserd?._id || !modal.user?._id) return;

      setLoading(true);
      try {
        const res = await fetch(
          `/api/chat/fetchchat?user1=${myuserd._id}&user2=${modal.user._id}`
        );
        const data = await res.json();

        if (res.ok && data.chatId) {
          setChatId(data.chatId);
        } else {
          console.warn("Chat not found, creating a new one...");

          const newChatRes = await fetch(`/api/chat/createchat`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ users: [myuserd._id, modal.user._id] }),
          });

          const newChatData = await newChatRes.json();
          if (newChatRes.ok && newChatData.chatId) {
            setChatId(newChatData.chatId);
          }
        }
      } catch (error) {
        console.error("Error fetching chat:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchChat();
  }, [myuserd._id, modal.user, chatId]);

  const send = async (e: React.FormEvent) => {
    if (!socket) return;
    e.preventDefault();
    if (!newMessage.trim() || !chatId) return;

    const newMsg = {
      sender: myuser,
      receiver: modal?.user?._id,
      content: newMessage,
      chatId,
      createdAt: new Date(),
      reactions: "😁",
    };

    try {
      sendMessage(newMsg);
      addMessage(newMsg); // Optimistically update UI
      socket.emit("sendMessage", newMsg, onlineUsers);

      setNewMessage("");
    } catch (error) {
      console.error("Message sending failed", error);
    }
  };

  let typingTimeout: NodeJS.Timeout;

  const handleTyping = () => {
    if (!socket) return;

    socket.emit("typing", { senderId: myuserd._id, receiverId: chatId });

    if (typingTimeout) clearTimeout(typingTimeout);

    typingTimeout = setTimeout(() => {
      socket.emit("stopTyping", { senderId: myuserd._id, receiverId: chatId });
    }, 3000);
  };

  if (loading) return <p>Loading chat...</p>;
  if (!chatId) return <p>Chat could not be created</p>;

  return (
    <section className="w-full max-w-lg sm:max-w-xl h-[500px] mt-3  flex flex-col border border-gray-600/50  rounded-2xl shadow-2xl bg-neutral-800/50  overflow-hidden">
      {/* Chat Header */}
      <ChatHeader
        onClose={onClose}
        modal={modal}
        user={myuserd}
        onOpenX={onOpenX}
      />

      {/* Chat Messages */}
      <div className="flex-1 p-4 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-900 dark:scrollbar-thumb-gray-900 scrollbar-track-transparent">
        <ChatPage chatId={chatId} modal={modal?.user?._id as string} />
      </div>

      {/* Chat Input */}
      <div className="w-full p-4   ">
        <ChatInput
          newMessage={newMessage}
          setNewMessage={setNewMessage}
          sendMessage={send}
          handleTyping={handleTyping}
        />{" "}
        <div className="flex justify-center w-full mt-2">
          <small className="text-center text-muted-foreground text-xs py-2 text-neutral-500">
            Powered By: gigMeUp
          </small>
        </div>
      </div>

      {/* Footer */}
    </section>
  );
};

export default Chat;
