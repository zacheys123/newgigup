// app/api/admin/reset-gigs-and-users/route.ts
import { NextRequest, NextResponse } from "next/server";
import { getAuth } from "@clerk/nextjs/server";
import connectDb from "@/lib/connectDb";
import Gig from "@/models/gigs";
import User from "@/models/user";
import { isAdmin } from "@/lib/actions/isAdmin";

export async function POST(req: NextRequest) {
  const { userId: clerkId } = getAuth(req);

  try {
    await connectDb();
    await isAdmin(clerkId || "");
    // Optional: restrict to admin Clerk ID
    if (!isAdmin) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Reset gigs - including proper reset of payment confirmations
    await Gig.updateMany(
      {},
      {
        $set: {
          isTaken: false,
          bookedBy: null,
          bookingHistory: [],
          bookCount: [],
          musicianConfirmPayment: {
            gigId: null,
            confirmPayment: false,
            confirmedAt: null,
            code: null,
            temporaryConfirm: false,
          },
          clientConfirmPayment: {
            gigId: null,
            confirmPayment: false,
            confirmedAt: null,
            code: null,
            temporaryConfirm: false,
          },
          paymentStatus: "pending",
          cancellationReason: null,
          completedAt: null,
          viewCount: [],
          gigRating: 0,
        },
      }
    );

    // Reset user references
    await User.updateMany(
      {},
      {
        $set: {
          bookingHistory: [],
          refference: [], // Note: Typo here - should be "reference" if that's your actual field name
          allreviews: [],
          myreviews: [],
          cancelgigCount: 0,
          completedGigsCount: 0,
          // Reset weekly booking counts if needed
          gigsBookedThisWeek: {
            count: 0,
            weekStart: null,
          },
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
