// Add this new endpoint in your route file
import connectDb from "@/lib/connectDb";
import Gig from "@/models/gigs";
import User from "@/models/user";
import { getAuth } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";

export async function PATCH(req: NextRequest) {
  const id = req.nextUrl.pathname.split("/").pop();
  const { userId } = getAuth(req);
  const { paymentStatus } = await req.json();

  if (!userId) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  try {
    await connectDb();

    // 1. Verify gig exists and is booked
    const gig = await Gig.findById(id);
    if (!gig || !gig.isTaken) {
      return NextResponse.json({ error: "Gig not booked" }, { status: 400 });
    }

    // 2. Verify requestor is gig owner
    if (gig.bookedBy.toString() !== userId) {
      return NextResponse.json({ error: "Not authorized" }, { status: 403 });
    }

    // 3. Prepare updates
    const gigUpdates = {
      completedAt: new Date(),
      paymentStatus: paymentStatus || "paid",
      $push: {
        bookingHistory: {
          userId: gig.postedBy,
          status: "completed",
          date: new Date(),
          role: "client",
          notes: "completed",
        },
      },
    };

    const userUpdates = {
      $push: {
        bookingHistory: {
          gigId: id,
          status: "completed",
          date: new Date(),
          role: "client",
          notes: `Payment: ${paymentStatus}`,
        },
      },
    };

    // 4. Execute updates
    await Promise.all([
      Gig.findByIdAndUpdate(id, gigUpdates),
      User.findByIdAndUpdate(gig.postedBy, userUpdates),
    ]);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? "Completion failed: " + error.message
            : undefined,
      },
      { status: 500 }
    );
  }
}
