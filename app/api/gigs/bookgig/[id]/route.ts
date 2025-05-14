import connectDb from "@/lib/connectDb";
import Gig from "@/models/gigs";
import User from "@/models/user";
import { getAuth } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";

export async function PUT(req: NextRequest) {
  const { userid } = await req.json();
  const id = req.nextUrl.pathname.split("/").pop();
  const { userId } = getAuth(req);

  if (!userId) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  try {
    await connectDb();

    const user = await User.findById(userid);
    if (!user) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }

    const gig = await Gig.findById(id);
    if (!gig) {
      return NextResponse.json({ message: "Gig not found" }, { status: 404 });
    }

    // Basic validation
    if (gig.isTaken || gig.isPending || gig.postedBy.equals(userid)) {
      return NextResponse.json(
        { success: false, message: "Cannot book this gig" },
        { status: 400 }
      );
    }

    // Subscription checks
    if (user.tier === "free") {
      const signupDate = user.createdAt;
      const oneMonthLater = new Date(signupDate);
      oneMonthLater.setMonth(oneMonthLater.getMonth() + 1);

      // After first month
      if (new Date() > oneMonthLater) {
        return NextResponse.json(
          { success: false, message: "Upgrade to Pro to continue booking" },
          { status: 403 }
        );
      }

      // Weekly limit check
      const currentWeekStart = new Date();
      currentWeekStart.setHours(0, 0, 0, 0);
      currentWeekStart.setDate(
        currentWeekStart.getDate() - currentWeekStart.getDay()
      );

      if (user.gigsBookedThisWeek?.weekStart) {
        const lastWeekStart = new Date(user.gigsBookedThisWeek.weekStart);

        // Same week check
        if (lastWeekStart >= currentWeekStart) {
          if (user.gigsBookedThisWeek.count >= 3) {
            return NextResponse.json(
              { success: false, message: "Free limit reached (3 gigs/week)" },
              { status: 403 }
            );
          }
        }
      }
    }

    // Update booking counts
    const currentWeekStart = new Date();
    currentWeekStart.setHours(0, 0, 0, 0);
    currentWeekStart.setDate(
      currentWeekStart.getDate() - currentWeekStart.getDay()
    );

    let updatedCount = 1;
    if (user.gigsBookedThisWeek?.weekStart) {
      const lastWeekStart = new Date(user.gigsBookedThisWeek.weekStart);
      updatedCount =
        lastWeekStart >= currentWeekStart
          ? user.gigsBookedThisWeek.count + 1
          : 1;
    }

    await User.findByIdAndUpdate(userid, {
      $set: {
        gigsBookedThisWeek: {
          count: updatedCount,
          weekStart: currentWeekStart,
        },
        lastBookingDate: new Date(),
      },
    });

    await gig.updateOne({
      $push: { bookCount: userid },
    });

    const updatedGig = await Gig.findById(id).populate("bookCount");

    return NextResponse.json({
      success: true,
      message: "Booked successfully",
      updatedGig,
      weeklyBookings: updatedCount,
    });
  } catch (error) {
    console.error("Booking error:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}
