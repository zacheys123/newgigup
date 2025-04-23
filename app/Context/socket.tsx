"use client";
import { MessageProps } from "@/types/chatinterfaces";
import useStore from "../zustand/useStore";
import { createContext, useContext, useEffect, useState } from "react";
import { useCurrentUser } from "@/hooks/useCurrentUser";
import { io, Socket } from "socket.io-client";
import { AppNotification, useNotifications } from "./NotificationContext";
import { UserProps } from "@/types/userinterfaces";

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
  const { addNotification } = useNotifications();
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

  // utils/typeGuards.ts
  function isUserProps(obj: UserProps) {
    return obj && typeof obj === "object" && "_id" in obj && "firstname" in obj;
  }
  useEffect(() => {
    if (!socket?.connected) return;

    const handleIncomingMessage = (message: MessageProps) => {
      const { messages, updateUnreadCount } = useStore.getState();

      // Check for duplicate messages
      const isDuplicate = messages.some(
        (msg) =>
          (msg._id && message._id && msg._id === message._id) ||
          (msg.tempId && message.tempId && msg.tempId === message.tempId)
      );

      if (!isDuplicate) {
        addMessage(message);

        // If the message is for the current user
        if (message.receiver === user?.user?._id) {
          updateUnreadCount(message.chatId as string, true);

          // Create the notification with the exact expected shape
          // In your SocketProvider component
          // In your SocketProvider
          // In your SocketProvider component
          // In your SocketProvider component
          const createNotification = (
            message: MessageProps
          ): Omit<AppNotification, "id"> => {
            // Ensure sender is properly typed as UserProps
            if (!message.sender || !isUserProps(message.sender)) {
              throw new Error("Invalid sender data - expected UserProps");
            }

            return {
              text: `New message from ${message.sender.firstname}`,
              sender: message.sender, // Now guaranteed to be UserProps
              receiver: message.receiver || "unknown-receiver",
              chatId: message.chatId as string,
              content: message.content,
              timestamp: new Date(message.createdAt || Date.now()),
              read: false,
            };
          };

          // Usage with error handling
          try {
            const notification = createNotification(message);
            addNotification(notification);
          } catch (error) {
            console.error("Failed to create notification:", error);
            // Handle error appropriately
          }

          // Usage

          // Usage
        }
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
