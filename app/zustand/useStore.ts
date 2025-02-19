import { ChatProps, MessageProps } from "@/types/chatinterfaces";
import { GigProps } from "@/types/giginterface";
import { initialState, StoreState } from "@/types/storeinterface";
import { Review, UserProps } from "@/types/userinterfaces";
import { create } from "zustand"; // Import SetState

const isDuplicateMessage = (
  messages: MessageProps[],
  newMessage: MessageProps
) => {
  return messages.some(
    (msg) => msg._id === newMessage._id || msg.tempId === newMessage.tempId
  );
};
const useStore = create<StoreState>((set, get) => ({
  ...initialState,
  setShowUpload: () =>
    set((state: StoreState) => ({ showUpload: !state.showUpload })),
  setRefetchData: (data: boolean) => set(() => ({ refetchData: data })),
  setCurrentFollowers: (data: boolean) =>
    set(() => ({ currentFollowers: data })),
  setShowModal: (data: boolean) => set(() => ({ showModal: data })),
  setSelectedReview: (data: Record<string, Review>) =>
    set(() => ({ selectedReview: data })),
  setSearch: (data: boolean) => set(() => ({ search: data })),
  setFollow: (data: boolean) => set(() => ({ follow: data })),
  setCurrentUser: (data: Partial<UserProps>) =>
    set((state: StoreState) => ({
      currentUser: { ...state.currentUser, ...data },
    })),
  setCurrentGig: (data: Partial<GigProps>) =>
    set((state: StoreState) => ({
      currentgig: { ...state.currentgig, ...data },
    })),
  setSearchQuery: (data: string) => set(() => ({ searchQuery: data })),
  setModalVisible: (data: boolean) => set(() => ({ modalVisible: data })),
  setDrawerVisible: () =>
    set((state: StoreState) => ({ drawerVisible: !state.drawerVisible })),
  setFollowersModal: (data: boolean) => set(() => ({ followersModal: data })),
  setFollowingsModal: (data: boolean) => set(() => ({ followingsModal: data })),
  setRefetchGig: (data: boolean) => set(() => ({ refetchGig: data })),
  setMessages: (data: MessageProps[]) => set(() => ({ messages: data })),
  setOnlineUsers: (users) => set({ onlineUsers: users }),

  addChat: (chat: ChatProps) =>
    set((state: StoreState) => ({
      chats: { ...state.chats, [chat.chatId]: chat },
    })),

  // addMessage: (newMessage) => {
  //   set((state: StoreState) => {
  //     // Check if message already exists
  //     const existingMessage = state.messages.find(
  //       (msg: MessageProps) =>
  //         msg._id === newMessage._id || msg.tempId === newMessage.tempId
  //     );

  //     if (existingMessage) return state; // Prevent duplicate message

  //     return { messages: [...state.messages, newMessage] };
  //   });
  // },
  fetchMessages: async (chatId: string) => {
    try {
      const res = await fetch(`/api/chat/getmessages?chatId=${chatId}`);
      if (!res.ok) throw new Error("Failed to fetch messages");

      const { messages } = await res.json();
      set((state: StoreState) => ({
        messages,
        chats: {
          ...state.chats,
          [chatId]: {
            ...state.chats[chatId],
            messages,
          },
        },
      }));
    } catch (error) {
      console.error("Error fetching messages:", error);
      // Optionally, set an error state or retry logic
    }
  },

  addMessage: (newMessage) => {
    set((state: StoreState) => {
      if (isDuplicateMessage(state.messages, newMessage)) return state;

      return {
        messages: [
          ...state.messages,
          {
            ...newMessage,
            temPid: newMessage.sender?._id || newMessage.sender, // Ensure sender is stored consistently
          },
        ],
      };
    });
  },

  sendMessage: async (newMessage: MessageProps) => {
    console.log("Debug newMessage:", newMessage);
    if (!newMessage.chatId || typeof newMessage.chatId !== "string") {
      console.error("Error: newMessage.chatId is invalid", newMessage.chatId);
      return;
    }

    const { currentUser } = get(); // Get current user from Zustand store
    const chatId = newMessage.chatId as string;
    const tempId = `temp-${Math.random().toString(36).substr(2, 9)}`;
    const optimisticMessage = { ...newMessage, tempId: currentUser?._id };

    // Optimistically update UI
    set((state: StoreState) => {
      const existingChat = state.chats?.[chatId] ?? {
        messages: [],
      };

      return {
        messages: [...state.messages, optimisticMessage],
        chats: {
          ...state.chats,
          [chatId]: {
            ...existingChat,
            messages: [...(existingChat.messages ?? []), optimisticMessage],
          },
        },
      };
    });

    try {
      const res = await fetch("/api/messages/sendmessages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newMessage),
      });

      if (!res.ok) throw new Error("Failed to send message");

      const savedMessage = await res.json();

      // Replace optimistic message with real one
      set((state: StoreState) => ({
        messages: state.messages.map((msg) =>
          msg.tempId === tempId ? savedMessage : msg
        ),
        chats: {
          ...state.chats,
          [savedMessage.chatId]: {
            ...state.chats?.[savedMessage.chatId],
            messages: state.chats?.[savedMessage.chatId]?.messages?.map((msg) =>
              msg.tempId === tempId ? savedMessage : msg
            ) ?? [savedMessage],
          },
        },
      }));
    } catch (error) {
      console.error("Error sending message:", error);

      // Remove optimistic message if request fails
      set((state: StoreState) => ({
        messages: state.messages.filter((msg) => msg.tempId !== tempId),
      }));
    }
  },

  updateMessageReaction: async (
    messageId: string,
    emoji: string,
    setShowReaction: (response: { success: boolean; message: string }) => void
  ) => {
    console.log("updateMessageReaction ", messageId, emoji);

    try {
      const res = await fetch(`/api/messages?messageId=${messageId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ emoji }),
      });

      if (!res.ok) throw new Error("Failed to update message reaction");

      const data = await res.json();
      console.log(data);

      setTimeout(() => {
        setShowReaction({
          success: false,
          message: "",
        });
      }, 3000);
      // Call the callback function with success status
      setShowReaction({
        success: true,
        message: data.message,
      });
    } catch (error) {
      console.error("Error updating message reaction:", error);

      // Handle failure case
      setShowReaction({
        success: false,
        message: "Failed to update reaction",
      });
    }
  },
}));

export default useStore;
