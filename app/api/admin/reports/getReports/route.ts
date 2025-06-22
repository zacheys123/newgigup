import connectDb from "@/lib/connectDb";
import { getAuth } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";
import Report from "@/models/reports";
import User from "@/models/user";

export async function GET(req: NextRequest) {
  try {
    await connectDb();
    const { userId } = getAuth(req);

    if (!userId) {
      return NextResponse.json(
        { error: "You must be logged in" },
        { status: 401 }
      );
    }
    const isAdmin = User.findOne({ clerkId: userId });
    if (!isAdmin) {
      return NextResponse.json({ error: "Not Authorized" }, { status: 401 });
    }
    const reports = await Report.find()
      .populate("reportedUser", "firstname lastname email")
      .populate("reportedBy", "firstname lastname email")
      .sort({ createdAt: -1 });

    return NextResponse.json(reports);
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Server error" },
      { status: 500 }
    );
  }
}
