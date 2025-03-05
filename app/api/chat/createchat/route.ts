import { NextRequest, NextResponse } from "next/server";

import Chat from "@/models/chat";
import connectDb from "@/lib/connectDb";

export async function POST(req: NextRequest) {
  const { users } = await req.json();

  if (!users || users.length !== 2) {
    return NextResponse.json(
      { error: "Two users are required" },
      { status: 400 }
    );
  }
  try {
    await connectDb();
    const existingChat = await Chat.findOne({ users: { $all: users } });

    if (existingChat) {
      return NextResponse.json({ chatId: existingChat._id }, { status: 200 });
    }

    const newChat = new Chat({ users, messages: [] });
    await newChat.save();

    return NextResponse.json({ chatId: newChat._id }, { status: 201 });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Failed to create chat" },
      { status: 500 }
    );
  }
}
