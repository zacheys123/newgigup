// models/Leaderboard.ts
import { GameCategory, GameSpecificFields } from "@/types/gamesiinterface";
import { Document, Schema, model } from "mongoose";

interface ILeaderboardBase extends Document {
  gameId: Schema.Types.ObjectId;
  userId: Schema.Types.ObjectId;
  username: string;
  avatar?: string;
  score: number;
  rank?: number;
  timeTaken?: number;
  accuracy?: number;
  levelReached?: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface ILeaderboard extends ILeaderboardBase {
  gameSpecific: GameSpecificFields;
  category: GameCategory;
}

// Create the schema first
const LeaderboardSchema = new Schema<ILeaderboard>(
  {
    gameId: {
      type: Schema.Types.ObjectId,
      ref: "Game",
      required: true,
    },
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    username: {
      type: String,
      required: true,
    },
    avatar: String,
    score: {
      type: Number,
      required: true,
    },
    rank: Number,
    timeTaken: Number,
    accuracy: Number,
    levelReached: Number,
    gameSpecific: {
      type: Schema.Types.Mixed,
      required: true,
    },
    category: {
      type: String,
      enum: ["word", "math", "trivia", "puzzle", "strategy", "playful"],
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

// Add indexes separately
LeaderboardSchema.index({ gameId: 1, score: -1 });
LeaderboardSchema.index({ gameId: 1, userId: 1 });
LeaderboardSchema.index({ category: 1, score: -1 });
LeaderboardSchema.index({ score: -1 }); // Single field index

export const Leaderboard = model<ILeaderboard>(
  "Leaderboard",
  LeaderboardSchema
);
