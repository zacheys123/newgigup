import connectDb from "@/lib/connectDb";
import Message from "@/models/messages";
import { getAuth } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";

type Info = {
  emoji: string;
};

export async function PUT(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const messageId = searchParams.get("messageId");
  try {
    const { emoji }: Info = await req.json();

    if (!emoji) {
      return NextResponse.json(
        { gigstatus: "false", message: "No reactions recieved." },
        { status: 400 }
      );
    }

    const { userId } = getAuth(req);
    if (!userId) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    await connectDb();

    // Find existing gig by secret and ensure user is the owner

    // Update the gig
    await Message.findOneAndUpdate(
      { messageId },
      {
        reactions: emoji,
      },
      { new: true }
    );

    return NextResponse.json(
      { gigstatus: "true", message: `Reacted with ${emoji}` },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error reacting:", error);
    return NextResponse.json(
      {
        errorstatus: "error",
        message: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
