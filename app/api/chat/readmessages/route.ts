import connectDb from "@/lib/connectDb";
import Message from "@/models/messages";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const { chatId, userId } = await req.json();
  console.log(chatId, userId);
  try {
    await connectDb();
    await Message.updateMany(
      { chatId, receiver: userId, read: false },
      { $set: { read: true } }
    );
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error marking messages as read:", error);
    return NextResponse.json({
      success: false,
      error: "Internal Server Error",
    });
  }
}
