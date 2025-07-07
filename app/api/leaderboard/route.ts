// /app/api/leaderboard/route.ts
import { NextRequest, NextResponse } from "next/server";
import { getAuth } from "@clerk/nextjs/server";
import connectDb from "@/lib/connectDb";
import Leaderboard from "@/models/leaderboard";

interface LeaderBoardProps {
  topic?: string;
  userId?: string;
}

export async function GET(req: NextRequest) {
  await connectDb();
  const topic = req.nextUrl.searchParams.get("topic");
  const userId = req.nextUrl.searchParams.get("userId");

  const filter: LeaderBoardProps = {};
  if (topic) filter.topic = topic;
  if (userId) filter.userId = userId;

  const scores = await Leaderboard.find(filter).sort({ score: -1 }).limit(100);
  return NextResponse.json(scores);
}

export async function POST(req: NextRequest) {
  await connectDb();
  const auth = getAuth(req);
  const { userId } = auth;

  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { topic, score, username } = await req.json();

  if (!topic || typeof score !== "number") {
    return NextResponse.json(
      { error: "Missing topic or score" },
      { status: 400 }
    );
  }

  const entry = await Leaderboard.create({
    topic,
    score,
    userId,
    username: username || "Anonymous",
    date: new Date(),
  });

  return NextResponse.json(entry);
}
