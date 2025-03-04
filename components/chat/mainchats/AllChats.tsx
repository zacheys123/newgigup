// app/all-chats/page.tsx
"use client";
import { MessageProps } from "@/types/chatinterfaces";
import { GigProps } from "@/types/giginterface";
import { UserProps } from "@/types/userinterfaces";
import React, { useEffect, useState } from "react";

interface Chat {
  _id: string;
  users: UserProps[]; // Adjust the type according to your User model
  messages: MessageProps[]; // Adjust the type according to your Message model
  gigChat: GigProps; // Adjust the type according to your Gig model
}

const AllChats = () => {
  const [chats, setChats] = useState<Chat[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchChats = async () => {
      try {
        const response = await fetch("/api/chat/allchats");
        if (!response.ok) {
          throw new Error("Failed to fetch chats");
        }
        const data = await response.json();
        setChats(data);
      } catch (error) {
        setError(error instanceof Error ? error.message : "An error occurred");
      } finally {
        setLoading(false);
      }
    };

    fetchChats();
  }, []);

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
    <div className="min-h-screen bg-gray-100 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">All Chats</h1>
        <div className="space-y-6">
          {chats.map((chat) => (
            <div
              key={chat._id}
              className="bg-white shadow-lg rounded-lg p-6 hover:shadow-xl transition-shadow duration-300"
            >
              <h2 className="text-xl font-semibold text-gray-800 mb-2">
                {chat.users.map((user) => user.firstname)}
              </h2>

              {chat.messages.length > 0 && (
                <div className="bg-blue-50 p-3 rounded-lg">
                  <p className="text-sm text-blue-700">
                    <span className="font-medium">
                      {/* Assuming messages are populated with content */}
                      {chat.messages[chat.messages.length - 1].content}
                    </span>
                  </p>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AllChats;
