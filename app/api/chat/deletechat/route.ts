import { NextResponse } from "next/server"; // Replace with your Chat model
import connectDb from "@/lib/connectDb";
import Chat from "@/models/chat";

export async function DELETE(request: Request) {
  try {
    // Connect to the database
    await connectDb();

    // Parse the request body
    const { chatId } = await request.json();

    // Validate the chatId
    if (!chatId) {
      return NextResponse.json(
        { success: false, message: "Chat ID is required" },
        { status: 400 }
      );
    }

    // Delete the chat from the database
    const deletedChat = await Chat.findByIdAndDelete(chatId);

    if (!deletedChat) {
      return NextResponse.json(
        { success: false, message: "Chat not found" },
        { status: 404 }
      );
    }

    // Return success response
    return NextResponse.json(
      { success: true, message: "Chat deleted successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error deleting chat:", error);
    return NextResponse.json(
      { success: false, message: "Internal server error" },
      { status: 500 }
    );
  }
}
