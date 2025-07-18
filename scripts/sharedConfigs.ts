// scripts/gameConfigs.ts
import { GameCategory } from "@/types/gamesiinterface";

export interface GameSeedConfig {
  slug: string;
  name: string;
  category: GameCategory;
  description: string;
  metrics: {
    primary: {
      name: string;
      type: "number" | "time" | "percentage" | "streak" | "count";
      description: string;
    };
    secondary?: Array<{
      name: string;
      type: string;
      description?: string;
    }>;
  };
  scoring: {
    basePoints: number;
    timeBonus?: boolean;
    streakMultiplier?: boolean;
    maxScore?: number;
    timePenalty?: boolean;
  };
}

export const ALL_GAME_CONFIGS: Record<GameCategory, GameSeedConfig[]> = {
  word: [
    {
      slug: "lexicon-legends",
      name: "Lexicon Legends",
      category: "word",
      description: "Word scramble challenge game",
      metrics: {
        primary: {
          name: "Words Solved",
          type: "count",
          description: "Total words unscrambled correctly",
        },
        secondary: [
          {
            name: "Longest Streak",
            type: "streak",
            description: "Consecutive correct answers",
          },
        ],
      },
      scoring: {
        basePoints: 10,
        timeBonus: true,
        streakMultiplier: true,
        maxScore: 1000,
      },
    },
  ],
  math: [
    {
      slug: "math-masters",
      name: "Math Masters",
      category: "math",
      description: "Fast-paced arithmetic challenges",
      metrics: {
        primary: {
          name: "Equations Solved",
          type: "count",
          description: "Total correct math problems",
        },
        secondary: [
          {
            name: "Accuracy",
            type: "percentage",
            description: "Correct answer percentage",
          },
        ],
      },
      scoring: {
        basePoints: 8,
        timeBonus: true,
        maxScore: 1500,
      },
    },
  ],
  trivia: [
    {
      slug: "trivia-titan",
      name: "Trivia Titan",
      category: "trivia",
      description: "General knowledge quiz game",
      metrics: {
        primary: {
          name: "Correct Answers",
          type: "count",
          description: "Total trivia questions answered correctly",
        },
      },
      scoring: {
        basePoints: 12,
        streakMultiplier: true,
      },
    },
  ],
  puzzle: [
    {
      slug: "puzzle-quest",
      name: "Puzzle Quest",
      category: "puzzle",
      description: "Logical puzzle solving game",
      metrics: {
        primary: {
          name: "Puzzles Solved",
          type: "count",
          description: "Number of puzzles completed",
        },
        secondary: [
          {
            name: "Hints Used",
            type: "count",
            description: "Total hints used",
          },
        ],
      },
      scoring: {
        basePoints: 15,
        timePenalty: true,
      },
    },
  ],
  strategy: [
    {
      slug: "stratagem",
      name: "Stratagem",
      category: "strategy",
      description: "Strategic decision-making game",
      metrics: {
        primary: {
          name: "Levels Completed",
          type: "count",
          description: "Game levels successfully finished",
        },
      },
      scoring: {
        basePoints: 20,
        maxScore: 2000,
      },
    },
  ],
  playful: [
    {
      slug: "playful-mind",
      name: "Playful Mind",
      category: "playful",
      description: "Casual mini-game collection",
      metrics: {
        primary: {
          name: "Games Played",
          type: "count",
          description: "Total mini-games completed",
        },
      },
      scoring: {
        basePoints: 5,
        timeBonus: true,
      },
    },
  ],
};
