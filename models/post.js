import mongoose from "mongoose";
import { models, Schema } from "mongoose";

const postSchema = new mongoose.Schema(
  {
    postedBy: { type: Schema.Types.ObjectId, ref: "User" },
    companyName: {
      type: String,
     
    },
    description: {
      type: String,
      lowercase: true,
    },
  rating: { type: Number, default: 0 },

  },
  { timestamps: true }
);
const Post = models.Post || mongoose.model("Post", postSchema);

export default Post;
