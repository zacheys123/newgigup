import { NextRequest, NextResponse } from "next/server";

import Chat from "@/models/chat";
import connectDb from "@/lib/connectDb";

export async function GET(req: NextRequest) {
  await connectDb();

  const { searchParams } = new URL(req.url);
  const user1 = searchParams.get("user1");
  const user2 = searchParams.get("user2");

  if (!user1 || !user2) {
    return NextResponse.json(
      { error: "User IDs are required" },
      { status: 400 }
    );
  }
  try {
    const chat = await Chat.findOne({ users: { $all: [user1, user2] } });

    if (!chat) {
      return NextResponse.json({ error: "Chat not found" }, { status: 404 });
    }

    return NextResponse.json({ chatId: chat._id }, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: error, status: 500 });
  }
}
