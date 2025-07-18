"use client";

import { useEffect, useState } from "react";
import { useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";

import Image from "next/image";
import {
  GameCategory,
  MathGameFields,
  PlayfulGameFields,
  TriviaGameFields,
  WordGameFields,
} from "@/types/gamesiinterface";

type GameSpecificData =
  | { category: "word"; fields: WordGameFields }
  | { category: "math"; fields: MathGameFields }
  | { category: "trivia"; fields: TriviaGameFields }
  | { category: "playful"; fields: PlayfulGameFields }
  | { category: "puzzle" | "strategy"; fields: Record<string, unknown> };

interface LeaderboardEntry {
  _id: string;
  gameId: string;
  gameName: string;
  userId: string;
  username: string;
  avatar?: string;
  score: number;
  rank?: number;
  category: GameCategory;
  timeTaken?: number;
  accuracy?: number;
  levelReached?: number;
  gameSpecific: GameSpecificData["fields"];
  createdAt: string;
}

export default function LeaderboardPage() {
  const [entries, setEntries] = useState<LeaderboardEntry[]>([]);
  const [filter, setFilter] = useState<GameCategory | "all">("all");
  const [showMineOnly, setShowMineOnly] = useState(false);
  const { user } = useUser();
  const router = useRouter();

  useEffect(() => {
    const fetchLeaderboard = async () => {
      try {
        const params = new URLSearchParams();
        if (filter !== "all") params.append("category", filter);
        if (showMineOnly && user?.id) params.append("userId", user.id);

        const res = await fetch(`/api/leaderboard?${params.toString()}`);
        const data = await res.json();
        setEntries(data);
      } catch (err) {
        console.error("Failed to fetch leaderboard:", err);
      }
    };

    fetchLeaderboard();
  }, [filter, showMineOnly, user]);

  const gameCategories: GameCategory[] = [
    "word",
    "math",
    "trivia",
    "puzzle",
    "strategy",
    "playful",
  ];

  const getGameSpecificField = (entry: LeaderboardEntry) => {
    switch (entry.category) {
      case "word":
        const wordFields = entry.gameSpecific as WordGameFields;
        return `Words: ${wordFields.wordsSolved || 0} | Streak: ${
          wordFields.longestStreak || 0
        }`;
      case "math":
        const mathFields = entry.gameSpecific as MathGameFields;
        return `Accuracy: ${mathFields.correctPercentage || 0}% | Solved: ${
          mathFields.equationsSolved || 0
        }`;
      case "trivia":
        const triviaFields = entry.gameSpecific as TriviaGameFields;
        return `Correct: ${triviaFields.correctAnswers || 0} | Fastest: ${
          triviaFields.fastestAnswer || 0
        }s`;
      case "playful":
        const playfulFields = entry.gameSpecific as PlayfulGameFields;
        return `Items: ${playfulFields.itemsCollected || 0} | Time: ${
          playfulFields.timeSurvived || 0
        }s`;
      default:
        return `Score: ${entry.score}`;
    }
  };

  const getCategoryDisplayName = (category: GameCategory) => {
    const names: Record<GameCategory, string> = {
      word: "Lexicon Legends",
      math: "Math Sprint",
      trivia: "Trivia Showdown",
      puzzle: "Emoji Enigma",
      strategy: "Chess Royale",
      playful: "Hungry Bear",
    };
    return names[category];
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-gray-800 p-4 sm:p-6 font-sans">
      <div className="max-w-3xl mx-auto bg-gray-800/70 backdrop-blur-sm rounded-xl shadow-xl p-4 sm:p-6 border border-gray-700/50">
        <div className="mb-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <h1 className="text-xl sm:text-2xl font-bold text-white">
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-indigo-400">
              🏆 Leaderboard
            </span>
          </h1>
          <button
            onClick={() => router.push("/game")}
            className="px-4 py-2 text-sm sm:text-base bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-lg hover:from-purple-700 hover:to-indigo-700 transition-all"
          >
            Back to Game
          </button>
        </div>

        <div className="mb-6 space-y-3 sm:space-y-0 sm:flex sm:gap-4">
          <div className="flex-1">
            <label
              htmlFor="filter"
              className="block text-sm sm:text-base font-medium mb-1 text-gray-300"
            >
              Filter by Game:
            </label>
            <select
              id="filter"
              value={filter}
              onChange={(e) =>
                setFilter(e.target.value as GameCategory | "all")
              }
              className="w-full p-2 sm:p-3 text-sm sm:text-base bg-gray-700 border border-gray-600 rounded-md text-gray-200"
            >
              <option value="all" className="text-gray-400">
                All Games
              </option>
              {gameCategories.map((category) => (
                <option
                  key={category}
                  value={category}
                  className="bg-gray-800 text-gray-200"
                >
                  {getCategoryDisplayName(category)}
                </option>
              ))}
            </select>
          </div>

          {user && (
            <label className="flex items-center gap-2 text-sm sm:text-base text-gray-300 mt-2 sm:mt-7">
              <input
                type="checkbox"
                checked={showMineOnly}
                onChange={() => setShowMineOnly(!showMineOnly)}
                className="rounded bg-gray-700 border-gray-600 text-purple-500 focus:ring-purple-500"
              />
              Show only my scores
            </label>
          )}
        </div>

        {entries.length === 0 ? (
          <p className="text-gray-400 text-center mt-6 text-sm sm:text-base">
            No scores recorded yet.
          </p>
        ) : (
          <ul className="divide-y divide-gray-700 mt-4">
            {entries.map((entry) => (
              <li
                key={entry._id}
                className="py-3 flex items-center justify-between hover:bg-gray-700/50 transition-colors rounded px-2"
              >
                <div className="flex items-center gap-3">
                  <div className="text-gray-400 font-bold w-6 text-right">
                    {entry.rank || "?"}
                  </div>
                  {entry.avatar ? (
                    <Image
                      src={entry.avatar}
                      alt={entry.username}
                      className="w-8 h-8 rounded-full"
                      height={8}
                      width={8}
                    />
                  ) : (
                    <div className="w-8 h-8 rounded-full bg-gray-700 flex items-center justify-center">
                      <span className="text-xs">
                        {entry.username.charAt(0).toUpperCase()}
                      </span>
                    </div>
                  )}
                  <div className="min-w-0">
                    <div className="font-semibold text-white truncate text-sm sm:text-base">
                      {entry.username}
                    </div>
                    <div className="text-xs sm:text-sm text-gray-400 truncate">
                      {entry.gameName || getCategoryDisplayName(entry.category)}{" "}
                      • {getGameSpecificField(entry)}
                    </div>
                  </div>
                </div>
                <div className="ml-4 text-purple-400 font-bold text-sm sm:text-base">
                  {entry.score}
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
