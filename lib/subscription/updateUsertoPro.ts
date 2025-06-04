// /lib/subscription/updateUserToPro.ts
import User from "@/models/user";

export async function updateUserToPro(clerkId: string): Promise<void> {
  const nextBillingDate = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000); // 30 days

  await User.findOneAndUpdate(
    { clerkId, tierStatus: { $ne: "active" } }, // idempotency: only if not already active
    {
      tier: "pro",
      tierStatus: "active",
      nextBillingDate,
    }
  );
}
