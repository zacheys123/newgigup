import connectDb from "@/lib/connectDb";
import User, { IUser } from "@/models/user";
import { clerkClient } from "@clerk/clerk-sdk-node";
import { getAuth } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";

export async function DELETE(req: NextRequest) {
  try {
    // Authenticate the request
    const { userId } = getAuth(req);
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Parse the request body
    const { username } = await req.json();
    if (!username || typeof username !== "string") {
      return NextResponse.json(
        { error: "Username is required" },
        { status: 400 }
      );
    }

    // Connect to the database
    await connectDb();

    // Find the user in your MongoDB database
    const existingUser = (await User.findOne({
      clerkId: userId,
    })) as IUser | null;
    if (!existingUser) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Ensure the username matches the authenticated user
    if (username !== existingUser.username) {
      return NextResponse.json(
        { error: "Username does not match" },
        { status: 400 }
      );
    }

    // Delete the user from Clerk first
    await clerkClient.users.deleteUser(userId);

    // Then remove the user from MongoDB
    await User.deleteOne({ clerkId: userId });

    // Respond with success
    return NextResponse.json(
      { message: "Account deleted successfully" },
      { status: 200 }
    );
  } catch (error: unknown) {
    console.error("Account deletion error:", error);

    // Return error info
    return NextResponse.json(
      { error: "Failed to delete account" },
      { status: 500 }
    );
  }
}
