import { NextRequest, NextResponse } from "next/server";
import { getAuth } from "@clerk/nextjs/server";
import {
  checkAdminStatus,
  fetchLatestReportsPerUser,
} from "@/lib/actions/reports.actions";

export async function GET(req: NextRequest) {
  try {
    const { userId } = getAuth(req);

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Verify admin status
    const isAdmin = await checkAdminStatus(userId); // Your admin check logic
    if (!isAdmin) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }
    const reports = await fetchLatestReportsPerUser(); // Your report fetching logic

    console.log(reports);
    return NextResponse.json({ reports });
  } catch (error) {
    console.error("[ADMIN_REPORTS_ERROR]", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
