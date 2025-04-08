export interface VideoProps {
  _id: string;
  title: string;
  source: string;
  description?: string;
  gigId: string;
  postedBy?: string | { _id: string; firstname: string; [key: string]: string };
  createdAt?: Date;
}
export interface VideoProfileProps {
  _id: string;
  title: string;
  url: string;
  createdAt?: Date;
}
export interface handleProfileprops {
  _id: string;
  name: string;
  handle: string;
}

export interface Review {
  _id: string;
  rating: number;
  comment: string;
  gigId: string; // assuming Gig ID is a string
  postedBy?: string | { _id: string; firstname: string; [key: string]: string };
  postedTo?: string | { _id: string; firstname: string; [key: string]: string };

  updatedAt?: Date;
  createdAt?: Date;
}

export interface UserProps {
  _id?: string;
  email?: string;
  clerkId: string; // Required and unique
  picture?: string | null;
  firstname?: string | undefined;
  lastname?: string;
  city?: string;
  date?: string;
  month?: string;
  year?: string;
  address?: string;
  instrument?: string;
  experience?: string;
  phone?: string;
  verification?: string;
  username: string; // Required, unique, and lowercase
  followers: string[] | UserProps[];
  followings: string[] | UserProps[];
  allreviews: Review[];
  myreviews: Review[];
  isMusician: boolean;
  isClient: boolean;
  videosProfile: VideoProfileProps[];
  organization: string;
  bio: string;
  handles: string;
  genre: string;
  refferences: UserProps[];
  roleType: string;
  djGenre: string;
  djEquipment: string;
  mcType: string;
  mcLanguage: string;
  talentbio: string;
  vocalistGenre: string;
  musicianhandles: { platform: string; handle: string }[]; // Changed to array
  musiciangenres: string[];
  firstLogin: boolean;
  onboardingComplete: boolean;
  lastActive: Date;
}
export interface Users {
  users: UserProps[]; // Optional}
}
export interface Videos {
  videos: VideoProps[]; // Optional}
}

export interface FetchResponse {
  result: UserProps; //
  message?: string;
  status: number;
}
