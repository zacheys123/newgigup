// app/api/subscription/route.ts
import { NextRequest, NextResponse } from "next/server";
import connectDb from "@/lib/connectDb";
import User from "@/models/user";

export async function GET(request: NextRequest) {
  try {
    await connectDb();

    const { searchParams } = new URL(request.url);
    const clerkId = searchParams.get("clerkId");

    console.log(clerkId);
    if (!clerkId) {
      return NextResponse.json({ error: "User ID required" }, { status: 400 });
    }

    const userdata = await User.findOne({ clerkId: clerkId });
    console.log("tier", userdata);
    if (!userdata) {
      return NextResponse.json(
        { error: "Userdata not found" },
        { status: 404 }
      );
    }
    console.log("tier", userdata);
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
        totalSpent: userdata.totalSpent,
        userearnings: userdata.earnings,
      },
      subscription: {
        tier: userdata.tier,
        nextBillingDate: userdata.nextBillingDate,
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

export async function PUT(request: NextRequest) {
  try {
    await connectDb();

    const { clerkId, tier } = await request.json();
    console.log("clerkId", clerkId);
    console.log("tier", tier);
    if (!clerkId || !tier) {
      return NextResponse.json(
        { error: "User ID and tier are required" },
        { status: 400 }
      );
    }

    const updateData: { tier: string; nextBillingDate: Date | null } = {
      tier,
      nextBillingDate: null,
    };

    if (tier === "pro") {
      const nextBillingDate = new Date();
      nextBillingDate.setMonth(nextBillingDate.getMonth() + 1);
      updateData.nextBillingDate = nextBillingDate;
    } else {
      updateData.nextBillingDate = null;
    }

    const user = await User.findOneAndUpdate({ clerkId }, updateData, {
      new: true,
    }).select(["tier", "nextBillingDate"]);

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    return NextResponse.json({
      tier: user.tier,
      nextBillingDate: user.nextBillingDate,
      isPro:
        user.tier === "pro" &&
        (!user.nextBillingDate || new Date(user.nextBillingDate) > new Date()),
    });
  } catch (error) {
    console.error("Failed to update subscription:", error);
    return NextResponse.json(
      { error: "Failed to update subscription" },
      { status: 500 }
    );
  }
}
