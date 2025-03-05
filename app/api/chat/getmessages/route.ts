import { NextResponse, NextRequest } from "next/server";
import connectDb from "@/lib/connectDb";
import Chat from "@/models/chat";
import Message from "@/models/messages";
// Make sure this is imported

export async function GET(req: NextRequest) {
  try {
    await connectDb(); // Ensure DB is connected before querying

    const { searchParams } = new URL(req.url);
    const chatId = searchParams.get("chatId");
    console.log("my chatId", chatId);

    if (!chatId) {
      return NextResponse.json({ error: "Missing chatId" }, { status: 400 });
    }

    // Query with populate
    const chat = await Chat.findById(chatId).populate({
      path: "messages",
      model: Message, // Explicitly reference the model
      populate: [
        {
          path: "sender",
          select: "username firstname lastname picture",
        },
        {
          path: "receiver",
          select: "username firstname lastname picture",
        },
      ],
    });

    if (!chat || !chat.messages) {
      return NextResponse.json(
        { error: "Chat not found or has no messages" },
        { status: 404 }
      );
    }

    return NextResponse.json({ messages: chat.messages }, { status: 200 });
  } catch (error) {
    console.error("Error fetching messages:", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
