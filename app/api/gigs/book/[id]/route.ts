import connectDb from "@/lib/connectDb";
import Gig from "@/models/gigs";
import User from "@/models/user";
import { getAuth } from "@clerk/nextjs/server";

import { NextRequest, NextResponse } from "next/server";

export async function PUT(req: NextRequest) {
  const id = req.nextUrl.pathname.split("/").pop(); // Extract the `id` from the URL
  const { userId } = getAuth(req);
  const { musicianId } = await req.json();

  if (!userId) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  try {
    await connectDb();

    let gig = await Gig.findById({ _id: id }).populate({
      path: "postedBy bookedBy",
      model: User,
    });
    const bookingUser = await User.findById({ _id: musicianId });
    // .populate("bookedBy", User)
    // .populate("postedBy", User);

    if (!gig) {
      return NextResponse.json({ message: "Gig not found" }, { status: 404 });
    }

    const updateGig = {
      isTaken: true,
      bookedBy: musicianId,
      bookCount: [],
      isPending: false,
    };

    if (bookingUser && bookingUser?.refferences.includes(gig.postedBy?._id)) {
      await gig.updateOne({ $set: updateGig }, { new: true });

      return NextResponse.json({
        gigstatus: true,
        message: "Booked successfully",
      });
    } else {
      if (bookingUser?.refferences.includes(gig.postedBy?._id)) {
        await gig.updateOne({ $set: updateGig }, { new: true });
      }
      await gig.updateOne({ $set: updateGig }, { new: true });
      gig = await Gig.findById({ _id: id }).populate({
        path: "postedBy bookedBy",
        model: User,
      });
      const updatedUser = await User.findByIdAndUpdate(
        musicianId,
        { $push: { refferences: gig.postedBy?._id } },
        { new: true }
      );

      return NextResponse.json({
        gigstatus: true,
        message: "Selected the Musician/Band successfully",
        gig: gig,
        updatedUser,
      });
    }
  } catch (error) {
    console.error(error);
    return NextResponse.json({
      gigstatus: false,
      message: "Failed to select musician: " + error,
    });
  }
}
