import connectDb from "@/lib/connectDb";
import Gigs from "@/models/gigs";
import { getAuth } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";

export async function DELETE(req: NextRequest) {
  const id = req.nextUrl.pathname.split("/").pop(); // Extract the `id` from the URL path
  const { userId } = getAuth(req);
  const { musicianId } = await req.json();

  console.log(musicianId);
  if (!userId) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  try {
    await connectDb();
    const gig = await Gigs.findOne({ _id: id });

    await gig.updateOne({
      $pull: { bookCount: musicianId },
    });

    return NextResponse.json({ message: "User removed successfully" });
  } catch (error) {
    console.error("Error deleting gig:", error);
    return NextResponse.json({ message: "Error deleting gig", status: 500 });
  }
}
