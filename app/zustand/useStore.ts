import { ChatProps, MessageProps } from "@/types/chatinterfaces";
import { GigProps } from "@/types/giginterface";
import { Review, UserProps } from "@/types/userinterfaces";
import { postedBy } from "@/utils";
import { create } from "zustand"; // Import SetState

// ... (your existing interfaces and types)
interface Message {
  _id?: string;
  sender: UserProps;
  content: string;
  createdAt: Date;
  reactions: string;
  tempId?: string;
  chatId: string;
  receiver?: string;
}
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
  updateMessageReaction: (
    messageId: string,
    emoji: string,
    setShowReaction: (response: { success: boolean; message: string }) => void
  ) => void;
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

  setOnlineUsers: (data: []) => set(() => ({ onlineUsers: data })),
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
  addChat: (chat: ChatProps) =>
    set((state: StoreState) => ({
      chats: { ...state.chats, [chat.chatId]: chat },
    })),

  addMessage: (newMessage: Message) => {
    set((state: StoreState) => {
      // Check if message already exists
      const existingMessage = state.messages.find(
        (msg: MessageProps) =>
          msg._id === newMessage._id || msg.tempId === newMessage.tempId
      );

      if (existingMessage) return state; // Prevent duplicate message

      return { messages: [...state.messages, newMessage] };
    });
  },

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
    }
  },

  sendMessage: async (newMessage: MessageProps) => {
    try {
      const res = await fetch("/api/messages/sendmessages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newMessage),
      });

      if (!res.ok) throw new Error("Failed to send message");

      const savedMessage = await res.json();

      set((state: StoreState) => {
        console.log("Before update:", state.messages.length);
        // Ensure the message is not already in the state
        if (state.messages.some((msg) => msg._id === savedMessage._id)) {
          return state;
        }
        console.log("After update:", state.messages.length);
        return {
          messages: [...state.messages, savedMessage], // Add only if not present
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
        };
      });
    } catch (error) {
      console.error("Error sending message:", error);
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
