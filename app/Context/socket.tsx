"use client";
import { useCurrentUser } from "@/hooks/useCurrentUser";
import { useAuth } from "@clerk/nextjs";
import React, { createContext, useContext, useEffect } from "react";

import useStore from "../zustand/useStore";
import useSocket from "@/hooks/useSocket";
import { MessageProps } from "@/types/chatinterfaces";

// interface SocketContextType {
//   socket: Socket | null;

// }

const SocketContext = createContext({});

export const SocketProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const { userId } = useAuth();

  const { user } = useCurrentUser(userId || null);
  const { setOnlineUsers, addMessage } = useStore();

  const { socket } = useSocket();
  console.log(socket);

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
  useEffect(() => {
    if (!socket) {
      console.error("❌ No socket instance found.");
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
  }, [socket, addMessage]); // ✅ Re-run when `socket` updates

  useEffect(() => {
    if (!socket?.connected) {
      console.warn("⚠️ Socket is NOT connected.");
      return;
    }

    console.log("✅ Listening for incoming messages...");

    const handleIncomingMessage = (message: MessageProps) => {
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
