// app/api/admin/reports/[userId]/route.ts

import connectDb from "@/lib/connectDb";
import Report from "@/models/reports";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const userId = request.nextUrl.pathname.split("/");
  try {
    await connectDb();

    const reports = await Report.find({ reportedUser: userId })
      .populate("reportedUser", "firstname lastname email")
      .populate("reportedBy", "firstname lastname email")
      .populate("resolvedBy", "firstname lastname email")
      .sort({ createdAt: -1 })
      .lean();

    return NextResponse.json(reports);
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      { error: "Failed to fetch user reports" },
      { status: 500 }
    );
  }
}
