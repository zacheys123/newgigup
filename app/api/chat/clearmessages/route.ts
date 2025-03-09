// app/api/chat/clearChat/[chatId]/route.ts
import connectDb from "@/lib/connectDb";
import Chat from "@/models/chat";
import { NextResponse, NextRequest } from "next/server";

export async function PUT(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const chatId = searchParams.get("chatId");

  try {
    // Connect to the database
    await connectDb();

    // Delete all messages associated with the chatId
    await Chat.findByIdAndUpdate(
      { _id: chatId },
      {
        $set: { messages: [] },
      }
    );

    // Return a success response
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
