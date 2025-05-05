import Gig from "@/models/gigs";
import { NextRequest, NextResponse } from "next/server";
import { getAuth } from "@clerk/nextjs/server";
import connectDb from "@/lib/connectDb";

export async function POST(req: NextRequest) {
  const { userId } = getAuth(req);
  const { searchParams } = new URL(req.url);
  const gigId = searchParams.get("gigId");
  const { secret } = await req.json();

  if (!userId) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }
  if (!gigId || !secret) {
    return NextResponse.json(
      { gigstatus: "false", message: "Missing gigId or secret" },
      { status: 400 }
    );
  }
  // Perform your validation here and return the appropriate response.
  try {
    await connectDb();
    const mygig = await Gig.findOne({ _id: gigId, secret: secret }); // Check both gigId and secret

    if (!mygig) {
      return NextResponse.json(
        { gigstatus: "false", message: "Secret is Invalid" },
        { status: 200 }
      );
    }

    return NextResponse.json({
      gigstatus: "true",
      message: "Validation Successful",
      gigId: mygig._id,
      secret: mygig?.secret,
    });
  } catch (error) {
    console.error("Error validating gig:", error);
    return NextResponse.json(
      { gigstatus: "false", message: "Error validating gig" },
      { status: 500 }
    );
  }
}
