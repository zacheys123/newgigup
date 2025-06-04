// /app/api/mpesa/callback/route.ts
import { NextRequest, NextResponse } from "next/server";
import connectDb from "@/lib/connectDb";
import { PendingPayment } from "@/models/pendingPayment";
import { updateUserToPro } from "@/lib/subscription/updateUsertoPro";
import { markPendingPayment } from "@/lib/subscription/markPendingPayments";

export const dynamic = "force-dynamic";

export async function POST(request: NextRequest) {
  try {
    await connectDb();
    const data = await request.json();
    const callback = data.Body?.stkCallback;

    if (!callback || !callback.CheckoutRequestID) {
      return NextResponse.json(
        { message: "Invalid callback" },
        { status: 400 }
      );
    }

    const checkoutId = callback.CheckoutRequestID;

    const payment = await PendingPayment.findOne({
      checkoutRequestId: checkoutId,
    });
    if (!payment) {
      return NextResponse.json(
        { message: "Unknown transaction" },
        { status: 404 }
      );
    }

    if (callback.ResultCode === 0) {
      try {
        // Upgrade user first
        await updateUserToPro(payment.clerkId);

        // Only mark payment successful if upgrade succeeded
        await markPendingPayment(checkoutId, "success");
        return NextResponse.json({
          message: "Callback processed successfully",
        });
      } catch (upgradeError) {
        console.error("Error upgrading user to Pro:", upgradeError);
        await markPendingPayment(checkoutId, "failed"); // Mark payment as error (not failed)
        return NextResponse.json(
          { message: "User upgrade failed" },
          { status: 500 }
        );
      }
    } else {
      await markPendingPayment(checkoutId, "failed");
      return NextResponse.json({ message: "Payment failed" });
    }
  } catch (error) {
    console.error("Callback error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
