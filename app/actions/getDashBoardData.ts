// ... existing imports

import connectDb from "@/lib/connectDb";
import User from "@/models/user";
import { DashboardData } from "@/types/dashboard";

export async function getDashboardData(userId: string): Promise<DashboardData> {
  try {
    await connectDb();

    if (!userId) {
      throw new Error("Unauthorized");
    }

    const user = await User.findOne({ clerkId: userId }).select([
      "isClient",
      "isMusician",
      "firstLogin",
      "clerkId",
      "earnings",
      "monthlyGigsBooked",
      "monthlyGigsPosted",
      "totalSpent",
      "tier",
      "nextBillingDate",
    ]);

    if (!user) {
      throw new Error("User not found");
    }

    return {
      user: {
        isClient: user.isClient,
        isMusician: user.isMusician,
        firstLogin: user.firstLogin,
        clerkId: user.clerkId,
        earnings: user?.earnings,
        gigsBooked: user?.monthlyGigsBooked,
        gigsPosted: user?.monthlyGigsPosted,
        total: user?.totalSpent,
      },
      subscription: {
        isPro:
          user.tier === "pro" &&
          (!user.nextBillingDate ||
            new Date(user.nextBillingDate) > new Date()),
        nextBillingDate: user?.nextBillingDate || null,
        tier: user.tier,
      },
    };
  } catch (error) {
    console.error("Failed to fetch dashboard data:", error);
    throw error;
  }
}
