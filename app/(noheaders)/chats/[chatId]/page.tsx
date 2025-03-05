"use client";
import { useCurrentUser } from "@/hooks/useCurrentUser";
import { MessageProps } from "@/types/chatinterfaces";
import { UserProps } from "@/types/userinterfaces";
import { useAuth } from "@clerk/nextjs";
import moment from "moment";
import Image from "next/image";
import { useParams, useSearchParams, useRouter } from "next/navigation";
import React, { useEffect, useState, useRef } from "react";
import { IoArrowBack, IoEllipsisVertical, IoSearch } from "react-icons/io5";

const ChatPage = () => {
  const params = useParams();
  const { userId } = useAuth();
  const searchParams = useSearchParams();
  const router = useRouter();
  const chatId = params.chatId as string;
  const otherUserId = searchParams.get("userId");
  const [messages, setMessages] = useState<MessageProps[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [otherUser, setOtherUser] = useState<UserProps>();
  const [isMenuOpen, setIsMenuOpen] = useState(false); // For dropdown menu
  const [isSearchOpen, setIsSearchOpen] = useState(false); // For search bar
  const [isTyping, setIsTyping] = useState(false); // For typing indicator
  const { user } = useCurrentUser(userId || null);
  const [searchquery, setSearch] = useState<string>("");

  // Ref for the chat container to enable auto-scrolling
  const chatContainerRef = useRef<HTMLDivElement>(null);

  // Fetch messages and other user's details on component mount
  useEffect(() => {
    const fetchMessagesAndUser = async () => {
      try {
        const [messagesResponse, userResponse] = await Promise.all([
          fetch(`/api/chat/getmessages?chatId=${chatId}`),
          fetch(`/api/user/getuser/${otherUserId}`),
        ]);

        if (!messagesResponse.ok || !userResponse.ok) {
          throw new Error("Failed to fetch data");
        }

        const { messages } = await messagesResponse.json();
        const userData = await userResponse.json();
        console.log(userData);
        setMessages(messages);
        setOtherUser(userData);
      } catch (error) {
        setError(error instanceof Error ? error.message : "An error occurred");
      } finally {
        setLoading(false);
      }
    };

    fetchMessagesAndUser();
  }, [chatId, otherUserId]);

  // Auto-scroll to the bottom whenever messages change
  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop =
        chatContainerRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault(); // Prevent form submission from reloading the page

    if (!newMessage.trim()) return;

    try {
      const response = await fetch("/api/messages/sendmessages", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          chatId,
          content: newMessage,
          sender: user, // Replace with actual logged-in user ID
          reciever: otherUserId, // Replace with the other user's ID
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to send message");
      }

      // Refresh messages after sending
      const updatedMessages = await response.json();
      setMessages(updatedMessages);
      setNewMessage("");
    } catch (error) {
      setError(error instanceof Error ? error.message : "An error occurred");
    }
  };

  // Toggle menu visibility
  const toggleMenu = (ev: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    ev.stopPropagation(); // prevent
    setIsMenuOpen(!isMenuOpen);
  };

  // Toggle search bar visibility
  const toggleSearch = (
    ev: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) => {
    ev.stopPropagation(); // prevent
    setIsSearchOpen(!isSearchOpen);
  };

  const searchMessage = () => {
    // Filter messages based on search query
    const filteredMessages = messages.filter((message) => {
      if (message.content.toLowerCase().includes(searchquery?.toLowerCase())) {
        return true;
      } else if (
        moment(message?.createdAt || new Date())
          .calendar(null, {
            sameDay: "[Today at] h:mm A",
            lastDay: "[Yesterday at] h:mm A",
            lastWeek: "dddd [at] h:mm A",
            sameElse: "MMMM D [at] h:mm A",
          })
          .toLowerCase()
          .includes(searchquery?.toLowerCase())
      ) {
        return true;
      } else {
        return false;
      }
    });
    return filteredMessages;
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center h-screen text-red-500">
        Error: {error}
      </div>
    );
  }

  return (
    <div
      className="h-screen flex flex-col bg-[#f0f2f5] pt-[55px] "
      onClick={() => {
        setIsMenuOpen(false);
      }}
    >
      {/* Header with back icon, avatar, and other user's name */}
      <div className="w-full bg-neutral-300/60 h-[55px] absolute top-0 px-5 py-2 flex items-center">
        <button onClick={() => router.back()} className="mr-4">
          <IoArrowBack className="text-2xl" />
        </button>
        {otherUser?.picture && (
          <div className="flex items-center">
            <Image
              src={otherUser?.picture}
              alt={otherUser?.firstname?.split("")[0] as string}
              className="w-8 h-8 rounded-full mr-2"
              width={30}
              height={30}
            />
            <div>
              <span className="font-semibold">{otherUser?.firstname}</span>
              {isTyping && <p className="text-xs text-gray-500">Typing...</p>}
            </div>
          </div>
        )}
        {/* Search Icon */}
        <button
          onClick={(ev) => toggleSearch(ev)}
          className="ml-auto p-2 hover:bg-gray-200 rounded-full"
        >
          <IoSearch className="text-gray-600" />
        </button>
        {/* Menu Icon and Dropdown */}
        <div className="relative">
          <button
            onClick={(ev) => toggleMenu(ev)}
            className="p-2 hover:bg-gray-200 rounded-full"
          >
            <IoEllipsisVertical className="text-gray-600" />
          </button>
          {isMenuOpen && (
            <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-200 rounded-lg shadow-lg">
              <button className="block w-full px-4 py-2 text-left hover:bg-gray-100 title">
                View Profile
              </button>
              <button className="block w-full px-4 py-2 text-left hover:bg-gray-100 title ">
                Block User
              </button>
              <button className="block w-full px-4 py-2 text-left hover:bg-gray-100 title ">
                Clear Chat
              </button>
            </div>
          )}
        </div>
      </div>
      {/* Search Bar (conditionally rendered) */}
      {isSearchOpen && (
        <div className="w-full p-2 bg-white border-b border-gray-200">
          <input
            type="text"
            placeholder="Search messages..."
            value={searchquery}
            className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
            onChange={(ev) => {
              ev.stopPropagation(); // prevent
              setSearch(ev.target.value);
            }}
            onKeyDown={searchMessage}
          />
          <span className="my-[20px]">
            {searchquery && `All searches for '${searchquery}'`}
          </span>
        </div>
      )}
      {/* Chat messages container with ref for auto-scrolling */}
      <div ref={chatContainerRef} className="flex-1 overflow-y-auto p-4">
        {searchMessage().map((message) => (
          <div
            key={message._id}
            className={`mb-4 ${
              message.sender?._id === otherUserId ? "text-left" : "text-right"
            }`}
          >
            <div
              className={`inline-block p-3 rounded-lg ${
                message.sender?._id === otherUserId
                  ? "bg-blue-50"
                  : "bg-green-50"
              }`}
            >
              <p className="text-sm">{message.content}</p>
              <p className="text-xs text-gray-500 mt-1">
                {moment(message?.createdAt || new Date()).calendar(null, {
                  sameDay: "[Today at] h:mm A",
                  lastDay: "[Yesterday at] h:mm A",
                  lastWeek: "dddd [at] h:mm A",
                  sameElse: "MMMM D [at] h:mm A",
                })}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Message input form */}
      <div className="p-4 bg-white border-t border-gray-200">
        <form onSubmit={handleSendMessage} className="flex space-x-2">
          <input
            type="text"
            value={newMessage}
            onChange={(e) => {
              setNewMessage(e.target.value);
              setIsTyping(true);
            }}
            placeholder="Type a message..."
            className="flex-1 p-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
          />
          <button
            type="submit"
            className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors duration-200"
          >
            Send
          </button>
        </form>
      </div>
    </div>
  );
};

export default ChatPage;
