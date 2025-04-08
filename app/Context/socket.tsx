"use client";
import { MessageProps } from "@/types/chatinterfaces";
import useStore from "../zustand/useStore";
import { createContext, useContext, useEffect, useState } from "react";
import { useCurrentUser } from "@/hooks/useCurrentUser";
import { io, Socket } from "socket.io-client";

interface SocketContextType {
  socket: Socket | null;
  isTyping: (userId: string) => boolean;
  setTypingStatus: (userId: string, isTyping: boolean) => void;
}

const SocketContext = createContext<SocketContextType | null>(null);
const SOCKET_URL = process.env.NEXT_PUBLIC_SOCKET_URL;

export const SocketProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const { user } = useCurrentUser();
  const { setOnlineUsers, addMessage } = useStore();
  const [socket, setSocket] = useState<Socket | null>(null);
  const [typingUsers, setTypingUsers] = useState<Record<string, boolean>>({});

  // Typing status management
  const isTyping = (userId: string) => typingUsers[userId] || false;
  const setTypingStatus = (userId: string, isTyping: boolean) => {
    setTypingUsers((prev) => ({ ...prev, [userId]: isTyping }));
  };

  // Initialize socket connection
  useEffect(() => {
    console.log("⏳ Initializing socket...");
    const newSocket = io(SOCKET_URL, {
      transports: ["websocket"],
      reconnectionAttempts: 5,
      timeout: 5000,
    });

    newSocket.on("connect", () => {
      console.log("✅ Socket connected!");
      setSocket(newSocket);
    });

    newSocket.on("disconnect", () => {
      console.warn("❌ Socket disconnected!");
      setSocket(null);
    });

    newSocket.on("connect_error", (err) => {
      console.error("❌ Socket connection error:", err);
      setSocket(null);
    });

    return () => {
      newSocket.disconnect();
      setSocket(null);
    };
  }, []);

  // Handle online users
  useEffect(() => {
    if (socket?.connected && user) {
      socket.emit("addNewUsers", user?.user?._id);
      socket.on("getOnlineUsers", (res) => {
        setOnlineUsers(res);
        console.log(res);
      });

      return () => {
        socket.off("getOnlineUsers");
      };
    }
  }, [socket, setOnlineUsers, user]);

  // Handle incoming messages
  useEffect(() => {
    if (!socket?.connected) {
      console.warn("⚠️ Socket is NOT connected.");
      return;
    }

    console.log("✅ Listening for incoming messages...");

    const handleIncomingMessage = (message: MessageProps) => {
      console.log("🟢 Received a message from the server:", message);

      const { messages, updateUnreadCount } = useStore.getState();

      // Check for duplicate messages
      const isDuplicate = messages.some(
        (msg) =>
          (msg._id && message._id && msg._id === message._id) ||
          (msg.tempId && message.tempId && msg.tempId === message.tempId)
      );

      if (!isDuplicate) {
        console.log("🟢 Adding new message to Zustand store.");
        addMessage(message);

        if (message.receiver === user?.user?._id) {
          updateUnreadCount(message.chatId as string, true);
        }
      } else {
        console.log("🟡 Duplicate message detected, skipping update.");
      }
    };

    socket.on("getMessage", handleIncomingMessage);

    return () => {
      socket.off("getMessage", handleIncomingMessage);
    };
  }, [socket, addMessage, user?.user?._id]);

  // Handle typing indicators
  useEffect(() => {
    if (!socket) return;

    const handleTypingEvent = ({
      senderId,
    }: {
      senderId: string;
      chatId?: string;
    }) => {
      console.log("✍️ Received typing event from:", senderId);
      setTypingStatus(senderId, true);
    };

    const handleStopTypingEvent = ({
      senderId,
    }: {
      senderId: string;
      chatId?: string;
    }) => {
      console.log("🛑 Received stop typing from:", senderId);
      setTypingStatus(senderId, false);
    };

    socket.on("userTyping", handleTypingEvent);
    socket.on("userStoppedTyping", handleStopTypingEvent);

    return () => {
      socket.off("userTyping", handleTypingEvent);
      socket.off("userStoppedTyping", handleStopTypingEvent);
    };
  }, [socket]);

  return (
    <SocketContext.Provider value={{ socket, isTyping, setTypingStatus }}>
      {children}
    </SocketContext.Provider>
  );
};

export const useSocketContext = () => {
  const context = useContext(SocketContext);
  if (!context) {
    throw new Error("useSocketContext must be used within a SocketProvider");
  }
  return context;
};
