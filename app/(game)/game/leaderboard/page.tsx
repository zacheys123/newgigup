"use client";

import { useEffect, useState } from "react";
import { useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";

interface LeaderboardEntry {
  topic: string;
  score: number;
  userId?: string;
  username?: string;
  date?: string;
}

export default function LeaderboardPage() {
  const [entries, setEntries] = useState<LeaderboardEntry[]>([]);
  const [filter, setFilter] = useState<string>("all");
  const [showMineOnly, setShowMineOnly] = useState(false);
  const { user } = useUser();
  const router = useRouter();

  useEffect(() => {
    const fetchLeaderboard = async () => {
      try {
        const params = new URLSearchParams();
        if (filter !== "all") params.append("topic", filter);
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

  const uniqueTopics = Array.from(new Set(entries.map((e) => e.topic)));

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
              Filter by Topic:
            </label>
            <select
              id="filter"
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className="w-full p-2 sm:p-3 text-sm sm:text-base bg-gray-700 border border-gray-600 rounded-md text-gray-200"
            >
              <option value="all" className="text-gray-400">
                All Topics
              </option>
              {uniqueTopics.map((topic) => (
                <option
                  key={topic}
                  value={topic}
                  className="bg-gray-800 text-gray-200"
                >
                  {topic}
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
            {entries.map((entry, index) => (
              <li
                key={`${entry.topic}-${index}`}
                className="py-3 flex items-center justify-between hover:bg-gray-700/50 transition-colors rounded px-2"
              >
                <div className="flex-1 min-w-0">
                  <div className="font-semibold text-white truncate text-sm sm:text-base">
                    {entry.username || "Guest"}
                  </div>
                  <div className="text-xs sm:text-sm text-gray-400 truncate">
                    {entry.topic} •{" "}
                    {entry.date
                      ? new Date(entry.date).toLocaleDateString()
                      : "Unknown date"}
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
