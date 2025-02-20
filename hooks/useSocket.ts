"use client";
// import useStore from "@/app/zustand/useStore";
// import { useEffect } from "react";
// import { io, Socket } from "socket.io-client";

const SOCKET_URL = "http://localhost:8080"; // Update if needed

// export const useSocket = () => {
//   const { setOnlineUsers } = useStore();

//   useEffect(() => {
//     const socket: Socket = io(SOCKET_URL, {
//       withCredentials: true,
//     });

//     socket.on("connect", () => {
//       console.log("Connected to socket server");
//     });

//     socket.on("disconnect", () => {
//       console.log("Disconnected from socket server");
//     });

//     // socket.on("newMessage", (message) => {
//     //   addMessage(message);
//     // });

//     socket.on("onlineUsers", (users) => {
//       setOnlineUsers(users);
//     });

//     return () => {
//       socket.disconnect();
//     };
//   }, [setOnlineUsers]);

//   return null; // No need to render anything
// };

import { useEffect, useState } from "react";
import { io, Socket } from "socket.io-client";

const useSocket = () => {
  const [socket, setSocket] = useState<Socket | null>(null);

  useEffect(() => {
    const newSocket = io(SOCKET_URL, {
      transports: ["websocket"],
      reconnectionAttempts: 3,
      timeout: 5000,
    });

    setSocket(newSocket);

    return () => {
      newSocket.disconnect();
    };
  }, []);

  return { socket };
};

export default useSocket;
