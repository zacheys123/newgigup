import Gig from "@/models/gigs";
import User from "@/models/user";
import { NextRequest, NextResponse } from "next/server";

export const GET = async (req: NextRequest) => {
  const id = req.nextUrl.pathname.split("/").pop(); // Extract the `id` from the URL path
  console.log("current id", id);

  if (!id) {
    console.log("Invalid gig ID");
    return null;
  }
  try {
    const gig = await Gig.findOne({ _id: id })
      .populate({ path: "postedBy", model: User })
      .populate({ path: "bookedBy", model: User });

    if (!gig) {
      console.log("Gig not found");
      return NextResponse.json({ error: "Gig not found" });
    }
    console.log("Gig", gig);
    return NextResponse.json(gig);
  } catch (error) {
    console.error("Error fetching gig:", error);
    return NextResponse.json({ error: "Failed to fetch gig" });
  }
};
