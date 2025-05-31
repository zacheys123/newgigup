// c/users/admin/appdata/roaming/wondershare/wondersharefilmora/output
import { BookingEligibility, DashboardData } from "./types/dashboard";
import { GigProps } from "./types/giginterface";
import { FetchResponse, UserProps } from "./types/userinterfaces";

interface SearchOptions {
  searchQuery?: string;
  category?: string;
  location?: string;
  scheduler?: "all" | "notPending" | "pending" | string; // Hybrid approach
  timelineOption: "once" | "weekly" | "other" | string; // Hybrid approach
}
function gigme(query: string, gig: GigProps): boolean {
  const lowerQuery = query.toLowerCase();

  return (
    Boolean(
      gig.time?.from && gig.time.from.toLowerCase().includes(lowerQuery)
    ) ||
    Boolean(gig.time?.to && gig.time.to.toLowerCase().includes(lowerQuery)) ||
    Boolean(gig.title && gig.title.toLowerCase().includes(lowerQuery)) ||
    Boolean(
      gig.description && gig.description.toLowerCase().includes(lowerQuery)
    ) ||
    Boolean(
      gig.postedBy?.username &&
        gig.postedBy.username.toLowerCase().includes(lowerQuery)
    ) ||
    Boolean(gig.category && gig.category.toLowerCase().includes(lowerQuery)) ||
    Boolean(
      gig.bussinesscat && gig.bussinesscat.toLowerCase().includes(lowerQuery)
    )
  );
}

export const filterGigs = (
  data: GigProps[] = [],
  options: SearchOptions
): GigProps[] => {
  const {
    searchQuery,
    category = "all",
    location = "all",
    scheduler = "all",
    timelineOption = "once",
  } = options;

  return data.filter((gig) => {
    // Handle scheduler filtering
    if (scheduler !== "all") {
      if (scheduler === "pending" && !gig.isPending) return false;
      if (scheduler === "notPending") {
        return gig?.isPending === false && gig?.isTaken === false;
      }
    }
    if (timelineOption.trim() !== "once") {
      if (timelineOption === "weekly") {
        return gig?.gigtimeline.trim() === "weekly";
      }
      if (timelineOption === "other") {
        return gig?.gigtimeline.trim() === "other";
      }
      return gig?.gigtimeline.trim() === "once";
    }
    // Handle search query if present
    if (searchQuery?.trim() && !gigme(searchQuery, gig)) {
      return false;
    }

    // Handle category filtering
    if (category.toLowerCase() !== "all") {
      const lowerCategory = category.toLowerCase();
      if (
        !gig.category?.toLowerCase().includes(lowerCategory) &&
        !gig.bussinesscat?.toLowerCase().includes(lowerCategory)
      ) {
        return false;
      }
    }
    if (location.toLowerCase() !== "all") {
      if (!gig.location?.toLowerCase().includes(location.toLowerCase())) {
        return false;
      }
    }

    return true;
  });
};

export const formatViewCount = (count?: number | string[]): string => {
  const num = Array.isArray(count)
    ? count.length
    : typeof count === "number"
    ? count
    : 0;

  if (num >= 1000000) {
    const millions = num / 1000000;
    return millions % 1 === 0 ? `${millions}M` : `${millions.toFixed(1)}M`;
  }
  if (num >= 1000) {
    const thousands = num / 1000;
    return thousands % 1 === 0 ? `${thousands}k` : `${thousands.toFixed(1)}k`;
  }
  return num.toString();
};
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
  banReason: "",
  bannedAt: new Date(),
  isAdmin: false,
  adminRole: "",
  adminPermissions: [""],
  lastAdminAction: new Date(),
  adminNotes: "",
  isBanned: false,
  banExpiresAt: new Date(), // New field for temporary ban
  banReference: "", // New fiel
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

export const handleFollow = async (_id: string, user: UserProps) => {
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
  } else {
    throw new Error("Failed to follow");
  }
};

// Function to handle unfollow action
export const handleUnfollow = async (_id: string, user: UserProps) => {
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

export const fonts = [
  // Modern Sans-Serif
  "Poppins",
  "Inter",
  "Roboto",
  "Montserrat",
  "Open Sans",
  "Nunito",
  "Raleway",
  "Work Sans",
  "DM Sans",
  "Manrope",
  "Fira Sans",
  "Source Sans Pro",
  "Noto Sans",
  "Ubuntu",
  "Segoe UI",
  "SF Pro Display",
  "Figtree",

  // Elegant Serif
  "Lora",
  "Merriweather",
  "Playfair Display",
  "Cormorant Garamond",
  "Libre Baskerville",
  "EB Garamond",
  "Alegreya",
  "Bitter",
  "Vollkorn",

  // Display & Headings
  "Oswald",
  "Bebas Neue",
  "Josefin Sans",
  "Alfa Slab One",
  "Archivo Black",
  "Anton",
  "Impact",
  "Abril Fatface",

  // Rounded/Soft Sans-Serif
  "Quicksand",
  "Cabin",
  "Nunito Sans",
  "Mukta",
  "Comfortaa",
  "Lexend",

  // Monospace & Tech
  "Courier New",
  "Roboto Mono",
  "Fira Code",
  "Source Code Pro",
  "IBM Plex Mono",

  // Web-Safe Fallbacks
  "Arial",
  "Georgia",
  "Verdana",
  "Times New Roman",
  "Trebuchet MS",
  "Helvetica",

  // Decorative/Cursive
  "Sofia",
  "Pacifico",
  "Dancing Script",
  "Great Vibes",
  "Parisienne",
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
  "#3D495A",
  "#6D6D6D",
  "#7F7F7F",
  "#C4C4C4",
  "#D3D3D3",
];
export const dataCounties = [
  "Nairobi",
  "Mombasa",
  "Kisumu",
  "Meru",
  "Kakamega",
  "Kiambu",
  "Bungoma",
  "Voi",
  "Machakos",
  "Kilifi",
  "Mandera",
  "Tharaka-Nithi",
  "Kajiado",
  "Kericho",
  "Naivasha",
  "Eldoret",
  "Lamu",
  "Nyeri",
  "Nakuru",
  "Kisii",
  "Muranga",
  "Garissa",
  "Kilimanjaro",
  "Elgeyo-Marakwet",
  "Mugumu",
  "Bomet",
  "Siaya",
  "Kakuma",
  "Isiolo",
  "Kitui",
  "Vihiga",
  "All",
];

export const canStillBookThisWeekDetailed = (
  data: DashboardData | null
): BookingEligibility => {
  // Return temporary state if data isn't fully loaded
  if (data) {
    if (!data?.user?.createdAt || !data.subscription) {
      return {
        canBook: false,
        reason: null,
        status: "loading",
        isLoading: true,
      };
    }

    const { user, subscription } = data;

    // Pro users can always book
    if (subscription?.tier === "pro" || user.tier === "pro") {
      console.log("Pro user - allowed to book");
      return {
        canBook: true,
        reason: null,
        status: "available",
      };
    }
    // Check if user is in first month
    const signupDate = new Date(user.createdAt);
    const oneMonthLater = new Date(signupDate);
    oneMonthLater.setMonth(oneMonthLater.getMonth() + 1);
    const isFirstMonth = new Date() < oneMonthLater;

    if (!isFirstMonth) {
      console.log("Free trial expired - must upgrade");
      return {
        canBook: false,
        reason: "Free trial expired - must Upgrade to Pro",
        status: "pro-only",
        desc: "1 month trial is over",
      };
    }

    // Check weekly limit for free users in first month
    const weeklyBooking = user.gigsBookedThisWeek || {
      count: 0,
      weekStart: null,
    };
    const currentWeekStart = new Date();
    currentWeekStart.setHours(0, 0, 0, 0);
    currentWeekStart.setDate(
      currentWeekStart.getDate() - currentWeekStart.getDay()
    );

    // Reset count if new week
    if (
      !weeklyBooking.weekStart ||
      new Date(weeklyBooking.weekStart).getTime() < currentWeekStart.getTime()
    ) {
      return {
        canBook: true,
        reason: null,
        status: "available",
      };
    }

    // Enforce 3 gigs/week limit
    if (weeklyBooking.count >= 2) {
      return {
        canBook: false,
        reason: "Free limit reached (2 gigs/week)",
        desc: "Upgrade to Pro",
        status: "free-limit",
      };
    }
  }
  return {
    canBook: true,
    reason: null,
    status: "available",
  };
};
