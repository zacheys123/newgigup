import connectDb from "@/lib/connectDb";
import Gigs from "@/models/gigs";
import User from "@/models/user";
import { getAuth } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";

export async function PUT(req: NextRequest) {
  const id = req.nextUrl.pathname.split("/").pop(); // Extract the `id` from the URL path
  const { userId } = getAuth(req);
  const { musicianId } = await req.json();

  if (!userId) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  try {
    await connectDb();
    const gig = await Gigs.findOne({ _id: id }).populate({
      path: "postedBy bookedBy",
      model: User,
    });

    if (!gig) {
      return NextResponse.json({ message: "Gig not found" }, { status: 404 });
    }

    const user = await User.findById(musicianId);
    if (!user) {
      return NextResponse.json(
        { message: "Musician not found" },
        { status: 404 }
      );
    }

    await gig.updateOne({
      $pull: { bookCount: musicianId },
    });

    return NextResponse.json({ message: "Canceled gig successfully" });
  } catch (error) {
    console.error("Error canceling gig:", error);
    return NextResponse.json(
      { message: "Error canceling gig" },
      { status: 500 }
    );
  }
}
