import { BusinessCategory } from "@/components/gig/create/types";
import { UserProps } from "./userinterfaces";
import { BookingItem } from "./history";
import { Types } from "mongoose";
export interface TimeProps {
  from?: string;
  to?: string;
}

export interface GigProps {
  _id?: string;
  postedBy: UserProps;
  bookedBy?: UserProps;
  title?: string;
  secret: string; // Required and unique
  description?: string;
  phone?: string;
  price?: string;
  category?: string;
  bandCategory?: string[];
  bussinesscat?: BusinessCategory;
  location?: string;
  date?: Date;
  time?: TimeProps;
  isTaken?: boolean;
  isPending?: boolean;
  viewCount?: string[];
  username: string; // Required, unique, and lowercase
  updatedAt: Date;
  createdAt: Date;
  bookCount: UserProps[];
  font: string;
  fontColor: string;
  backgroundColor: string;
  logo: string;
  otherTimeline: string;
  gigtimeline: string;
  day: string;
  mcType: string;
  mcLanguages: string;
  djGenre: string;
  djEquipment: string;
  vocalistGenre: string[];
  pricerange: string;
  currency: string;
  scheduleDate: Date;
  bookingHistory: BookingItem[];
  paymentStatus: string;
  completedAt: Date;
  musicianConfirmPayment: {
    gigId: Types.ObjectId | string;
    confirmPayment: boolean;
    confirmedAt: Date;
    code: string;
    temporaryConfirm: boolean;
  };
  clientConfirmPayment: {
    gigId: Types.ObjectId | string;
    confirmPayment: boolean;
    confirmedAt: Date;
    code: string;
    temporaryConfirm: boolean;
  };
}

export interface Gigs {
  gigs: GigProps[]; // Optional}
}
export interface FetchResponse {
  gigstatus: boolean;
  message?: string;
}
export type GigFilter = {
  $or?: Array<{
    title?: { $regex: string; $options: string };
    description?: { $regex: string; $options: string };

    // Add any other text-searchable fields
  }>;
  price?: string;
  category?: string;
  gigTimeline?: string;
  location?: string;
  // Add any other fields you might filter on
  // For array fields:
  bandCategory?: { $in: string[] };
  bookedBy: Types.ObjectId;
  isTaken: boolean;
};
