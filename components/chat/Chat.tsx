"use client";
import { UserProps } from "@/types/userinterfaces";
import React, { useState, useEffect } from "react";
import ChatPage from "./ChatPage";
import ChatHeader from "./ChatHeader";
import ChatInput from "./ChatInput";
import useStore from "@/app/zustand/useStore";
import useSocket from "@/hooks/useSocket";
import { useSocketContext } from "@/app/Context/socket";
import useActivityPing from "@/hooks/useActivityPing";

interface ChatProps {
  myuser: UserProps;
  modal: { user: UserProps };
  onClose: () => void;
  onOpenX: () => void;
}

const Chat: React.FC<ChatProps> = ({ myuser, modal, onClose, onOpenX }) => {
  console.log("[Chat] Component rendering"); // Debug
  const [chatId, setChatId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [newMessage, setNewMessage] = useState("");
  const { sendMessage, addMessage, onlineUsers } = useStore();
  const { socket } = useSocket();

  useActivityPing(true, myuser?._id as string);
  const { isTyping } = useSocketContext();
  const otherUserTyping = isTyping(modal?.user?._id as string);
  console.log("[Chat] Current socket:", socket?.id); // Debug
  console.log("[Chat] Online users:", onlineUsers); // Debug

  useEffect(() => {
    const fetchChat = async () => {
      console.log("[Chat] Fetching chat data..."); // Debug
      if (!myuser?._id || !modal.user?._id) {
        console.warn("[Chat] Missing user IDs - cannot fetch chat");
        return;
      }

      setLoading(true);
      try {
        const res = await fetch(
          `/api/chat/fetchchat?user1=${myuser?._id}&user2=${modal?.user?._id}`
        );
        const data = await res.json();
        console.log("[Chat] Fetch response:", data); // Debug

        if (res.ok && data.chatId) {
          console.log("[Chat] Found existing chat:", data.chatId); // Debug
          setChatId(data.chatId);
        } else {
          console.warn("[Chat] Chat not found, creating new one..."); // Debug
          const newChatRes = await fetch(`/api/chat/createchat`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              users: [myuser?._id, modal?.user?._id],
            }),
          });

          const newChatData = await newChatRes.json();
          console.log("[Chat] Create chat response:", newChatData); // Debug
          if (newChatRes.ok && newChatData.chatId) {
            console.log("[Chat] New chat created:", newChatData.chatId); // Debug
            setChatId(newChatData.chatId);
          }
        }
      } catch (error) {
        console.error("[Chat] Error fetching chat:", error); // Debug
      } finally {
        setLoading(false);
      }
    };

    fetchChat();
  }, [myuser?._id, modal?.user, chatId]);

  const handleTyping = () => {
    if (!socket) return;

    socket.emit("typing", {
      senderId: myuser?._id,
      receiverId: modal?.user?._id,
      chatId: chatId,
    });

    const timer = setTimeout(() => {
      socket.emit("stopTyping", {
        senderId: myuser?._id,
        receiverId: modal?.user?._id,
        chatId: chatId,
      });
    }, 3000);

    return () => clearTimeout(timer);
  };
  const send = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log("[Chat] Send message triggered"); // Debug
    if (!socket) {
      console.warn("[Chat] Cannot send - socket not available"); // Debug
      return;
    }
    if (!newMessage.trim() || !chatId) {
      console.warn("[Chat] Cannot send - empty message or no chat ID"); // Debug
      return;
    }

    const newMsg = {
      sender: myuser,
      receiver: modal?.user?._id as string,
      content: newMessage,
      chatId,
      createdAt: new Date(),
      reactions: "😁",
      read: false,
    };

    try {
      console.log("[Chat] Sending message:", newMsg); // Debug
      sendMessage(newMsg);
      addMessage(newMsg);
      socket.emit("sendMessage", newMsg, onlineUsers);

      console.log("[Chat] Sending stopTyping event"); // Debug
      socket.emit("stopTyping", {
        senderId: myuser?._id,
        receiverId: modal?.user?._id,
      });

      setNewMessage("");
    } catch (error) {
      console.error("[Chat] Message sending failed", error); // Debug
    }
  };

  if (loading) {
    console.log("[Chat] Rendering loading state"); // Debug
    return (
      <div className="flex h-[550px] justify-center items-center">
        <p className="text-1xl font-mono animate-bounce text-amber-600">
          Loading chat Data...
        </p>
      </div>
    );
  }

  if (!chatId) {
    console.log("[Chat] Rendering no chat ID state"); // Debug
    return <p>Chat could not be created</p>;
  }

  console.log("[Chat] Rendering chat UI"); // Debug

  // In your Chat component, update the return section like this:
  return (
    <section className="w-full max-w-lg sm:max-w-xl h-[550px] -mt-5 flex flex-col border border-gray-600/50 rounded-2xl shadow-2xl bg-neutral-900/50 overflow-hidden">
      <ChatHeader
        onClose={onClose}
        modal={modal}
        user={myuser}
        onOpenX={onOpenX}
      />

      {/* Main chat area - make this flex-1 to take available space */}
      <div className="flex-1 overflow-hidden flex flex-col">
        <div className="flex-1 overflow-y-auto p-4">
          <ChatPage
            chatId={chatId}
            modal={modal?.user?._id as string}
            otherUserTyping={otherUserTyping}
          />
        </div>

        {/* Input area - fixed height */}
        <div className="w-full p-4 pt-0">
          <ChatInput
            newMessage={newMessage}
            setNewMessage={setNewMessage}
            sendMessage={send}
            handleTyping={handleTyping}
          />
          <div className="flex justify-center w-full mt-2">
            <small className="text-center text-muted-foreground text-xs py-2 text-neutral-500">
              Powered By: guup
            </small>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Chat;
