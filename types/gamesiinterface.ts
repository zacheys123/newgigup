import { ILeaderboard } from "@/models/leaderboard";

// types.ts
export interface Question {
  question: string;
  correctAnswer: string;
  otherGuesses: string[];
  timeLimit?: number; // in seconds
}

export interface Topic {
  name: string;
  description?: string;
  icon?: string;
  questions: Question[];
}

// types/game.types.ts
export type GameCategory =
  | "word"
  | "math"
  | "trivia"
  | "puzzle"
  | "strategy"
  | "playful";

export type MetricType = "number" | "time" | "percentage" | "streak" | "count";

export interface GameMetric {
  name: string;
  type: MetricType;
  description?: string;
}

export interface ScoringRules {
  basePoints: number;
  timeBonus: boolean;
  streakMultiplier?: boolean;
  maxScore?: number;
  timePenalty?: boolean;
}

// types/response.types.ts

export type LeaderboardResponse = Pick<
  ILeaderboard,
  "userId" | "username" | "avatar" | "score" | "rank" | "gameSpecific"
> & {
  _id: string;
  timeAgo: string;
};

export type GameLeaderboardResponse = {
  gameId: string;
  gameName: string;
  primaryMetric: string;
  entries: LeaderboardResponse[];
  userRank?: LeaderboardResponse;
};

export type UserStatsResponse = {
  [gameId: string]: {
    highScore: number;
    rank: number;
    lastPlayed: Date;
    stats: Record<string, unknown>;
  };
};
// types/game-specific.types.ts
export interface WordGameFields {
  wordsSolved: number;
  longestStreak: number;
  hintsUsed: number;
  bonusPoints: number;
  difficultyLevel: "basic" | "intermediate" | "advanced";
}

export interface MathGameFields {
  equationsSolved: number;
  correctPercentage: number;
  operations: {
    addition: number;
    subtraction: number;
    multiplication: number;
    division: number;
  };
  powerUpsUsed: number;
}

export interface TriviaGameFields {
  categories: Record<string, number>;
  correctAnswers: number;
  fastestAnswer: number;
  consecutiveCorrect: number;
}

export interface PlayfulGameFields {
  itemsCollected: number;
  distanceAchieved: number;
  timeSurvived: number;
}

export type GameSpecificFields =
  | WordGameFields
  | MathGameFields
  | TriviaGameFields
  | PlayfulGameFields
  | Record<string, unknown>;
