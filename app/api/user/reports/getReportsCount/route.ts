import User from "@/models/user";
import { getAuth } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const { userId: clerkId } = getAuth(req);
  try {
    const user = await User.findOne({ clerkId }).select("reportsCount");

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }
    const isAdmin = User.findOne({ clerkId });
    if (!isAdmin) {
      return NextResponse.json({ error: "Not Authorized" }, { status: 401 });
    }
    console.log(user);
    return NextResponse.json({ reportsCount: user.reportsCount });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
