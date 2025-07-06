import mongoose, { Schema, Document, Model } from "mongoose";

// 1. Define the TypeScript interface
export interface IPendingPayment extends Document {
  clerkId: string;
  checkoutRequestId: string;
  amount: string;
  status: "pending" | "success" | "failed" | "error";
  tier: string;
  phoneNumber?: string;
  createdAt?: Date;
  updatedAt?: Date;
  username: string;
  isRenewal: boolean;
}

// 2. Define the Mongoose Schema
const pendingPaymentSchema = new Schema<IPendingPayment>(
  {
    clerkId: { type: String, required: true },
    checkoutRequestId: { type: String, required: true, unique: true },
    amount: { type: String, required: true },
    status: { type: String, default: "pending" }, // pending, success, failed
    tier: { type: String, required: true },
    phoneNumber: { type: String }, // correct default type to String
    username: { type: String, required: true }, // pending, success, failed
    isRenewal: { type: Boolean, default: false },
  },
  { timestamps: true }
);

// 3. Create the model
export const PendingPayment: Model<IPendingPayment> =
  mongoose.models.PendingPayment ||
  mongoose.model<IPendingPayment>("PendingPayment", pendingPaymentSchema);
