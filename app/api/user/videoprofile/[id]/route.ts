import { NextRequest, NextResponse } from "next/server";
import connectDb from "@/lib/connectDb";
import User from "@/models/user";

export async function PUT(req: NextRequest) {
  // const { params } = context; // ✅ Extract params correctly
  // console.log("PUT request received for user ID:", params.id);

  // if (!params.id) {
  //   return NextResponse.json(
  //     { updateStatus: false, message: "User ID is missing" },
  //     { status: 400 }
  //   );
  // }
  const id = req.nextUrl.pathname.split("/").pop(); // Extract the `id` from the URL path

  try {
    await connectDb();
    console.log("Connected to database");

    const { videoUrl } = await req.json();
    if (!videoUrl) {
      return NextResponse.json(
        { updateStatus: false, message: "Invalid video URL" },
        { status: 400 }
      );
    }

    const user = await User.findById(id);
    if (!user) {
      return NextResponse.json(
        { updateStatus: false, message: "User not found" },
        { status: 404 }
      );
    }

    if (user.videosProfile.length >= 3) {
      return NextResponse.json(
        { updateStatus: false, message: "Maximum of 3 videos allowed" },
        { status: 400 }
      );
    }

    await User.findByIdAndUpdate(id, {
      $push: { videosProfile: { url: videoUrl, createdAt: new Date() } },
    });

    return NextResponse.json({
      updateStatus: true,
      message: "Video uploaded successfully",
    });
  } catch (error) {
    console.error("Error updating video:", error);
    return NextResponse.json(
      { updateStatus: false, message: "Failed to update video" },
      { status: 500 }
    );
  }
}
