import { UserProps } from "@/types/userinterfaces";
import { useAllUsers } from "./useAllUsers";
import { useCurrentUser } from "./useCurrentUser";

import { useRouter } from "next/navigation";
import { useState } from "react";

export const useAddChat = (chats: []) => {
  const { users } = useAllUsers();
  const { user: myuser } = useCurrentUser();
  const [searchAddChat, setSearchAddChat] = useState(""); // State for search query
  const [isAddingChat, setIsAddingChat] = useState(false);
  const router = useRouter();
  const loggedInUserId = myuser?.user?._id;

  const filteredUsers = (searchParam: string = "") => {
    if (!users?.users || !myuser) return [];

    return users.users.filter((user: UserProps) => {
      // Exclude the logged-in user
      if (user?._id === loggedInUserId) return false;

      // Apply search filter if searchParam is provided
      if (searchParam) {
        const searchLower = searchParam.toLowerCase();
        const firstname = user?.firstname?.toLowerCase() || "";
        const userName = user?.username?.toLowerCase() || "";
        const userEmail = user?.email?.toLowerCase() || "";
        if (
          !userName.includes(searchLower) &&
          !userEmail.includes(searchLower) &&
          !firstname.includes(searchLower)
        ) {
          return false;
        }
      }

      // Check if user is in existing chats (EXCLUDE these users)
      const isUserInChat = chats?.some((chat: { users: UserProps[] }) =>
        chat?.users.some((u) => u._id === user?._id)
      );
      if (isUserInChat) return false; // Exclude users we already chat with

      // Check if user is in references
      const isUserInReferences = myuser?.refferences?.some(
        (u: UserProps) => u._id === user?._id
      );

      // If current user is a musician
      if (myuser?.user?.isMusician) {
        return isUserInReferences || user?.isMusician; // Only show users in references
      }

      // If current user is a client, show all musicians and clients (except those already chatted with)
      if (myuser?.user?.isClient) {
        return true;
      }

      return false;
    });
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
    allfilteredUsers: filteredUsers(searchAddChat), // Apply current search filter
    handleAddChat,
    isAddingChat,
    searchAddChat,
    setSearchAddChat,
    filteredUsers, // Expose the function if needed by the component
  };
};
