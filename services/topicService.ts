// lib/actions/topicActions.ts

import connectDb from "@/lib/connectDb";
import { Topic } from "@/models/topics";

export async function getAllTopics() {
  await connectDb();
  const topics = await Topic.find().sort({ createdAt: -1 });
  return JSON.parse(JSON.stringify(topics));
}
