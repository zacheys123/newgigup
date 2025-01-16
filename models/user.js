import mongoose from "mongoose";
import { models, Schema } from "mongoose";

const userSchema = new mongoose.Schema(
  {
    clerkId: {
      type: String,
      required: true,
      unique: true,
    },
    picture: {
      type: String,
    },

    firstname: {
      type: String,
      lowercase: true,
    },
    lastname: { type: String, lowercase: true },
    email: {
      type: String,
      require: true,
      unique: true,
    },
    city: { type: String, lowercase: true },
    date: { type: String, lowercase: true },
    month: { type: String, lowercase: true },
    year: { type: String, lowercase: true },
    address: { type: String, lowercase: true },

    instrument: { type: String, lowercase: true },
    experience: { type: String, lowercase: true },
    phone: {
      type: { type: String },
    },
    verification: {
      type: { type: String },
    },

    username: {
      type: String,
      require: true,
      unique: true,
      lowercase: true,
    },
    followers: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    followings: [{ type: Schema.Types.ObjectId, ref: "User" }],
    videos: [
      {
        title: {
          type: String,
          lowercase: true,
        },
        source: {
          type: String,
          required: true,
        },
        description: {
          type: String,
          required: true,
        },
        gigId: {
          type: String,
          required: true,
        },
      },
    ],
    allreviews: [
      {
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
const User = models?.User || mongoose.model("User", userSchema);

export default User;
