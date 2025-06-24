import connectDb from "@/lib/connectDb";
import Gig from "@/models/gigs";
import User from "@/models/user";
import { getAuth } from "@clerk/nextjs/server";
import mongoose from "mongoose";

import { NextRequest, NextResponse } from "next/server";

export async function PUT(req: NextRequest) {
  const id = req.nextUrl.pathname.split("/").pop();
  const { userId } = getAuth(req);
  const { musicianId } = await req.json();

  if (!userId) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  try {
    await connectDb();

    const gig = await Gig.findById(id).populate({
      path: "postedBy bookedBy",
      model: User,
    });

    if (!gig) {
      return NextResponse.json({ message: "Gig not found" }, { status: 404 });
    }

    // Verify requestor is gig owner
    if (gig.postedBy.clerkId.toString() !== userId) {
      return NextResponse.json({ message: "Not authorized" }, { status: 403 });
    }

    // Update booking history for ALL applicants first
    if (gig.bookCount && gig.bookCount.length > 0) {
      // 1. Update status for selected musician
      await User.updateOne(
        { _id: musicianId, "bookingHistory.gigId": id },
        { $set: { "bookingHistory.$.status": "booked" } }
      );

      await Gig.updateOne(
        { _id: id, "bookingHistory.userId": musicianId },
        { $set: { "bookingHistory.$.status": "booked" } }
      );

      // 2. Update status for cancelled musicians
      const cancelledMusicians = gig.bookCount.filter(
        (id: string) => id.toString() !== musicianId.toString()
      );

      await User.updateMany(
        {
          _id: { $in: cancelledMusicians },
          "bookingHistory.gigId": id,
        },
        { $set: { "bookingHistory.$.status": "cancelled" } }
      );

      await Gig.updateMany(
        {
          _id: id,
          "bookingHistory.userId": { $in: cancelledMusicians },
        },
        { $set: { "bookingHistory.$.status": "cancelled" } }
      );

      // 3. Handle weekly count decrement for cancelled musicians
      const currentWeekStart = new Date();
      currentWeekStart.setDate(
        currentWeekStart.getDate() - ((currentWeekStart.getDay() + 6) % 7)
      );
      currentWeekStart.setHours(0, 0, 0, 0);

      for (const userMainID of cancelledMusicians) {
        const user = await User.findById(userMainID);
        if (user?.gigsBookedThisWeek?.weekStart) {
          const lastWeekStart = new Date(user.gigsBookedThisWeek.weekStart);
          if (lastWeekStart >= currentWeekStart) {
            await User.findByIdAndUpdate(userMainID, [
              {
                $set: {
                  "gigsBookedThisWeek.count": {
                    $cond: [
                      { $gt: ["$gigsBookedThisWeek.count", 0] },
                      { $add: ["$gigsBookedThisWeek.count", -1] },
                      "$gigsBookedThisWeek.count",
                    ],
                  },
                },
              },
            ]);
          }
        }
      }
    }

    // Update gig and selected musician
    const updateGig = {
      isTaken: true,
      bookedBy: musicianId,
      bookCount: [],
      isPending: false,
      $set: {
        "bookingHistory.$[elem].status": "booked",
      },
    };

    const bookingUser = await User.findById(musicianId);
    const isExistingReference = bookingUser?.refferences.includes(
      gig.postedBy?._id
    );

    await Gig.findByIdAndUpdate(id, updateGig, {
      arrayFilters: [{ "elem.userId": musicianId }],
      new: true,
    });
    // Add this after updating the musician's record
    await User.findByIdAndUpdate(gig.postedBy._id, {
      $push: {
        bookingHistory: {
          gigId: id,
          userId: musicianId,
          status: "booked",
          date: new Date(),
          role: "client", // Differentiate client vs musician
        },
      },
    });
    // Define the complete update type
    const userUpdates: {
      $inc: {
        "gigsBookedThisWeek.count": number;
        monthlyGigsBooked: number;
      };
      $set: {
        lastBookingDate: Date;
        "bookingHistory.$[elem].status": string;
      };
      $push?: {
        refferences: mongoose.Types.ObjectId;
      };
    } = {
      $inc: {
        "gigsBookedThisWeek.count": 1,
        monthlyGigsBooked: 1,
      },
      $set: {
        lastBookingDate: new Date(),
        "bookingHistory.$[elem].status": "booked",
      },
    };

    // Conditionally add $push
    if (!isExistingReference) {
      userUpdates.$push = { refferences: gig.postedBy._id };
    }

    const updatedUser = await User.findByIdAndUpdate(musicianId, userUpdates, {
      arrayFilters: [{ "elem.gigId": id }],
      new: true,
    });

    return NextResponse.json({
      success: true,
      message: "Musician selected successfully",
      gig: await Gig.findById(id).populate("bookedBy"),
      musician: updatedUser,
    });
  } catch (error) {
    console.error("Selection error:", error);
    console.error(error);
    return NextResponse.json({
      gigstatus: false,
      message: "Failed to select musician: " + error,
    });
  }
}
