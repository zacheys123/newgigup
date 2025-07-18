"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";
import TriviaComponent from "./components/TriviaComponent";
import MathComponent from "./components/MathComponent";
import EmojiComponent from "./components/EmojiComponent";
import BearComponent from "./components/BearComponent";
import WordsComponent from "./components/WordComponent";

const availableGames = [
  {
    id: 1,
    key: "trivia",
    title: "Trivia Showdown",
    description: "Test your knowledge against global opponents",
    category: "Quiz",
    players: "10K+",
    rating: 4.8,
    emoji: "🧠",
    featured: true,
    component: TriviaComponent,
  },
  {
    id: 2,
    key: "words",
    title: "Lexicon Legends",
    description: "Unscramble letters under pressure",
    category: "Puzzle",
    players: "5K+",
    rating: 4.5,
    emoji: "🔠",
    component: WordsComponent,
  },
  {
    id: 3,
    key: "math",
    title: "Math Sprint",
    description: "Race to solve complex equations",
    category: "Educational",
    players: "3K+",
    rating: 4.3,
    emoji: "➕",
    component: MathComponent,
  },
  {
    id: 4,
    key: "emoji",
    title: "Emoji Enigma",
    description: "Decipher phrases from emojis",
    category: "Puzzle",
    players: "8K+",
    rating: 4.6,
    emoji: "🤔",
    component: EmojiComponent,
  },
  {
    id: 5,
    key: "bear",
    title: "Hungry Bear",
    description: "Don't let your bear go hungry",
    category: "Playful",
    players: "7K+",
    rating: 4.4,
    emoji: "🐻",
    component: BearComponent,
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

export default function GameAdminPage() {
  const [selectedGame, setSelectedGame] = useState<string | null>(null);

  const router = useRouter();

  const handleGameSelect = (key: string) => {
    setSelectedGame(key);
  };

  const handleBack = () => setSelectedGame(null);
  const selectedGameData = availableGames.find(
    (game) => game.key === selectedGame
  );

  return (
    <div className="flex flex-col h-screen bg-background text-foreground overflow-hidden">
      {/* Fixed Header Section - Now shows different headers based on state */}
      <div className="sticky top-0 z-10 bg-background border-b border-border">
        <div className="container mx-auto px-4 py-4">
          <Button
            variant="outline"
            onClick={selectedGame ? handleBack : () => router.back()}
            className="mb-4"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            {selectedGame ? "Back to Games" : "Back"}
          </Button>

          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-lg shadow-md bg-primary/10 text-primary">
                <span className="text-2xl">
                  {selectedGame ? selectedGameData?.emoji : "🎮"}
                </span>
              </div>
              <div>
                <h1 className="text-2xl md:text-3xl font-bold">
                  {selectedGame
                    ? `${selectedGameData?.title} Admin`
                    : "GameHub Admin"}
                </h1>
                <p className="text-sm text-muted-foreground">
                  {selectedGame
                    ? selectedGameData?.description
                    : "Manage all game configurations"}
                </p>
              </div>
              {!selectedGame && (
                <span className="px-3 py-1 rounded-full text-sm font-medium bg-primary/10 text-primary">
                  {availableGames.length} Games
                </span>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Scrollable Content Section - Full page for selected game */}
      <div className="flex-1 overflow-auto">
        <div className="container mx-auto px-4 py-4 h-full">
          <AnimatePresence mode="wait">
            {!selectedGame ? (
              <motion.div
                key="menu"
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -40 }}
                transition={{ duration: 0.4 }}
                className="h-full"
              >
                {/* Games Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {availableGames.map((game) => (
                    <motion.div
                      key={game.id}
                      whileHover={{ scale: 1.03 }}
                      className="bg-card rounded-xl p-6 shadow hover:shadow-xl transition cursor-pointer border border-border h-full flex flex-col"
                      onClick={() => handleGameSelect(game.key)}
                    >
                      <div className="text-4xl">{game.emoji}</div>
                      <h2 className="text-xl font-semibold mt-2">
                        {game.title}
                      </h2>
                      <p className="text-sm text-muted-foreground flex-grow">
                        {game.description}
                      </p>
                      <div className="text-xs text-muted-foreground mt-2">
                        {game.category} • {game.players} players • ⭐{" "}
                        {game.rating}
                      </div>
                    </motion.div>
                  ))}
                </div>

                {/* Coming Soon Section */}
                <div className="mt-12">
                  <h2 className="text-xl font-semibold mb-4">🚧 Coming Soon</h2>
                  <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {comingSoonGames.map((game) => (
                      <div
                        key={game.id}
                        className="bg-muted/50 p-5 rounded-lg border-dashed border-border border shadow-inner"
                      >
                        <div className="text-3xl">{game.emoji}</div>
                        <h3 className="text-lg font-semibold">{game.title}</h3>
                        <p className="text-sm text-muted-foreground">
                          {game.description}
                        </p>
                        <span className="text-xs text-muted-foreground">
                          Releases {game.release}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </motion.div>
            ) : (
              <motion.div
                key="game"
                initial={{ opacity: 0, x: 60 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -60 }}
                transition={{ duration: 0.4 }}
                className="h-full"
              >
                {/* Full-page game component */}
                <div className="bg-card rounded-xl p-6 shadow border border-border h-full">
                  {selectedGameData?.component && (
                    <selectedGameData.component />
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
