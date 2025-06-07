import connectDb from "@/lib/connectDb";
import User from "@/models/user";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { userIds } = await req.json();

    if (!userIds || !Array.isArray(userIds) || userIds.length === 0) {
      return NextResponse.json(
        { error: "Invalid user IDs provided" },
        { status: 400 }
      );
    }

    await connectDb();

    const result = await User.updateMany(
      { _id: { $in: userIds } },
      {
        $set: {
          isBanned: false,
          banReason: "",
          banReference: "",
          bannedAt: null,
          banExpiresAt: null,
        },
      }
    );

    if (result.modifiedCount === 0) {
      return NextResponse.json(
        { error: "No users were unbanned" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: `${result.modifiedCount} users unbanned successfully`,
    });
  } catch (error) {
    console.error("Error unbanning users:", error);
    return NextResponse.json(
      { error: "Failed to unban users" },
      { status: 500 }
    );
  }
}
