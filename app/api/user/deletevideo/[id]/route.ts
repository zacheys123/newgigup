import connectDb from "@/lib/connectDb";
import User from "@/models/user";
import { VideoProfileProps } from "@/types/userinterfaces";
import { getAuth } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";

export async function DELETE(req: NextRequest) {
  const videoId = req.nextUrl.pathname.split("/").pop(); // Extract the `id` from the URL path
  const { userid } = await req.json();
  const { userId } = getAuth(req);

  if (!userId) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  try {
    // Connect to the database
    await connectDb();

    // Find user
    const user = await User.findById(userid);
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Filter out the video to delete
    const initialLength = user.videosProfile.length;
    user.videosProfile = user.videosProfile.filter(
      (video: VideoProfileProps) => video._id.toString() !== videoId
    );

    if (user.videosProfile.length === initialLength) {
      return NextResponse.json({ error: "Video not found" }, { status: 404 });
    }

    // Save the updated user document
    await user.save();

    return NextResponse.json({ message: "Video deleted successfully" });
  } catch (error) {
    console.error("Error deleting video:", error);
    return NextResponse.json(
      { error: "An error occurred while deleting the video" },
      { status: 500 }
    );
  }
}
