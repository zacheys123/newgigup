import connectDb from "@/lib/connectDb";
import { getAuth } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";
import Report from "@/models/reports";
import { CreateReportRequest } from "@/types/reports";
import User from "@/models/user";

export async function POST(req: NextRequest) {
  try {
    await connectDb();
    const { userId } = getAuth(req);

    if (!userId) {
      return NextResponse.json(
        { error: "You must be logged in" },
        { status: 401 }
      );
    }

    const {
      reportedUserId,
      reason,
      additionalInfo,
      userid: reportedBy,
    }: CreateReportRequest = await req.json();
    const report = new Report({
      reportedUser: reportedUserId,
      reportedBy,
      reason,
      additionalInfo,
    });

    const myuser = await User.findByIdAndUpdate(reportedUserId, {
      $inc: { reportsCount: 1 }, // Increment by 1
    });
    console.log(myuser);
    await report.save();
    return NextResponse.json(report, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Server error" },
      { status: 500 }
    );
  }
}
