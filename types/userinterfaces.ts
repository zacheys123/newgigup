export interface Video {
  title: string;
  source: string;
}

export interface Review {
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
