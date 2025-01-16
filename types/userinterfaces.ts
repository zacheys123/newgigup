export interface Video {
  title: string;
  source: string;
  description: string;
  gigId: string;
}

export interface Review {
  _id: string;
  rating: number;
  comment: string;
  gigId: string; // assuming Gig ID is a string
  updatedAt: Date;
  createdAt: Date;
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
  followers: string[]; // Array of User IDs
  followings: string[]; // Array of User IDs
  videos: Video[];
  allreviews: Review[];
  myreviews: Review[];
}
export interface Users {
  users: UserProps[]; // Optional}
}

export interface FetchResponse {
  result: UserProps; //
  message?: string;
  status: number;
}
