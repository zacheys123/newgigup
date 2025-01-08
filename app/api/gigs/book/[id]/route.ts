import connectDb from "@/lib/connectDb";
import Gigs from "@/models/gigs";
import { NextRequest, NextResponse } from "next/server";

export async function PUT(req: NextRequest) {
  const id = req.nextUrl.pathname.split("/").pop(); // Extract the `id` from the URL path
  console.log("current id", id);

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
