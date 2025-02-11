import { NextRequest, NextResponse } from "next/server";
import Message from "@/models/messages";
import connectDb from "@/lib/connectDb";
import Chat from "@/models/chat";
// import { getIO } from "@/lib/socket"; // Import Socket.io instance

export async function POST(req: NextRequest) {
  const { sender, receiver, text, chatId } = await req.json();
  if (!sender || !receiver || !text || !chatId) {
    return NextResponse.json(
      { error: "Missing required fields" },
      { status: 400 }
    );
  }
  console.log(sender);
  console.log("Received", text, chatId, receiver);
  console.log("sender", sender);
  try {
    await connectDb();

    const newMessage = new Message({
      sender: typeof sender === "object" ? sender?._id : sender,
      receiver,
      text,
      chatId,
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
