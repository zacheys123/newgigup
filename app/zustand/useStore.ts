import { GigProps } from "@/types/giginterface";
import { Review, UserProps } from "@/types/userinterfaces";
import { ChatProps, MessageProps } from "@/types/chatinterfaces";
import { postedBy } from "@/utils";
import { create } from "zustand";

interface StoreState {
  search: boolean;
  currentUser: UserProps;
  currentgig: GigProps;
  searchQuery: string;
  follow: boolean;
  refetchData: boolean;
  showModal: boolean;
  selectedReview: Record<string, Review>;
  showUpload: boolean;
  modalVisible: boolean;
  drawerVisible: boolean;
  followersModal: boolean;
  followingsModal: boolean;
  currentFollowers: boolean;
  refetchGig: boolean;
  messages: MessageProps[];
  chats: Record<string, ChatProps>;
  onlineUsers: [];

  setShowUpload: () => void;
  setRefetchData: (data: boolean) => void;
  setShowModal: (data: boolean) => void;
  setCurrentFollowers: (data: boolean) => void;
  setSelectedReview: (data: Record<string, Review>) => void;
  setSearch: (data: boolean) => void;
  setFollow: (data: boolean) => void;
  setCurrentUser: (data: Partial<UserProps>) => void;
  setCurrentGig: (data: Partial<GigProps>) => void;
  setSearchQuery: (data: string) => void;
  setModalVisible: (data: boolean) => void;
  setDrawerVisible: () => void;
  setFollowersModal: (data: boolean) => void;
  setFollowingsModal: (data: boolean) => void;
  setRefetchGig: (data: boolean) => void;
  setMessages: (data: MessageProps[]) => void;
  addChat: (chat: ChatProps) => void;
  addMessage: (message: MessageProps) => void;
  fetchMessages: (chatId: string) => Promise<void>;
  sendMessage: (message: MessageProps) => Promise<void>;
  // listenForMessages: () => void;
  setOnlineUsers: (onlineuser: []) => void;
  updateMessageReaction: (messageId: string, emoji: string) => void;
}

const useStore = create<StoreState>((set) => ({
  messages: [],
  chats: {}, // Efficient dictionary for chat lookups
  search: false,
  refetchGig: false,
  currentUser: {
    clerkId: "",
    firstname: "",
    lastname: "",
    experience: "",
    instrument: "",
    username: "",
    followers: [],
    followings: [],
    allreviews: [],
    myreviews: [],
    isMusician: false,
    isClient: false,
    videosProfile: [],
    handles: "",
    bio: "",
    genre: "",
    organization: "",
  },
  currentgig: {
    _id: "",
    postedBy: postedBy,
    bookedBy: postedBy,
    title: "",
    secret: "",
    description: "",
    phone: "",
    price: "",
    category: "",
    bandCategory: [],
    bussinesscat: "",
    location: "",
    date: new Date(),
    time: {},
    isTaken: false,
    isPending: false,
    viewCount: [],
    username: "",
    updatedAt: new Date(),
    createdAt: new Date(),
    bookCount: [],
    font: "",
    fontColor: "",
    backgroundColor: "",
    logo: "",
  },
  searchQuery: "",
  follow: false,
  refetchData: false,
  showModal: false,
  selectedReview: {},
  showUpload: false,
  modalVisible: false,
  drawerVisible: false,
  followersModal: false,
  followingsModal: false,
  currentFollowers: false,
  onlineUsers: [],

  setOnlineUsers: (data) => set(() => ({ onlineUsers: data })),
  setShowUpload: () => set((state) => ({ showUpload: !state.showUpload })),
  setRefetchData: (data) => set(() => ({ refetchData: data })),
  setCurrentFollowers: (data) => set(() => ({ currentFollowers: data })),
  setShowModal: (data) => set(() => ({ showModal: data })),
  setSelectedReview: (data) => set(() => ({ selectedReview: data })),
  setSearch: (data) => set(() => ({ search: data })),
  setFollow: (data) => set(() => ({ follow: data })),
  setCurrentUser: (data) =>
    set((state) => ({ currentUser: { ...state.currentUser, ...data } })),
  setCurrentGig: (data) =>
    set((state) => ({ currentgig: { ...state.currentgig, ...data } })),
  setSearchQuery: (data) => set(() => ({ searchQuery: data })),
  setModalVisible: (data) => set(() => ({ modalVisible: data })),
  setDrawerVisible: () =>
    set((state) => ({ drawerVisible: !state.drawerVisible })),
  setFollowersModal: (data) => set(() => ({ followersModal: data })),
  setFollowingsModal: (data) => set(() => ({ followingsModal: data })),
  setRefetchGig: (data) => set(() => ({ refetchGig: data })),
  setMessages: (data) => set(() => ({ messages: data })),
  // Efficiently add new chats
  addChat: (chat) =>
    set((state) => ({
      chats: { ...state.chats, [chat.chatId]: chat },
    })),

  addMessage: (message) =>
    set((state) => {
      if (state.messages.find((msg) => msg._id === message._id)) return state;
      return {
        messages: [...state.messages, message],
        chats: {
          ...state.chats,
          [message.chatId]: {
            ...(state.chats[message.chatId] || {}), // Ensure chat exists
            messages: [
              ...(state.chats[message.chatId]?.messages || []),
              message,
            ],
          },
        },
      };
    }),

  // Fetch messages and update chat state
  fetchMessages: async (chatId: string) => {
    try {
      const res = await fetch(`/api/chat/getmessages?chatId=${chatId}`);
      if (!res.ok) throw new Error("Failed to fetch messages");

      const { messages } = await res.json();
      set((state) => ({
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
    }
  },

  // listenForMessages: () => {
  //   socket.off("receive_message"); // Ensure we don’t create multiple listeners
  //   socket.on("receive_message", (message) => {
  //     set((state) => ({
  //       messages: [...state.messages, message],
  //     }));
  //   });
  // },
  sendMessage: async (newMessage: MessageProps) => {
    try {
      const res = await fetch("/api/messages/sendmessages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newMessage),
      });

      if (!res.ok) throw new Error("Failed to send message");

      const savedMessage = await res.json();
      console.log(savedMessage);
      set((state) => ({
        messages: [...state.messages, savedMessage], // Update state
        chats: {
          ...state.chats,
          [savedMessage.chatId]: {
            ...(state.chats[savedMessage.chatId] || {}),
            messages: [
              ...(state.chats[savedMessage.chatId]?.messages || []),
              savedMessage,
            ],
          },
        },
      }));
    } catch (error) {
      console.error("Error sending message:", error);
    }
  },
  updateMessageReaction: async (messageId: string, emoji: string) => {
    // put request to update message model reactions prroperty
    console.log("updateMessageReaction ", messageId, emoji);
    try {
      const res = await fetch(`/api/messages?messageId=${messageId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(emoji),
      });

      if (!res.ok) throw new Error("Failed to send message");
    } catch (error) {
      console.error("Error sending message:", error);
    }
  },
}));

export default useStore;
