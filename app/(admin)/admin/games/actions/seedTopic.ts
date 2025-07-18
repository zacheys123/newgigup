// app/admin/games/actions/seedTopics.ts
"use server";

import connectDb from "@/lib/connectDb";
import { Topic } from "@/models/topics";

export async function seedTopicsToDb() {
  await connectDb();

  const existing = await Topic.findOne();
  if (existing) return;
  const { topics } = await import("@/app/(game)/game/topics.json");

  await Topic.insertMany(topics);
}
