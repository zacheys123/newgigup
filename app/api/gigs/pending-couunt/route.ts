// src/app/api/gigs/pending-count/route.ts
import { NextResponse } from "next/server";
import connectDb from "@/lib/connectDb";
import Gigs from "@/models/gigs";
import User from "@/models/user";
import { UserProps } from "@/types/userinterfaces";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const userId = searchParams.get("userId");

  if (!userId) {
    return NextResponse.json(
      { success: false, message: "User ID is required" },
      { status: 400 }
    );
  }

  try {
    await connectDb();

    console.log(`Fetching pending gigs count for user: ${userId}`);

    // const count = await Gigs.countDocuments({
    //   "bookCount.clerkId": userId, // Correct for UserProps array
    //   isTaken: false,
    //   isPending: false,
    // });
    const gigs = await Gigs.find().populate({ path: "bookCount", model: User });
    const count = gigs.filter((gig) =>
      gig?.bookCount.some(
        (bookedUser: UserProps) => bookedUser?.clerkId === userId
      )
    )?.length;

    console.log(`Found ${count} pending gigs for user ${userId}`);

    return NextResponse.json({
      success: true,
      count,
    });
  } catch (error) {
    console.error("Error fetching pending gigs count:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Failed to fetch pending gigs count",
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
