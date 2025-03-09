import { UserProps } from "@/types/userinterfaces";
import { useAllUsers } from "./useAllUsers";
import { useCurrentUser } from "./useCurrentUser";
import { useAuth } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { useState } from "react";

export const useAddChat = (chats: []) => {
  const { userId } = useAuth();
  const { users } = useAllUsers();
  const { user: myuser } = useCurrentUser(userId || null);
  const [searchAddChat, setSearchAddChat] = useState(""); // State for search query
  const [isAddingChat, setIsAddingChat] = useState(false);
  const router = useRouter();
  const loggedInUserId = myuser?._id;

  const filteredUsers = users?.users?.filter((user: UserProps) => {
    // Exclude the current user
    if (user?._id === loggedInUserId) return false;

    // Exclude users already in the chat list
    const isUserInChat = chats?.some((chat: { users: UserProps[] }) =>
      chat?.users.some((u) => u._id === user._id)
    );
    if (isUserInChat) return false;

    // If the current user is a musician
    if (myuser?.isMusician) {
      return true && user?.refferences?.includes(user?._id as string);
    }

    // If the current user is a client
    if (myuser.isClient) {
      return true; // Show all musicians
      // Show only clients who are in the current user's references
    }

    return false;
  });
  const allFiltedUsers = () => {
    const newData =
      filteredUsers &&
      filteredUsers?.filter((user: UserProps) => {
        if (
          user?.firstname?.toLowerCase().includes(searchAddChat.toLowerCase())
        ) {
          return true; // Show all clients who are in the current user's references
        }
      });
    return newData;
  };

  const handleAddChat = async (otherUserId: string) => {
    setIsAddingChat(true);
    try {
      const response = await fetch("/api/chat/createchat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ users: [loggedInUserId, otherUserId] }),
      });
      const { chatId } = await response.json();
      console.log(chatId);
      if (response.ok) {
        if (chatId) {
          router.push(`/chats/${chatId}?userId=${otherUserId}`);
        } else {
          console.log(chatId);
        }
      } else {
        console.error("Failed to create chat");
      }
    } catch (error) {
      console.error("Error creating chat:", error);
    } finally {
      setIsAddingChat(false);
    }
  };
  return {
    allFiltedUsers,
    handleAddChat,
    isAddingChat,
    searchAddChat,
    setSearchAddChat,
  };
};
