// app/api/subscription/route.ts
import { NextRequest, NextResponse } from "next/server";
import connectDb from "@/lib/connectDb";
import User from "@/models/user";

export async function GET(request: NextRequest) {
  try {
    await connectDb();

    const { searchParams } = new URL(request.url);
    const clerkId = searchParams.get("clerkId");

    if (!clerkId) {
      return NextResponse.json({ error: "User ID required" }, { status: 400 });
    }

    const userdata = await User.findOne({ clerkId: clerkId });
    if (!userdata) {
      return NextResponse.json(
        { error: "Userdata not found" },
        { status: 404 }
      );
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

        gigsBookedThisWeek: userdata?.gigsBookedThisWeek, // Track weekly bookings
        totalSpent: userdata.totalSpent,
        userearnings: userdata.earnings,
        createdAt: userdata?.createdAt,
      },
      subscription: {
        tier: userdata.tier,
        nextBillingDate: userdata.nextBillingDate,
        lastBookingDate: userdata?.lastBookingDate, // To track weekly reset

        isPro:
          userdata.tier === "pro" &&
          (!userdata.nextBillingDate ||
            new Date(userdata.nextBillingDate) > new Date()),
      },
    });
  } catch (error) {
    console.error("Failed to fetch subscription:", error);
    return NextResponse.json(
      { error: "Failed to fetch subscription" },
      { status: 500 }
    );
  }
}

import { mpesaService } from "@/services/mpesa.service";
import { getAuth } from "@clerk/nextjs/server";

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
    console.log(tier, phoneNumber);
    // For free tier, process immediately
    if (tier === "free") {
      const updateData = {
        tier,
        nextBillingDate: null,
      };

      const user = await User.findOneAndUpdate({ clerkId }, updateData, {
        new: true,
      }).select(["tier", "nextBillingDate"]);

      if (!user) {
        return NextResponse.json({ error: "User not found" }, { status: 404 });
      }

      return NextResponse.json({
        tier: user.tier,
        nextBillingDate: user.nextBillingDate,
        isPro: false, // Immediately reflect free tier
      });
    }
    const subscriber = await User.findOne({ clerkId });
    // For pro tier, initiate M-Pesa payment
    // For pro tier, initiate M-Pesa payment
    if (tier === "pro") {
      if (!phoneNumber) {
        return NextResponse.json(
          { error: "Phone number is required for Pro subscription" },
          { status: 400 }
        );
      }

      // First update the user with pending status
      const nextBillingDate = new Date();
      nextBillingDate.setMonth(nextBillingDate.getMonth() + 1);

      const updateData = {
        tier: "pro",
        tierStatus: "pending", // Add this field to track payment status
        nextBillingDate,
      };

      await User.findOneAndUpdate({ clerkId }, updateData);

      // Then initiate payment
      const amount = subscriber?.isClient ? "2" : "1";
      const accountReference = `sub_${clerkId}`;
      const description = "Pro subscription";

      const stkResponse = await mpesaService.initiateSTKPush(
        phoneNumber,
        amount,
        accountReference,
        description
      );

      return NextResponse.json({
        tier: "pro",
        nextBillingDate,
        isPro: false, // Set to false until payment confirmed
        paymentInitiated: true,
        checkoutRequestId: stkResponse.CheckoutRequestID,
        message: "Payment initiated - subscription will be confirmed shortly",
      });
    }

    return NextResponse.json(
      { error: "Invalid tier specified" },
      { status: 400 }
    );
  } catch (error) {
    console.error("Failed to update subscription:", error);
    return NextResponse.json(
      { error: "Failed to update subscription" },
      { status: 500 }
    );
  }
}
