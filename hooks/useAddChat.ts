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
    if (!myuser) return false; // Ensure current user exists

    // 1. Exclude the current user
    if (user?._id === loggedInUserId) return false;

    // 2. Exclude users already in the chat list
    const isUserInChat = chats?.some((chat: { users: UserProps[] }) =>
      chat?.users.some((u) => u._id === user._id)
    );
    if (isUserInChat) return false;

    // 3. If the current user is a musician
    if (myuser?.isMusician) {
      return (
        user?.isMusician || myuser?.refferences?.includes(user?._id as string)
      );
    }

    // 4. If the current user is a client
    if (myuser?.isClient) {
      return (
        user?.isMusician ||
        users?.users?.some(
          (musician) =>
            musician.isMusician &&
            musician.refferences?.includes(user?._id as string)
        )
      );
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
  console.log(myuser);
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
