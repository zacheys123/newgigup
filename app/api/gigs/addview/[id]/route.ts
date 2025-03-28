import connectDb from "@/lib/connectDb";
import Gigs from "@/models/gigs";
import User from "@/models/user";
import { getAuth } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";

export async function PUT(req: NextRequest) {
  const { userid } = await req.json();
  const id = req.nextUrl.pathname.split("/").pop(); // Extract the `id` from the URL path

  const { userId } = getAuth(req);
  if (!userId) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }
  try {
    await connectDb();
    const newGig = await Gigs.findById(id);

    if (newGig?.viewCount?.includes(userid)) {
      console.log("Already viewed this gig", newGig.viewCount?.length);
      console.log(newGig);
      return NextResponse.json({
        gigstatus: "false",
        message: "You have already viewed this gig",
      });
    }

    await newGig.updateOne(
      {
        $push: {
          viewCount: userid,
        },
      },
      { new: true }
    );
    const currentgig = await Gigs.findById(newGig._id)
      .populate({
        path: "postedBy",
        model: User,
      })
      .populate({
        path: "bookedBy",
        model: User,
      });

    return NextResponse.json({
      gigstatus: "true",
      message: "Viewed successfully",
      results: currentgig,
    });
  } catch (error) {
    console.log(error);
  }
}
