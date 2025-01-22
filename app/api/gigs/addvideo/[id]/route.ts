import connectDb from "@/lib/connectDb";
import Video from "@/models/videos";
import { getAuth } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const id = req.nextUrl.pathname.split("/").pop(); // Extract `id` from URL path
  const { userId } = getAuth(req);
  const { title, description, media, postedBy } = await req.json();

  console.log("title from front End", title);
  console.log("description from front End", description);
  console.log("media from front End", media);
  console.log("postedBy from front End", postedBy);
  console.log("gigid from front End", id);

  // Redirect to sign-in if user is not authenticated
  if (!userId) {
    return NextResponse.redirect(new URL("/sign-in", req.url));
  }

  // Validate input
  if (!title || !description || !media || !postedBy || !id) {
    return NextResponse.json({
      gigstatus: false,
      message:
        "All fields (title, description, media, postedBy, gigId) are required.",
    });
  }

  try {
    await connectDb();

    // Create the video document
    await Video.create({
      postedBy,
      title,
      description,
      gigId: id,
      source: media,
    });

    return NextResponse.json({
      gigstatus: true,
      message: "Posted video successfully.",
    });
  } catch (error: unknown) {
    console.error("Error saving video:", error);

    // Return the error response
    return NextResponse.json({
      gigstatus: false,
      message: "An error occurred while posting the video.",
      error: error,
    });
  }
}
