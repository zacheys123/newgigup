import connectDb from "@/lib/connectDb";
import User from "@/models/user";
import Video from "@/models/videos";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  const videoId = request.nextUrl.pathname.split("/").pop(); // Extract the `id` from the URL path

  try {
    await connectDb();
    const { userId } = await request.json();

    if (!userId) {
      return NextResponse.json(
        { error: "User ID is required" },
        { status: 400 }
      );
    }

    const video = await Video.findById(videoId);
    if (!video) {
      return NextResponse.json({ error: "Video not found" }, { status: 404 });
    }

    // Check if user already liked the video
    const userIndex = video.likes.indexOf(userId);
    if (userIndex !== -1) {
      // Add like
      video.likes.splice(userId);
      await video.save();

      await User.findByIdAndUpdate(userId, {
        $pull: { likedVideos: videoId },
      });
    }

    return NextResponse.json({
      success: true,
      likes: video.likes.length,
    });
  } catch (error) {
    return NextResponse.json(
      {
        error:
          error instanceof Error ? error.message : "Failed to update like: ",
      },
      { status: 500 }
    );
  }
}
