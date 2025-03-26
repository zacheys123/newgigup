import connectDb from "@/lib/connectDb";
import Chat from "@/models/chat";
import Gig from "@/models/gigs";
import Message from "@/models/messages";
import User from "@/models/user";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  try {
    await connectDb();

    // Extract userId from query parameters
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get("userId");
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "20");
    const skip = (page - 1) * limit;

    // ... rest of your query
    if (!userId) {
      return NextResponse.json(
        { error: "User ID is required" },
        { status: 400 }
      );
    }

    // Find chats where the user is a participant
    const chats = await Chat.find({ users: userId })
      .skip(skip)
      .limit(limit)
      .populate({
        path: "users",
        model: User,
        select: "firstname lastname picture isMusician isClient", // Only select needed fields
      })
      .populate({
        path: "messages",
        model: Message,
        options: { sort: { createdAt: -1 }, limit: 1 }, // Only get the latest message
      })
      .populate({
        path: "gigChat",
        model: Gig,
        select: "title", // Only select needed fields
      })
      .sort({ updatedAt: -1 }); // Sort by most recently updated
    const response = NextResponse.json(chats);

    // Cache for 60 seconds, serve stale for 30 seconds while revalidating
    response.headers.set(
      "Cache-Control",
      "public, s-maxage=60, stale-while-revalidate=30"
    );

    return response;
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Failed to fetch chats" },
      { status: 500 }
    );
  }
}
