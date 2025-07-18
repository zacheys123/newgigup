// app/api/leaderboard/route.ts

import { NextRequest, NextResponse } from "next/server";

import { WordGameFields } from "@/types/gamesiinterface";
import { getAuth } from "@clerk/nextjs/server";
import { Game } from "@/models/game";
import { Leaderboard } from "@/models/leaderboard";

export async function POST(req: NextRequest) {
  const session = getAuth(req);
  const { userId } = session;

  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await req.json();

    // Validate the request body
    const {
      gameSlug,
      score,
      gameSpecific,
      timeTaken,
      difficulty,
      username,
      picture,
      id,
    } = body;

    if (!gameSlug || typeof score !== "number") {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Find the game

    const game = await Game.findOne({ slug: gameSlug });
    if (!game) {
      return NextResponse.json({ error: "Game not found" }, { status: 404 });
    }

    // Prepare game-specific fields for word games
    const wordGameFields: WordGameFields = {
      wordsSolved: gameSpecific?.wordsSolved || 0,
      longestStreak: gameSpecific?.longestStreak || 0,
      hintsUsed: gameSpecific?.hintsUsed || 0,
      bonusPoints: gameSpecific?.bonusPoints || 0,
      difficultyLevel: difficulty || "basic",
    };

    // Create or update leaderboard entry
    const existingEntry = await Leaderboard.findOne({
      gameId: game._id,
      userId: id,
    });

    let leaderboardEntry;

    if (existingEntry) {
      // Update existing entry if new score is higher
      if (score > existingEntry.score) {
        existingEntry.score = score;
        existingEntry.gameSpecific = wordGameFields;
        existingEntry.timeTaken = timeTaken;
        await existingEntry.save();
        leaderboardEntry = existingEntry;
      } else {
        leaderboardEntry = existingEntry;
      }
    } else {
      // Create new entry
      leaderboardEntry = await Leaderboard.create({
        gameId: game._id,
        userId: id,
        username: username || "Anonymous",
        avatar: picture,
        score,
        gameSpecific: wordGameFields,
        category: "word",
        timeTaken,
      });
    }

    return NextResponse.json({
      leaderboardEntry,
      status: 200,
      message: "Added Game data ",
    });
  } catch (error) {
    console.error("Error submitting to leaderboard:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
