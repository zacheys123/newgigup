// app/admin/games/actions/resetTopics.ts
"use server";

import connectDb from "@/lib/connectDb";
import { Topic } from "@/models/topics";

export async function resetTopics() {
  await connectDb();
  await Topic.deleteMany({});
}
