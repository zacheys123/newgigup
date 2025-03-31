import Gig from "@/models/gigs";
import { NextRequest, NextResponse } from "next/server";
import { getAuth } from "@clerk/nextjs/server";
import connectDb from "@/lib/connectDb";
export async function PUT(req: NextRequest) {
  const { userId } = getAuth(req);
  const { searchParams } = new URL(req.url);
  const gigId = searchParams.get("gigId");
  const { newSecret } = await req.json();

  if (!userId) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }
  if (!gigId || !newSecret) {
    return NextResponse.json(
      { error: "Missing gigId or secret" },
      { status: 400 }
    );
  }
  // Perform your validation here and return the appropriate response.
  try {
    await connectDb();
    const gig = await Gig.findByIdAndUpdate(
      { _id: gigId },
      {
        $set: { secret: newSecret },
      }
    );
    return NextResponse.json({
      gigstatus: "true",
      message: "Update Successful",
      gig,
    });
  } catch (error) {
    console.error("Error validating gig:", error);
    return NextResponse.json({ message: "Error validating gig", status: 500 });
  }
}
