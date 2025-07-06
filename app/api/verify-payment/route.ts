import { NextRequest, NextResponse } from "next/server";
import { mpesaService } from "@/services/mpesa.service";
import connectDb from "@/lib/connectDb";

import { PendingPayment } from "@/models/pendingPayment";
import User from "@/models/user";
// import { sendConfirmationEmail } from "@/lib/subscription/sendConfirmationEmail";
interface UserUpdateData {
  tier: string;
  nextBillingDate: Date;
  renewalAttempts: number;
  mpesaPhoneNumber?: string; // Optional property
}
export async function POST(req: NextRequest) {
  const { checkoutRequestId, attempt = 1 } = await req.json(); // 👈 Add attempt with default 1

  try {
    await connectDb();
    console.log("the checkout iD is", checkoutRequestId);
    // Check if payment is already successful
    const pendingPayment = await PendingPayment.findOne({ checkoutRequestId });
    if (pendingPayment?.status === "success") {
      return NextResponse.json({ success: true });
    }

    const verification = await mpesaService.verifyTransaction(
      checkoutRequestId
    );

    if (verification.success && pendingPayment && checkoutRequestId) {
      // Create base update object
      const updateData: UserUpdateData = {
        tier: "pro",
        nextBillingDate: new Date(
          new Date().setMonth(new Date().getMonth() + 1)
        ),
        renewalAttempts: 0,
      };

      // Conditionally add phone number for new subscriptions
      if (!pendingPayment.isRenewal) {
        updateData.mpesaPhoneNumber = pendingPayment.phoneNumber;
      }

      const updatedUser = await User.findOneAndUpdate(
        { clerkId: pendingPayment.clerkId },
        updateData, // Pass the dynamic object
        { new: true }
      );

      if (!updatedUser) {
        throw new Error("User not found");
      }

      await PendingPayment.updateOne(
        { checkoutRequestId },
        { status: "success" }
      );

      return NextResponse.json({
        success: true,
        user: {
          tier: updatedUser.tier,
          nextBillingDate: updatedUser.nextBillingDate,
          isPro: true,
        },
      });
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
