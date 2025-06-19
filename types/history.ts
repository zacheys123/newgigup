import { Types } from "mongoose";

export interface BookingItem {
  userId: Types.ObjectId;
  gigId: Types.ObjectId; // Reference to Gig
  status: "pending" | "booked" | "completed" | "cancelled";
  date: Date;
  role: "musician" | "client";
  notes?: string;
}

export interface BookingHistoryItem {
  date: string;
  gigId: {
    _id: string;
    postedBy: {
      _id: string;
      username?: string;
      email?: string;
      picture?: string;
    };
    title: string;
    description?: string;
    scheduleDate: string;
    time?: { from: string; to: string };
    location?: string;
    price?: string;
    currency?: string;
    paymentStatus?: string;
    djGenre?: string;
    vocalistGenre?: string[];
    djEquipment?: string;
    cancellationReason?: string;
  };
  notes?: string;
  role: string;
  status: string;
  _id: string;
}
