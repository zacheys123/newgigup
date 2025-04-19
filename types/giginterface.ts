import { UserProps } from "./userinterfaces";

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
  bussinesscat?: string;
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
}

export interface Gigs {
  gigs: GigProps[]; // Optional}
}
export interface FetchResponse {
  gigstatus: boolean;
  message?: string;
}
