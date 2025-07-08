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
      description: "Test your knowledge against global opponents in real-time",
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
      description: "Unscramble letters to form words under pressure",
      category: "Puzzle",
      players: "5K+",
      rating: 4.5,
      emoji: "🔠",
      url: "/game/words",
    },
    {
      id: 3,
      title: "Math Sprint",
      description: "Race against time to solve complex equations",
      category: "Educational",
      players: "3K+",
      rating: 4.3,
      emoji: "➕",
      url: "/game/math-sprint",
    },
    {
      id: 4,
      title: "Emoji Enigma",
      description: "Decipher phrases from clever emoji combinations",
      category: "Puzzle",
      players: "8K+",
      rating: 4.6,
      emoji: "🤔",
      url: "/game/emoji-puzzle",
    },
    {
      id: 5,
      title: "Hungry Bear",
      description: "Dont't allow your bear to go hungry",
      category: "Playfull",
      players: "7K+",
      rating: 4.4,
      emoji: "🌍",
      url: "/game/bear",
    },
  ];

  const comingSoonGames = [
    {
      id: 6,
      title: "Chess Royale",
      description: "Strategic battles with special power-ups",
      category: "Strategy",
      release: "Q3 2024",
      emoji: "♟️",
    },
    {
      id: 7,
      title: "Pixel Odyssey",
      description: "Retro-inspired adventure with modern mechanics",
      category: "Adventure",
      release: "Q4 2024",
      emoji: "👾",
    },
    {
      id: 8,
      title: "Eco Guardians",
      description: "Tower defense with environmental strategy",
      category: "Strategy",
      release: "Q1 2025",
      emoji: "🌱",
    },
    {
      id: 9,
      title: "Harmony Quest",
      description: "Identify songs from short audio clips",
      category: "Music",
      release: "Q2 2025",
      emoji: "🎵",
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white overflow-hidden">
      {/* Animated Background Elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
        {[...Array(20)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute rounded-full bg-indigo-500/10"
            style={{
              width: `${Math.random() * 300 + 100}px`,
              height: `${Math.random() * 300 + 100}px`,
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
            }}
            animate={{
              y: [0, (Math.random() - 0.5) * 100],
              x: [0, (Math.random() - 0.5) * 50],
              opacity: [0.1, 0.3, 0.1],
            }}
            transition={{
              duration: Math.random() * 20 + 10,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
        ))}
      </div>

      {/* Hero Section */}
      <div className="relative z-10 container mx-auto px-4 py-12 text-center">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="mb-6"
        >
          <motion.span
            className="inline-block bg-indigo-600/20 px-3 py-1 rounded-full text-sm mb-4 border border-indigo-400/30"
            initial={{ scale: 0.9 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.3, duration: 0.5 }}
          >
            <span className="text-indigo-300">New Games Weekly</span>
          </motion.span>
          <motion.h1
            className="text-4xl md:text-5xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-white via-indigo-200 to-white"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.8 }}
          >
            Discover <span className="text-indigo-400">Premium</span> Gaming
          </motion.h1>
          <motion.p
            className="text-lg text-gray-300 max-w-2xl mx-auto"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4, duration: 0.8 }}
          >
            Immerse yourself in professionally crafted gaming experiences
          </motion.p>
        </motion.div>

        <motion.div
          className="flex justify-center gap-4 mt-8"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6, duration: 0.8 }}
        >
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="bg-indigo-600 hover:bg-indigo-700 px-6 py-3 rounded-lg font-medium flex items-center gap-2 transition-all shadow-lg shadow-indigo-500/20"
          >
            <IoIosRocket /> Explore Games
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="bg-gray-800 hover:bg-gray-700 px-6 py-3 rounded-lg font-medium transition-all border border-gray-700"
          >
            <BsGraphUp className="inline mr-2" /> View Leaderboards
          </motion.button>
        </motion.div>
      </div>

      {/* Main Content */}
      <div className="relative z-10 overflow-y-auto h-[calc(100vh-280px)] pb-16">
        {/* Available Games Section */}
        <section className="container mx-auto px-4 mb-16">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6 }}
            className="flex items-center justify-between mb-8"
          >
            <h2 className="text-2xl font-bold flex items-center gap-3">
              <motion.span
                animate={{ rotate: [0, 10, -10, 0] }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                <FaGamepad className="text-indigo-400" />
              </motion.span>
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-300">
                Available Now
              </span>
            </h2>
            <motion.div
              whileHover={{ x: 3 }}
              className="text-indigo-400 text-sm flex items-center gap-1 cursor-pointer"
            >
              View all <FaArrowRight size={14} />
            </motion.div>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            {availableGames.map((game, index) => (
              <motion.div
                key={game.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ delay: index * 0.1, duration: 0.5 }}
                whileHover={{
                  y: -8,
                  boxShadow: "0 15px 30px -10px rgba(99, 102, 241, 0.3)",
                }}
                className={`relative rounded-xl overflow-hidden border border-gray-700/50 hover:border-indigo-400/50 transition-all duration-300 ${
                  game.featured ? "ring-2 ring-indigo-500/50" : ""
                }`}
                style={{
                  background:
                    "linear-gradient(135deg, rgba(30, 30, 40, 0.8) 0%, rgba(17, 17, 23, 0.9) 100%)",
                  backdropFilter: "blur(4px)",
                }}
              >
                <div className="p-5">
                  <div className="flex items-center gap-4 mb-4">
                    <motion.div
                      whileHover={{ rotate: [0, 10, -10, 0] }}
                      transition={{ duration: 0.8 }}
                      className="text-4xl bg-gradient-to-br from-indigo-600 to-purple-600 p-3 rounded-lg flex items-center justify-center"
                    >
                      {game.emoji}
                    </motion.div>
                    <div>
                      <h3 className="font-bold text-lg">{game.title}</h3>
                      <span className="text-xs text-indigo-300 bg-indigo-900/30 px-2 py-1 rounded-full">
                        {game.category}
                      </span>
                    </div>
                  </div>
                  <p className="text-sm text-gray-300 mb-5">
                    {game.description}
                  </p>
                  <div className="flex justify-between items-center text-sm mb-5">
                    <span className="flex items-center gap-2 text-gray-400">
                      <FaUsers className="text-indigo-400" /> {game.players}
                    </span>
                    <span className="flex items-center gap-2 text-yellow-400">
                      <FaStar /> {game.rating}
                    </span>
                  </div>
                  <motion.button
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.97 }}
                    className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 py-2.5 rounded-lg font-medium text-sm transition-all shadow-lg shadow-indigo-500/20"
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
        <section className="container mx-auto px-4 mb-16">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6 }}
            className="flex items-center justify-between mb-8"
          >
            <h2 className="text-2xl font-bold flex items-center gap-3">
              <motion.span
                animate={{ rotate: [0, 15, 0] }}
                transition={{ duration: 3, repeat: Infinity }}
              >
                <FaClock className="text-indigo-400" />
              </motion.span>
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-300">
                Coming Soon
              </span>
            </h2>
            <motion.div
              whileHover={{ x: 3 }}
              className="text-indigo-400 text-sm flex items-center gap-1 cursor-pointer"
            >
              View all <FaArrowRight size={14} />
            </motion.div>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            {comingSoonGames.map((game, index) => (
              <motion.div
                key={game.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ delay: index * 0.1, duration: 0.5 }}
                whileHover={{ y: -8 }}
                className="relative rounded-xl overflow-hidden border border-gray-700/50 hover:border-indigo-400/50 transition-all duration-300"
                style={{
                  background:
                    "linear-gradient(135deg, rgba(30, 30, 40, 0.6) 0%, rgba(17, 17, 23, 0.7) 100%)",
                  backdropFilter: "blur(4px)",
                }}
              >
                <div className="absolute inset-0 bg-gradient-to-br from-gray-900/80 to-gray-900/90"></div>
                <div className="relative p-5">
                  <div className="flex items-center gap-4 mb-4">
                    <motion.div
                      whileHover={{ scale: 1.1 }}
                      className="text-4xl bg-gradient-to-br from-gray-700 to-gray-800 p-3 rounded-lg flex items-center justify-center opacity-90"
                    >
                      {game.emoji}
                    </motion.div>
                    <div>
                      <h3 className="font-bold text-lg">{game.title}</h3>
                      <span className="text-xs text-indigo-300 bg-indigo-900/30 px-2 py-1 rounded-full">
                        {game.category}
                      </span>
                    </div>
                  </div>
                  <p className="text-sm text-gray-300 mb-5">
                    {game.description}
                  </p>
                  <div className="text-xs text-indigo-300 mb-5 bg-indigo-900/20 inline-block px-3 py-1.5 rounded-full">
                    Coming {game.release}
                  </div>
                  <motion.button
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.97 }}
                    className="w-full bg-gray-700 hover:bg-gray-600 py-2.5 rounded-lg font-medium text-sm transition-all flex items-center justify-center gap-2"
                  >
                    <FaClock /> Notify Me
                  </motion.button>
                </div>
              </motion.div>
            ))}
          </div>
        </section>

        {/* CTA Section */}
        <motion.section
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="container mx-auto px-4 text-center py-16"
        >
          <div className="bg-gradient-to-r from-indigo-900/30 via-gray-800/50 to-purple-900/30 rounded-2xl p-8 border border-gray-700/50">
            <motion.h2
              className="text-3xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-white to-indigo-200"
              initial={{ y: -10 }}
              whileInView={{ y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
            >
              Ready to Elevate Your Gaming Experience?
            </motion.h2>
            <motion.p
              className="text-lg text-gray-300 max-w-2xl mx-auto mb-8"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2, duration: 0.5 }}
            >
              Join thousands of players in our premium gaming community
            </motion.p>
            <motion.div
              className="flex justify-center gap-4"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.4, duration: 0.5 }}
            >
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="bg-indigo-600 hover:bg-indigo-700 px-8 py-3 rounded-lg font-bold transition-all shadow-lg shadow-indigo-500/30 flex items-center gap-2"
              >
                <IoIosRocket /> Get Started
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="bg-transparent hover:bg-gray-800/50 px-8 py-3 rounded-lg font-bold transition-all border border-gray-600 flex items-center gap-2"
              >
                Learn More
              </motion.button>
            </motion.div>
          </div>
        </motion.section>
      </div>
    </div>
  );
};

export default GamesLandingPage;
