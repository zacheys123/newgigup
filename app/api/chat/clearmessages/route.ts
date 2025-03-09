// app/api/chat/clearChat/[chatId]/route.ts
import connectDb from "@/lib/connectDb";
import Chat from "@/models/chat";
import { NextResponse, NextRequest } from "next/server";

export async function PUT(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const chatId = searchParams.get("chatId");
  const { userId } = await req.json(); // Pass the current user's ID from the frontend

  try {
    await connectDb();

    // Add the user's ID to the `clearedBy` array
    await Chat.findByIdAndUpdate(
      { _id: chatId },
      {
        $addToSet: { clearedBy: userId }, // Use $addToSet to avoid duplicates
      }
    );

    return NextResponse.json(
      { message: "Chat cleared successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error clearing chat:", error);
    return NextResponse.json(
      { error: "Failed to clear chat" },
      { status: 500 }
    );
  }
}
