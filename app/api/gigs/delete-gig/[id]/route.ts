import connectDb from "@/lib/connectDb";
import Gig from "@/models/gigs";
import { getAuth } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";

export async function DELETE(req: NextRequest) {
  const gigId = req.nextUrl.pathname.split("/").pop(); // Extract the `id` from the URL path
  const { userId } = getAuth(req);

  if (!userId) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  try {
    // Connect to the database
    await connectDb();

    // Find and delete the video by ID
    const gig = await Gig.findByIdAndDelete(gigId);

    if (!gig) {
      return NextResponse.json({ error: "Video not found" }, { status: 404 });
    }

    return NextResponse.json({ message: "Gig deleted successfully" });
  } catch (error) {
    console.error("Error deleting video:", error);
    return NextResponse.json(
      { error: "An error occurred while deleting the video" },
      { status: 500 }
    );
  }
}
