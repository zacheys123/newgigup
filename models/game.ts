// models/Game.ts
import {
  GameCategory,
  GameMetric,
  ScoringRules,
} from "@/types/gamesiinterface";
import { Document, Schema, model } from "mongoose";

interface IGame extends Document {
  name: string;
  slug: string;
  category: GameCategory;
  description: string;
  metrics: {
    primary: GameMetric;
    secondary: GameMetric[];
  };
  scoring: ScoringRules;
  minPlayers?: number;
  maxPlayers?: number;
  createdAt: Date;
  updatedAt: Date;
}

const GameSchema = new Schema<IGame>(
  {
    name: { type: String, required: true },
    slug: { type: String, unique: true, required: true },
    category: {
      type: String,
      enum: ["word", "math", "trivia", "puzzle", "strategy", "playful"],
      required: true,
    },
    description: { type: String, required: true },
    metrics: {
      primary: {
        name: { type: String, required: true },
        type: {
          type: String,
          enum: ["number", "time", "percentage", "streak", "count"],
          required: true,
        },
        description: String,
      },
      secondary: [
        {
          name: String,
          type: String,
          description: String,
        },
      ],
    },
    scoring: {
      basePoints: { type: Number, required: true },
      timeBonus: { type: Boolean, default: false },
      streakMultiplier: { type: Boolean, default: false },
      maxScore: Number,
      timePenalty: Boolean,
    },
    minPlayers: Number,
    maxPlayers: Number,
  },
  { timestamps: true }
);

export const Game = model<IGame>("Game", GameSchema);
