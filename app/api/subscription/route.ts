import { NextRequest, NextResponse } from "next/server";
import User from "@/models/user";
import { getAuth } from "@clerk/nextjs/server";

// GET: Check subscription status
export async function GET(req: NextRequest) {
  try {
    const { userId } = getAuth(req);
    if (!userId) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }
    if (!userId) {
      return NextResponse.json(
        { isPro: false, nextBillingDate: null },
        { status: 400 }
      );
    }

    const user = await User.findOne({ clerkId: userId }).select([
      "tier",
      "nextBillingDate",
    ]);

    if (!user) {
      return NextResponse.json({ isPro: false, nextBillingDate: null });
    }

    return NextResponse.json({
      isPro:
        user.tier === "pro" &&
        (!user.nextBillingDate || user.nextBillingDate > new Date()),
      nextBillingDate: user.nextBillingDate || null,
    });
  } catch (error) {
    console.error("Subscription check failed:", error);
    return NextResponse.json(
      { isPro: false, nextBillingDate: null },
      { status: 500 }
    );
  }
}

// POST: Update subscription status (used for Clerk webhook)
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { userId, status, nextBillingDate } = body;

    if (!userId || !status) {
      return NextResponse.json(
        { message: "Invalid request data" },
        { status: 400 }
      );
    }

    await User.findOneAndUpdate(
      { clerkId: userId },
      {
        tier: status === "active" ? "pro" : "free",
        nextBillingDate: nextBillingDate || null,
      },
      { upsert: true }
    );

    return NextResponse.json({ message: "Subscription updated" });
  } catch (error) {
    console.error("Subscription update failed:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}
