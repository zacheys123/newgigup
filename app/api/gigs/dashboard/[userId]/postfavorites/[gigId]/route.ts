import connectDb from "@/lib/connectDb";
import User from "@/models/user";
import { getAuth } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  const gigId = request.nextUrl.pathname.split("/").pop(); // Extract the `id` from the URL path

  try {
    const { userId } = getAuth(request);
    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    await connectDb();

    const user = await User.findOne({ clerkId: userId });
    if (!user) {
      return new NextResponse("User not found", { status: 404 });
    }
    await User.findOneAndUpdate(
      { clerkId: userId },
      { $push: { favoriteGigs: gigId } }
    );

    return NextResponse.json({ message: "Added to favourites" });
  } catch (error) {
    console.error(error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
export async function DELETE(request: NextRequest) {
  const gigId = request.nextUrl.pathname.split("/").pop(); // Extract the `id` from the URL path

  try {
    const { userId } = getAuth(request);
    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    await connectDb();

    // Remove gig from user's favorites
    await User.findOneAndUpdate(
      { clerkId: userId },
      { $pull: { favoriteGigs: gigId } }
    );

    return NextResponse.json({
      success: true,
      message: "Removed from favorite gigs",
    });
  } catch (error) {
    console.error(error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
