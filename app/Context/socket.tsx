"use client";
import { useCurrentUser } from "@/hooks/useCurrentUser";
import { useAuth } from "@clerk/nextjs";
import React, { createContext, useContext, useEffect } from "react";

import useStore from "../zustand/useStore";
import useSocket from "@/hooks/useSocket";
import { MessageProps } from "@/types/chatinterfaces";

const SOCKET_URL = "http://localhost:8080";

// interface SocketContextType {
//   socket: Socket | null;

// }

const SocketContext = createContext({});

export const SocketProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const { userId } = useAuth();

  const { user } = useCurrentUser(userId || null);
  const { setOnlineUsers, messages, addMessage } = useStore();

  const { socket } = useSocket();

  useEffect(() => {
    if (socket?.connected === true && user) {
      socket?.emit("addNewUsers", user?._id);
      socket?.on("getOnlineUsers", (res) => {
        setOnlineUsers(res);
        console.log(res);
      });
      const handleIncomingMessage = (message: MessageProps) => {
        console.log("🟢 New message received:", message);

        if (!messages.some((msg) => msg._id === message._id)) {
          console.log("✅ Adding message to state.");
          addMessage(message); // ✅ Update Zustand state
        } else {
          console.warn("⚠️ Duplicate message, skipping.");
        }
      };
      socket.on("getMessage", handleIncomingMessage);

      return () => {
        socket?.off("getMessage", handleIncomingMessage); // Cleanup on unmount
        socket?.off("getOnlineUsers");
      };
    }
  }, [socket, setOnlineUsers, user]);
  useEffect(() => {
    if (socket?.connected === true) {
      const handleIncomingMessage = (message: MessageProps) => {
        console.log("🟢 New message received:", message);

        if (!messages.some((msg) => msg._id === message._id)) {
          console.log("✅ Adding message to state.");
          addMessage(message); // ✅ Update Zustand state
        } else {
          console.warn("⚠️ Duplicate message, skipping.");
        }
      };
      socket.on("getMessage", handleIncomingMessage);

      return () => {
        socket?.off("getMessage", handleIncomingMessage); // Cleanup on unmount
        socket?.off("getOnlineUsers");
      };
    }
  }, [socket, messages, addMessage]);

  return (
    <SocketContext.Provider value={{ socket }}>
      {children}
    </SocketContext.Provider>
  );
};

export const useSocketContext = () => useContext(SocketContext);
