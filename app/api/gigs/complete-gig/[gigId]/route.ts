import connectDb from "@/lib/connectDb";
import Gig from "@/models/gigs";
import User from "@/models/user";
import { getAuth } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";
type UpdateData = {
  $push: {
    bookingHistory: {
      gigId: string;
      status: string;
      date: Date;
      role: "musician" | "client";
      notes: string;
    };
  };
  $inc?: {
    completedGigsCount?: number;
    earnings?: number;
    totalSpent?: number;
  };
};
export async function POST(req: NextRequest) {
  const gigId = req.nextUrl.pathname.split("/").pop();
  const { userId } = getAuth(req);
  const { role, notes, code } = await req.json();

  console.log("role", role);
  console.log("code", code);
  console.log("Gigid", gigId);
  console.log("notes", notes);

  if (!userId) {
    return NextResponse.json(
      { error: "UserId required data" },
      { status: 400 }
    );
  }

  if (!gigId || Array.isArray(gigId)) {
    return NextResponse.json({ error: "Invalid gig ID." }, { status: 400 });
  }

  if (!gigId) {
    return NextResponse.json(
      { error: "GigId is  required data" },
      { status: 400 }
    );
  }
  if (!role) {
    return NextResponse.json(
      { error: "Role is required data" },
      { status: 400 }
    );
  }
  if (!code && gigId && role) {
    return NextResponse.json(
      { error: "CPayment Code is required data" },
      { status: 400 }
    );
  }

  try {
    await connectDb();

    const gig = await Gig.findById(gigId).populate("postedBy bookedBy");
    if (!gig || !gig.isTaken) {
      return NextResponse.json(
        { error: "Gig not found or not booked" },
        { status: 404 }
      );
    }

    const isMusician = gig.bookedBy?.clerkId === userId;
    const isClient = gig.postedBy?.clerkId === userId;

    if (
      (role === "musician" && !isMusician) ||
      (role === "client" && !isClient)
    ) {
      return NextResponse.json(
        { error: "Unauthorized to confirm payment" },
        { status: 403 }
      );
    }

    // Capture code from the caller (musician or client) but do not write to DB yet
    // Capture incoming code from the current caller
    const incomingCode = code;

    // Determine if this is musician or client and update the relevant field
    if (role === "musician") {
      gig.musicianConfirmPayment = {
        gigId: gig._id,
        confirmPayment: true,
        confirmedAt: new Date(),
        code: incomingCode,
      };
    } else {
      gig.clientConfirmPayment = {
        gigId: gig._id,
        confirmPayment: true,
        confirmedAt: new Date(),
        code: incomingCode,
      };
    }

    // Check if BOTH have confirmed AND codes match
    const bothConfirmed =
      gig.musicianConfirmPayment?.confirmPayment &&
      gig.clientConfirmPayment?.confirmPayment;

    const codesMatch =
      gig.musicianConfirmPayment?.code &&
      gig.clientConfirmPayment?.code &&
      gig.musicianConfirmPayment.code === gig.clientConfirmPayment.code;

    if (!bothConfirmed || !codesMatch) {
      await gig.save();

      return NextResponse.json({
        success: true,
        paymentStatus: "pending",
        message:
          role === "musician"
            ? "Code received. Awaiting client to confirm with the same code."
            : "Code received. Awaiting musician to confirm with the same code.",
      });
    }

    await gig.save();

    return NextResponse.json({
      success: true,
      paymentStatus: "pending",
      message:
        role === "musician"
          ? "Code received. Awaiting client to confirm with same code."
          : "Code received. Awaiting musician to confirm with same code.",
    });

    // If codes match, proceed to finalize everything
    const session = await Gig.startSession();
    session.startTransaction();

    try {
      gig.paymentStatus = "paid";
      gig.completedAt = new Date();

      gig.musicianConfirmPayment = {
        gigId: gig._id,
        confirmPayment: true,
        confirmedAt: new Date(),
        code,
      };

      gig.clientConfirmPayment = {
        gigId: gig._id,
        confirmPayment: true,
        confirmedAt: new Date(),
        code,
      };

      gig.bookingHistory.push({
        userId: role === "musician" ? gig.bookedBy._id : gig.postedBy._id,
        status: "completed",
        date: new Date(),
        role,
        notes: notes || `${role} confirmed payment`,
      });

      await gig.save({ session });

      const userToUpdate =
        role === "musician" ? gig.bookedBy._id : gig.postedBy._id;

      const userHistoryEntry = {
        gigId: gig._id,
        status: "completed",
        date: new Date(),
        role,
        notes: "Payment fully confirmed",
      };

      const updateData: UpdateData = {
        $push: { bookingHistory: userHistoryEntry },
        $inc: { completedGigsCount: 1 },
      };

      // Add dynamic field based on role
      if (role === "musician") {
        updateData.$inc!.earnings = gig.price;
      } else {
        updateData.$inc!.totalSpent = gig.price;
      }

      await User.findByIdAndUpdate(userToUpdate, updateData, { session });

      await session.commitTransaction();

      return NextResponse.json({
        success: true,
        paymentStatus: "paid",
        message: "✅ Payment successfully confirmed by both parties.",
      });
    } catch (err) {
      await session.abortTransaction();
      console.error("Transaction error:", err);
      return NextResponse.json(
        { error: "Failed to finalize payment." },
        { status: 500 }
      );
    } finally {
      session.endSession();
    }
  } catch (error) {
    console.error("Error confirming gig:", error);
    return NextResponse.json(
      {
        error:
          error instanceof Error ? error.message : "Unknown error occurred",
      },
      { status: 500 }
    );
  }
}
