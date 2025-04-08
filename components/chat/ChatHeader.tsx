import useStore from "@/app/zustand/useStore";
import { UserProps } from "@/types/userinterfaces";
import moment from "moment";
import Image from "next/image";
import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";

interface ChatHeaderProps {
  onOpenX: () => void;
  onClose: () => void;
  modal: {
    user: UserProps;
    lastSeen?: Date; // Add lastSeen to props
  };
  user: UserProps;
}

const ChatHeader = ({ onOpenX, onClose, modal }: ChatHeaderProps) => {
  const { onlineUsers } = useStore();
  const [lastSeenTime, setLastSeenTime] = useState<string>("");
  const [isOnline, setIsOnline] = useState(false);

  // Enhanced online status check with last seen tracking
  useEffect(() => {
    const checkOnlineStatus = () => {
      const onlineStatus = onlineUsers.some(
        (user) => user?.userId === modal?.user?._id
      );
      setIsOnline(onlineStatus);

      if (!onlineStatus) {
        // If you have lastSeen data from the server, use that
        const lastSeen = modal?.user?.lastActive || new Date();
        setLastSeenTime(moment(lastSeen).fromNow());
      }
    };

    checkOnlineStatus();
    // Refresh status every 30 seconds
    const interval = setInterval(checkOnlineStatus, 30000);
    return () => clearInterval(interval);
  }, [onlineUsers, modal?.user?._id, modal?.user?.lastActive]);

  return (
    <motion.header
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.3 }}
      className="sticky top-0 p-4 border-b border-gray-600/50 bg-gradient-to-r from-neutral-800/90 to-neutral-900/80 backdrop-blur-sm text-lg font-medium flex justify-between items-center rounded-t-2xl shadow-lg shadow-amber-500/20 z-10"
    >
      <div className="flex items-center gap-3">
        <motion.div whileHover={{ scale: 1.05 }} className="relative">
          <div className="relative h-10 w-10">
            <Image
              src={
                modal?.user?.picture ||
                "../../public/assets/logo/png/logo-color.png"
              }
              alt={`${modal?.user?.firstname}'s profile`}
              width={40}
              height={40}
              className="rounded-full border-2 border-amber-500/30 object-contain"
            />
            <motion.span
              animate={{
                scale: [1, 1.2, 1],
                opacity: isOnline ? [0.6, 1, 0.6] : 0,
              }}
              transition={{
                repeat: Infinity,
                duration: 1.5,
                ease: "easeInOut",
              }}
              className={`absolute -right-1 -bottom-1 w-3 h-3 rounded-full border-2 border-neutral-900      
              `}
            />
          </div>
        </motion.div>

        <div className="flex flex-col">
          <motion.h2
            whileHover={{ x: 2 }}
            className="text-neutral-100 font-semibold"
          >
            {modal.user.firstname} {modal.user.lastname}
          </motion.h2>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex items-center gap-1"
          >
            <span
              className={`text-xs ${
                isOnline ? "text-green-400" : "text-amber-500/80"
              }`}
            >
              {isOnline ? (
                <span className="flex items-center">
                  <span className="w-2 h-2 rounded-full bg-green-400 mr-1 animate-pulse"></span>
                  Online
                </span>
              ) : (
                <span className="flex items-center">
                  <span className="w-2 h-2 rounded-full bg-amber-500/80 mr-1"></span>
                  Last seen {lastSeenTime}
                </span>
              )}
            </span>
          </motion.div>
        </div>
      </div>

      <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={() => {
          onOpenX();
          onClose();
        }}
        className="text-neutral-300 hover:text-amber-400 transition-colors p-1 rounded-full"
        aria-label="Close chat"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <line x1="18" y1="6" x2="6" y2="18"></line>
          <line x1="6" y1="6" x2="18" y2="18"></line>
        </svg>
      </motion.button>
    </motion.header>
  );
};

export default ChatHeader;
