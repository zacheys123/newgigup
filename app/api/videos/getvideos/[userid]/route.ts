import Video from "@/models/videos";
import { NextResponse } from "next/server";
import connectDb from "@/lib/connectDb";
import { NextRequest } from "next/server";
import { getAuth } from "@clerk/nextjs/server";
import User from "@/models/user";

export async function GET(req: NextRequest) {
  const id = req.nextUrl.pathname.split("/").pop(); // Extract the `id` from the URL path
  const { userId } = getAuth(req);

  if (!userId) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  try {
    await connectDb();

    // Find the current user first
    const currentUser = await User.findOne({ clerkId: userId });
    if (!currentUser) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }

    // Get all videos with populated postedBy
    const allVideos = await Video.find().sort({ createdAt: -1 }).populate({
      path: "postedBy",
      model: User,
    });

    // Filter videos based on privacy and ownership
    const filteredVideos = allVideos.filter((video) => {
      // If video is public, include it
      if (video.isPublic) return true;

      // If video is private, only include if current user is the owner
      return video.postedBy?.clerkId === userId;
    });

    return NextResponse.json({
      videos: filteredVideos,
    });
  } catch (error) {
    console.error("Error fetching videos:", error);
    return NextResponse.json({
      message: "An error occurred while fetching videos.",
      error: (error as Error).message,
      status: 500,
    });
  }
}
