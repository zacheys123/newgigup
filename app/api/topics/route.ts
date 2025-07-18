// app/api/topics/route.ts
import { Topic } from "@/models/topics";
import { NextResponse } from "next/server";

// Server-side import of JSON

export async function GET() {
  const topicData = await Topic.find({}).lean();
  return NextResponse.json(topicData);
}
