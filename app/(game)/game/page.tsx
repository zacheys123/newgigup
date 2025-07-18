"use client";

import { motion } from "framer-motion";
import {
  FaGamepad,
  FaClock,
  FaStar,
  FaUsers,
  FaArrowRight,
} from "react-icons/fa";
import { IoIosRocket } from "react-icons/io";
import { BsGraphUp } from "react-icons/bs";
import { useRouter } from "next/navigation";

const GamesLandingPage = () => {
  const router = useRouter();
  const availableGames = [
    {
      id: 1,
      title: "Trivia Showdown",
      description: "Test your knowledge against global opponents",
      category: "Quiz",
      players: "10K+",
      rating: 4.8,
      emoji: "🧠",
      url: "/game/quiz",
      featured: true,
    },
    {
      id: 2,
      title: "Lexicon Legends",
      description: "Unscramble letters under pressure",
      category: "Puzzle",
      players: "5K+",
      rating: 4.5,
      emoji: "🔠",
      url: "/game/words",
    },
    {
      id: 3,
      title: "Math Sprint",
      description: "Race to solve complex equations",
      category: "Educational",
      players: "3K+",
      rating: 4.3,
      emoji: "➕",
      url: "/game/math-sprint",
    },
    {
      id: 4,
      title: "Emoji Enigma",
      description: "Decipher phrases from emojis",
      category: "Puzzle",
      players: "8K+",
      rating: 4.6,
      emoji: "🤔",
      url: "/game/emoji-puzzle",
    },
    {
      id: 5,
      title: "Hungry Bear",
      description: "Don't let your bear go hungry",
      category: "Playful",
      players: "7K+",
      rating: 4.4,
      emoji: "🐻",
      url: "/game/bear",
    },
  ];

  const comingSoonGames = [
    {
      id: 6,
      title: "Chess Royale",
      description: "Strategic battles with power-ups",
      category: "Strategy",
      release: "Q3 2024",
      emoji: "♟️",
    },
    {
      id: 7,
      title: "Pixel Odyssey",
      description: "Retro-inspired adventure",
      category: "Adventure",
      release: "Q4 2024",
      emoji: "👾",
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white overflow-hidden pt-[260px]">
      {/* Hero Section */}
      <div className="container mx-auto px-4 py-8 md:py-12 text-center fixed -mt-[260px] z-[9999] bg-black ">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6"
        >
          <motion.span className="inline-block bg-indigo-600/20 px-2 py-1 rounded-full text-xs md:text-sm mb-3 border border-indigo-400/30">
            <span className="text-indigo-300">New Games Weekly</span>
          </motion.span>
          <h1 className="text-3xl md:text-4xl font-bold mb-3">
            Discover <span className="text-indigo-400">Premium</span> Gaming
          </h1>
          <p className="text-sm md:text-base text-gray-300 max-w-2xl mx-auto">
            Immerse yourself in professionally crafted gaming experiences
          </p>
        </motion.div>

        <div className="flex flex-col sm:flex-row justify-center gap-3 mt-6">
          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            className="bg-amber-600 hover:bg-indigo-700 px-4 py-2 md:px-6 md:py-3 rounded-lg text-sm md:text-base flex items-center justify-center gap-2"
          >
            <IoIosRocket size={16} /> Explore
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            className="bg-emerald-500 hover:bg-gray-700 px-4 py-2 md:px-6 md:py-3 rounded-lg text-sm md:text-base flex items-center justify-center gap-2"
          >
            <BsGraphUp size={16} /> Leaderboards
          </motion.button>
        </div>
      </div>
      <div className="flex-1 overflow-hidden bg-neutral-800 shadow-violet-600 shadow-md rounded-xl ">
        {/* Available Games Section */}
        <div
          className="h-1/2 overflow-y-auto py-6 px-4 border-t border-b border-gray-700/30"
          style={{
            background:
              "linear-gradient(135deg, rgba(29, 78, 216, 0.08) 0%, rgba(130, 264, 175, 0.05) 100%)",
          }}
        >
          {/* Main Content */}
          <div className="container mx-auto px-4 pb-12 overflow-y-auto p-4 ">
            {/* Available Games Section */}
            <section className="mb-12">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold flex items-center gap-2">
                  <FaGamepad className="text-indigo-400" />
                  Available Now
                </h2>
                <div className="text-indigo-400 text-xs md:text-sm flex items-center gap-1">
                  View all <FaArrowRight size={12} />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {availableGames.map((game) => (
                  <motion.div
                    key={game.id}
                    whileHover={{ y: -4 }}
                    className={`relative rounded-lg overflow-hidden border border-gray-700/50 ${
                      game.featured ? "ring-1 ring-indigo-500/50" : ""
                    } bg-gray-800/50`}
                  >
                    <div className="p-4">
                      <div className="flex items-center gap-3 mb-3">
                        <div className="text-3xl bg-indigo-600/20 p-2 rounded-lg">
                          {game.emoji}
                        </div>
                        <div>
                          <h3 className="font-bold text-base">{game.title}</h3>
                          <span className="text-xs text-indigo-300 bg-indigo-900/20 px-2 py-1 rounded-full">
                            {game.category}
                          </span>
                        </div>
                      </div>
                      <p className="text-xs text-gray-300 mb-4 line-clamp-2">
                        {game.description}
                      </p>
                      <div className="flex justify-between items-center text-xs mb-4">
                        <span className="flex items-center gap-1 text-gray-400">
                          <FaUsers size={12} /> {game.players}
                        </span>
                        <span className="flex items-center gap-1 text-yellow-400">
                          <FaStar size={12} /> {game.rating}
                        </span>
                      </div>
                      <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        className="w-full bg-indigo-600 hover:bg-indigo-700 py-2 rounded-lg text-xs md:text-sm"
                        onClick={() => router.push(game.url)}
                      >
                        Play Now
                      </motion.button>
                    </div>
                  </motion.div>
                ))}
              </div>
            </section>

            {/* Coming Soon Section */}
            <section className="mb-12">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold flex items-center gap-2">
                  <FaClock className="text-indigo-400" />
                  Coming Soon
                </h2>
                <div className="text-indigo-400 text-xs md:text-sm flex items-center gap-1">
                  View all <FaArrowRight size={12} />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {comingSoonGames.map((game) => (
                  <motion.div
                    key={game.id}
                    whileHover={{ y: -4 }}
                    className="relative rounded-lg overflow-hidden border border-gray-700/50 bg-gray-800/30"
                  >
                    <div className="absolute inset-0 bg-gradient-to-br from-gray-900/70 to-gray-900/80"></div>
                    <div className="relative p-4">
                      <div className="flex items-center gap-3 mb-3">
                        <div className="text-3xl bg-gray-700/50 p-2 rounded-lg">
                          {game.emoji}
                        </div>
                        <div>
                          <h3 className="font-bold text-base">{game.title}</h3>
                          <span className="text-xs text-indigo-300 bg-indigo-900/20 px-2 py-1 rounded-full">
                            {game.category}
                          </span>
                        </div>
                      </div>
                      <p className="text-xs text-gray-300 mb-4 line-clamp-2">
                        {game.description}
                      </p>
                      <div className="text-xs text-indigo-300 mb-4 bg-indigo-900/20 inline-block px-2 py-1 rounded-full">
                        Coming {game.release}
                      </div>
                      <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        className="w-full bg-gray-700 hover:bg-gray-600 py-2 rounded-lg text-xs md:text-sm flex items-center justify-center gap-1"
                      >
                        <FaClock size={12} /> Notify Me
                      </motion.button>
                    </div>
                  </motion.div>
                ))}
              </div>
            </section>

            {/* CTA Section */}
            <section className="text-center">
              <div className="bg-gray-800/50 rounded-xl p-6 border border-gray-700/50">
                <h2 className="text-xl md:text-2xl font-bold mb-3">
                  Ready to Elevate Your Gaming?
                </h2>
                <p className="text-sm text-gray-300 max-w-md mx-auto mb-6">
                  Join thousands of players in our premium gaming community
                </p>
                <div className="flex flex-col sm:flex-row justify-center gap-3">
                  <motion.button
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.97 }}
                    className="bg-indigo-600 hover:bg-indigo-700 px-6 py-2 rounded-lg text-sm md:text-base flex items-center justify-center gap-2"
                  >
                    <IoIosRocket size={16} /> Get Started
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.97 }}
                    className="bg-transparent hover:bg-gray-700/50 px-6 py-2 rounded-lg text-sm md:text-base border border-gray-600"
                  >
                    Learn More
                  </motion.button>
                </div>
              </div>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GamesLandingPage;
