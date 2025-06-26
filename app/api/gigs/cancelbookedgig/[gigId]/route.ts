// app/api/gigs/remove-musician/[gigId]/route.ts
import { NextRequest, NextResponse } from "next/server";
import connectDb from "@/lib/connectDb";
import Gigs from "@/models/gigs";
import User from "@/models/user";
import { Types } from "mongoose";
import { getAuth } from "@clerk/nextjs/server";

export async function PUT(request: NextRequest) {
  const gigId = request.nextUrl.pathname.split("/").pop();
  const { userId } = getAuth(request);
  const { musicianId, reason, cancelerRole } = await request.json();

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
      { message: "A reason is required" },
      { status: 400 }
    );
  }

  try {
    await connectDb();

    const session = await Gigs.startSession();
    session.startTransaction();

    try {
      // 1. Update gig
      const updatedGig = await Gigs.findByIdAndUpdate(
        gigId,
        {
          $pull: { bookCount: musicianId },
          $set: {
            isTaken: false,
            bookedBy: null,
            cancellationReason: reason,
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
          },
          $push: {
            bookingHistory: {
              userId: musicianId,
              status: "cancelled",
              date: new Date(),
              role: cancelerRole,
              notes: reason,
            },
          },
        },
        { new: true, session }
      ).populate("postedBy bookedBy");

      if (!updatedGig) {
        throw new Error("Gig not found");
      }

      // 2. Always update musician stats
      const musician = await User.findById(musicianId).session(session);
      if (!musician) {
        throw new Error("Musician not found");
      }

      const currentCount = musician.gigsBookedThisWeek?.count ?? 0;
      const updatedCount = Math.max(0, currentCount - 1);

      await User.findByIdAndUpdate(
        musicianId,
        {
          $inc: { cancelgigCount: 1 },
          $set: {
            "gigsBookedThisWeek.count": updatedCount,
            ...(musician.gigsBookedThisWeek?.weekStart && {
              "gigsBookedThisWeek.weekStart":
                musician.gigsBookedThisWeek.weekStart,
            }),
          },
          $push: {
            bookingHistory: {
              gigId: updatedGig._id,
              status: "cancelled",
              date: new Date(),
              role: "musician",
              notes:
                cancelerRole === "client"
                  ? `Client cancelled: ${reason}`
                  : `Musician cancelled: ${reason}`,
            },
          },
        },
        { session }
      );

      // 3. Update client if they cancelled
      if (cancelerRole === "client" && updatedGig.postedBy) {
        await User.findByIdAndUpdate(
          updatedGig.postedBy._id,
          {
            $inc: { cancelgigCount: 1 },
            $push: {
              bookingHistory: {
                gigId: updatedGig._id,
                status: "cancelled",
                date: new Date(),
                role: "client",
                notes: `Client cancelled: ${reason}`,
              },
            },
          },
          { session }
        );
      }

      // 4. If musician cancelled, log in client history
      if (cancelerRole === "musician" && updatedGig.postedBy) {
        await User.findByIdAndUpdate(
          updatedGig.postedBy._id,
          {
            $push: {
              bookingHistory: {
                gigId: updatedGig._id,
                status: "cancelled",
                date: new Date(),
                role: "client",
                notes: `Musician cancelled: ${reason}`,
              },
            },
          },
          { session }
        );
      }

      await session.commitTransaction();

      const successMessage =
        cancelerRole === "musician"
          ? "Musician removed from the gig : weekly gig count updated"
          : "Musician has been canceled Successfully";

      return NextResponse.json({
        success: true,
        message: successMessage,
        gig: updatedGig,
      });
    } catch (error) {
      await session.abortTransaction();
      throw error;
    } finally {
      session.endSession();
    }
  } catch (error) {
    console.error("Error processing cancellation:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Error processing cancellation",
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
