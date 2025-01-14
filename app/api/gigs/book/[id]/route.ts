import connectDb from "@/lib/connectDb";
import Gigs from "@/models/gigs";
import { getAuth } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";

export async function PUT(req: NextRequest) {
  const id = req.nextUrl.pathname.split("/").pop(); // Extract the `id` from the URL path
  const { userId } = getAuth(req);
  if (!userId) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }
  try {
    await connectDb();
    const newGig = await Gigs.findById(id);
    await newGig.updateOne(
      {
        $set: {
          isTaken: true,
          isPending: false,
        },
      },
      { new: true }
    );

    return NextResponse.json({
      gigstatus: true,
      message: "Selected the Musician/Band successfully",
    });
  } catch (error) {
    console.log(error);
  }
}
