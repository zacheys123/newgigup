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

    // Basic validation
    if (!clerkId || !tier) {
      return NextResponse.json(
        { error: "User ID and tier are required" },
        { status: 400 }
      );
    }

    // Validate phone number for pro tier
    if (tier === "pro") {
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
    }

    const subscriber = await User.findOne({ clerkId });
    if (!subscriber) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Free tier - update immediately
    if (tier === "free") {
      const updateData = {
        tier,
        nextBillingDate: null,
      };

      const user = await User.findOneAndUpdate({ clerkId }, updateData, {
        new: true,
      }).select(["tier", "nextBillingDate"]);

      if (!user) {
        return NextResponse.json(
          { error: "User not found or update failed" },
          { status: 404 }
        );
      }

      return NextResponse.json({
        tier: user.tier,
        nextBillingDate: user.nextBillingDate,
        isPro: false,
      });
    }

    // Pro tier - handle payment first
    if (tier === "pro") {
      if (!phoneNumber) {
        return NextResponse.json(
          { error: "Phone number is required for Pro subscription" },
          { status: 400 }
        );
      }

      // 1. Attempt STK push FIRST (no DB update yet)
      try {
        const amount = subscriber?.isClient ? "2" : "1";
        const accountReference = `sub_${clerkId}`;
        const description = "Pro subscription";

        const stkResponse = await mpesaService.initiateSTKPush(
          phoneNumber,
          amount,
          accountReference,
          description
        );

        if (!stkResponse.CheckoutRequestID) {
          throw new Error("M-Pesa did not return a CheckoutRequestID");
        }

        // 2. Return checkoutRequestId (but DO NOT update user yet)
        return NextResponse.json({
          checkoutRequestId: stkResponse.CheckoutRequestID,
          message: "Payment initiated - awaiting confirmation",
        });
      } catch (error) {
        console.error("STK Push failed:", error);
        return NextResponse.json(
          { error: "Failed to initiate payment. Please try again." },
          { status: 500 }
        );
      }
    }

    return NextResponse.json(
      { error: "Invalid tier specified" },
      { status: 400 }
    );
  } catch (error) {
    console.error("Failed to update subscription:", error);
    return NextResponse.json(
      { error: "Failed to process subscription" },
      { status: 500 }
    );
  }
}
