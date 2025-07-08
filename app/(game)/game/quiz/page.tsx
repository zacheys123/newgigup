"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import GameComponent from "@/components/game/GameComponent";

export default function GamePage() {
  const [isLoading, setIsLoading] = useState(true);
  const [progress, setProgress] = useState(0);
  const hasVisited =
    typeof window !== "undefined"
      ? sessionStorage.getItem("quizMasterVisited")
      : null;

  useEffect(() => {
    let progressInterval: NodeJS.Timeout;
    let timeout: NodeJS.Timeout;

    const startLoading = () => {
      progressInterval = setInterval(() => {
        setProgress((prev) => {
          const newValue = Math.min(prev + 1, 100);
          if (newValue === 100) {
            clearInterval(progressInterval);
            setIsLoading(false);
            sessionStorage.setItem("quizMasterVisited", "true");
          }
          return newValue;
        });
      }, 100);

      timeout = setTimeout(() => {
        clearInterval(progressInterval);
        setIsLoading(false);
        sessionStorage.setItem("quizMasterVisited", "true");
      }, 10000);
    };

    if (
      process.env.NODE_ENV === "development" ||
      !sessionStorage.getItem("quizMasterVisited")
    ) {
      startLoading();
    } else {
      setIsLoading(false);
    }

    return () => {
      clearInterval(progressInterval);
      clearTimeout(timeout);
    };
  }, []);

  // Color sequence for the title animation
  const colorSequence = [
    "#FF2D55", // Vibrant pink
    "#FF9500", // Orange
    "#FFCC00", // Yellow
    "#4CD964", // Green
    "#5AC8FA", // Light blue
    "#007AFF", // Blue
    "#5856D6", // Purple
    "#FF2D55", // Back to pink
  ];

  return (
    <div className="relative min-h-screen bg-gray-950 overflow-hidden">
      {/* Background elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-10"></div>
        <div className="absolute inset-0 bg-gradient-to-br from-blue-900/20 via-purple-900/20 to-black"></div>

        {/* Floating bubbles */}
        {[...Array(30)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute rounded-full"
            style={{
              width: `${Math.random() * 10 + 5}px`,
              height: `${Math.random() * 10 + 5}px`,
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
              background: `hsla(${Math.random() * 360}, 80%, 60%, 0.3)`,
            }}
            animate={{
              y: [0, (Math.random() - 0.5) * 100],
              x: [0, (Math.random() - 0.5) * 50],
              opacity: [0.1, 0.6, 0.1],
            }}
            transition={{
              duration: Math.random() * 15 + 10,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
        ))}
      </div>

      <AnimatePresence mode="wait">
        {isLoading && !hasVisited ? (
          <motion.div
            key="loader"
            initial={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
            className="fixed inset-0 bg-gradient-to-br from-gray-950 via-gray-900 to-gray-950 z-50 flex flex-col items-center justify-center gap-8 p-4"
          >
            {/* Main Title Container */}
            <motion.div
              className="relative mb-8 perspective-1000 origin-center"
              initial={{ opacity: 0, y: -20 }}
              animate={{
                opacity: 1,
                y: 0,
                rotateY: [0, 5, -5, 0],
              }}
              transition={{
                duration: 1.5,
                ease: "easeInOut",
              }}
            >
              {/* Rainbow Letter Animation */}
              <motion.h1
                className="text-6xl md:text-8xl font-bold text-center font-title tracking-tighter"
                style={{
                  textShadow: `
                    0 1px 0 #ccc, 
                    0 2px 0 #c9c9c9,
                    0 3px 0 #bbb,
                    0 4px 0 #b9b9b9,
                    0 5px 0 #aaa,
                    0 6px 1px rgba(0,0,0,0.1),
                    0 0 20px rgba(255,255,255,0.2),
                    0 0 30px rgba(255,255,255,0.1)
                  `,
                }}
              >
                {"TRIVIA SHOWDOWN".split("").map((letter, i) => (
                  <motion.span
                    key={i}
                    className="inline-block"
                    animate={{
                      color: colorSequence,
                      y: [0, -10, 0, 5, 0],
                      scale: [1, 1.2, 1, 1.1, 1],
                      rotateZ: [0, 5, -5, 2, 0],
                    }}
                    transition={{
                      duration: 4,
                      repeat: Infinity,
                      delay: i * 0.1,
                      ease: "easeInOut",
                    }}
                  >
                    {letter === " " ? "\u00A0" : letter}
                  </motion.span>
                ))}
              </motion.h1>

              {/* Subtitle with rainbow underline */}
              <motion.div
                className="text-center mt-6"
                initial={{ opacity: 0 }}
                animate={{
                  opacity: 1,
                  textShadow: [
                    "0 0 5px rgba(0,255,255,0.3)",
                    "0 0 10px rgba(255,0,255,0.5)",
                    "0 0 5px rgba(255,255,0,0.3)",
                  ],
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  delay: 0.5,
                }}
              >
                <div className="relative inline-block">
                  <p className="text-xl md:text-2xl font-mono my-5 font-medium text-white">
                    KNOWLEDGE • FUN • CHALLENGE
                  </p>
                  <motion.div
                    className="absolute bottom-0 left-0 right-0 h-1"
                    animate={{
                      background: [
                        "linear-gradient(90deg, #FF2D55, #FF9500)",
                        "linear-gradient(90deg, #FF9500, #FFCC00)",
                        "linear-gradient(90deg, #FFCC00, #4CD964)",
                        "linear-gradient(90deg, #4CD964, #5AC8FA)",
                        "linear-gradient(90deg, #5AC8FA, #007AFF)",
                        "linear-gradient(90deg, #007AFF, #5856D6)",
                        "linear-gradient(90deg, #5856D6, #FF2D55)",
                      ],
                    }}
                    transition={{
                      duration: 7,
                      repeat: Infinity,
                      ease: "linear",
                    }}
                  />
                </div>
              </motion.div>

              {/* Floating emoji badges */}
              <motion.div
                className="absolute -top-4 -right-4 text-2xl"
                animate={{
                  y: [0, -15, 0],
                  rotate: [0, 20, -20, 0],
                }}
                transition={{
                  duration: 4,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
              >
                🎯
              </motion.div>
              <motion.div
                className="absolute -bottom-4 -left-4 text-2xl"
                animate={{
                  y: [0, 15, 0],
                  rotate: [0, -20, 20, 0],
                }}
                transition={{
                  duration: 5,
                  repeat: Infinity,
                  ease: "easeInOut",
                  delay: 0.5,
                }}
              >
                🏆
              </motion.div>
            </motion.div>

            {/* Animated Emoji with Progress */}
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{
                scale: [1, 1.1, 1],
                y: [0, -15, 0],
                rotate: [0, 10, -10, 0],
              }}
              transition={{
                duration: 3,
                repeat: Infinity,
                ease: "easeInOut",
              }}
              className="relative w-40 h-40 mb-8"
            >
              {/* Rotating emoji selection */}
              <motion.div
                className="text-8xl text-center"
                animate={{
                  rotate: [0, 360],
                  scale: [1, 1.2, 1],
                }}
                transition={{
                  duration: 8,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
              >
                {["🧠", "🎲", "📚", "🏅", "🌟"][Math.floor(progress / 20) % 5]}
              </motion.div>

              {/* Progress Bar - Fixed Version */}
              <div className="absolute -bottom-8 left-0 right-0">
                <div className="relative h-3 w-full bg-gray-800/80 rounded-full overflow-hidden shadow-inner">
                  <motion.div
                    className="h-full"
                    initial={{ width: "0%" }}
                    animate={{ width: `${progress}%` }}
                    transition={{ type: "tween", duration: 0.2 }}
                    style={{
                      background:
                        "linear-gradient(90deg, #FF2D55, #FF9500, #FFCC00, #4CD964, #5AC8FA, #007AFF, #5856D6)",
                      backgroundSize: "200% 200%",
                    }}
                  />
                </div>
              </div>

              {/* Percentage Display */}
              <motion.div
                className="absolute -bottom-16 left-0 right-0 text-center"
                animate={{
                  scale: [1, 1.05, 1],
                  textShadow: [
                    "0 0 8px rgba(255,255,255,0.3)",
                    "0 0 12px currentColor",
                    "0 0 8px rgba(255,255,255,0.3)",
                  ],
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                }}
              >
                <motion.span
                  className="text-3xl font-bold"
                  style={{
                    background:
                      "linear-gradient(90deg, #FF2D55, #FF9500, #FFCC00, #4CD964, #5AC8FA, #007AFF, #5856D6)",
                    WebkitBackgroundClip: "text",
                    backgroundClip: "text",
                    color: "transparent",
                    backgroundSize: "400% 400%",
                  }}
                  animate={{
                    backgroundPosition: ["0% 50%", "100% 50%"],
                  }}
                  transition={{
                    duration: 6,
                    repeat: Infinity,
                    ease: "linear",
                  }}
                >
                  {progress}%
                </motion.span>
                <span className="block text-sm text-gray-400 mt-1 font-mono">
                  {progress < 30
                    ? "Powering up..."
                    : progress < 70
                    ? "Loading excitement..."
                    : "Almost there!"}
                </span>
              </motion.div>
            </motion.div>

            {/* Dancing dots */}
            <motion.div className="flex gap-3">
              {[...Array(5)].map((_, i) => (
                <motion.div
                  key={i}
                  animate={{
                    y: [0, -15, 0],
                    opacity: [0.4, 1, 0.4],
                    scale: [1, 1.5, 1],
                  }}
                  transition={{
                    duration: 1.5,
                    repeat: Infinity,
                    delay: i * 0.2,
                  }}
                  style={{
                    width: "12px",
                    height: "12px",
                    borderRadius: "50%",
                    background: colorSequence[i % colorSequence.length],
                  }}
                />
              ))}
            </motion.div>

            {/* Copyright */}
            <motion.div
              className="absolute bottom-6 left-0 right-0 text-center"
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.6 }}
              transition={{ delay: 1 }}
            >
              <p className="text-xs text-gray-500 font-mono">
                © {new Date().getFullYear()} TRIVIA SHOWDOWN - Ready to Play?
              </p>
            </motion.div>
          </motion.div>
        ) : (
          <motion.div
            key="content"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="relative w-full"
          >
            <GameComponent />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Global styles for fonts */}
      <style jsx global>{`
        @import url("https://fonts.googleapis.com/css2?family=Luckiest+Guy&family=Rubik+Mono+One&display=swap");

        .font-title {
          font-family: "Luckiest Guy", cursive;
          letter-spacing: 2px;
          -webkit-text-stroke: 1px rgba(0, 0, 0, 0.3);
        }

        .font-mono {
          font-family: "Rubik Mono One", sans-serif;
          letter-spacing: -1px;
        }
      `}</style>
    </div>
  );
}
