import mongoose, { Schema, Document, Model } from "mongoose";

export interface IAppeal extends Document {
  userId: string; // Reference to the banned user (as string, e.g., User._id)
  clerkId: string; // Clerk user ID (if needed for auth)
  email: string; // User's email (for quick reference)
  banReference: string; // Reference to the ban (e.g., ban ID or reason code)
  message: string; // User's appeal message
  status: "pending" | "reviewed" | "approved" | "rejected";
  reviewerNotes?: string; // Admin comments
  reviewedBy?: string; // Admin who reviewed (e.g., Clerk ID or username)
  reviewedAt?: Date; // When the appeal was reviewed
  createdAt: Date; // Auto-set by timestamps
  updatedAt: Date; // Auto-updated by timestamps
  user: mongoose.Types.ObjectId;
}

const AppealSchema: Schema = new Schema(
  {
    userId: {
      type: String,
      required: true,
      index: true,
    },
    clerkId: {
      type: String,
      required: true,
      index: true,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
    banReference: {
      type: String,
      required: true,
      index: true,
    },
    message: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      enum: ["pending", "reviewed", "approved", "rejected"],
      default: "pending",
      index: true,
    },
    reviewerNotes: {
      type: String,
    },
    reviewedBy: {
      type: String,
    },
    reviewedAt: {
      type: Date,
    },
  },
  {
    timestamps: true,
  }
);

// Compound indexes for common query patterns
AppealSchema.index({ userId: 1, status: 1 }); // Faster user-specific appeal lookups
AppealSchema.index({ createdAt: -1 }); // Sort by newest appeals first

const Appeal: Model<IAppeal> =
  mongoose.models.Appeal || mongoose.model<IAppeal>("Appeal", AppealSchema);

export default Appeal;
