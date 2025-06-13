"use client";
import { MessageProps } from "@/types/chatinterfaces";
import useStore from "../zustand/useStore";
import { createContext, useContext, useEffect, useState } from "react";
import { useCurrentUser } from "@/hooks/useCurrentUser";
import { io, Socket } from "socket.io-client";
import { AppNotification, useNotifications } from "./NotificationContext";
import { UserProps } from "@/types/userinterfaces";
import { useRouter } from "next/navigation";

interface SocketContextType {
  socket: Socket | null;
  isTyping: (userId: string) => boolean;
  setTypingStatus: (userId: string, isTyping: boolean) => void;
  sendBanUpdate: (
    userId: string,
    isBanned: boolean,
    reason?: string, // Made optional
    duration?: number // Made optional)
  ) => void;
  banNotification: {
    show: boolean;
    isBanned: boolean;
    reason?: string;
    duration?: number;
  };
  closeBanNotification: () => void;
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
  const router = useRouter();

  const [banNotification, setBanNotification] = useState<{
    show: boolean;
    isBanned: boolean;
    reason?: string;
    duration?: number;
  }>({
    show: false,
    isBanned: false,
  });

  const closeBanNotification = () => {
    setBanNotification((prev) => ({ ...prev, show: false }));
    router.push("/");
  };
  // Typing status management
  const isTyping = (userId: string) => typingUsers[userId] || false;
  const setTypingStatus = (userId: string, isTyping: boolean) => {
    setTypingUsers((prev) => ({ ...prev, [userId]: isTyping }));
  };

  // Function to send ban notifications
  // const sendBanNotification = (
  //   userId: string,
  //   isBanned: boolean,
  //   reason?: string,
  //   duration?: number
  // ) => {
  //   if (!socket) {
  //     console.error("Socket not connected");
  //     return;
  //   }

  //   socket.emit("banNotification", {
  //     userId,
  //     isBanned,
  //     reason,
  //     duration,
  //     adminId: user?.user?._id,
  //     timestamp: new Date().toISOString(),
  //   });

  //   console.log(
  //     `Sent ${isBanned ? "ban" : "unban"} notification to user ${userId}`
  //   );
  // };
  const sendBanUpdate = (
    userId: string,
    isBanned: boolean,
    reason?: string,
    duration?: number
  ) => {
    if (socket) {
      socket.emit("adminBanUser", {
        userId,
        isBanned,
        ...(reason && { reason }), // Only include if truthy
        ...(duration && { duration }), // Only include if truthy
      });
    }
  };

  useEffect(() => {
    if (!socket) return;

    const handleBanUpdate = (data: {
      userId: string;
      isBanned: boolean;
      reason?: string;
      duration?: number;
    }) => {
      if (data.userId === user?.user?._id) {
        setBanNotification({
          show: true,
          isBanned: data.isBanned,
          reason: data.reason,
          duration: data.duration,
        });
        router.refresh();
      }
    };

    socket.on("userBanUpdate", handleBanUpdate);

    return () => {
      socket.off("userBanUpdate", handleBanUpdate);
    };
  }, [socket, user?.user?._id, router]);
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

  // useEffect(() => {
  //   if (!socket || !user?.user?._id) return;

  //   // In your SocketProvider component
  //   const handleUserBanned = (data: {
  //     isBanned: boolean;
  //     reason?: string;
  //     duration?: number;
  //     adminId: string;
  //     timestamp: string;
  //   }) => {
  //     // Add this somewhere in your constants or context file
  //     const SYSTEM_USER: UserProps = {
  //       _id: "system-admin",
  //       clerkId: "system-admin",
  //       firstname: "System",
  //       username: "system_admin",
  //       updatedAt: new Date(),
  //       isBanned: false,
  //       // Add any other required properties from UserProps
  //       createdAt: new Date(),
  //       email: "system@admin.com",
  //       banReason: data.reason as string,
  //       bannedAt: new Date(data.timestamp),
  //       banExpiresAt: new Date(), // New field for temporary ban
  //       banReference: "", // New fiel
  //       // ... other required properties
  //     };

  //     // Then use it in your notification
  //     const notification: Omit<AppNotification, "id"> = {
  //       text: data.isBanned
  //         ? `Your account has been ${
  //             data.duration ? "temporarily" : "permanently"
  //           } banned`
  //         : "Your account has been unbanned",
  //       sender: SYSTEM_USER,
  //       receiver: user.user._id,
  //       content: data.isBanned
  //         ? `Reason: ${data.reason || "Not specified"}${
  //             data.duration ? ` | Duration: ${data.duration} days` : ""
  //           }`
  //         : "ess has been restored",
  //       timestamp: new Date(data.timestamp),
  //       read: false,
  //       chatId: "system-notification", // or some other placeholder
  //     };

  //     addNotification(notification);

  //     if (data.isBanned && user.user._id === user.user._id) {
  //       console.log("User banned - should log out");
  //     }
  //   };

  //   socket.on("userBanned", handleUserBanned);

  //   return () => {
  //     socket.off("userBanned", handleUserBanned);
  //   };
  // }, [socket, user, addNotification]);
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

  const BanNotificationModal = () => (
    <div
      className={`fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50 transition-opacity ${
        banNotification.show ? "opacity-100" : "opacity-0 pointer-events-none"
      }`}
    >
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-md w-full p-6 transform transition-all duration-300 scale-100">
        <div className="flex flex-col space-y-4">
          <h3 className="text-xl font-bold">
            {banNotification.isBanned ? "Account Banned" : "Account Unbanned"}
          </h3>

          {banNotification.isBanned && (
            <>
              {banNotification.reason && (
                <p className="text-gray-600 dark:text-gray-300">
                  <span className="font-semibold">Reason:</span>{" "}
                  {banNotification.reason}
                </p>
              )}
              {banNotification.duration && (
                <p className="text-gray-600 dark:text-gray-300">
                  <span className="font-semibold">Duration:</span>{" "}
                  {banNotification.duration} days
                </p>
              )}
              <div className="bg-red-50 dark:bg-red-900/10 p-3 rounded-md">
                <p className="text-red-600 dark:text-red-300 text-sm">
                  Your account access has been restricted.{" "}
                  {banNotification.duration
                    ? "This is a temporary ban."
                    : "This is a permanent ban."}
                </p>
              </div>
            </>
          )}

          {!banNotification.isBanned && (
            <div className="bg-green-50 dark:bg-green-900/10 p-3 rounded-md">
              <p className="text-green-600 dark:text-green-300 text-sm">
                Your account access has been fully restored.
              </p>
            </div>
          )}

          <button
            onClick={closeBanNotification}
            className="mt-4 w-full bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-md text-sm font-medium transition-colors"
          >
            I Understand
          </button>
        </div>
      </div>
    </div>
  );
  return (
    <SocketContext.Provider
      value={{
        socket,
        isTyping,
        setTypingStatus,
        sendBanUpdate,
        banNotification,
        closeBanNotification,
      }}
    >
      <BanNotificationModal />
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
