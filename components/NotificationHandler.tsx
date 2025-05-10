// components/NotificationHandler.tsx
"use client";
import {
  AppNotification,
  useNotifications,
} from "@/app/Context/NotificationContext";
import { useEffect, useState } from "react";
import { toast } from "sonner";

export default function NotificationHandler() {
  const { notifications, removeNotification, markAsRead, setLastMessage } =
    useNotifications();
  const [userInteracted, setUserInteracted] = useState(false);

  // Track user interaction
  useEffect(() => {
    const handleInteraction = () => {
      setUserInteracted(true);
      window.removeEventListener("click", handleInteraction);
      window.removeEventListener("keydown", handleInteraction);
      window.removeEventListener("touchstart", handleInteraction);
    };

    window.addEventListener("click", handleInteraction);
    window.addEventListener("keydown", handleInteraction);
    window.addEventListener("touchstart", handleInteraction);

    return () => {
      window.removeEventListener("click", handleInteraction);
      window.removeEventListener("keydown", handleInteraction);
      window.removeEventListener("touchstart", handleInteraction);
    };
  }, []);

  const playNotificationSound = () => {
    if (!userInteracted) return;

    try {
      const audio = new Audio("../public/notification-tone.mp3");
      audio.volume = 1;
      audio.play().catch((e) => console.error("Sound playback failed:", e));
    } catch (error) {
      console.error("Audio initialization failed:", error);
    }
  };

  const vibrateDevice = () => {
    if (!userInteracted || !("vibrate" in navigator)) return;

    try {
      navigator.vibrate(200); // 200ms vibration
    } catch (error) {
      console.error("Vibration failed:", error);
    }
  };

  const showBrowserNotification = (notification: AppNotification) => {
    if (!("Notification" in window)) return;
    if (document.visibilityState === "visible") return;

    try {
      if (Notification.permission === "granted") {
        new Notification(
          `New message from ${notification.sender.firstname || "Someone"}`,
          {
            body: notification.content,
            icon:
              notification.sender.picture ||
              "../public/assets/png/logo-white.png",
            tag: notification.chatId,
          }
        );
      }
    } catch (error) {
      console.error("Browser notification failed:", error);
    }
  };

  useEffect(() => {
    const unreadNotifications = notifications.filter((n) => !n.read);
    if (unreadNotifications.length === 0) return;

    // Only play sound/vibrate if user has interacted
    if (userInteracted) {
      playNotificationSound();
      vibrateDevice();
    }

    unreadNotifications.forEach((notification) => {
      setLastMessage(notification.content);
      // Show toast notification (always works)
      toast.info(
        <div
          className="cursor-pointer bg-gray-600"
          onClick={() => {
            markAsRead?.(notification.chatId);
            removeNotification(notification.id);
          }}
        >
          <p className="font-medium">
            {notification.text ||
              `New message from ${notification.sender.firstname || "Someone"}`}
          </p>
          <p className="text-sm text-gray-300 truncate max-w-xs">
            {notification.content}
          </p>
        </div>,
        {
          duration: 5000,
          onDismiss: () => {
            markAsRead?.(notification.chatId);
            removeNotification(notification.id);
          },
          action: {
            label: "View",
            onClick: () => {
              markAsRead?.(notification.chatId);
              removeNotification(notification.id);
            },
          },
        }
      );

      // Show browser notification if tab isn't focused
      if (document.visibilityState !== "visible") {
        showBrowserNotification(notification);
      }

      // Mark as read in the background
      markAsRead?.(notification.chatId);
    });
  }, [notifications, removeNotification, markAsRead, userInteracted]);

  return null;
}
