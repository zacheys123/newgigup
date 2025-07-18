// app/admin/games/actions/createTopic.ts
"use server";

import connectDb from "@/lib/connectDb";
import { Topic } from "@/models/topics";

export async function createTopic(data: { name: string; description: string }) {
  await connectDb();
  await Topic.create(data);
}
