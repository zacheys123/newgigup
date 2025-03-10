"use client";
import { useCurrentUser } from "@/hooks/useCurrentUser";
import { MessageProps } from "@/types/chatinterfaces";
import { UserProps } from "@/types/userinterfaces";
import { useAuth } from "@clerk/nextjs";
import Image from "next/image";
import { useRouter } from "next/navigation";
import useSWR, { mutate } from "swr";
import { useEffect, useState } from "react"; // Import useState
import { FaSearch, FaArrowLeft, FaUserPlus, FaTrash } from "react-icons/fa"; // Import icons for search and back
import { useAllUsers } from "@/hooks/useAllUsers";
import BallLoader from "@/components/loaders/BallLoader";
import { colors, fonts } from "@/utils";
import useStore from "@/app/zustand/useStore";
import { useAddChat } from "@/hooks/useAddChat";

const fetcher = (url: string) => fetch(url).then((res) => res.json());

const AllChats = () => {
  const { userId } = useAuth();
  const { user: myuser } = useCurrentUser(userId || null);
  const { users } = useAllUsers();
  const router = useRouter();
  const loggedInUserId = myuser?._id;
  console.log(users);
  // Use localStorage to store and retrieve chats
  const [localChats, setLocalChats] = useState<
    { users: UserProps[]; _id: string; messages: MessageProps[] }[]
  >([]);

  // Fetch chats from the database and store them in localStorage
  const { data: chats, error } = useSWR("/api/chat/allchats", fetcher, {
    revalidateOnFocus: true,
    onErrorRetry: (error, key, config, revalidate, { retryCount }) => {
      if (retryCount >= 3) return; // Retry up to 3 times
      setTimeout(() => revalidate({ retryCount }), 5000); // Retry after 5 seconds
    },
    onSuccess: (data) => {
      // Store fetched chats in localStorage
      localStorage.setItem("chats", JSON.stringify(data));
      setLocalChats(data); // Update local state
    },
  });

  // Load chats from localStorage on initial render
  useEffect(() => {
    const storedChats = localStorage.getItem("chats");
    if (storedChats) {
      setLocalChats(JSON.parse(storedChats));
    }
  }, []);
  const [longPressTimer, setLongPressTimer] = useState<NodeJS.Timeout | null>(
    null
  ); // Timer for long press
  const [selectedChatId, setSelectedChatId] = useState<string | null>(null); // Track which chat is selected for deletion

  // Function to handle long press start
  const handleLongPressStart = (chatId: string) => {
    const timer = setTimeout(() => {
      setSelectedChatId(chatId); // Set the chat ID for deletion
    }, 1000); // 1 second long press
    setLongPressTimer(timer);
  };

  // Function to handle long press end
  const handleLongPressEnd = () => {
    if (longPressTimer) {
      clearTimeout(longPressTimer); // Clear the timer if the press is released early
      setLongPressTimer(null);
    }
  };

  // Function to delete a chat
  const handleDeleteChat = async (chatId: string) => {
    try {
      const response = await fetch("/api/chat/deletechat", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ chatId }),
      });

      if (response.ok) {
        // Refresh the chat list or remove the deleted chat from the state
        mutate("/api/chat/allchats"); // Use SWR's mutate function to re-fetch the chats
      } else {
        console.error("Failed to delete chat");
      }
    } catch (error) {
      console.error("Error deleting chat:", error);
    } finally {
      setSelectedChatId(null); // Reset the selected chat ID
    }
  };

  // Add a cleanup effect to clear the timer
  useEffect(() => {
    return () => {
      if (longPressTimer) {
        clearTimeout(longPressTimer);
      }
    };
  }, [longPressTimer]);
  const { setIsOpen, updateUnreadCount, unreadCounts } = useStore();
  const [searchQuery, setSearchQuery] = useState(""); // State for search query
  const [isSearchVisible, setIsSearchVisible] = useState(false); // State to toggle search input

  const [isAddChat, setIsAddChat] = useState(false); // State to toggle search input
  const {
    allFiltedUsers,
    handleAddChat,
    isAddingChat,
    searchAddChat,
    setSearchAddChat,
  } = useAddChat(chats);
  const handleChatClick = async (chatId: string, otherUserId: string) => {
    const response = await fetch("/api/chat/readmessages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ chatId, userId: loggedInUserId }),
    });
    console.log(response);
    // Reset the unread count for this chat
    updateUnreadCount(chatId, false); // Set unread count to 0
    // Navigate to the chat keyswo...sikuweza jana
    router.push(`/chats/${chatId}?userId=${otherUserId}`);
  };

  // Filter chats based on the search query
  const uniqueChatsMap = new Map<
    string,
    { users: UserProps[]; _id: string; messages: MessageProps[] }
  >();

  localChats?.forEach(
    (chat: { users: UserProps[]; _id: string; messages: MessageProps[] }) => {
      const otherUser = chat.users.find((user) => user._id !== loggedInUserId);
      if (otherUser && !uniqueChatsMap.has(otherUser._id as string)) {
        uniqueChatsMap.set(otherUser._id as string, chat);
      }
    }
  );

  const filteredChats = Array.from(uniqueChatsMap.values()).filter((chat) => {
    const otherUser = chat.users.find((user) => user._id !== loggedInUserId);
    return (
      otherUser?.firstname &&
      otherUser?.firstname.toLowerCase().includes(searchQuery.toLowerCase())
    );
  });

  // // Filter users for the "Add Chat" modal
  // const filteredUsers = users?.users?.filter((user: UserProps) => {
  //   // Exclude the current user
  //   if (user?._id === loggedInUserId) return false;

  //   // Exclude users already in the chat list
  //   const isUserInChat = chats?.some((chat: { users: UserProps[] }) =>
  //     chat?.users.some((u) => u._id === user._id)
  //   );
  //   if (isUserInChat) return false;

  //   // If the current user is a musician
  //   if (myuser?.isMusician) {
  //     return true && user?.refferences?.includes(user?._id as string);
  //   }

  //   // If the current user is a client
  //   if (myuser.isClient) {
  //     return true; // Show all musicians
  //     // Show only clients who are in the current user's references
  //   }

  //   return false;
  // });
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
  // const [isAddingChat, setIsAddingChat] = useState(false);

  // const handleAddChat = async (otherUserId: string) => {
  //   setIsAddingChat(true);
  //   try {
  //     const response = await fetch("/api/chat/createchat", {
  //       method: "POST",
  //       headers: {
  //         "Content-Type": "application/json",
  //       },
  //       body: JSON.stringify({ users: [loggedInUserId, otherUserId] }),
  //     });
  //     const { chatId } = await response.json();
  //     console.log(chatId);
  //     if (response.ok) {
  //       if (chatId) {
  //         router.push(`/chats/${chatId}?userId=${otherUserId}`);
  //       } else {
  //         console.log(chatId);
  //       }
  //     } else {
  //       console.error("Failed to create chat");
  //     }
  //   } catch (error) {
  //     console.error("Error creating chat:", error);
  //   } finally {
  //     setIsAddingChat(false);
  //   }
  // };
  const LoadingSkeleton = () => (
    <div className="animate-pulse flex items-center p-3 space-x-4 mt-9">
      <div className="w-10 h-10 bg-gray-300 rounded-full"></div>
      <div className="flex-1 space-y-5">
        <div className="h-6 bg-gray-300  rounded-full"></div>
        <div className="h-6 bg-gray-300  w-1/2 rounded-full"></div>
      </div>
    </div>
  );

  // Use it in your component
  if (!chats) {
    return (
      <div className="flex-1 overflow-y-auto p-2 sm:p-4">
        {[...Array(7)].map((_, index) => (
          <LoadingSkeleton key={index} />
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center h-screen text-red-500">
        Error: {error.message}
      </div>
    );
  }
  // if (!isAddingChat) {
  //   return (
  //     <div className="fixed inset-0 flex items-center justify-center bg-black  bg-opacity-50 backdrop-blur-sl w-[100%] mx-auto h-full -py-6 z-50">
  //       <div className="w-[90%] p-4 max-w-lg sm:max-w-xl h-[80%] m-auto   flex flex-col border border-gray-600/50  rounded-2xl shadow-2xl bg-neutral-900/70   "></div>
  //     </div>
  //   );
  // }
  return (
    <div
      className="h-screen bg-[#f0f2f5] flex flex-col overflow-y-auto pb-20"
      onClick={() => {
        setIsOpen(false);
      }}
    >
      {filteredChats && filteredChats.length > 0 && (
        <button
          onClick={() => setIsAddChat(true)}
          className="fixed bottom-6 right-6 p-4 bg-[#128C7E] text-white rounded-full shadow-lg hover:bg-[#0e6e5f] transition-colors duration-200 bounce-icon z-50"
        >
          <FaUserPlus size={24} />
        </button>
      )}
      {isAddingChat && (
        <div className="fixed inset-0 flex items-center justify-center bg-black  bg-opacity-50 backdrop-blur-[4px] w-[100%] mx-auto h-full -py-6 z-50">
          <div className="w-[90%] p-4 max-w-lg sm:max-w-xl h-[90%] m-auto   flex flex-col border border-gray-600/50  rounded-2xl shadow-2xl overflow-y-auto  justify-center items-center">
            <BallLoader />
          </div>
        </div>
      )}
      {/* Header */}
      {!isSearchVisible && (
        <div className="bg-[#128C7E] p-4 text-white flex justify-between items-center">
          <h1 className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-[#ba51e4] to-[#e0ab16] bg-clip-text text-transparent">
            Chats
          </h1>
          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                console.log("true");
                setIsSearchVisible(true);
              }}
              className="p-2 hover:bg-[#0e6e5f] rounded-full transition-colors duration-200"
              aria-label="Search chats"
            >
              <FaSearch size={20} />
            </button>
            {/* <button
              onClick={() => setIsAddChat(true)}
              className="p-2 hover:bg-[#0e6e5f] rounded-full transition-colors duration-200"
            >
              <FaUserPlus size={20} />
            </button> */}
          </div>
        </div>
      )}
      {isAddChat && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-[4px] w-[100%] mx-auto h-full -py-6 z-50">
          <div className="w-[90%] p-4 max-w-lg sm:max-w-xl h-[80%] m-auto flex flex-col border border-gray-600/50 rounded-2xl shadow-2xl bg-neutral-900/50 overflow-y-auto">
            {" "}
            <div className="flex justify-between items-center  mt-4">
              {" "}
              <button
                onClick={() => setIsAddChat(false)}
                className="p-2 hover:bg-[#0e6e5f] rounded-full transition-colors duration-200 text-gray-300"
              >
                <FaArrowLeft size={20} />
              </button>
              <h1
                className="text-xl sm:text-2xl font-bold text-gray-200 "
                style={{ fontFamily: fonts[24] }}
              >
                Add a new chat
              </h1>{" "}
            </div>
            <div className="mt-[55px] mb-[20px]">
              <input
                type="text"
                placeholder="Type here to find a new chat"
                value={searchAddChat}
                onChange={(e) => setSearchAddChat(e.target.value)}
                className={`w-full p-2 rounded-lg border border-gray-300 focus:outline-none text-[14px] focus:border-[#128C7E] text-gray-300 bg-neutral-700 `}
                style={{ fontFamily: fonts[26] }}
              />
            </div>
            <div className="my-[5px] overflow-y-auto flex-1">
              {allFiltedUsers()?.map((user: UserProps) => (
                <div
                  key={user?._id}
                  className="flex gap-2 items-center hover:bg-[#0e6e5f] transition-colors duration-200 cursor-pointer bg-neutral-500/50  first:rounded-tl-xl first:rounded-tr-xl last:rounded:bl-xl last:rounded-b-r-xl py-3 px-5 "
                  onClick={() => handleAddChat(user?._id as string)}
                >
                  {user?.picture && (
                    <Image
                      src={user.picture}
                      alt={user.firstname as string}
                      width={40}
                      height={40}
                      className="rounded-full"
                    />
                  )}
                  <span
                    className="flex flex-col "
                    style={{ fontFamily: fonts[32] }}
                  >
                    {" "}
                    <span
                      className="text-gray-300"
                      style={{ fontFamily: fonts[34] }}
                    >
                      {user.firstname}
                    </span>
                    {!user?.isClient && !user?.isMusician && (
                      <span
                        className="text-red-500 tracking-wider text-[13px]"
                        style={{
                          fontFamily: fonts[23],
                          color: colors[28],
                        }}
                      >
                        unknown
                      </span>
                    )}
                    {user?.isClient && (
                      <span
                        className="text-green-300 tracking-wider text-[13px]"
                        style={{
                          fontFamily: fonts[2],
                        }}
                      >
                        client
                      </span>
                    )}{" "}
                    {user?.isMusician && (
                      <span
                        className="text-amber-300 tracking-wider text-[13px]"
                        style={{
                          fontFamily: fonts[23],
                          color: colors[28],
                        }}
                      >
                        musician
                      </span>
                    )}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
      {/* Search Bar */}
      {isSearchVisible && (
        <div className="bg-[#187950] p-4 text-white flex items-center">
          <button
            onClick={() => {
              setIsSearchVisible(false);
              setSearchQuery(""); // Clear search query when closing
            }}
            className="p-2 hover:bg-[#0e6e5f] rounded-full transition-colors duration-200 mr-2"
          >
            <FaArrowLeft size={20} />
          </button>
          <input
            type="text"
            placeholder="Search chats..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full p-2 rounded-lg border border-gray-300 focus:outline-none focus:border-[#128C7E] text-gray-500 "
          />
        </div>
      )}
      {/* Chat List */}
      <div className="flex-1 overflow-y-auto p-2 sm:p-4">
        {/* Case 1: No chats available at all */}
        {filteredChats.length === 0 && !searchQuery ? (
          <div className="flex flex-col items-center justify-center h-full">
            <p className="text-gray-600 text-lg">No chats available</p>
            <button
              onClick={() => setIsAddChat(true)}
              className="mt-4 px-4 py-2 bg-[#128C7E] text-white rounded-lg hover:bg-[#0e6e5f] transition-colors duration-200"
            >
              Add Chat
            </button>
          </div>
        ) : (
          <>
            {/* Case 2: No results found for the search query */}
            {filteredChats.length === 0 && searchQuery ? (
              <div className="flex justify-center items-center h-full">
                <p className="text-neutral-400">No results found</p>
              </div>
            ) : (
              // Case 3: Display the list of chats
              filteredChats.map(
                (
                  chat: {
                    users: UserProps[];
                    _id: string;
                    messages: MessageProps[];
                  },
                  index: number
                ) => {
                  const otherUser = chat.users.find(
                    (user) => user._id !== loggedInUserId
                  );
                  const unreadCount = unreadCounts[chat._id] || 0;

                  return (
                    <div
                      key={chat._id}
                      onMouseDown={() => handleLongPressStart(chat._id)} // Desktop long press
                      onMouseUp={handleLongPressEnd} // Desktop long press end
                      onMouseLeave={handleLongPressEnd} // Cancel long press if mouse leaves
                      onTouchStart={() => handleLongPressStart(chat._id)} // Mobile long press
                      onTouchEnd={handleLongPressEnd} // Mobile long press end
                      onClick={() => {
                        if (selectedChatId === chat._id) return; // Prevent click if long press is active
                        handleChatClick(chat._id, otherUser?._id || "");
                      }}
                      className="flex items-center p-2 sm:p-3 hover:bg-gradient-to-br active:scale-6 hover:from-neutral-300/30 hover:to-yellow-200/10 hover:via-gray-300/10 active:scale-95 active:opacity-80 rounded-lg transition-all duration-75 ease-in-out cursor-pointer mb-2 relative"
                      style={{
                        animation: `fadeIn 0.5s ease-in-out ${
                          index * 0.1
                        }s forwards`,
                        opacity: 0,
                      }}
                    >
                      {/* User Avatar */}
                      <div className="flex-shrink-0">
                        {otherUser?.picture ? (
                          <Image
                            src={otherUser?.picture}
                            alt={otherUser?.firstname as string}
                            width={40}
                            height={40}
                            className="rounded-full"
                          />
                        ) : (
                          <div className="w-10 h-10 sm:w-12 sm:h-12 bg-[#128C7E] rounded-full flex items-center justify-center text-white font-bold">
                            {otherUser?.firstname && !otherUser?.picture
                              ? otherUser?.firstname[0]
                              : "U"}
                          </div>
                        )}
                      </div>
                      {/* Chat Details */}
                      <div className="flex-1 ml-3 sm:ml-4">
                        <p className="text-sm sm:text-md font-semibold text-gray-800">
                          {otherUser ? otherUser.firstname : "Unknown User"}
                        </p>
                        {chat.messages.length > 0 && (
                          <p
                            className={
                              chat.messages[chat.messages.length - 1]?.read ===
                              true
                                ? "text-xs sm:text-sm text-gray-600 truncate"
                                : "text-md font-bold text-gray-800 truncate"
                            }
                          >
                            {chat.messages[chat.messages.length - 1].content}
                          </p>
                        )}
                      </div>
                      {/* Unread Message Count */}
                      {unreadCount > 0 && (
                        <div className="ml-auto bg-[#128C7E] text-white rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold hover:bg-[#0e6e5f] active:scale-95 transition-all duration-200 animate-pulse">
                          {unreadCount}
                        </div>
                      )}
                      {/* Delete Button (Visible on Long Press) */}
                      {selectedChatId === chat._id && (
                        <button
                          onClick={() => handleDeleteChat(chat._id)}
                          className="absolute top-2 right-2 p-2 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors duration-200"
                          aria-label="Delete chat"
                        >
                          <FaTrash size={16} />
                        </button>
                      )}
                    </div>
                  );
                }
              )
            )}
          </>
        )}
      </div>

      {/* Add CSS for fade-in animation */}
      <style jsx>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </div>
  );
};

export default AllChats;
