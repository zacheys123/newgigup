import { NextRequest, NextResponse } from "next/server";
import User from "@/models/user";
import { getAuth } from "@clerk/nextjs/server";
import connectDb from "@/lib/connectDb";

// GET: Check subscription status

export async function GET(req: NextRequest) {
  try {
    await connectDb();

    const { searchParams } = new URL(req.url);
    const userId = searchParams.get("userId") || getAuth(req).userId;

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Fetch user and subscription data in parallel
    const [user, subscription] = await Promise.all([
      User.findOne({ clerkId: userId }),
      User.findOne({ clerkId: userId }).select(["tier", "nextBillingDate"]),
    ]);

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const responseData = {
      user: {
        isClient: user.isClient,
        isMusician: user.isMusician,
        firstLogin: user.firstLogin,
        clerkId: user.clerkId,
      },
      subscription: {
        isPro:
          subscription?.tier === "pro" &&
          (!subscription?.nextBillingDate ||
            new Date(subscription.nextBillingDate) > new Date()),
        nextBillingDate: subscription?.nextBillingDate || null,
      },
    };

    return NextResponse.json(responseData);
  } catch (error) {
    console.error("Dashboard API error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
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
