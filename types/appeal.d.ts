// types/appeal.d.ts
export interface AppealSubmission {
  userId: string;
  clerkId: string;
  email: string;
  banReference: string;
  message: string;
}

export interface AppealResponse {
  success: boolean;
  appeal?: IAppeal;
  error?: string;
}

// types/appeal.ts
export interface AppealTableItem {
  _id: string;
  user: {
    _id: string;
    username: string;
    email: string;
  };
  message: string;
  status: "pending" | "reviewed" | "approved" | "rejected";
  createdAt: string;
  updatedAt: string;
}

export type AppealStatus = AppealTableItem["status"];
// types/admininterfaces.ts

export interface BannedUser {
  _id: string;
  clerkId: string;
  username: string;
  email: string;
  isBanned: boolean;
  banReason: string;
  banReference: string;
  bannedAt: Date | string;
  banExpiresAt?: Date | string | null;
  // User profile fields
  firstname?: string;
  lastname?: string;
  phone?: string;
  city?: string;
  // Account status fields
  isMusician?: boolean;
  isClient?: boolean;
  // Additional admin fields
  lastActive?: Date | string;
  createdAt?: Date | string;
  updatedAt?: Date | string;
  // Appeal information (if you want to include it directly)
  appeals?: {
    _id: string;
    status: "pending" | "reviewed" | "approved" | "rejected";
    createdAt: Date | string;
  }[];
}

// For the admin table view with minimal fields
// types/appeal.d.ts
export interface AppealItem {
  _id: string;
  status: "pending" | "reviewed" | "approved" | "rejected";
  message?: string; // From AppealSubmission
  reviewerNotes?: string; // From IAppeal
  createdAt: Date | string;
  reviewedAt?: Date | string;
}

export interface BannedUserTableItem {
  _id: string;
  clerkId: string;
  username: string;
  email: string;
  banReason: string;
  banReference: string;
  bannedAt: Date | string;
  isBanned: boolean;
  banExpiresAt?: Date | string | null;
  appeals?: AppealItem[]; // <-- Now properly typed
}

// For the detailed banned user view
export interface BannedUserDetails extends BannedUser {
  // Additional detailed fields
  instrument?: string;
  experience?: string;
  organization?: string;
  bio?: string;
  // Social/activity fields
  followersCount?: number;
  followingCount?: number;
  gigsPosted?: number;
  // Previous bans
  previousBans?: {
    reason: string;
    bannedAt: Date | string;
    unbannedAt: Date | string;
  }[];
}
