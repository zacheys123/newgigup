// lib/actions/report.actions.ts

import { PopulatedReport } from "@/types/reports";
import connectDb from "../connectDb";
import Report from "@/models/reports";
import User from "@/models/user";

export const fetchLatestReportsPerUser = async (): Promise<
  PopulatedReport[]
> => {
  try {
    await connectDb();

    // Fetch reports sorted by createdAt (newest first)
    const reports = await Report.find()
      .populate("reportedUser", "firstname lastname email")
      .populate("reportedBy", "firstname lastname email")
      // .populate("resolvedBy", "firstname lastname email")
      .sort({ createdAt: -1 })
      .lean();

    // Use Map to keep only the latest report per user
    const latestReportsMap = new Map<string, PopulatedReport>();

    for (const report of reports) {
      const userId = report.reportedUser._id.toString();
      if (!latestReportsMap.has(userId)) {
        latestReportsMap.set(userId, {
          ...report,
          _id: report._id as string,
          reportedUser: report.reportedUser,
          reportedBy: report.reportedBy,
          reason: report.reason,
          status: report.status,
          createdAt: report.createdAt,
        });
      }
    }

    return Array.from(latestReportsMap.values());
  } catch (error) {
    console.error("Error fetching reports:", error);
    throw new Error("Failed to fetch reports");
  }
};
export const checkAdminStatus = async (userId: string) => {
  if (!userId) {
    console.error("❌ No userId found :", userId);
    throw new Error("UserId not found");
  }
  try {
    await connectDb();
    const user = await User.findOne({ clerkId: userId }).lean();
    return user?.isAdmin;
  } catch (error) {
    console.error("❌ Error found :", error);
    throw new Error("An Error Occured Checking Admin");
  }
};
