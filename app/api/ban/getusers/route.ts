// app/api/admin/banned-users/route.ts
import { NextResponse } from "next/server";

import { BannedUserTableItem } from "@/types/appeal";
import connectDb from "@/lib/connectDb";
import User from "@/models/user";
import Appeal from "@/models/appeal";

export async function GET() {
  try {
    await connectDb();

    // Fetch banned users
    const bannedUsers = await User.find({ isBanned: true })
      .sort({ bannedAt: -1 })
      .lean();

    if (!bannedUsers.length) {
      return NextResponse.json([]);
    }

    // Fetch appeals for all banned users in one query
    const userIds = bannedUsers.map((user) => user._id.toString());
    const appeals = await Appeal.find({ userId: { $in: userIds } }).lean();

    // Map appeals to users
    const result: BannedUserTableItem[] = bannedUsers.map((user) => ({
      _id: user._id.toString(),
      clerkId: user.clerkId,
      username: user.username,
      email: user.email,
      isBanned: user.isBanned,
      banReason: user.banReason,
      banReference: user.banReference,
      bannedAt: user.bannedAt,
      appeals: appeals
        .filter((appeal) => appeal.userId === user._id.toString())
        .map((appeal) => ({
          _id: appeal._id.toString(),
          status: appeal.status,
          createdAt: appeal.createdAt,
        })),
    }));

    return NextResponse.json(result);
  } catch (error) {
    console.error("Error fetching banned users:", error);
    return NextResponse.json(
      { error: "Failed to fetch banned users" },
      { status: 500 }
    );
  }
}
