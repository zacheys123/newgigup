"use client";

import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FaClock, FaTrophy, FaRedo } from "react-icons/fa";
import { IoMdDoneAll } from "react-icons/io";
import { ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";
import { WORD_LIST } from "@/data";

const TIMER_DURATION = 60;

export default function WordScrambleGame() {
  const [isLoading, setIsLoading] = useState(true);
  const [progress, setProgress] = useState(0);
  const [currentWord, setCurrentWord] = useState("");
  const [scrambledWord, setScrambledWord] = useState("");
  const [userGuess, setUserGuess] = useState("");
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(TIMER_DURATION);
  const [gameStatus, setGameStatus] = useState("playing");
  const [wordsCompleted, setWordsCompleted] = useState(0);
  const [hintUsed, setHintUsed] = useState(false);
  const [showHint, setShowHint] = useState(false);
  const router = useRouter();

  // Loading animation
  useEffect(() => {
    const timer = setInterval(() => {
      setProgress((prev) => {
        const newValue = Math.min(prev + 2, 100);
        if (newValue === 100) {
          clearInterval(timer);
          setIsLoading(false);
        }
        return newValue;
      });
    }, 50);

    return () => clearInterval(timer);
  }, []);

  // Rest of your game logic remains the same...
  const scrambleWord = useCallback((word: string) => {
    const letters = word.split("");
    for (let i = letters.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [letters[i], letters[j]] = [letters[j], letters[i]];
    }
    return letters.join("");
  }, []);

  const newWord = useCallback(() => {
    const randomIndex = Math.floor(Math.random() * WORD_LIST.length);
    const word = WORD_LIST[randomIndex];
    setCurrentWord(word);
    setScrambledWord(scrambleWord(word));
    setUserGuess("");
    setShowHint(false);
    setHintUsed(false);
  }, [scrambleWord]);

  const checkGuess = useCallback(() => {
    if (userGuess.toUpperCase() === currentWord) {
      const points = hintUsed ? 5 : 10;
      setScore((prev) => prev + points);
      setWordsCompleted((prev) => prev + 1);
      newWord();
    }
  }, [userGuess, currentWord, hintUsed, newWord]);

  const getHint = () => {
    if (!hintUsed) {
      setShowHint(true);
      setHintUsed(true);
    }
  };

  const resetGame = () => {
    setScore(0);
    setTimeLeft(TIMER_DURATION);
    setGameStatus("playing");
    setWordsCompleted(0);
    newWord();
  };

  useEffect(() => {
    newWord();
  }, [newWord]);

  useEffect(() => {
    if (gameStatus !== "playing") return;

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          setGameStatus("lost");
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [gameStatus]);

  useEffect(() => {
    if (wordsCompleted >= 5) {
      setGameStatus("won");
    }
  }, [wordsCompleted]);

  if (isLoading) {
    return (
      <div className="fixed inset-0 bg-gradient-to-br from-gray-900 to-gray-800 flex flex-col items-center justify-center z-50">
        {/* Circular Text Animation */}
        <div className="relative w-64 h-64 mb-12">
          <svg viewBox="0 0 200 200" className="w-full h-full">
            <path
              id="textPath"
              d="M 100, 100
                m -75, 0
                a 75,75 0 1,0 150,0
                a 75,75 0 1,0 -150,0"
              fill="none"
            />
            <text className="text-xl font-bold fill-indigo-400">
              <textPath href="#textPath" startOffset="0%">
                <animate
                  attributeName="startOffset"
                  from="0%"
                  to="100%"
                  dur="10s"
                  repeatCount="indefinite"
                />
                • LEXICON LEGENDS • WORD SCRAMBLE • BRAIN GAME •
              </textPath>
            </text>
          </svg>

          {/* Center Emoji */}
          <motion.div
            className="absolute inset-0 flex items-center justify-center text-6xl"
            animate={{
              rotate: 360,
              scale: [1, 1.2, 1],
            }}
            transition={{
              duration: 8,
              repeat: Infinity,
              ease: "linear",
            }}
          >
            🔠
          </motion.div>
        </div>

        {/* Floating Letters */}
        {["L", "E", "X", "I", "C", "O", "N"].map((letter, index) => (
          <motion.div
            key={index}
            className="absolute text-2xl text-indigo-400 font-bold"
            style={{
              left: `${20 + index * 10}%`,
              top: `${30 + Math.sin(index) * 10}%`,
            }}
            animate={{
              y: [0, -20, 0],
              opacity: [0.6, 1, 0.6],
            }}
            transition={{
              duration: 4 + index,
              repeat: Infinity,
              delay: index * 0.3,
            }}
          >
            {letter}
          </motion.div>
        ))}

        {/* Progress Bar */}
        <div className="w-64 h-2 bg-gray-700 rounded-full mt-12 overflow-hidden">
          <motion.div
            className="h-full bg-gradient-to-r from-indigo-500 to-purple-600"
            initial={{ width: "0%" }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.3 }}
          />
        </div>

        {/* Percentage and Loading Text */}
        <motion.div
          className="mt-4 text-center"
          animate={{
            scale: [1, 1.05, 1],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
          }}
        >
          <motion.span className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 to-purple-400">
            {progress}%
          </motion.span>
          <p className="text-gray-400 mt-2">
            {progress < 30
              ? "Preparing word database..."
              : progress < 70
              ? "Loading game mechanics..."
              : "Almost ready!"}
          </p>
        </motion.div>

        {/* Floating Particles */}
        {[...Array(20)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute rounded-full bg-indigo-500/20"
            style={{
              width: `${Math.random() * 10 + 5}px`,
              height: `${Math.random() * 10 + 5}px`,
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
            }}
            animate={{
              y: [0, (Math.random() - 0.5) * 100],
              x: [0, (Math.random() - 0.5) * 50],
              opacity: [0.1, 0.5, 0.1],
            }}
            transition={{
              duration: Math.random() * 10 + 5,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
        ))}
      </div>
    );
  }
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 text-white flex flex-col items-center justify-center p-4">
      {/* Game Header */}
      <ArrowLeft
        onClick={() => router.back()}
        size={23}
        className="text-neutral-300 absolute top-10 left-10"
      />
      <motion.div
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="text-center mb-8"
      >
        <h1 className="text-4xl font-bold mb-2 flex items-center justify-center gap-2">
          <span className="text-indigo-400">Lexicon</span> Legends
        </h1>
        <p className="text-gray-300">
          Unscramble the letters to form a valid word!
        </p>
      </motion.div>

      {/* Game Board */}
      <div className="w-full max-w-md bg-gray-800/50 rounded-xl border border-gray-700 p-6 shadow-lg backdrop-blur-sm">
        {/* Game Info Bar */}
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center gap-2 text-yellow-400">
            <FaTrophy /> <span className="font-bold">{score}</span>
          </div>
          <div className="flex items-center gap-2 text-red-400">
            <FaClock /> <span className="font-bold">{timeLeft}s</span>
          </div>
          <div className="flex items-center gap-2 text-indigo-400">
            <IoMdDoneAll />{" "}
            <span className="font-bold">{wordsCompleted}/5</span>
          </div>
        </div>

        {/* Scrambled Word Display */}
        <motion.div
          className="bg-gray-900/50 p-6 rounded-lg mb-6 text-center"
          initial={{ scale: 0.9 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring" }}
          key={scrambledWord}
        >
          <h2 className="text-2xl font-mono tracking-widest text-gray-300 mb-2">
            {scrambledWord.split("").map((letter, i) => (
              <motion.span
                key={i}
                className="inline-block mx-1"
                animate={{
                  y: [0, -5, 0],
                  rotate: [0, 5, -5, 0],
                }}
                transition={{
                  delay: i * 0.05,
                  duration: 0.5,
                }}
              >
                {letter}
              </motion.span>
            ))}
          </h2>
          {showHint && (
            <p className="text-sm text-indigo-300 mt-2">
              {`Hint: Starts with "${currentWord[0]}" and ends with 
              ${currentWord[currentWord.length - 1]}`}
            </p>
          )}
        </motion.div>

        {/* Game Status Messages */}
        <AnimatePresence>
          {gameStatus !== "playing" && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className={`text-center p-4 rounded-lg mb-6 ${
                gameStatus === "won"
                  ? "bg-green-900/30 border border-green-700"
                  : "bg-red-900/30 border border-red-700"
              }`}
            >
              <h3 className="text-xl font-bold mb-2">
                {gameStatus === "won" ? "🏆 You Won! 🏆" : "⏰ Time's Up! ⏰"}
              </h3>
              <p className="text-gray-300">
                {gameStatus === "won"
                  ? `You unscrambled 5 words with ${score} points!`
                  : `You completed ${wordsCompleted} words with ${score} points`}
              </p>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Input Area */}
        {gameStatus === "playing" ? (
          <div className="space-y-4">
            <input
              type="text"
              value={userGuess}
              onChange={(e) => setUserGuess(e.target.value.toUpperCase())}
              onKeyDown={(e) => e.key === "Enter" && checkGuess()}
              className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-3 text-center font-mono text-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
              placeholder="Your answer..."
              autoFocus
            />
            <div className="flex gap-3">
              {/* <motion.button
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                onClick={checkGuess}
                className="flex-1 bg-indigo-600 hover:bg-indigo-700 py-3 rounded-lg font-medium transition-all"
              >
                Submit
              </motion.button> */}
              <motion.button
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                onClick={getHint}
                disabled={hintUsed}
                className={`py-3 px-4 rounded-lg font-medium transition-all ${
                  hintUsed
                    ? "bg-gray-700 text-gray-500 cursor-not-allowed"
                    : "bg-purple-600 hover:bg-purple-700"
                }`}
              >
                Hint
              </motion.button>
            </div>
          </div>
        ) : (
          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            onClick={resetGame}
            className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 py-3 rounded-lg font-medium transition-all flex items-center justify-center gap-2"
          >
            <FaRedo /> Play Again
          </motion.button>
        )}
      </div>

      {/* Game Instructions */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="mt-8 text-center text-gray-400 max-w-md text-sm"
      >
        <p className="mb-2">
          Type the unscrambled word and press Enter or click Submit
        </p>
        <p>
          Each correct word gives {hintUsed ? "5" : "10"} points (5 if hint
          used)
        </p>
        <p className="mt-2">Complete 5 words before time runs out!</p>
      </motion.div>
    </div>
  );
}
