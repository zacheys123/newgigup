import mongoose, { Schema, models, Document, Model } from "mongoose";

// Define TypeScript Interface
interface IUser extends Document {
  clerkId: string;
  picture?: string;
  firstname?: string;
  lastname?: string;
  email: string;
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
  followers: mongoose.Types.ObjectId[];
  followings: mongoose.Types.ObjectId[];
  allreviews: {
    _id: mongoose.Types.ObjectId;
    postedBy: mongoose.Types.ObjectId;
    postedTo: mongoose.Types.ObjectId;
    rating?: number;
    comment?: string;
    gigId?: mongoose.Types.ObjectId;
    updatedAt?: Date;
    createdAt?: Date;
  }[];
  myreviews: {
    _id: mongoose.Types.ObjectId;
    postedBy: mongoose.Types.ObjectId;
    postedTo: mongoose.Types.ObjectId;
    rating?: number;
    comment?: string;
    gigId?: mongoose.Types.ObjectId;
    videoId?: mongoose.Types.ObjectId[];
    updatedAt?: Date;
    createdAt?: Date;
  }[];
  isMusician: boolean;
  isClient: boolean;
  videosProfile: {
    _id: string;
    url: string;
    createdAt?: Date;
  }[];
  organization?: string;
  bio?: string;
  handles?: string;
  genres?: string;
  refferences: mongoose.Types.ObjectId[];
  roleType?: string;
  djGenre?: string;
  djEquipment?: string;
  mcType?: string;
  mcLanguages?: string;
  talentbio?: string;
  vocalistGenre?: string;
  musicianhandles: [{ platform: string; handle: string }];
  gigsBookedThisWeek: { count: number; weekStart: Date };
  musiciangenres: string[];
  tier: "free" | "pro";
  earnings: number;
  totalSpent: number;
  nextBillingDate?: Date;
  monthlyGigsPosted: number;
  monthlyMessages: number;
  monthlyGigsBooked: number;
  firstLogin: boolean;
  isBanned: boolean;
  onboardingComplete: boolean;
  lastActive: Date;
  lastBookingDate?: Date;
  createdAt: Date;
  updatedAt: Date;
  isAdmin: boolean;
  adminRole?: "super" | "content" | "support" | "analytics";
  tierStatus?: "active" | "pending" | "canceled" | "expired";
  adminPermissions?: string[];
  lastAdminAction?: Date;
  adminNotes?: string;
  banReason: string;
  bannedAt: Date;
  banExpiresAt: Date; // New field for temporary bans
  banReference: string; // New fiel
}

// Define Mongoose Schema
const userSchema = new Schema<IUser>(
  {
    isAdmin: { type: Boolean, default: false },
    adminRole: {
      type: String,
      enum: ["super", "content", "support", "analytics"],
      default: undefined,
    },
    adminPermissions: { type: [String], default: [] },
    lastAdminAction: Date,
    adminNotes: String,
    clerkId: { type: String, required: true, unique: true },
    picture: String,
    firstname: { type: String, lowercase: true },
    lastname: { type: String, lowercase: true },
    email: { type: String, required: true, unique: true },
    city: { type: String, lowercase: true },
    date: { type: String, lowercase: true },
    month: { type: String, lowercase: true },
    year: { type: String, lowercase: true },
    address: { type: String, lowercase: true },
    instrument: { type: String, lowercase: true },
    experience: { type: String, lowercase: true },
    phone: String,
    verification: String,
    username: { type: String, required: true, unique: true, lowercase: true },
    followers: [{ type: Schema.Types.ObjectId, ref: "User" }],
    followings: [{ type: Schema.Types.ObjectId, ref: "User" }],
    allreviews: [
      {
        _id: { type: mongoose.Schema.Types.ObjectId, auto: true },
        postedBy: { type: Schema.Types.ObjectId, ref: "User" },
        postedTo: { type: Schema.Types.ObjectId, ref: "User" },
        rating: Number,
        comment: String,
        gigId: { type: Schema.Types.ObjectId, ref: "Gig" },
        updatedAt: { type: Date, default: Date.now },
        createdAt: { type: Date, default: Date.now },
      },
    ],
    myreviews: [
      {
        _id: { type: mongoose.Schema.Types.ObjectId, auto: true },
        postedBy: { type: Schema.Types.ObjectId, ref: "User" },
        postedTo: { type: Schema.Types.ObjectId, ref: "User" },
        rating: Number,
        comment: String,
        gigId: { type: Schema.Types.ObjectId, ref: "Gig" },
        videoId: [{ type: Schema.Types.ObjectId, ref: "Video" }],
        updatedAt: { type: Date, default: Date.now },
        createdAt: { type: Date, default: Date.now },
      },
    ],
    isMusician: { type: Boolean, default: false },
    isClient: { type: Boolean, default: false },
    videosProfile: [
      {
        _id: { type: mongoose.Schema.Types.ObjectId, auto: true }, // Ensure _id is generated

        url: { type: String },
        createdAt: { type: Date, default: Date.now },
      },
    ],
    organization: { type: String, lowercase: true },
    bio: { type: String, lowercase: true },
    handles: { type: String, lowercase: true },
    genres: { type: String, lowercase: true },
    refferences: [{ type: Schema.Types.ObjectId, ref: "User", default: [] }],
    roleType: String,
    djGenre: String,
    djEquipment: String,
    mcType: String,
    mcLanguages: String,
    talentbio: { type: String, lowercase: true },
    vocalistGenre: String,

    musicianhandles: [
      {
        platform: { type: String, lowercase: true },
        handle: { type: String, lowercase: true },
      },
    ],
    musiciangenres: { type: [String], default: [] },

    nextBillingDate: Date,
    monthlyGigsPosted: Number,
    monthlyMessages: Number,
    monthlyGigsBooked: Number,
    totalSpent: Number,
    earnings: Number,
    firstLogin: { type: Boolean, default: true },
    onboardingComplete: { type: Boolean, default: false },
    lastActive: {
      type: Date,
      default: new Date(),
    },
    tier: { type: String, enum: ["free", "pro"], default: "free" },
    gigsBookedThisWeek: {
      count: { type: Number, default: 0 },
      weekStart: { type: Date, default: null },
    },
    lastBookingDate: Date,
    isBanned: { type: Boolean, default: false },
    banReason: { type: String, lowercase: true },
    bannedAt: { type: Date, default: new Date() },
    banExpiresAt: { type: Date }, // New field for temporary bans
    banReference: { type: String }, // New fiel
    tierStatus: {
      type: String,
      enum: ["active", "pending", "canceled"],
      default: undefined,
    },
  },

  { timestamps: true }
);

// Define Mongoose Model
const User: Model<IUser> =
  models.User || mongoose.model<IUser>("User", userSchema);

export default User;
export type { IUser };
