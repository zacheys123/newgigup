import { VideoProps } from "@/types/userinterfaces";
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
  theme: "lightMode" | "darkMode" | "system";
  savedGigs: mongoose.Types.ObjectId[];
  favoriteGigs: mongoose.Types.ObjectId[];
  cancelgigCount: number;
  bookingHistory: [
    {
      userId: mongoose.Types.ObjectId[];
      gigId: mongoose.Types.ObjectId[];
      status: string; // 'booked', 'completed', 'cancelled'
      date: Date;
      role: string; // 'musician' or 'client'
      notes: string; // Optional (e.g., cancellation reason)
    }
  ];
  rate: {
    regular: string;
    function: string;
    concert: string;
    corporate: string;
  };
  completedGigsCount: number;
  reportsCount: number;
  firstTimeInProfile: boolean;
  likedVideos: VideoProps[];
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
    theme: { type: String, default: "lightMode" },
    savedGigs: [{ type: Schema.Types.ObjectId, ref: "Gig", default: [] }],
    favoriteGigs: [{ type: Schema.Types.ObjectId, ref: "Gig", default: [] }],
    bookingHistory: [
      {
        gigId: { type: mongoose.Schema.Types.ObjectId, ref: "Gig" },
        status: {
          type: String,
          enum: ["pending", "booked", "completed", "cancelled"],
          default: "pending",
        }, // 'booked', 'completed', 'cancelled'
        date: Date,
        role: String, // 'musician' or 'client'
        notes: String, // Optional (e.g., cancellation reason)
      },
    ],
    cancelgigCount: {
      type: Number,
      default: 0,
    },
    completedGigsCount: {
      type: Number,
      default: 0,
    },

    reportsCount: {
      type: Number,
      default: 0,
    },

    rate: {
      regular: String,
      function: String,
      concert: String,
      corporate: String,
    },
    firstTimeInProfile: Boolean,
    likedVideos: [{ type: Schema.Types.ObjectId, ref: "Video" }],
  },

  { timestamps: true }
);

// ========== INDEXES ========== //

// 📌 Search Index
userSchema.index(
  {
    firstname: "text",
    lastname: "text",
    username: "text",
    email: "text",
    city: "text",
    instrument: "text",
  },
  {
    weights: {
      username: 5,
      email: 3,
      firstname: 2,
      lastname: 2,
      city: 1,
      instrument: 1,
    },
    name: "user_search_index",
  }
);

// 📌 Tier & Billing
userSchema.index({ tier: 1 });
userSchema.index({ tierStatus: 1 });
userSchema.index({ tier: 1, tierStatus: 1 });
userSchema.index({ nextBillingDate: 1 });

// 📌 Performance & Filtering
userSchema.index({ isAdmin: 1 });
userSchema.index({ isClient: 1 });
userSchema.index({ isMusician: 1 });

userSchema.index({ lastActive: -1 });
userSchema.index({ createdAt: -1 });
userSchema.index({ updatedAt: -1 });
userSchema.index({ isBanned: 1 });
userSchema.index({ isBanned: 1, banExpiresAt: 1 });
userSchema.index({ isMusician: 1, city: 1 }); // Example compound index

// 📌 Admin Operations
userSchema.index({ isAdmin: 1, adminRole: 1 });
userSchema.index({ reportsCount: 1 });
// 📌 Reviews & Relations
userSchema.index({ "allreviews.postedBy": 1 });
userSchema.index({ "allreviews.postedTo": 1 });
userSchema.index({ rate: 1 });

userSchema.index({ followers: 1 });
userSchema.index({ followings: 1 });

// ========== INDEX CREATION STRATEGY ========== //

// Mongoose will automatically create indexes unless disabled.
// You can enforce creation during startup like this:
if (process.env.NODE_ENV === "production") {
  userSchema.set("autoIndex", false); // Performance boost in prod

  mongoose
    .model<IUser>("User", userSchema)
    .syncIndexes()
    .then(() => console.log("✅ User indexes synced"))
    .catch((err) => console.error("❌ Index sync failed:", err));
}

// Final export
const User: Model<IUser> =
  models.User || mongoose.model<IUser>("User", userSchema);

export default User;
export type { IUser };
