import mongoose from "mongoose";
import { models, Schema } from "mongoose";

const reviewSchema = new mongoose.Schema(
  {
    allreviews: [
      {
        userid: { type: Schema.Types.ObjectId, ref: "User" }, // Add User model reference here

        rating: { type: Number },
        comment: { type: String },
        gigId: { type: Schema.Types.ObjectId, ref: "Gig" }, // Add User model reference here
        updatedAt: {
          type: Date,
          default: Date.now,
        },
        createdAt: {
          type: Date,
          default: Date.now,
        },
      },
    ],
    myreviews: [
      {
        userid: { type: Schema.Types.ObjectId, ref: "User" }, // Add User model reference here

        rating: { type: Number },
        comment: { type: String },
        gigId: { type: Schema.Types.ObjectId, ref: "Gig" }, // Add User model reference here
        updatedAt: {
          type: Date,
          default: Date.now,
        },
        createdAt: {
          type: Date,
          default: Date.now,
        },
      },
    ],
  },
  { timestamps: true }
);
const Review = models?.Review || mongoose.model("Review", reviewSchema);

export default Review;
