import { create } from "zustand";

interface StoreState {
  search: boolean;
  currentUser: object;
  currentgig: object;
  searchQuery: string;
  follow: boolean;
  refetchData: boolean;
  showModal: boolean;
  selectedReview: object;
  showUpload: boolean;
  modalVisible: boolean;
  drawerVisible: boolean;
  followersModal: boolean;
  followingsModal: boolean;
  currentFollowers: boolean;

  setShowUpload: () => void;
  setRefetchData: (data: boolean) => void;
  setShowModal: (data: boolean) => void;
  setCurrentFollowers: (data: boolean) => void;
  setSelectedReview: (data: object) => void;
  setSearch: (data: boolean) => void;
  setFollow: (data: boolean) => void;
  setCurrentUser: (data: object) => void;
  setCurrentGig: (data: object) => void;
  setSearchQuery: (data: string) => void;
  setModalVisible: (data: boolean) => void;
  setDrawerVisible: () => void;
  setFollowersModal: (data: boolean) => void;
  setFollowingsModal: (data: boolean) => void;
}

const useStore = create<StoreState>((set) => ({
  messages: [],
  allgigs: [],
  publishedgigs: [],
  mygigs: [],
  bookedgigs: [],
  search: false,
  currentUser: {},
  currentgig: {},
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

  setShowUpload: () => set((state) => ({ showUpload: !state.showUpload })),
  setRefetchData: (data) => set(() => ({ refetchData: data })),
  setCurrentFollowers: (data) => set(() => ({ refetchData: data })),
  setShowModal: (data) => set(() => ({ showModal: data })),
  setSelectedReview: (data) => set(() => ({ selectedReview: data })),
  setSearch: (data) => set(() => ({ search: data })),
  setFollow: (data) => set(() => ({ follow: data })),
  setCurrentUser: (data) => set(() => ({ currentUser: data })),
  setCurrentGig: (data) => set(() => ({ currentgig: data })),
  setSearchQuery: (data) => set(() => ({ searchQuery: data })),
  setModalVisible: (data) => set(() => ({ modalVisible: data })),
  setDrawerVisible: () =>
    set((state) => ({ drawerVisible: !state.drawerVisible })),
  setFollowersModal: (data) => set(() => ({ followersModal: data })),
  setFollowingsModal: (data) => set(() => ({ followingsModal: data })),
}));

export default useStore;
