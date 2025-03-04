// API route: /api/gigs/get-book-count/[gigId].ts

import connectDb from "@/lib/connectDb";
import Gig from "@/models/gigs";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const gigId = req.nextUrl.pathname.split("/").pop(); // Extract the `id` from the URL path

  try {
    await connectDb();
    const gig = await Gig.findById(gigId);
    if (!gig) {
      return NextResponse.json({ success: false, message: "Gig not found" });
    }

    const bookCount = gig.bookCount.length;
    return NextResponse.json({ success: true, bookCount });
  } catch (error) {
    console.error("Error fetching bookCount:", error);
    return NextResponse.json({
      success: false,
      message: "Internal server error",
    });
  }
}
