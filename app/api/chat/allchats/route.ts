// app/api/chats/route.ts
import connectDb from "@/lib/connectDb";
import Chat from "@/models/chat";
import Gig from "@/models/gigs";
import Message from "@/models/messages";
import User from "@/models/user";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    await connectDb();
    const chats = await Chat.find({})
      .populate({ path: "users", model: User })
      .populate({ path: "messages", model: Message })
      .populate({ path: "gigChat", model: Gig });
    console.log(chats);
    return NextResponse.json(chats);
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      { error: "Failed to fetch chats" },
      { status: 500 }
    );
  }
}
