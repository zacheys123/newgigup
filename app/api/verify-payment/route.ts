import { NextRequest, NextResponse } from "next/server";
import { mpesaService } from "@/services/mpesa.service";
import connectDb from "@/lib/connectDb";

import { PendingPayment } from "@/models/pendingPayment";
// import { sendConfirmationEmail } from "@/lib/subscription/sendConfirmationEmail";

// In your verification endpoint
// In your verification endpoint (/api/verify-payment)
export async function POST(req: NextRequest) {
  const { checkoutRequestId, attempt = 1 } = await req.json(); // 👈 Add attempt with default 1

  try {
    await connectDb();

    // Check if payment is already successful
    const pendingPayment = await PendingPayment.findOne({ checkoutRequestId });
    if (pendingPayment?.status === "success") {
      return NextResponse.json({ success: true });
    }

    const verification = await mpesaService.verifyTransaction(
      checkoutRequestId
    );

    if (verification.success) {
      // Update user and payment status

      await PendingPayment.updateOne(
        { checkoutRequestId },
        { status: "success" }
      );
      return NextResponse.json({ success: true });
    }

    // Handle timeout specifically
    if (
      verification.data?.ResultCode === "1032" ||
      verification.data?.ResultCode === "17" ||
      verification.data?.ResultDesc?.toLowerCase().includes("timeout")
    ) {
      return NextResponse.json({
        success: false,
        retry: attempt < 10, // 👈 Only retry if under 10 attempts
        shouldCancel: attempt >= 10, // 👈 Cancel after 10 attempts
        message: `Payment verification timed out (attempt ${attempt}/10)`,
      });
    }

    // For other errors, mark as failed
    await PendingPayment.updateOne(
      { checkoutRequestId },
      { status: "failed", error: verification.message }
    );

    return NextResponse.json({
      success: false,
      errorCode: verification.data?.ResultCode || "UNKNOWN",
      errorMessage: verification.message || "Payment verification failed",
      shouldCancel: true, // 👈 Don't retry on other errors
    });
  } catch (error: unknown) {
    console.error("Verification error:", error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Verification failed",
        shouldCancel: true,
      },
      { status: 500 }
    );
  }
}
