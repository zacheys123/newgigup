// app/api/subscription/route.ts
import { NextRequest, NextResponse } from "next/server";
import connectDb from "@/lib/connectDb";
import User from "@/models/user";
import { mpesaService } from "@/services/mpesa.service";
import { getAuth } from "@clerk/nextjs/server";
import { PendingPayment } from "@/models/pendingPayment";

export async function GET(request: NextRequest) {
  try {
    await connectDb();

    const { searchParams } = new URL(request.url);
    const clerkId = searchParams.get("clerkId");

    if (!clerkId) {
      return NextResponse.json({ error: "User ID required" }, { status: 400 });
    }

    const userdata = await User.findOne({ clerkId });
    if (!userdata) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    return NextResponse.json({
      user: {
        isClient: userdata.isClient,
        isMusician: userdata.isMusician,
        firstLogin: userdata.firstLogin,
        clerkId: userdata.clerkId,
        earnings: userdata.earnings,
        onboardingComplete: userdata.onboardingComplete,
        gigsPosted: userdata?.monthlyGigsPosted,
        gigsBooked: userdata.monthlyGigsBooked,
        gigsBookedThisWeek: userdata?.gigsBookedThisWeek,
        totalSpent: userdata.totalSpent,
        createdAt: userdata?.createdAt,
      },
      subscription: {
        tier: userdata.tier,
        nextBillingDate: userdata.nextBillingDate,
        lastBookingDate: userdata?.lastBookingDate,
        isPro:
          userdata.tier === "pro" &&
          (!userdata.nextBillingDate ||
            new Date(userdata.nextBillingDate) > new Date()),
      },
    });
  } catch (error) {
    console.error("GET /subscription failed:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  const { userId: clerkId } = getAuth(request);

  try {
    await connectDb();

    const { tier, phoneNumber } = await request.json();

    if (!clerkId || !tier) {
      return NextResponse.json(
        { error: "User ID and tier are required" },
        { status: 400 }
      );
    }

    const user = await User.findOne({ clerkId });
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    if (tier === "free") {
      const updatedUser = await User.findOneAndUpdate(
        { clerkId },
        { tier: "free", nextBillingDate: null },
        { new: true }
      ).select(["tier", "nextBillingDate"]);

      return NextResponse.json({
        tier: updatedUser?.tier,
        nextBillingDate: updatedUser?.nextBillingDate,
        isPro: false,
      });
    }

    if (tier === "pro") {
      // Validate phone number
      if (
        !phoneNumber ||
        !phoneNumber.startsWith("254") ||
        phoneNumber.length !== 12
      ) {
        return NextResponse.json(
          {
            error: "Please provide a valid Kenyan phone number (254XXXXXXXXX)",
          },
          { status: 400 }
        );
      }

      // Calculate amount
      const amount = user.isClient ? "2" : "1";
      const accountReference = `sub_${clerkId}`;
      const description = "Pro subscription";

      // Initiate STK push
      const stkResponse = await mpesaService.initiateSTKPush(
        phoneNumber,
        amount,
        accountReference,
        description
      );

      const checkoutRequestId = stkResponse?.CheckoutRequestID;
      if (!checkoutRequestId) {
        throw new Error("M-Pesa did not return a CheckoutRequestID");
      }

      // Save PendingPayment
      await PendingPayment.create({
        clerkId,
        checkoutRequestId,
        amount,
        tier,
        status: "pending",
        phoneNumber,
        username: user.username,
      });

      return NextResponse.json({
        checkoutRequestId,
        message: "Payment initiated - awaiting confirmation",
      });
    }

    return NextResponse.json(
      { error: "Invalid tier specified" },
      { status: 400 }
    );
  } catch (error) {
    console.error("POST /subscription failed:", error);
    return NextResponse.json(
      { error: "Failed to process subscription" },
      { status: 500 }
    );
  }
}
