// pages/api/videos/upload.js
import connectDb from "@/lib/connectDb";
import Video from "@/models/videos";
import { NextRequest, NextResponse } from "next/server";

// Establish database connection

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      postedBy,
      title,
      source,
      description,
      gigId,
      isPublic,

      thumbnail,
    } = body;

    await connectDb();
    // Validate required fields
    if (!postedBy || !source || !description) {
      return NextResponse.json(
        { message: "Missing required fields" },
        { status: 400 }
      );
    }

    // Create new video document
    const newVideo = new Video({
      postedBy,
      title: title ? title.toLowerCase() : "",
      source,
      description,
      gigId,
      isPublic: isPublic !== false,

      thumbnail: thumbnail ? thumbnail.toLowerCase() : "",
    });

    // Save to database
    const savedVideo = await newVideo.save();

    return NextResponse.json(savedVideo, { status: 201 });
  } catch (error) {
    console.error("Error uploading video:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
