import connectDb from "@/lib/connectDb";
import User from "@/models/user";
import { NextRequest, NextResponse } from "next/server";

export async function PUT(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const { id } = params; // Correct way to extract ID in App Router
  const { videoUrl } = await req.json();

  if (!videoUrl) {
    return NextResponse.json({
      updateStatus: false,
      message: "Invalid video URL",
    });
  }

  try {
    await connectDb();

    const user = await User.findById(id);
    if (!user) {
      return NextResponse.json({
        updateStatus: false,
        message: "User not found",
      });
    }

    if (user.videosProfile.length >= 3) {
      return NextResponse.json({
        updateStatus: false,
        message: "Maximum of 3 videos allowed",
      });
    }

    await User.findByIdAndUpdate(id, {
      $push: {
        videosProfile: { url: videoUrl, createdAt: new Date() },
      },
    });

    return NextResponse.json({
      updateStatus: true,
      message: "Video uploaded successfully",
    });
  } catch (error) {
    console.error("Error updating video:", error);
    return NextResponse.json({
      updateStatus: false,
      message: "Failed to update video",
    });
  }
}
