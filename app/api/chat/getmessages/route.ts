import { NextResponse } from "next/server";
import connectDb from "@/lib/connectDb";
import Chat from "@/models/chat";

export async function GET(req: Request) {
  try {
    await connectDb();

    const { searchParams } = new URL(req.url);
    const chatId = searchParams.get("chatId");

    if (!chatId) {
      return NextResponse.json({ error: "Missing chatId" }, { status: 400 });
    }

    // Use aggregation pipeline instead of findById().populate()
    const chat = await Chat.aggregate([
      { $match: { _id: chatId } },
      {
        $lookup: {
          from: "messages",
          localField: "messages",
          foreignField: "_id",
          as: "messages",
        },
      },
      { $unwind: "$messages" },
      {
        $lookup: {
          from: "users",
          localField: "messages.sender",
          foreignField: "_id",
          as: "messages.sender",
        },
      },
      {
        $lookup: {
          from: "users",
          localField: "messages.receiver",
          foreignField: "_id",
          as: "messages.receiver",
        },
      },
      {
        $project: {
          "messages._id": 1,
          "messages.text": 1,
          "messages.timestamp": 1,
          "messages.sender": {
            $arrayElemAt: ["$messages.sender", 0],
          },
          "messages.receiver": {
            $arrayElemAt: ["$messages.receiver", 0],
          },
        },
      },
      { $group: { _id: "$_id", messages: { $push: "$messages" } } },
    ]);

    if (!chat.length) {
      return NextResponse.json(
        { error: "Chat not found or has no messages" },
        { status: 404 }
      );
    }

    return NextResponse.json({ messages: chat[0].messages }, { status: 200 });
  } catch (error) {
    console.error("Error fetching messages:", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
