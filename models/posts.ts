import mongoose from "mongoose";
import { models, Schema } from "mongoose";

const postSchema = new mongoose.Schema({
  postedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  companyName: { type: String, },
  rating: { type: Number, min: 1, max: 5, required: true },
  description: { type: String, required: true },
}, { timestamps: true });
const Posts = models.Post || mongoose.model("Post", postSchema);

export default Posts;
