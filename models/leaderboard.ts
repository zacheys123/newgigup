// /models/leaderboard.ts
import mongoose from "mongoose";

const leaderboardSchema = new mongoose.Schema({
  topic: { type: String, required: true },
  score: { type: Number, required: true },
  userId: { type: String, required: true },
  username: { type: String },
  date: { type: Date, default: Date.now },
});

const Leaderboard =
  mongoose.models.Leaderboard ||
  mongoose.model("Leaderboard", leaderboardSchema);

export default Leaderboard;
