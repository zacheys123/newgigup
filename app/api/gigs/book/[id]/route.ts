import connectDb from "@/lib/connectDb";
import Gig from "@/models/gigs";
import User from "@/models/user";
import { getAuth } from "@clerk/nextjs/server";

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

    let gig = await Gig.findById({ _id: id }).populate({
      path: "postedBy bookedBy",
      model: User,
    });
    const bookingUser = await User.findById({ _id: musicianId });

    if (!gig) {
      return NextResponse.json({ message: "Gig not found" }, { status: 404 });
    }

    // Get current week start date (Monday)
    const currentDate = new Date();
    const currentWeekStart = new Date(currentDate);
    currentWeekStart.setDate(
      currentDate.getDate() - ((currentDate.getDay() + 6) % 7)
    );
    currentWeekStart.setHours(0, 0, 0, 0);

    // Decrement weekly count for users in bookCount who weren't selected
    // In the part where you decrement counts for unselected musicians:
    if (gig.bookCount && gig.bookCount.length > 0) {
      for (const userMainID of gig.bookCount) {
        if (userMainID.toString() !== musicianId.toString()) {
          const user = await User.findById(userMainID);
          if (user?.gigsBookedThisWeek?.weekStart) {
            const lastWeekStart = new Date(user.gigsBookedThisWeek.weekStart);
            if (lastWeekStart >= currentWeekStart) {
              // Only decrement if count is greater than 0
              await User.findByIdAndUpdate(userMainID, [
                {
                  $set: {
                    "gigsBookedThisWeek.count": {
                      $cond: [
                        { $gt: ["$gigsBookedThisWeek.count", 0] }, // Only if count > 0
                        { $add: ["$gigsBookedThisWeek.count", -1] }, // Then decrement
                        "$gigsBookedThisWeek.count", // Else keep current value
                      ],
                    },
                  },
                },
              ]);
            }
          }
        }
      }
    }

    const updateGig = {
      isTaken: true,
      bookedBy: musicianId,
      bookCount: [],
      isPending: false,
    };

    if (bookingUser && bookingUser?.refferences.includes(gig.postedBy?._id)) {
      await gig.updateOne({ $set: updateGig }, { new: true });
      return NextResponse.json({
        gigstatus: true,
        message: "Booked successfully",
      });
    } else {
      await gig.updateOne({ $set: updateGig }, { new: true });
      gig = await Gig.findById({ _id: id }).populate({
        path: "postedBy bookedBy",
        model: User,
      });

      // Update the selected musician's stats
      const updatedUser = await User.findByIdAndUpdate(
        musicianId,
        {
          $push: {
            refferences: gig.postedBy?._id,
          },
          $inc: { monthlyGigsBooked: 1 },
        },
        { new: true }
      );

      // Update weekly count for selected musician
      let updatedCount = 1;
      if (updatedUser?.gigsBookedThisWeek?.weekStart) {
        const lastWeekStart = new Date(
          updatedUser.gigsBookedThisWeek.weekStart
        );
        updatedCount =
          lastWeekStart >= currentWeekStart
            ? updatedUser.gigsBookedThisWeek.count + 1
            : 1;
      }

      await User.findByIdAndUpdate(musicianId, {
        $inc: {
          "gigsBookedThisWeek.count": updatedCount,
          monthlyGigsBooked: 1,
        },
        $push: {
          references: gig.postedBy?._id,
        },
        $set: {
          lastBookingDate: new Date(),
        },
      });

      return NextResponse.json({
        gigstatus: true,
        message: "Selected the Musician/Band successfully",
        gig: gig,
        updatedUser,
      });
    }
  } catch (error) {
    console.error(error);
    return NextResponse.json({
      gigstatus: false,
      message: "Failed to select musician: " + error,
    });
  }
}
