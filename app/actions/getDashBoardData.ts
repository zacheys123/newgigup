import connectDb from "@/lib/connectDb";
import User from "@/models/user";
import { DashboardData } from "@/types/dashboard";

export async function getDashboardData(userId: string): Promise<DashboardData> {
  try {
    console.log("Connecting to DB...");
    await connectDb();
    console.log("DB connected");

    if (!userId) {
      throw new Error("Unauthorized");
    }

    console.log("Looking for user with clerkId:", userId);
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
      "onboardingComplete",
    ]);

    console.log("User found:", user);

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
        onboardingComplete: user?.onboardingComplete,
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
    console.error("Full error in getDashboardData:", error);
    throw error;
  }
}
