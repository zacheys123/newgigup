// app/api/mpesa/webhook/route.ts
import { NextRequest, NextResponse } from "next/server";
import connectDb from "@/lib/connectDb";
import User from "@/models/user";

export async function POST(request: NextRequest) {
  try {
    await connectDb();
    const data = await request.json();

    // Verify payment was successful
    if (data.ResultCode === 0) {
      const accountReference = data.MerchantRequestID || data.CheckoutRequestID;
      const clerkId = accountReference.replace("sub_", "");

      // Update user to active status
      const nextBillingDate = new Date();
      nextBillingDate.setMonth(nextBillingDate.getMonth() + 1);

      await User.findOneAndUpdate(
        { clerkId },
        {
          tier: "pro",
          tierStatus: "active",
          nextBillingDate,
          isPro: true,
        }
      );

      // Optionally: Send email notification or trigger other actions
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Webhook error:", error);
    return NextResponse.json(
      { error: "Webhook processing failed" },
      { status: 500 }
    );
  }
}
