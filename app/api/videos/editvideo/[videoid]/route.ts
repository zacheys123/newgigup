import connectDb from "@/lib/connectDb";
import Video from "@/models/videos";
import { NextRequest, NextResponse } from "next/server";

export async function PUT(req: NextRequest) {
  const videoId = req.nextUrl.pathname.split("/").pop(); // Extract the `id` from the URL path

  const { title, description } = await req.json();

  if (!title || !description) {
    return NextResponse.json({
      updateStatus: false,
      message: "Title and description are required",
    });
  } else {
    try {
      await connectDb();
      const video = await Video.findByIdAndUpdate(
        { _id: videoId },
        {
          $set: {
            title,
            description,
          },
        }
      );
      return NextResponse.json({
        updateStatus: true,
        message: "Edit successfull",
        userData: video,
      });
    } catch (error) {
      console.log(error);
      return NextResponse.json({
        updateStatus: false,
        message: error,
      });
    }
  }
}
