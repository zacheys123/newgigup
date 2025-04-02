"use server";

import connectDb from "@/lib/connectDb";
import User from "@/models/user";
import { DashboardData } from "@/types/dashboard";

export async function getDashboardData(userId: string): Promise<DashboardData> {
  try {
    await connectDb();

    if (!userId) {
      throw new Error("Unauthorized");
    }

    const [user, subscription] = await Promise.all([
      User.findOne({ clerkId: userId }),
      User.findOne({ clerkId: userId }).select(["tier", "nextBillingDate"]),
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
      },
      subscription: {
        isPro:
          subscription?.tier === "pro" &&
          (!subscription?.nextBillingDate ||
            new Date(subscription.nextBillingDate) > new Date()),
        nextBillingDate: subscription?.nextBillingDate || null,
      },
    };
  } catch (error) {
    console.error("Failed to fetch dashboard data:", error);
    throw error;
  }
}
