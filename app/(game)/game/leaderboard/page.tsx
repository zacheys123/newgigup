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
    <div className="min-h-screen bg-gray-50 p-6 font-sans">
      <div className="max-w-3xl mx-auto bg-white rounded-xl shadow-xl p-6">
        <div className="mb-6 flex justify-between items-center">
          <h1 className="text-xl font-bold text-gray-800">🏆 Leaderboard</h1>
          <button
            onClick={() => router.push("/game")}
            className="px-4 py-2 text-sm bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
          >
            Back to Game
          </button>
        </div>

        <div className="mb-4 space-y-3">
          <div>
            <label htmlFor="filter" className="block text-sm font-medium mb-1">
              Filter by Topic:
            </label>
            <select
              id="filter"
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className="w-full md:w-64 p-2 border border-gray-300 rounded-md"
            >
              <option value="all">All Topics</option>
              {uniqueTopics.map((topic) => (
                <option key={topic} value={topic}>
                  {topic}
                </option>
              ))}
            </select>
          </div>

          {user && (
            <label className="flex items-center gap-2 text-sm">
              <input
                type="checkbox"
                checked={showMineOnly}
                onChange={() => setShowMineOnly(!showMineOnly)}
              />
              Show only my scores
            </label>
          )}
        </div>

        {entries.length === 0 ? (
          <p className="text-gray-500 text-center mt-6">
            No scores recorded yet.
          </p>
        ) : (
          <ul className="divide-y divide-gray-200 mt-4">
            {entries.map((entry, index) => (
              <li
                key={`${entry.topic}-${index}`}
                className="py-3 flex items-center justify-between"
              >
                <div>
                  <div className="font-semibold text-gray-700">
                    {entry.username || "Guest"}
                  </div>
                  <div className="text-sm text-gray-500">
                    {entry.topic} •{" "}
                    {new Date(entry.date || "").toLocaleDateString()}
                  </div>
                </div>
                <div className="text-indigo-600 font-bold">{entry.score}</div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
