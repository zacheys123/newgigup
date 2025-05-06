// contexts/NotificationContext.tsx
"use client";

import { UserProps } from "@/types/userinterfaces";
import { createContext, useContext, useState } from "react";

// contexts/NotificationContext.tsx
export // contexts/NotificationContext.tsx
interface AppNotification {
  id: string;
  text: string;
  sender: UserProps; // Strictly UserProps
  receiver: string;
  chatId: string;
  content: string;
  timestamp: Date;
  read: boolean;
}

interface NotificationContextType {
  notifications: AppNotification[];
  addNotification: (notification: Omit<AppNotification, "id">) => void;
  removeNotification: (id: string) => void;
  markAsRead: (chatId: string) => void;
  setLastMessage: (lastMessage: string) => void;
  lastMessage: string;
}

const NotificationContext = createContext<NotificationContextType | null>(null);

export const NotificationProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [notifications, setNotifications] = useState<AppNotification[]>([]);
  const [lastMessage, setLastMessage] = useState("");

  const addNotification = (notification: Omit<AppNotification, "id">) => {
    const id = Math.random().toString(36).substring(2, 9);
    setNotifications((prev) => [...prev, { ...notification, id }]);
  };

  const removeNotification = (id: string) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  };
  // In the provider component:
  const markAsRead = (chatId: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.chatId === chatId ? { ...n, read: true } : n))
    );
  };

  return (
    <NotificationContext.Provider
      value={{
        notifications,
        addNotification,
        removeNotification,
        markAsRead,
        setLastMessage,
        lastMessage,
      }}
    >
      {children}
    </NotificationContext.Provider>
  );
};

export const useNotifications = () => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error(
      "useNotifications must be used within a NotificationProvider"
    );
  }
  return context;
};
