import { NextRequest, NextResponse } from "next/server";
import Message from "@/models/messages";
import connectDb from "@/lib/connectDb";
import Chat from "@/models/chat";
// import { getIO } from "@/lib/socket"; // Import Socket.io instance

export async function POST(req: NextRequest) {
  const { sender, receiver, content, chatId, reactions, read } =
    await req.json();
  if (!sender || !receiver || !content || !chatId) {
    return NextResponse.json(
      { error: "Missing required fields" },
      { status: 400 }
    );
  }
  console.log("message", content);
  console.log("chatId", chatId);
  console.log("Receiver", receiver);
  console.log("sender", sender);
  console.log("reactions", reactions);
  if (!content || !chatId || !reactions || !sender || !receiver) {
    console.log("Missing required fields");
    return NextResponse.json(
      { error: "Missing required fields" },
      { status: 400 }
    );
  }
  try {
    await connectDb();

    const newMessage = new Message({
      sender: typeof sender === "object" ? sender?._id : sender,
      receiver,
      content,
      chatId,
      reactions,
      read,
    });

    await newMessage.save();
    // **Update the Chat model to include the new message**
    await Chat.findByIdAndUpdate(chatId, {
      $push: { messages: newMessage._id },
    });

    // Emit message to Socket.io clients in the chat room
    // getIO().to(chatId).emit("receive_message", newMessage);

    return NextResponse.json(newMessage, { status: 201 });
  } catch (error: unknown) {
    return NextResponse.json(
      { error: "Internal Server Error", details: error },
      { status: 500 }
    );
  }
}
