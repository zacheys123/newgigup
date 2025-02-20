"use client";
import { useCurrentUser } from "@/hooks/useCurrentUser";
import { useAuth } from "@clerk/nextjs";
import React, { createContext, useContext, useEffect, useState } from "react";

import useStore from "../zustand/useStore";

import { MessageProps } from "@/types/chatinterfaces";

import { io, Socket } from "socket.io-client";

// interface SocketContextType {
//   socket: Socket | null;

// }
const SOCKET_URL = "http://localhost:8080"; // Update if needed

const SocketContext = createContext({});

export const SocketProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const { userId } = useAuth();

  const { user } = useCurrentUser(userId || null);
  const { setOnlineUsers, addMessage } = useStore();

  const [socket, setSocket] = useState<Socket | null>(null);

  useEffect(() => {
    console.log("⏳ Initializing socket...");
    const newSocket = io(SOCKET_URL, {
      transports: ["websocket"],
      reconnectionAttempts: 5, // 🔄 Auto-reconnect
      timeout: 5000,
    });

    newSocket.on("connect", () => {
      console.log("✅ Socket connected!");
      setSocket(newSocket);
    });

    newSocket.on("disconnect", () => {
      console.warn("❌ Socket disconnected!");
    });

    return () => {
      newSocket.disconnect();
    };
  }, []);

  useEffect(() => {
    if (socket?.connected === true && user) {
      socket?.emit("addNewUsers", user?._id);
      socket?.on("getOnlineUsers", (res) => {
        setOnlineUsers(res);
        console.log(res);
      });

      return () => {
        socket?.off("getOnlineUsers");
      };
    }
  }, [socket, setOnlineUsers, user]);

  // const messagesRef = useRef(messages);

  // useEffect(() => {
  //   messagesRef.current = messages;
  // }, []);
  // import { useStore } from "@/store"; // Ensure correct Zustand import
  console.log(socket);
  useEffect(() => {
    console.log("🔍 Checking socket instance:", socket); // Debugging line

    if (!socket) {
      console.log("❌ No socket instance found.");
      return;
    }

    if (!socket.connected) {
      console.warn("⚠️ Socket is NOT connected.");
      return;
    }

    console.log("✅ Socket is connected.");

    const handleIncomingMessage = (message: MessageProps) => {
      console.log("🟢 Received a message from the server:", message);
      addMessage(message); // ✅ Update Zustand state
    };

    socket.on("getMessage", handleIncomingMessage);

    return () => {
      console.log("🛑 Cleaning up socket listeners...");
      socket.off("getMessage", handleIncomingMessage);
    };
  }, [socket, addMessage]);

  useEffect(() => {
    if (!socket?.connected) {
      console.warn("⚠️ Socket is NOT connected.");
      return;
    }

    console.log("✅ Listening for incoming messages...");

    const handleIncomingMessage = (message: MessageProps) => {
      // ✅ Force UI re-render before adding to Zustand
      setTimeout(() => addMessage(message), 0);
      console.log("🟢 Received a message from the server:", message);
    };

    socket.on("getMessage", handleIncomingMessage);

    return () => {
      socket.off("getMessage", handleIncomingMessage);
    };
  }, [socket]); // ✅ Keep dependencies minimal

  return (
    <SocketContext.Provider value={{ socket }}>
      {children}
    </SocketContext.Provider>
  );
};

export const useSocketContext = () => useContext(SocketContext);
