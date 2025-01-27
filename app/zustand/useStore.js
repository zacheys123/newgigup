import { create } from "zustand";
import { devtools } from "zustand/middleware";

// Define Zustand store with devtools
const useStore = create(
  devtools((set) => ({
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
    refetchdata: false,
    showModal: false,
    selectedReview: null,
    setRefetchData: (data) =>
      set(() => ({
        refetchdata: data,
      })),
    setShowModal: (data) =>
      set(() => ({
        showModal: data,
      })),
    setSelectedReview: (data) =>
      set(() => ({
        selectedReview: data,
      })),
    setSearch: (data) =>
      set(() => ({
        search: data,
      })),
    setFollow: (data) =>
      set(() => ({
        follow: data,
      })),
    setCurrentUser: (data) =>
      set(() => ({
        currentUser: data,
      })),
    setCurrentGig: (data) =>
      set(() => ({
        currentgig: data,
      })),
    setSearchQuery: (data) =>
      set(() => ({
        searchQuery: data,
      })),

    // Action to update user information
    // setUser: (data) =>
    //   set(() => ({
    //     user: data,
    //   })),

    // Action to add a new message to the list
    // addMessage: (message) =>
    //   set((state) => ({
    //     messages: [...state.messages, message],
    //   })),

    // Action to set typing status

    // Action to update user information
    setModalVisible: (data) =>
      set(() => ({
        modalVisible: data,
      })),
    // Action to update user information
    setDrawerVisible: () =>
      set((state) => ({
        drawerVisible: !state.drawerVisible,
      })),
    // Action to update user information
    setFollowersModal: (data) =>
      set(() => ({
        followersmodal: data,
      })),
    setFollowingsModal: (data) =>
      set(() => ({
        followingsmodal: data,
      })),
  }))
);

export default useStore;
