// app/api/gigs/remove-musician/[gigId]/route.ts
import { NextRequest, NextResponse } from "next/server";
import connectDb from "@/lib/connectDb";
import Gigs from "@/models/gigs";
import { Types } from "mongoose";
import { getAuth } from "@clerk/nextjs/server";

export async function DELETE(request: NextRequest) {
  const gigId = request.nextUrl.pathname.split("/").pop(); // Extract the `id` from the URL path
  const { userId } = getAuth(request);
  const { musicianId, reason } = await request.json();
  console.log(musicianId);
  if (!userId) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  if (
    !Types.ObjectId.isValid(gigId || "") ||
    !Types.ObjectId.isValid(musicianId)
  ) {
    return NextResponse.json({ message: "Invalid ID format" }, { status: 400 });
  }
  if (!reason) {
    return NextResponse.json(
      { message: "A reason is Required" },
      { status: 400 }
    );
  } else {
    const cancellationDate = new Date();
    try {
      await connectDb();
      // Update the gig - remove musician and add cancellation reason
      const updatedGig = await Gigs.findByIdAndUpdate(
        gigId,
        {
          $pull: { bookCount: musicianId },
          $set: {
            cancellationReason: reason,
          },
          $push: {
            bookingHistory: {
              userId: musicianId,
              status: "cancelled",
              date: cancellationDate,
              role: "musician",
              cancellationReason: reason,
            },
          },
        },
        { new: true }
      );

      if (!updatedGig) {
        return NextResponse.json({ message: "Gig not found" }, { status: 404 });
      }

      return NextResponse.json({
        message: "Musician removed successfully",
        gig: updatedGig,
      });
    } catch (error) {
      console.error("Error removing musician:", error);
      return NextResponse.json(
        {
          message: "Error removing musician",
          error: error instanceof Error ? error.message : "Unknown error",
        },
        { status: 500 }
      );
    }
  }
}
