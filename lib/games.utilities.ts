// utilities/leaderboard.utils.ts

import { Game } from "@/models/game";
import { Leaderboard } from "@/models/leaderboard";

export async function getUserRank(userId: string, gameSlug: string) {
  const game = await Game.findOne({ slug: gameSlug });
  if (!game) return null;

  const userEntry = await Leaderboard.findOne({
    gameId: game._id,
    userId,
  });

  if (!userEntry) return null;

  const rank =
    (await Leaderboard.countDocuments({
      gameId: game._id,
      score: { $gt: userEntry.score },
    })) + 1;

  return rank;
}

export async function getTopPlayers(gameSlug: string, limit = 10) {
  const game = await Game.findOne({ slug: gameSlug });
  if (!game) return [];

  return Leaderboard.find({ gameId: game._id })
    .sort({ score: -1 })
    .limit(limit)
    .lean();
}
