import mongoose from "mongoose";
import { models, Schema } from "mongoose";

const gigSchema = new mongoose.Schema(
  {
    postedBy: { type: Schema.Types.ObjectId, ref: "User" },
    bookedBy: { type: Schema.Types.ObjectId, ref: "User" },
    title: {
      type: String,
      required: true,
    },
    secret: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      lowercase: true,
    },
    phone: { type: String },
    price: { type: String },
    category: { type: String },
    bandCategory: [],
    bussinesscat: {
      type: String,
      required: true,
    },
    location: { type: String },
    date: { type: Date, default: new Date() },
    time: {
      from: {
        type: String,
      },
      to: {
        type: String,
        required: true,
      },
    },
    isTaken: { type: Boolean, default: false },
    isPending: { type: Boolean, default: false },

    viewCount: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],

    bookCount: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    font: {
      type: String,
      lowerCase: true,
    },
    fontColor: {
      type: String,
      lowerCase: true,
    },
    backgroundColor: {
      type: String,
      lowerCase: true,
    },
    logo: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);
const Gig = models?.Gig || mongoose.model("Gig", gigSchema);

export default Gig;
