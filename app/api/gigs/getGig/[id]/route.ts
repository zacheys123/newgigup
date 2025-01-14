import Gig from "@/models/gigs";
import User from "@/models/user";
import { getAuth } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";

export const GET = async (req: NextRequest) => {
  const id = req.nextUrl.pathname.split("/").pop(); // Extract the `id` from the URL path

  if (!id) {
    console.log("Invalid gig ID");
    return NextResponse.json({ error: "Invalid gig ID" }, { status: 400 });
  }
  const { userId } = getAuth(req);
  if (!userId) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }
  try {
    const gig = await Gig.findOne({ _id: id })
      .populate({ path: "postedBy", model: User })
      .populate({ path: "bookedBy", model: User });

    if (!gig) {
      console.log("Gig not found");
      return NextResponse.json({ error: "Gig not found" });
    }
    return NextResponse.json(gig);
  } catch (error) {
    console.error("Error fetching gig:", error);
    return NextResponse.json({ error: "Failed to fetch gig" });
  }
};
