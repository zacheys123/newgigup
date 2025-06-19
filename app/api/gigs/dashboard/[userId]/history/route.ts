import { NextRequest, NextResponse } from "next/server";
import { getAuth } from "@clerk/nextjs/server";
import connectDb from "@/lib/connectDb";
import User from "@/models/user";
import Gig from "@/models/gigs";

export async function GET(request: NextRequest) {
  const pathParts = request.nextUrl.pathname.split("/");
  const clerkId = pathParts[pathParts.length - 2];

  try {
    const { userId: authUserId } = getAuth(request);
    if (!authUserId || authUserId !== clerkId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    await connectDb();

    // Get user with populated bookingHistory
    const user = await User.findOne({ clerkId })
      .populate({
        path: "bookingHistory.gigId",
        model: Gig,
        populate: [
          {
            path: "postedBy",
            select: "username email picture",
          },
          {
            path: "bookedBy",
            select: "username email picture",
          },
        ],
      })
      .lean();

    if (!user) return new NextResponse("User not found", { status: 404 });

    // Transform the data to match HistoryGig interface

    return NextResponse.json(user.bookingHistory);
  } catch (error) {
    console.error("Error fetching booking history:", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
