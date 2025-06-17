import connectDb from "@/lib/connectDb";
import Gig from "@/models/gigs";
import User from "@/models/user";
import { getAuth } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
  request: NextRequest,
  { params }: { params: { userId: string } }
) {
  try {
    const { userId } = getAuth(request);

    // Verify the requesting user matches the userId in params
    if (!userId || userId !== params.userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    await connectDb();

    // Get user with populated savedGigs
    const user = await User.findOne({ clerkId: userId })
      .populate({
        path: "savedGigs",
        model: Gig,
        match: { isTaken: false }, // Only show available gigs
      })
      .exec();

    if (!user) {
      return new NextResponse("User not found", { status: 404 });
    }

    return NextResponse.json(user.savedGigs || []);
  } catch (error) {
    console.error("Error fetching saved gigs:", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
