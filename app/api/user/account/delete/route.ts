import connectDb from "@/lib/connectDb";
import User, { IUser } from "@/models/user";
import { getAuth } from "@clerk/nextjs/server";
import mongoose from "mongoose";
import { NextRequest, NextResponse } from "next/server";

export async function DELETE(req: NextRequest) {
  const searchUrl = req.nextUrl.pathname.split("/").pop(); // Extract the `id` from the URL path
  const { userId } = getAuth(req);
  const { username } = await req.json();
  if (!userId) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }
  // Check if a string is a valid ObjectId
  function isValidObjectId(id: string): boolean {
    return mongoose.Types.ObjectId.isValid(id);
  }
  const query = {
    $or: [
      { clerkId: searchUrl },
      { username: searchUrl },
      ...(isValidObjectId(searchUrl || "") ? [{ _id: searchUrl }] : []),
    ],
  };

  try {
    const existing = (await User.findOne(query)) as IUser | null;
    // Verify the username matches the logged-in user
    if (username !== existing?.username) {
      return NextResponse.json(
        { error: "Username does not match" },
        { status: 400 }
      );
    }
    await connectDb();
    // Delete user from MongoDB
    await User.deleteOne({ clerkId: userId });

    return NextResponse.json(
      { message: "Account deleted successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error deleting account:", error);
    return NextResponse.json(
      { error: "Failed to delete account" },
      { status: 500 }
    );
  }
}
