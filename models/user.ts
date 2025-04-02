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
    postedBy: mongoose.Types.ObjectId;
    postedTo: mongoose.Types.ObjectId;
    rating?: number;
    comment?: string;
    gigId?: mongoose.Types.ObjectId;
    updatedAt?: Date;
    createdAt?: Date;
  }[];
  myreviews: {
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
  musiciangenres: string[];
  tier: "free" | "pro";
  earnings: number;
  nextBillingDate?: Date;
  monthlyGigsPosted: number;
  monthlyMessages: number;
  monthlyGigsBooked: number;
  firstLogin: boolean;
  onboardingComplete: boolean;
}

// Define Mongoose Schema
const userSchema = new Schema<IUser>(
  {
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
    tier: { type: String, enum: ["free", "pro"], default: "free" },

    nextBillingDate: Date,
    monthlyGigsPosted: Number,
    monthlyMessages: Number,
    monthlyGigsBooked: Number,
    earnings: Number,
    firstLogin: { type: Boolean, default: true },
    onboardingComplete: { type: Boolean, default: false },
  },
  { timestamps: true }
);

// Define Mongoose Model
const User: Model<IUser> =
  models.User || mongoose.model<IUser>("User", userSchema);

export default User;
export type { IUser };
