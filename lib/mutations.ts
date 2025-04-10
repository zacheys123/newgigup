// lib/mutations.ts
import { toast } from "sonner";

export async function updateSubscription(
  clerkId: string,
  tier: "free" | "pro",
  options?: {
    onSuccess?: () => void;
    onError?: (error: Error) => void;
  }
) {
  try {
    const response = await fetch(`/api/user/subscription?clerkId=${clerkId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ clerkId, tier }),
    });

    if (!response.ok) {
      throw new Error(
        response.status === 403
          ? "Upgrade failed: Payment required"
          : "Failed to update subscription"
      );
    }

    const data = await response.json();
    toast.success(
      tier === "pro"
        ? "Successfully upgraded to Pro Tier!"
        : "Successfully downgraded to Free Tier"
    );
    options?.onSuccess?.();
    return data;
  } catch (error) {
    console.error("Subscription update error:", error);
    toast.error(
      error instanceof Error ? error.message : "An unknown error occurred"
    );
    options?.onError?.(error as Error);
    throw error;
  }
}
