"use client";
import { MessageProps } from "@/types/chatinterfaces";
import useStore from "../zustand/useStore";
import { createContext, useContext, useEffect, useState } from "react";
import { useCurrentUser } from "@/hooks/useCurrentUser";
import { useAuth } from "@clerk/nextjs";
import { io, Socket } from "socket.io-client";

interface SocketContextType {
  socket: Socket | null;
}

const SocketContext = createContext<SocketContextType | null>(null);
const SOCKET_URL = process.env.NEXT_PUBLIC_SOCKET_URL;
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

export const useSocketContext = () => {
  const context = useContext(SocketContext);
  if (!context) {
    throw new Error("useSocketContext must be used within a SocketProvider");
  }
  return context;
};

// "use client";
// import { useCurrentUser } from "@/hooks/useCurrentUser";
// import { useAuth } from "@clerk/nextjs";
// import React, { createContext, useContext, useEffect, useState } from "react";
// import useStore from "../zustand/useStore";
// import { MessageProps } from "@/types/chatinterfaces";
// import { io, Socket } from "socket.io-client";

// interface SocketContextType {
//   socket: Socket | null;
// }

// const SOCKET_URL = process.env.NEXT_PUBLIC_SOCKET_URL;

// const SocketContext = createContext<SocketContextType>({ socket: null });

// export const SocketProvider: React.FC<{ children: React.ReactNode }> = ({
//   children,
// }) => {
//   const { userId } = useAuth();
//   const { user } = useCurrentUser(userId || null);
//   const { setOnlineUsers, addMessage } = useStore();
//   const [socket, setSocket] = useState<Socket | null>(null);

//   useEffect(() => {
//     console.log("⏳ Initializing socket...");
//     const newSocket = io(SOCKET_URL, {
//       transports: ["websocket"],
//       reconnectionAttempts: 5,
//       timeout: 5000,
//     });

//     newSocket.on("connect", () => {
//       console.log("✅ Socket connected!");
//       setSocket(newSocket);
//     });

//     newSocket.on("disconnect", () => {
//       console.warn("❌ Socket disconnected!");
//       setSocket(null); // Ensure socket is set to null on disconnect
//     });

//     newSocket.on("connect_error", (err) => {
//       console.error("❌ Socket connection error:", err);
//       setSocket(null); // Ensure socket is set to null on error
//     });

//     return () => {
//       newSocket.disconnect();
//       setSocket(null); // Cleanup on unmount
//     };
//   }, []);

//   useEffect(() => {
//     if (socket?.connected && user) {
//       socket.emit("addNewUsers", user._id);
//       socket.on("getOnlineUsers", (res) => {
//         setOnlineUsers(res);
//         console.log(res);
//       });

//       return () => {
//         socket.off("getOnlineUsers");
//       };
//     }
//   }, [socket, setOnlineUsers, user]);

//   useEffect(() => {
//     if (!socket?.connected) {
//       console.warn("⚠️ Socket is NOT connected.");
//       return;
//     }

//     console.log("✅ Listening for incoming messages...");

//     const handleIncomingMessage = (message: MessageProps) => {
//       console.log("🟢 Received a message from the server:", message);

//       const { messages } = useStore.getState();
//       const isDuplicate = messages.some(
//         (msg) =>
//           (msg._id && message._id && msg._id === message._id) ||
//           (msg.tempId && message.tempId && msg.tempId === message.tempId)
//       );

//       if (!isDuplicate) {
//         console.log("🟢 Adding new message to Zustand store.");
//         addMessage(message);
//       } else {
//         console.log("🟡 Duplicate message detected, skipping update.");
//       }
//     };

//     socket.on("getMessage", handleIncomingMessage);

//     return () => {
//       socket.off("getMessage", handleIncomingMessage);
//     };
//   }, [socket, addMessage]);

//   return (
//     <SocketContext.Provider value={{ socket }}>
//       {children}
//     </SocketContext.Provider>
//   );
// };

// export const useSocketContext = () => useContext(SocketContext);
