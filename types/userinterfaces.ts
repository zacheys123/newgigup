import { GigProps } from "./giginterface";
import { BookingItem } from "./history";
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
  postedBy?: string | UserProps;
  postedTo?: string | UserProps;
  updatedAt?: Date;
  createdAt?: Date;
}

export interface UserProps {
  _id?: string;
  clerkId: string;
  picture?: string | null;
  firstname?: string;
  lastname?: string;
  email?: string;
  city?: string;
  date?: string;
  month?: string;
  year?: string;
  address?: string;
  instrument?: string;
  experience?: string;
  phone?: string;
  verification?: string;
  username: string;
  followers?: string[] | UserProps[];
  followings?: string[] | UserProps[];
  allreviews?: Review[];
  myreviews?: Review[];
  isMusician?: boolean;
  isClient?: boolean;
  videosProfile?: VideoProfileProps[];
  organization?: string;
  bio?: string;
  handles?: string;
  genre?: string;
  refferences?: UserProps[];
  roleType?: string;
  djGenre?: string;
  djEquipment?: string;
  mcType?: string;
  mcLanguage?: string;
  talentbio?: string;
  vocalistGenre?: string;
  musicianhandles?: { platform: string; handle: string }[];
  musiciangenres?: string[];
  firstLogin?: boolean;
  onboardingComplete?: boolean;
  lastActive?: Date;
  createdAt?: Date;
  updatedAt: Date;
  isAdmin?: boolean;
  adminRole?: "super" | "content" | "support" | "analytics" | string;
  tierStatus?: "active" | "pending" | "canceled" | "expired" | string;
  adminPermissions?: string[];
  lastAdminAction?: Date;
  adminNotes?: string;
  isBanned: boolean;
  banReason: string;
  bannedAt: Date;
  banExpiresAt: Date; // New field for temporary ban
  banReference: string; // New fiel
  theme: "lightMode" | "darkMode" | "system" | string;
  savedGigs: GigProps[];
  favoriteGigs: GigProps[];
  bookingHistory: BookingItem[];
  completedGigsCount: number;
  cancelgigCount: number;
  reliabilityScore?: number;
  reportsCount: number;
}
export interface Users {
  users: UserProps[]; // Optional}
}

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
export interface Videos {
  videos: VideoProps[]; // Optional}
}

export interface FetchResponse {
  result: UserProps; //
  message?: string;
  status: number;
}
export type UserFilter = {
  $or?: Array<{
    firstname?: { $regex: string; $options: string };
    lastname?: { $regex: string; $options: string };
    email?: { $regex: string; $options: string };
    username?: { $regex: string; $options: string };
    city?: { $regex: string; $options: string };
    instrument?: { $regex: string; $options: string };
    // Add any other text-searchable fields
  }>;
  isAdmin?: boolean;
  isMusician?: boolean;
  isClient?: boolean;
  tier?: "free" | "pro";
  roleType?: string | { $in: string[] };
  createdAt?: { $gte?: Date; $lte?: Date };
  updatedAt?: { $gte?: Date; $lte?: Date };
  lastActive?: { $gte?: Date };

  // Add any other fields you might filter on
  // For array fields:
  musiciangenres?: { $in: string[] };
  // For exact matches:
  verification?: string;
  // For numeric ranges:
  earnings?: { $gte?: number; $lte?: number };
};
