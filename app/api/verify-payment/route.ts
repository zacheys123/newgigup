import User from "@/models/user";
import { mpesaService } from "@/services/mpesa.service";
import { getAuth } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";

import emailjs from "@emailjs/nodejs"; // For backend usage
// OR (if using frontend):
// import emailjs from '@emailjs/browser';

export async function POST(req: NextRequest) {
  const { checkoutRequestId } = await req.json();

  try {
    const verification = await mpesaService.verifyTransaction(
      checkoutRequestId
    );
    console.log("Verification Result:", verification); // Debug log
    if (verification.ResultCode === "0") {
      // Payment successful
      const { userId: clerkId } = getAuth(req); // Get user ID
      const user = await User.findOne({ clerkId }).select("email"); // Fetch user email

      if (!user) {
        throw new Error("User not found");
      }

      // 1. Update database
      const nextBillingDate = new Date();
      nextBillingDate.setMonth(nextBillingDate.getMonth() + 1);

      await User.findOneAndUpdate(
        { clerkId },
        { tier: "pro", tierStatus: "active", nextBillingDate }
      );

      // 2. Send confirmation email
      const emailParams = {
        to_email: user.email, // User's email from DB
        to_name: user.username || "Customer",
        from_name: "GiguP",
        message: `Your Pro subscription is active! Next billing date: ${nextBillingDate.toDateString()}`,
      };

      await emailjs.send(
        process.env.EMAILJS_SERVICE_ID!, // From EmailJS dashboard
        process.env.EMAILJS_TEMPLATE_ID!, // Your template ID
        emailParams,
        {
          publicKey: process.env.EMAILJS_PUBLIC_KEY!,
          privateKey: process.env.EMAILJS_PRIVATE_KEY!, // Only for Node.js
        }
      );

      return NextResponse.json({ success: true });
    } else if (verification.ResultCode === "1032") {
      // Pending
      return NextResponse.json({ success: false, retry: true });
    } else {
      return NextResponse.json({
        success: false,
        errorCode: verification.ResultCode,
        errorMessage: verification.ResultDesc || "Payment failed",
      });
    }
  } catch (error: unknown) {
    console.error("Full verification error:", error);

    const errorMessage =
      error instanceof Error ? error.message : "Payment verification failed";

    return NextResponse.json(
      {
        success: false,
        error: errorMessage,
        stack:
          process.env.NODE_ENV === "development" && error instanceof Error
            ? error.stack
            : undefined,
      },
      { status: 500 }
    );
  }
}
