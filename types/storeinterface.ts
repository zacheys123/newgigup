import { postedBy } from "@/utils";
import { Review, UserProps } from "./userinterfaces";
import { GigProps } from "./giginterface";
import { ChatProps, MessageProps } from "./chatinterfaces";
import { Socket } from "socket.io-client";
import { DashboardData } from "./dashboard";

export const initialState = {
  gigs: [], // Initialize gigs array
  subscriptiondata: {
    user: {
      isClient: false,
      isMusician: false,
      firstLogin: true,
      clerkId: "",
      gigsBooked: 0, // Add this
      userearnings: 0, // Add this
      gigsPosted: 0,
      total: 0,
      onboardingComplete: false,
      gigsBookedThisWeek: { count: 0, weekStart: new Date() },
      createdAt: new Date(),
      tier: "free",
    },
    subscription: {
      tier: "free",
      isPro: false,
      nextBillingDate: new Date() || null,
      lastBookingDate: new Date() || null,
    },
  },
  loadingPostId: "",
  loadPostId: "",
  showVideo: false,
  confirmEdit: false,
  selectedReview: {
    _id: "",
    rating: 0,
    comment: "",
    gigId: "", // assuming Gig ID is a string
    postedBy: "",
    postedTo: "",
  },
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
    roleType: "",
    djGenre: "",
    djEquipment: "",
    mcType: "",
    mcLanguage: "",
    talentbio: "",
    vocalistGenre: "",
    musicianhandles: [{ platform: "", handle: "" }],
    musiciangenres: [],
    firstLogin: true,
    onboardingComplete: false,
    lastActive: new Date(),
    createdAt: new Date(),
    updatedAt: new Date(),
    isBanned: false,
    banReason: "",
    bannedAt: new Date(),
    isAdmin: false,
    adminRole: "super",
    tierStatus: "",
    adminPermissions: [""],
    lastAdminAction: new Date(),
    adminNotes: "",
    banExpiresAt: new Date(), // New field for temporary ban
    banReference: "", // New fiel
    theme: "lightMode",
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
    bussinesscat: null,
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
    gigtimeline: "",
    day: "",
    mcType: "",
    mcLanguages: "",
    djGenre: "",
    djEquipment: "",
    vocalistGenre: [],
    pricerange: "",
    currency: "",
    scheduleDate: new Date(),
  },

  searchQuery: "",
  follow: false,
  refetchData: false,
  showModal: false,
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
  showConfirmModal: false,
  showConfirmation: false,
  lastBookedGigId: "",
  isSchedulerOpen: false,
  showTrialModal: false,
  trialRemainingDays: 0,
  showOfflineNotification: false,
};
interface OnlineUser {
  userId: string;
  socketId: string;
}
export interface StoreState {
  gigs: GigProps[];
  subscriptiondata: DashboardData;
  loadingPostId: string;
  loadPostId: string;
  confirmEdit: boolean;
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
  showVideo: boolean;
  selectedReview: Review;
  showUpload: boolean;
  modalVisible: boolean;
  drawerVisible: boolean;
  followersModal: boolean;
  followingsModal: boolean;
  currentFollowers: boolean;
  refetchGig: boolean;
  showConfirmModal: boolean;
  messages: MessageProps[];
  chats: Record<string, ChatProps>;
  onlineUsers: OnlineUser[];
  socket: Socket | null;
  unreadCounts: Record<string, number>; // { chatId: unreadCount }
  showConfirmation: boolean;
  lastBookedGigId: string | null;
  isSchedulerOpen: boolean;
  showTrialModal: boolean;
  trialRemainingDays: number | null;
  showOfflineNotification: boolean;
  setShowOfflineNotification: (data: boolean) => void;

  setTrialRemainingDays: (days: number | null) => void;
  setShowTrialModal: (data: boolean) => void;

  setisSchedulerOpen: (data: boolean) => void;
  setLastBookedGigId: (data: string | null) => void;
  setShowConfirmation: (data: boolean) => void;
  setData: (data: DashboardData) => void;
  setLoadingPostId: (data: string) => void;
  setLoadPostId: (data: string) => void;
  updateUnreadCount: (chatId: string, increment?: boolean) => void;
  setShowUpload: () => void;
  setShowVideo: (data: boolean) => void;
  setRefetchData: (data: boolean) => void;
  setIsOpen: (data: boolean) => void;
  setShowModal: (data: boolean) => void;
  setConfirmEdit: (data: boolean) => void;
  setCurrentFollowers: (data: boolean) => void;
  setSelectedReview: (data: Review) => void;
  setSearch: (data: boolean) => void;
  setFollow: (data: boolean) => void;
  setRefferenceModalOpen: (data: boolean) => void;
  setIsDescriptionModal: (isOpen: boolean) => void;
  setReviewModalOpen: (data: boolean) => void;
  setIsProfileModalOpen: (data: boolean) => void;
  setShowConfirmModal: (showconfirmModal: boolean) => void;
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
  updateGigStatus: (gigId: string, updates: Partial<GigProps>) => void;
  setGigs: (gigs: GigProps[]) => void;
}
