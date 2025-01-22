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
  // Check if a string is a valid ObjectId

  try {
    await connectDb();
    const vids = await Video.find().populate({ path: "postedBy", model: User });
    console.log(vids);
    const videos = vids.filter((video) => video.postedBy._id.toString() === id);
    return NextResponse.json({
      videos,
    });
  } catch (error) {
    console.error("Error fetching user:", error);
    return NextResponse.json({
      message: "An error occurred while fetching the user.",
      error: (error as Error).message,
      status: 500,
    });
  }
}
