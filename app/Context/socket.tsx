"use client";
import { useCurrentUser } from "@/hooks/useCurrentUser";
import { useAuth } from "@clerk/nextjs";
import React, { createContext, useContext, useEffect, useState } from "react";
import useStore from "../zustand/useStore";
import { MessageProps } from "@/types/chatinterfaces";
import { io, Socket } from "socket.io-client";

interface SocketContextType {
  socket: Socket | null;
}

const SocketContext = createContext<SocketContextType>({ socket: null });

export const SocketProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const { userId } = useAuth();
  const { user } = useCurrentUser(userId || null);
  const { setOnlineUsers, addMessage } = useStore();
  const [socket, setSocket] = useState<Socket | null>(null);

  useEffect(() => {
    console.log("WebSocket URL:", process.env.NEXT_PUBLIC_SOCKET_URL);
    console.log("⏳ Initializing socket...");
    const newSocket = io(process.env.NEXT_PUBLIC_SOCKET_URL, {
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
    });

    newSocket.on("connect_error", (err) => {
      console.error("❌ Socket connection error:", err);
    });

    return () => {
      newSocket.disconnect();
    };
  }, []);

  useEffect(() => {
    if (socket?.connected && user) {
      socket.emit("addNewUsers", user._id);
      socket.on("getOnlineUsers", (res) => {
        setOnlineUsers(res);
        console.log(res);
      });

      return () => {
        socket.off("getOnlineUsers");
      };
    }
  }, [socket, setOnlineUsers, user]);

  useEffect(() => {
    if (!socket?.connected) {
      console.warn("⚠️ Socket is NOT connected.");
      return;
    }

    console.log("✅ Listening for incoming messages...");

    const handleIncomingMessage = (message: MessageProps) => {
      console.log("🟢 Received a message from the server:", message);

      const { messages } = useStore.getState();
      const isDuplicate = messages.some(
        (msg) =>
          (msg._id && message._id && msg._id === message._id) ||
          (msg.tempId && message.tempId && msg.tempId === message.tempId)
      );

      if (!isDuplicate) {
        console.log("🟢 Adding new message to Zustand store.");
        addMessage(message);
      } else {
        console.log("🟡 Duplicate message detected, skipping update.");
      }
    };

    socket.on("getMessage", handleIncomingMessage);

    return () => {
      socket.off("getMessage", handleIncomingMessage);
    };
  }, [socket, addMessage]);

  return (
    <SocketContext.Provider value={{ socket }}>
      {children}
    </SocketContext.Provider>
  );
};

export const useSocketContext = () => useContext(SocketContext);
