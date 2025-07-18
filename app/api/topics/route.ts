// app/api/topics/route.ts
import connectDb from "@/lib/connectDb";
import { Topic } from "@/models/topics";
import { NextResponse } from "next/server";

export const dynamic = "force-dynamic"; // Ensure fresh data

export async function GET() {
  try {
    const responseHeaders = new Headers();
    responseHeaders.set("Cache-Control", "no-cache, no-store, must-revalidate");
    responseHeaders.set("Pragma", "no-cache");
    responseHeaders.set("Expires", "0");

    await connectDb(); // Connect to MongoDB

    const topics = await Topic.find({}).lean();
    const totalQuestions = topics.reduce(
      (total, topic) => total + topic.questions.length,
      0
    );

    return NextResponse.json({
      topics,
      totalQuestions, // Send this to client
      count: topics.length,
    });
  } catch (error) {
    console.error("Failed to fetch topics:", error);
    return NextResponse.json(
      { error: "Failed to fetch topics" },
      { status: 500 }
    );
  }
}
