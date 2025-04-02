import User from "@/models/user";

type SubscriptionStatus = {
  isPro: boolean;
  nextBillingDate: Date | null;
};

export async function checkSubscription(
  userId: string
): Promise<SubscriptionStatus> {
  if (!userId) {
    return { isPro: false, nextBillingDate: null };
  }

  try {
    const user = await User.findOne({ clerkId: userId }).select([
      "tier",
      "nextBillingDate",
    ]);

    if (!user) {
      return { isPro: false, nextBillingDate: null };
    }

    return {
      isPro:
        user.tier === "pro" &&
        (!user.nextBillingDate || user.nextBillingDate > new Date()),
      nextBillingDate: user.nextBillingDate || null,
    };
  } catch (error) {
    console.error("Subscription check failed:", error);
    return { isPro: false, nextBillingDate: null };
  }
}

// For Clerk webhook handling
export async function updateSubscription(
  userId: string,
  subscriptionData: {
    status: string;
    nextBillingDate: Date;
  }
) {
  await User.findOneAndUpdate(
    { clerkId: userId },
    {
      tier: subscriptionData.status === "active" ? "pro" : "free",
      nextBillingDate: subscriptionData.nextBillingDate,
    },
    { upsert: true }
  );
}
