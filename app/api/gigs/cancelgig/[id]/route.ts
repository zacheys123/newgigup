import connectDb from "@/lib/connectDb";
import Gigs from "@/models/gigs";
import User from "@/models/user";
import { getAuth } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";

export async function PUT(req: NextRequest) {
  const id = req.nextUrl.pathname.split("/").pop(); // Extract the `id` from the URL path
  const { userId } = getAuth(req);
  const { musicianId } = await req.json();

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

    const user = await User.findById(musicianId);
    if (!user) {
      return NextResponse.json(
        { message: "Musician not found" },
        { status: 404 }
      );
    }

    // Get the current count before updating
    const currentCount = user.gigsBookedThisWeek?.count || 0;
    const updatedCount = Math.max(0, currentCount - 1); // Ensure count doesn't go below 0
    const currentWeekStart = user.gigsBookedThisWeek?.weekStart || new Date();

    await gig.updateOne({
      $set: {
        isTaken: false,
        bookedBy: null,
      },
      $pull: { bookCount: musicianId },
    });

    await user.updateOne({
      $pull: { refferences: gig.postedBy?._id },
      $set: {
        gigsBookedThisWeek: {
          count: updatedCount,
          weekStart: currentWeekStart,
        },
        lastBookingDate: new Date(),
      },
    });

    return NextResponse.json({ message: "Canceled gig successfully" });
  } catch (error) {
    console.error("Error canceling gig:", error);
    return NextResponse.json(
      { message: "Error canceling gig" },
      { status: 500 }
    );
  }
}
