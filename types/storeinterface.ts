import { postedBy } from "@/utils";
import { Review, UserProps } from "./userinterfaces";
import { GigProps } from "./giginterface";
import { ChatProps, MessageProps } from "./chatinterfaces";
import { Socket } from "socket.io-client";

export const initialState = {
  socket: null,
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
    refferences: [],
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
    otherTimeline: "",
    gigTimeline: "",
    day: "",
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
  isOpen: false,
  refferenceModalOpen: false,
  reviewModalOpen: false,
  videoModalOpen: false,
  IsProfileModalOpen: false,
  isDescriptionModal: false,
};
interface OnlineUser {
  userId: string;
  socketId: string;
}
export interface StoreState {
  isDescriptionModal: boolean;
  IsProfileModalOpen: boolean;
  videoModalOpen: boolean;
  reviewModalOpen: boolean;
  refferenceModalOpen: boolean;
  isOpen: boolean;
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
  onlineUsers: OnlineUser[];
  socket: Socket | null;
  unreadCounts: Record<string, number>; // { chatId: unreadCount }
  updateUnreadCount: (chatId: string, increment?: boolean) => void;
  setShowUpload: () => void;
  setRefetchData: (data: boolean) => void;
  setIsOpen: (data: boolean) => void;
  setShowModal: (data: boolean) => void;
  setCurrentFollowers: (data: boolean) => void;
  setSelectedReview: (data: Record<string, Review>) => void;
  setSearch: (data: boolean) => void;
  setFollow: (data: boolean) => void;
  setRefferenceModalOpen: (data: boolean) => void;
  setIsDescriptionModal: (isOpen: boolean) => void;
  setReviewModalOpen: (data: boolean) => void;
  setIsProfileModalOpen: (data: boolean) => void;
  setVideoModalOpen: (data: boolean) => void;
  setCurrentGig: (data: Partial<GigProps>) => void;
  setCurrentUser: (data: Partial<UserProps>) => void;
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
  //   connectSocket: (user: UserProps) => void;
  //   disconnectSocket: () => void;
  updateMessageReaction: (
    messageId: string,
    emoji: string,
    setShowReaction: (response: { success: boolean; message: string }) => void
  ) => void;
}
