import connectDb from "@/lib/connectDb";
import User from "@/models/user";
import { NextRequest, NextResponse } from "next/server";

export async function PUT(req: NextRequest) {
  const id = req.nextUrl.pathname.split("/").pop(); // Extract the `id` from the URL path

  const { videoUrl } = await req.json();
  console.log(videoUrl);
  if (!videoUrl) {
    return NextResponse.json({
      updateStatus: false,
      message: "VideoUrl is Invalid",
    });
  }
  try {
    await connectDb();
    const user = await User.findById(id);
    if (user?.videosProfile.length > 3) {
      return NextResponse.json({
        updateStatus: false,
        message: "You can only upload a maximum of 3 videos",
      });
    }

    user.updateOne({
      $push: {
        videosProfile: {
          url: videoUrl,
          createdAt: new Date(),
        },
      },
    });
    return NextResponse.json({
      updateStatus: true,
      message: "Update VideoProfile successfull",
      userData: user,
    });
  } catch (error) {
    console.log(error);
    return NextResponse.json({
      updateStatus: false,
      message: error,
    });
  }
}
