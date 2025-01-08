import { UserProps } from "./types/userinterfaces";

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
  videos: [],
  allreviews: [],
  myreviews: [],
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
        user?.firstname?.toLowerCase().includes(searchQuery) ||
        user?.lastname?.toLowerCase().includes(searchQuery) ||
        // user?.username?.toLowerCase().includes(searchQuery) ||
        user?.email?.toLowerCase().includes(searchQuery) ||
        user?.instrument?.toLowerCase().includes(searchQuery)
      ) {
        return sortedData;
      }
    });
  }
  return sortedData;
};
