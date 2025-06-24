// app/api/admin/reset-gigs-and-users/route.ts
import { NextRequest, NextResponse } from "next/server";
import { getAuth } from "@clerk/nextjs/server";
import connectDb from "@/lib/connectDb";
import Gig from "@/models/gigs";
import User from "@/models/user";

export async function POST(req: NextRequest) {
  const { userId: clerkId } = getAuth(req);

  // Optional: restrict to admin Clerk ID
  try {
    await connectDb();

    const currentuser = await User.findOne({ clerkId });
    if (!currentuser?.isAdmin) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    // Reset gigs
    await Gig.updateMany(
      {},
      {
        $set: {
          isTaken: false,
          bookedBy: null,
          bookingHistory: [],
          bookCount: [],
        },
      }
    );
    // Reset user refferences
    await User.updateMany(
      {},
      {
        $set: {
          bookingHistory: [],
          refference: [],
          allreviews: [],
          myreviews: [],
        },
      }
    );
    return NextResponse.json({
      success: true,
      message: "All gigs and users reset successfully.",
    });
  } catch (error) {
    console.error("Reset error:", error);
    return NextResponse.json(
      { error: "Failed to reset data." },
      { status: 500 }
    );
  }
}
