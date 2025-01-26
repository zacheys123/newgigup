export interface VideoProps {
  _id: string;
  title: string;
  source: string;
  description?: string;
  gigId: string;
  postedBy?: string | { _id: string; firstname: string; [key: string]: string };

  createdAt?: Date;
}

export interface Review {
  _id: string;
  rating: number;
  comment: string;
  gigId: string; // assuming Gig ID is a string
  postedBy?: string | { _id: string; firstname: string; [key: string]: string };

  postedTo: string;
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
  followers: string[]; // Array of User IDs
  followings: string[]; // Array of User IDs
  allreviews: Review[];
  myreviews: Review[];
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
