// /lib/subscription/markPendingPayment.ts
import { PendingPayment } from "@/models/pendingPayment";

export async function markPendingPayment(
  checkoutId: string,
  status: "success" | "failed"
) {
  await PendingPayment.findOneAndUpdate(
    { checkoutRequestId: checkoutId },
    { status }
  );
}
