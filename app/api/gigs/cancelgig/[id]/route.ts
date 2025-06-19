import connectDb from "@/lib/connectDb";
import Gigs from "@/models/gigs";
import User from "@/models/user";
import { getAuth } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";

export async function PUT(req: NextRequest) {
  const id = req.nextUrl.pathname.split("/").pop();
  const { userId } = getAuth(req);
  const { musicianId, dep, reason } = await req.json();

  if (!userId) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  try {
    await connectDb();
    const gig = await Gigs.findOne({ _id: id }).populate({
      path: "postedBy bookedBy",
      model: User,
    });

    if (!gig) {
      return NextResponse.json({ message: "Gig not found" }, { status: 404 });
    }

    // Update gig status
    const updateData = {
      $set: {
        isTaken: false,
        bookedBy: null,
        cancellationReason: reason,
      },
      $pull: { bookCount: musicianId },
    };

    // Update musician's stats if musician is canceling
    if (dep === "musician" && musicianId) {
      const musician = await User.findById(musicianId);
      if (!musician) {
        return NextResponse.json(
          { message: "Musician not found" },
          { status: 404 }
        );
      }

      const currentCount = musician.gigsBookedThisWeek?.count || 0;
      const updatedCount = Math.max(0, currentCount - 1);

      await musician.updateOne({
        $set: {
          gigsBookedThisWeek: {
            count: updatedCount,
            weekStart: musician.gigsBookedThisWeek?.weekStart || new Date(),
          },
          lastBookingDate: new Date(),
        },
        $inc: { cancelgigCount: 1 },
      });
    }

    // Update client's stats if client is canceling
    if (dep === "client" && gig.postedBy) {
      await User.findByIdAndUpdate(gig.postedBy._id, {
        $inc: { clientCancellations: 1 },
      });
    }

    await Gigs.updateOne({ _id: id }, updateData);

    return NextResponse.json({ message: "Canceled gig successfully" });
  } catch (error) {
    console.error("Error canceling gig:", error);
    return NextResponse.json(
      { message: "Error canceling gig" },
      { status: 500 }
    );
  }
}
