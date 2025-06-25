import connectDb from "@/lib/connectDb";
import Gig from "@/models/gigs";
import User from "@/models/user";
import { getAuth } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";

// POST - For temporary confirmation
// POST - For temporary confirmation
export async function POST(req: NextRequest) {
  const gigId = req.nextUrl.pathname.split("/").pop();
  const { userId } = getAuth(req);
  const { role, notes, code } = await req.json();

  if (!userId) {
    return NextResponse.json(
      { error: "UserId required data" },
      { status: 400 }
    );
  }

  if (!gigId || Array.isArray(gigId)) {
    return NextResponse.json({ error: "Invalid gig ID." }, { status: 400 });
  }

  if (!role) {
    return NextResponse.json(
      { error: "Role is required data" },
      { status: 400 }
    );
  }

  if (!code) {
    return NextResponse.json(
      { error: "Payment Code is required data" },
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

    // Update temporary confirmation
    if (role === "musician") {
      gig.musicianConfirmPayment = {
        gigId: gig._id,
        temporaryConfirm: true,
        code,
        notes,
        updatedAt: new Date(),
      };
    } else {
      gig.clientConfirmPayment = {
        gigId: gig._id,
        temporaryConfirm: true,
        code,
        notes,
        updatedAt: new Date(),
      };
    }

    await gig.save();

    // Determine current confirmation state
    const musicianConfirmed = gig.musicianConfirmPayment?.temporaryConfirm;
    const clientConfirmed = gig.clientConfirmPayment?.temporaryConfirm;

    const bothConfirmed = musicianConfirmed && clientConfirmed;
    const codesMatch =
      gig.musicianConfirmPayment?.code &&
      gig.clientConfirmPayment?.code &&
      gig.musicianConfirmPayment.code === gig.clientConfirmPayment.code;

    let confirmedParty: "" | "none" | "partial" | "both" = "none";
    if (bothConfirmed && codesMatch) {
      confirmedParty = "both";
    } else if (musicianConfirmed || clientConfirmed) {
      confirmedParty = "partial";
    }

    return NextResponse.json({
      success: true,
      paymentStatus: "pending",
      confirmedParty,
      readyToFinalize: confirmedParty === "both",
      message:
        confirmedParty === "partial"
          ? "Waiting for the other party to confirm."
          : "Confirmation saved.",
    });
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

// PUT - For finalizing payment
export async function PUT(req: NextRequest) {
  const gigId = req.nextUrl.pathname.split("/").pop();
  const { userId } = getAuth(req);
  const { role, notes } = await req.json();

  if (!userId) {
    return NextResponse.json(
      { error: "UserId required data" },
      { status: 400 }
    );
  }

  if (!gigId || Array.isArray(gigId)) {
    return NextResponse.json({ error: "Invalid gig ID." }, { status: 400 });
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

    // Verify both parties have confirmed with matching codes
    const bothConfirmed =
      gig.musicianConfirmPayment?.temporaryConfirm &&
      gig.clientConfirmPayment?.temporaryConfirm;
    const codesMatch =
      gig.musicianConfirmPayment?.code &&
      gig.clientConfirmPayment?.code &&
      gig.musicianConfirmPayment.code === gig.clientConfirmPayment.code;

    if (!bothConfirmed || !codesMatch) {
      return NextResponse.json(
        { error: "Both parties must confirm with matching codes first" },
        { status: 400 }
      );
    }

    const session = await Gig.startSession();
    session.startTransaction();

    try {
      // Update to final confirmation
      gig.musicianConfirmPayment = {
        ...gig.musicianConfirmPayment,
        confirmPayment: true,
        confirmedAt: new Date(),
        temporaryConfirm: false,
      };

      gig.clientConfirmPayment = {
        ...gig.clientConfirmPayment,
        confirmPayment: true,
        confirmedAt: new Date(),
        temporaryConfirm: false,
      };

      gig.paymentStatus = "paid";
      gig.completedAt = new Date();

      gig.bookingHistory.push({
        userId: role === "client" ? gig.postedBy._id : gig.bookedBy._id,
        status: "completed",
        date: new Date(),
        role,
        notes: notes ? role + notes : role + "Confirmed payment",
      });

      await gig.save({ session });

      // Update musician's stats
      await User.findByIdAndUpdate(
        gig.bookedBy._id,
        {
          $push: {
            bookingHistory: {
              gigId: gig._id,
              status: "completed",
              date: new Date(),
              role: "musician",
              notes: "Payment fully confirmed",
            },
          },
          $inc: {
            completedGigsCount: 1,
            earnings: gig.price,
          },
        },
        { session }
      );

      // Update client's stats
      await User.findByIdAndUpdate(
        gig.postedBy._id,
        {
          $push: {
            bookingHistory: {
              gigId: gig._id,
              status: "completed",
              date: new Date(),
              role: "client",
              notes: "Payment fully confirmed",
            },
          },
          $inc: {
            completedGigsCount: 1,
            totalSpent: gig.price,
          },
        },
        { session }
      );

      await session.commitTransaction();

      return NextResponse.json({
        success: true,
        paymentStatus: "paid",
        message: "Payment successfully confirmed by both parties.",
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
    console.error("Error finalizing gig payment:", error);
    return NextResponse.json(
      {
        error:
          error instanceof Error ? error.message : "Unknown error occurred",
      },
      { status: 500 }
    );
  }
}

//
