import connectDb from "@/lib/connectDb";
import Gigs from "@/models/gigs";
import { getAuth } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";
export async function PUT(req: NextRequest) {
  const { userId } = getAuth(req);
  const { searchParams } = new URL(req.url);
  const gigId = searchParams.get("gigId");
  const { isPending } = await req.json();

  if (!userId) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  try {
    await connectDb();

    const newGig = await Gigs.findById(gigId);

    await newGig.updateOne(
      {
        $set: {
          isPending,
        },
      },
      { new: true }
    );

    return NextResponse.json({
      gigstatus: true,
      message: "Updated Scheduled Gig successfully",
    });
  } catch (error) {
    console.log(error);
  }
}
