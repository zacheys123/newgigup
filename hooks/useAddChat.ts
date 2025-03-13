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
  console.log(myuser?.refferences);
  const filteredUsers = users?.users?.filter((user: UserProps) => {
    if (!myuser) return false; // Ensure the current user exists

    // Exclude the logged-in user
    if (user?._id === loggedInUserId) return false;

    // Exclude users already in the chat list
    const isUserInChat = chats?.some((chat: { users: UserProps[] }) =>
      chat?.users.some((u) => u._id === user._id)
    );
    if (isUserInChat) return false;

    if (myuser?.isMusician) {
      // Show all musicians and referenced users
      return (
        user.isMusician || myuser.refferences?.includes(user._id as string)
      );
    }
    if (myuser?.isClient) {
      // Show all musicians and users in references of any musician
      return (
        user.isMusician ||
        users?.users?.some(
          (musician) =>
            musician.isMusician &&
            musician.refferences?.includes(user._id as string)
        )
      );
    }
    return false;
  });

  // Fetch users from `myuser.refferences`

  // Merge both lists & remove duplicates
  // const allFilteredUsers = [
  //   ...filteredUsers,
  //   ...referencedUsers.filter(
  //     (user) => !filteredUsers.some((u) => u._id === user._id)
  //   ),
  // ];

  // const allFiltedUsers = () => {
  //   const newData =
  //     filteredUsers &&
  //     filteredUsers?.filter((user: UserProps) => {
  //       if (
  //         user?.firstname?.toLowerCase().includes(searchAddChat.toLowerCase())
  //       ) {
  //         return true; // Show all clients who are in the current user's references
  //       }
  //     });
  //   return newData;
  // };
  const allFiltedUsers = () => {
    const mergedUsers = [...new Set(filteredUsers)];

    if (searchAddChat.trim() !== "") {
      return mergedUsers.filter((user) =>
        user?.firstname?.toLowerCase().includes(searchAddChat.toLowerCase())
      );
    }

    return mergedUsers;
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
