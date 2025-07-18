"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, RefreshCw } from "lucide-react";
import { useAuth } from "@clerk/nextjs";
import { Topic } from "@/types/gamesiinterface";

export default function GameComponent() {
  const router = useRouter();
  const [selectedTopic, setSelectedTopic] = useState<string>("");
  const { userId } = useAuth();
  const [topics, setTopics] = useState<Topic[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fallbackTopics: Topic[] = [
    {
      name: "Geography",
      description: "Test your knowledge of world geography",
      icon: "🌍",
      questions: [],
    },
    {
      name: "History",
      description: "Journey through historical events",
      icon: "🏛️",
      questions: [],
    },
    {
      name: "Science",
      description: "Explore the wonders of science",
      icon: "🔬",
      questions: [],
    },
    {
      name: "Movies",
      description: "Test your film knowledge",
      icon: "🎬",
      questions: [],
    },
    {
      name: "Music",
      description: "How well do you know music?",
      icon: "🎵",
      questions: [],
    },
    {
      name: "Sports",
      description: "Challenge your sports knowledge",
      icon: "⚽",
      questions: [],
    },
    {
      name: "Literature",
      description: "Dive into books and authors",
      icon: "📚",
      questions: [],
    },
    {
      name: "Technology",
      description: "Test your tech-savviness",
      icon: "💻",
      questions: [],
    },
    {
      name: "Food & Drink",
      description: "Test your culinary knowledge",
      icon: "🍴",
      questions: [],
    },
    {
      name: "Animals",
      description: "Test your knowledge of the animal kingdom",
      icon: "🐾",
      questions: [],
    },
    {
      name: "Art",
      description: "Test your knowledge of art history",
      icon: "🎨",
      questions: [],
    },
  ];
  const [refreshCounter, setRefreshCounter] = useState(0);

  const forceRefresh = () => {
    setRefreshCounter((prev) => prev + 1);
  };
  useEffect(() => {
    const controller = new AbortController();

    const fetchTopics = async () => {
      setIsLoading(true);
      try {
        const res = await fetch(`/api/topics?nocache=${Date.now()}`, {
          method: "GET",
          cache: "no-store",
          headers: {
            "Cache-Control": "no-cache",
          },
        });
        const data = await res.json();

        // More robust empty check
        if (
          !data ||
          (Array.isArray(data) && data.length === 0) ||
          (data.topics && data.topics.length === 0)
        ) {
          console.log("Using fallback topics");
          setTopics(fallbackTopics);
        } else {
          console.log("Using main topics");
          // Handle both array responses and object responses
          const topicsData = Array.isArray(data) ? data : data.topics || [];
          setTopics(topicsData.length ? topicsData : fallbackTopics);
        }
      } catch (err) {
        console.error("Failed to load topics", err);
        setTopics(fallbackTopics);
      } finally {
        setIsLoading(false);
      }
    };

    fetchTopics();
    return () => controller.abort();
  }, [refreshCounter]);

  const handleStartGame = () => {
    if (selectedTopic) {
      router.push(`/game/${encodeURIComponent(selectedTopic)}`);
    }
  };

  const handleViewLeaderboard = () => {
    router.push("/game/leaderboard");
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 via-purple-900 to-gray-800">
        <div className="text-white">Loading topics...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-gray-800 p-4 sm:p-6 md:p-8 relative overflow-y-auto">
      {" "}
      {/* Gradient overlay for video */}
      <div className="fixed inset-0 -z-10 bg-gradient-to-br from-gray-900/80 via-purple-900/50 to-gray-800/80">
        <video
          autoPlay
          loop
          muted
          className="w-full h-full object-cover opacity-30"
        >
          <source
            src="https://res.cloudinary.com/dsziq73cb/video/upload/v1742517915/kmhnhgji6gvpp0sumr2y.mp4"
            type="video/mp4"
          />
        </video>
      </div>
      {/* Main content container */}
      <div className="max-w-4xl mx-auto bg-gray-800/70 backdrop-blur-lg rounded-xl p-4 sm:p-6 md:p-8 shadow-2xl border border-gray-700/50 min-h-[calc(100vh-2rem)] sm:min-h-[calc(100vh-3rem)] md:min-h-[calc(100vh-4rem)]">
        {/* Header */}
        <div className="text-center mb-6 sm:mb-8 md:mb-10">
          <div className="flex items-center gap-[70px]">
            <ArrowLeft
              onClick={() => router.push("/av_gigs/" + userId)}
              className="text-gray-200"
              size={27}
            />
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-2 sm:mb-3 bg-clip-text text-transparent bg-gradient-to-r from-purple-400 via-pink-500 to-indigo-500">
              Quiz Challenge
            </h1>{" "}
          </div>
          <p className="text-sm sm:text-base md:text-lg text-gray-300">
            Select a topic and test your knowledge!
          </p>
        </div>

        {/* Topic Selection */}
        <div className="mb-6 sm:mb-8 md:mb-10">
          <label
            htmlFor="topic-select"
            className="block text-sm sm:text-base md:text-lg font-medium mb-2 text-gray-200"
          >
            Choose a Topic:
          </label>
          <select
            id="topic-select"
            value={selectedTopic}
            onChange={(e) => setSelectedTopic(e.target.value)}
            className="w-full p-2 sm:p-3 text-sm sm:text-base bg-gray-700 border border-gray-600 rounded-lg text-gray-200 focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
          >
            <option value="" className="text-gray-400">
              -- Select a topic --
            </option>
            {topics &&
              topics.map((topic) => (
                <option
                  key={topic.name}
                  value={topic.name}
                  className="bg-gray-800 text-gray-200 text-sm sm:text-base"
                >
                  {topic.icon} {topic.name} ({topic.questions.length} q)
                </option>
              ))}
          </select>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row justify-center gap-3 sm:gap-4 mb-8 sm:mb-10 md:mb-12">
          <button
            onClick={handleStartGame}
            disabled={!selectedTopic}
            className="px-4 py-2 sm:px-6 sm:py-3 text-sm sm:text-base bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-lg font-semibold hover:from-purple-700 hover:to-indigo-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg"
          >
            Start Quiz
          </button>

          <button
            onClick={handleViewLeaderboard}
            className="px-4 py-2 sm:px-6 sm:py-3 text-sm sm:text-base border border-purple-500 text-purple-300 rounded-lg font-semibold hover:bg-purple-900/30 transition-all shadow-lg"
          >
            View Leaderboard
          </button>
        </div>

        {/* Topics Grid */}
        <div className="mt-8 sm:mt-10 md:mt-12">
          ];
          <div className="flex items-center justify-between">
            {" "}
            <h2 className="text-lg sm:text-xl md:text-2xl font-semibold mb-4 sm:mb-5 md:mb-6 text-gray-200">
              Browse all topics:
            </h2>
            <RefreshButton onClick={forceRefresh} />
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 sm:gap-4 overflow-y-auto max-h-[50vh] sm:max-h-[55vh] md:max-h-[60vh] pb-6 sm:pb-8 scrollbar-thin scrollbar-thumb-purple-700 scrollbar-track-gray-700/50">
            {topics &&
              topics &&
              topics.map((topic) => (
                <button
                  key={topic.name}
                  onClick={() => setSelectedTopic(topic.name)}
                  className={`p-2 sm:p-3 md:p-4 rounded-lg border-2 transition-all min-w-0 backdrop-blur-sm ${
                    selectedTopic === topic.name
                      ? "border-purple-500 bg-purple-900/30 shadow-lg"
                      : "border-gray-700 bg-gray-700/50 hover:border-purple-400 hover:bg-gray-700/70"
                  }`}
                >
                  <div className="text-xl sm:text-2xl mb-1 sm:mb-2 text-purple-300">
                    {topic.icon}
                  </div>
                  <h3 className="font-medium text-xs sm:text-sm md:text-base text-gray-100 truncate">
                    {topic.name}
                  </h3>
                  <p className="text-xs sm:text-sm text-gray-400">
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

import { motion } from "framer-motion";

const RefreshButton = ({ onClick }: { onClick: () => void }) => {
  const [isRotating, setIsRotating] = useState(false);

  const handleClick = () => {
    setIsRotating(true);
    onClick(); // This will call setRefetch(!refetch)

    setTimeout(() => setIsRotating(false), 1000);
  };

  return (
    <motion.div
      className="flex items-center gap-2 text-gray-300 cursor-pointer select-none"
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      onClick={handleClick}
    >
      <motion.div
        animate={{ rotate: isRotating ? 360 : 0 }}
        transition={{
          duration: 0.6,
          repeat: isRotating ? Infinity : 0,
          ease: "linear",
        }}
      >
        <RefreshCw size={16} className="text-white" />
      </motion.div>
      <span>Refresh</span>
    </motion.div>
  );
};
