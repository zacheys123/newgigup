"use client";
import { useCurrentUser } from "@/hooks/useCurrentUser";
import { useAuth } from "@clerk/nextjs";
import React, { createContext, useContext, useEffect, useState } from "react";
import { io, Socket } from "socket.io-client";
import useStore from "../zustand/useStore";
import useSocket from "@/hooks/useSocket";

const SOCKET_URL = "http://localhost:8080";

// interface SocketContextType {
//   socket: Socket | null;

// }

const SocketContext = createContext({});

export const SocketProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  //   const [socket, setSocket] = useState<Socket | null>(null);
  //   const [isConnected, setIsConnected] = useState(false);

  //   useEffect(() => {
  //     const newSocket = io(SOCKET_URL, { withCredentials: true });

  //     newSocket.on("connect", () => {
  //       console.log("Connected to socket server");
  //       setIsConnected(true);
  //     });

  //     newSocket.on("disconnect", () => {
  //       console.log("Disconnected from socket server");
  //       setIsConnected(false);
  //     });

  //     setSocket(newSocket);

  //     return () => {
  //       newSocket.disconnect();
  //     };
  //   }, []);
  const { userId } = useAuth();

  const { user } = useCurrentUser(userId || null);
  const { setOnlineUsers } = useStore();

  const { socket } = useSocket();

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

  return (
    <SocketContext.Provider value={{ socket }}>
      {children}
    </SocketContext.Provider>
  );
};

export const useSocketContext = () => useContext(SocketContext);
