import connectDb from "@/lib/connectDb";
import Gigs from "@/models/gigs";
import User from "@/models/user";
import { getAuth } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";
import moment from "moment-timezone";

export async function PUT(req: NextRequest) {
  const { userid } = await req.json();
  const id = req.nextUrl.pathname.split("/").pop();

  const { userId } = getAuth(req);
  if (!userId) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  try {
    await connectDb();

    // Get user with subscription info
    const user = await User.findById(userid).select("tier isMusician");
    if (!user) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }

    if (!user.isMusician) {
      return NextResponse.json(
        { message: "Only musicians can book gigs" },
        { status: 403 }
      );
    }
    const gig = await Gigs.findById(id).populate({
      path: "postedBy",
      model: User,
    });
    // Add these checks before booking
    if (gig.isTaken) {
      return NextResponse.json(
        { message: "This gig is already taken" },
        { status: 400 }
      );
    }

    if (gig.isPending) {
      return NextResponse.json(
        { message: "This gig is not yet available" },
        { status: 400 }
      );
    }

    if (!gig) {
      return NextResponse.json({ message: "Gig not found" }, { status: 404 });
    }

    // Basic validation checks
    if (
      !userid ||
      gig.postedBy.equals(userid) ||
      gig.bookCount.includes(userid)
    ) {
      return NextResponse.json({
        success: false,
        message: "Cannot book this gig",
      });
    }

    // Calculate weekly bookings with timezone awareness
    // Calculate the start of the current week
    const timezone = "America/New_York";
    const now = moment().tz(timezone);
    const startOfWeek = now.clone().startOf("week").toDate();

    let updatedCount = 1;

    if (
      user.gigsBookedThisWeek?.weekStart &&
      moment(user.gigsBookedThisWeek.weekStart).isSame(startOfWeek, "week")
    ) {
      // Same week, increment count
      updatedCount = user.gigsBookedThisWeek.count + 1;
    } else {
      // New week, reset count
      updatedCount = 1;
    }

    if (user.tier === "free" && updatedCount > 3) {
      return NextResponse.json({
        success: false,
        message:
          "Free tier limit reached (3 gigs/week). Upgrade to Pro for unlimited bookings.",
        weeklyBookings: updatedCount - 1,
      });
    }

    await User.findByIdAndUpdate(userid, {
      $set: {
        gigsBookedThisWeek: { count: updatedCount, weekStart: startOfWeek },
        lastBookingDate: new Date(),
      },
    });

    // Update viewCount if not already viewed
    if (!gig.viewCount.includes(userid)) {
      await gig.updateOne({
        $push: { viewCount: userid },
      });
    }

    // Update bookCount
    await gig.updateOne({
      $push: { bookCount: userid },
    });
    // Update user's last booking date

    // Get updated gig data
    const updatedGig = await Gigs.findById(id);

    return NextResponse.json({
      success: true,
      message: "Booked successfully",
      weeklyBookings: updatedCount + 1,
      updatedGig,
      isPro: user?.tier === "pro",
    });
  } catch (error) {
    console.error("Booking error:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}
