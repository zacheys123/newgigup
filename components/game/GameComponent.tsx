"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { topics } from "@/data";

export default function GameComponent() {
  const router = useRouter();
  const [selectedTopic, setSelectedTopic] = useState<string>("");

  const handleStartGame = () => {
    if (selectedTopic) {
      router.push(`/game/${encodeURIComponent(selectedTopic)}`);
    }
  };

  const handleViewLeaderboard = () => {
    router.push("/game/leaderboard");
  };

  return (
    <div className="min-h-screen bg-gray-100 p-8 relative overflow-y-auto">
      {" "}
      {/* Added overflow-y-auto */}
      {/* Background video - made fixed so it doesn't scroll */}
      <div className="fixed inset-0 -z-10">
        {" "}
        {/* Changed from absolute to fixed */}
        <video
          autoPlay
          loop
          muted
          className="w-full h-full object-cover opacity-20"
        >
          <source
            src="https://res.cloudinary.com/dsziq73cb/video/upload/v1742517915/kmhnhgji6gvpp0sumr2y.mp4"
            type="video/mp4"
          />
        </video>
      </div>
      {/* Content container with max height */}
      <div className="max-w-4xl mx-auto bg-white/90 backdrop-blur-sm rounded-xl p-8 shadow-xl min-h-[calc(100vh-4rem)]">
        {" "}
        {/* Added min-h */}
        <h1 className="text-4xl font-bold mb-6 text-center text-indigo-700">
          Quiz Challenge
        </h1>
        <p className="text-lg text-center mb-8 text-gray-600">
          Select a topic and test your knowledge!
        </p>
        <div className="mb-8">
          <label
            htmlFor="topic-select"
            className="block text-lg font-medium mb-2"
          >
            Choose a Topic:
          </label>
          <select
            id="topic-select"
            value={selectedTopic}
            onChange={(e) => setSelectedTopic(e.target.value)}
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
          >
            <option value="">-- Select a topic --</option>
            {topics.map((topic) => (
              <option key={topic.name} value={topic.name}>
                {topic.icon} {topic.name} ({topic.questions.length} questions)
              </option>
            ))}
          </select>
        </div>
        <div className="flex justify-center gap-4">
          <button
            onClick={handleStartGame}
            disabled={!selectedTopic}
            className="px-6 py-3 bg-indigo-600 text-white rounded-lg font-semibold hover:bg-indigo-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Start Quiz
          </button>

          <button
            onClick={handleViewLeaderboard}
            className="px-6 py-3 border border-indigo-600 text-indigo-600 rounded-lg font-semibold hover:bg-indigo-50 transition-colors"
          >
            View Leaderboard
          </button>
        </div>
        <div className="mt-12">
          <h2 className="text-2xl font-semibold mb-6">Or browse all topics:</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 overflow-y-auto max-h-[60vh] pb-8 scrollbar-thin scrollbar-thumb-indigo-300 scrollbar-track-gray-100">
            {topics.map((topic) => (
              <button
                key={topic.name}
                onClick={() => setSelectedTopic(topic.name)}
                className={`p-4 rounded-lg border-2 transition-all min-w-[100px] ${
                  selectedTopic === topic.name
                    ? "border-indigo-500 bg-indigo-50"
                    : "border-gray-200 hover:border-indigo-300 hover:bg-gray-50"
                }`}
              >
                <div className="text-2xl mb-2">{topic.icon}</div>
                <h3 className="font-medium">{topic.name}</h3>
                <p className="text-sm text-gray-500">
                  {topic.questions.length} questions
                </p>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
