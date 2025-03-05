// c/users/admin/appdata/roaming/wondershare/wondersharefilmora/output

import { FetchResponse, UserProps } from "./types/userinterfaces";

const randomId = Math.floor(Math.random() * 1000000000);
export const postedBy = {
  _id: "",
  name: "",
  email: "",
  clerkId: "", // Required and unique
  picture: "",
  firstname: "",
  lastname: "",
  city: "",
  date: "",
  month: "",
  year: "",
  address: "",
  instrument: "",
  experience: "",
  phone: "",
  verification: "",
  username: "", // Required, unique, and lowercase
  followers: [], // Array of User IDs
  followings: [], // Array of User IDs
  allreviews: [],
  myreviews: [],
  isMusician: false,
  isClient: false,
  videosProfile: [],
  organization: "",
  handles: "",
  bio: "",
  genre: "",
  refferences: [],
};

export const instruments = [
  {
    id: randomId + "piano",
    name: "Piano",
    value: "piano",
  },

  {
    id: randomId + "guitar",
    name: "Guitar",
    value: "guitar",
  },

  {
    id: randomId + "bass",
    name: "Bass Guitar",
    value: "bass",
  },

  {
    id: randomId + "saxophone",
    name: "Saxophone",
    value: "sax",
  },

  {
    id: randomId + "other",
    name: "Other",
    value: "other",
  },

  {
    id: randomId + "ukulele",
    name: "Ukulele",
    value: "ukulele",
  },

  {
    id: randomId + "full",
    name: "Full Band",
    value: "full",
  },

  {
    id: randomId + "personal",
    name: "Personal",
    value: "personal",
  },

  {
    id: randomId + "violin",
    name: "Violin",
    value: "violin",
  },

  {
    id: randomId + "drums",
    name: "Drums",
    value: "drums",
  },

  {
    id: randomId + "keyboard",
    name: "Keyboard",
    value: "keyboard",
  },

  {
    id: randomId + "trumpet",
    name: "Trumpet",
    value: "trumpet",
  },

  {
    id: randomId + "harp",
    name: "Harp",
    value: "harp",
  },

  {
    id: randomId + "trombone",
    name: "Trombone",
    value: "trombone",
  },

  {
    id: randomId + "tuba",
    name: "Tuba",
    value: "tuba",
  },
];
export const checkEnvironment = () => {
  const base_url =
    process.env.NODE_ENV === "development"
      ? "http://localhost:3000"
      : "https://newgigup.vercel.app"; // https://v2ds.netlify.app

  return base_url;
};

export const searchFunc = (users: UserProps[], searchQuery: string) => {
  let sortedData = users;
  console.log(sortedData);
  if (searchQuery) {
    sortedData = sortedData?.filter((user: UserProps) => {
      if (
        user?.firstname?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        user?.lastname?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        // user?.username?.toLowerCase().includes(searchQuery) ||
        user?.email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        user?.instrument?.toLowerCase().includes(searchQuery.toLowerCase())
      ) {
        return true;
      }
    });
  }
  return sortedData;
};

// export const fetchVideos = async (userid: string) => {
//   const response = await fetch(`/api/videos/getvideos/${userid}`);
//   if (!response.ok) throw new Error("Failed to fetch videos");
//   return response.json();
// };

// export const deleteVideo = async (
//   id: string,
//   setVideos: () => void,
//   videos: VideoProps[]
// ) => {
//   try {
//     await fetch(`/api/videos/deletevideo/${id}`, {
//       method: "DELETE",
//       headers: { "Content-Type": "application/json" },
//     });
//     setRefetch((prev) => !prev);
//     setVideos(videos?.filter((v: VideoProps) => v._id !== id));
//     setDeleteLoading(false);
//   } catch (error) {
//     console.error("Error deleting video:", error);
//   }
// };

// Function to handle the follow action
export const handleFollow = async (
  _id: string,
  user: UserProps,
  router: {
    push: (url: string) => void;
    replace: (url: string) => void;
    refresh: () => void;
  }
) => {
  // Optimistically set follow status

  const res = await fetch(`/api/user/follower/${_id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ follower: user?._id }),
  });

  if (res.ok) {
    // Refresh the page or update the followers in the UI
    router.refresh();
  } else {
    throw new Error("Failed to follow");
  }
};

// Function to handle unfollow action
export const handleUnfollow = async (
  _id: string,
  user: UserProps,
  router: {
    push: (url: string) => void;
    replace: (url: string) => void;
    refresh: () => void;
  }
) => {
  // Optimistically set unfollow status

  const res = await fetch(`/api/user/unfollower/${_id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ follower: user?._id }),
  });

  if (res.ok) {
    // Refresh the page or update the followers in the UI
    router.refresh();
  } else {
    throw new Error("Failed to unfollow");
  }
};

export const handleUnFollowingCurrent = async (
  _id: string,
  user: UserProps
) => {
  const res = await fetch(`/api/user/unfollowing/${_id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ following: user?._id }),
  });
  const followingData: FetchResponse = await res.json();
  console.log("data", followingData);
};
export const handleFollowing = async (_id: string, user: UserProps) => {
  const res = await fetch(`/api/user/following/${_id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ following: user?._id }),
  });
  const followingData: FetchResponse = await res.json();
  console.log(followingData);
  if (res.ok) {
    console.log("following!!!", followingData);
  }
};

// function gigme(query: string, data: GigProps, sorted: GigProps[]) {
//   if (data?.location?.toLowerCase().includes(query.toLowerCase())) {
//     return sorted;
//   } else if (
//     data?.time?.from?.toLowerCase().includes(query.toLowerCase()) ||
//     data?.time?.to?.toLowerCase().includes(query.toLowerCase())
//   ) {
//     return sorted;
//   } else if (data?.title?.toLowerCase().includes(query.toLowerCase())) {
//     return sorted;
//   }
// }
// export const searchfunc = (
//   data: GigProps[],
//   searchquery: string,
//   category: string,
//   gigQuery: [],
//   location: string
// ) => {
//   let sortedData = data;

//   sortedData = sortedData?.filter((gig) => {
//     if (searchquery) {
//       gigQuery = gigme(searchquery, gig, sortedData);
//       return gigQuery;
//     } else {
//       if (
//         gig?.category &&
//         gig?.category?.toLowerCase() === category?.toLowerCase()
//       ) {
//         return sortedData;
//       } else if (gig.bussinesscat?.toLowerCase() === category?.toLowerCase()) {
//         return sortedData;
//       } else if (
//         category.toLowerCase() === "all" &&
//         gig?.location?.toLowerCase().includes(location.toLowerCase())
//       ) {
//         console.log(location);
//         return sortedData;
//       } else if (
//         category.toLowerCase() === "all" &&
//         location.toLowerCase() === "all"
//       ) {
//         return data;
//       }
//     }
//     if (location) {
//       if (gig?.location?.toLowerCase().includes(location.toLowerCase())) {
//         return sortedData;
//       }
//     }
//   });

//   return sortedData;
// };

// Font Choices
export const fonts = [
  "Poppins",
  "Inter",
  "Roboto",
  "Lora",
  "Montserrat",
  "Merriweather",
  "Playfair Display",
  "Oswald",
  "Raleway",
  "Source Sans Pro",
  "Nunito",
  "Open Sans",
  "Work Sans",
  "Quicksand",
  "DM Sans",
  "Manrope",
  "Josefin Sans",
  "Cabin",
  "Bebas Neue",
  "Fira Sans",
  "Cairo",
  "Ubuntu",
  "Noto Sans",
  "Sofia",
  "Arial",
  "Georgia",
  "Verdana",
  "Courier New",
  "Times New Roman",
  "Trebuchet MS",
];

// Professional Color Palette (Mini Circles)
export const colors = [
  "#fff",
  "#1E1E1E",
  "#3B3B3B",
  "#FF5733",
  "#FF8C42",
  "#FFC857",
  "#6A0572",
  "#AB83A1",
  "#0D3B66",
  "#F4D35E",
  "#EE964B",
  "#006D77",
  "#83C5BE",
  "#E29578",
  "#FFB4A2",
  "#B5838D",
  "#3D348B",
  "#7678ED",
  "#F6AE2D",
  "#F26419",
];
