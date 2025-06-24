// hooks/useConfirmPayment.ts
import { toast } from "sonner";
import { mutate } from "swr";
import { useRouter } from "next/navigation";

export const useConfirmPayment = () => {
  const router = useRouter();

  const confirmPayment = async (
    gigId: string,
    role: "client" | "musician",
    notes?: string,
    code?: string
  ) => {
    try {
      const response = await fetch(`/api/gigs/complete-gig/${gigId}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ role, notes, code }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to confirm payment");
      }

      await Promise.all([mutate("/api/gigs/getgigs"), mutate("/api/users/me")]);

      toast.success(data.message || "Confirmation submitted");
      if (data.paymentStatus === "paid") {
        router.refresh();
      }

      return data;
    } catch (error) {
      console.error("Error confirming payment:", error);
      toast.error(
        error instanceof Error ? error.message : "Failed to confirm payment"
      );
      throw error;
    }
  };

  return { confirmPayment, isConfirming: false };
};
