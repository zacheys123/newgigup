import mongoose from "mongoose";
import { Schema } from "mongoose";
import { models } from "mongoose";

const VideoSchema = new mongoose.Schema(
  {
    postedBy: {
      type: String,
      required: true,
    },
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
    },
    isPublic: {
      type: Boolean,
      default: true,
      required: true,
    },
    isPrivate: {
      type: Boolean,
      default: false,
      required: false,
    },
    thumbnail: {
      type: String,
      lowercase: true,
    },
    likes: [{ type: Schema.Types.ObjectId, ref: "User" }],
  },
  { timestamps: true }
);
const Video = models.Video || mongoose.model("Video", VideoSchema);

export default Video;
