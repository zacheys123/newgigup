import connectDb from "@/lib/connectDb";
import Gigs from "@/models/gigs";
// import { UserProps } from "@/types/userinterfaces";
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
    const newGig = await Gigs.findById(id);
    // const nonBookedMusicians = newGig.bookCount.filter(
    //   (mu: UserProps) => mu?._id !== musicianId
    // );
    await newGig.updateOne(
      {
        $set: {
          isTaken: true,
          isPending: false,
          bookedBy: musicianId,
        },
        // $pull:{
        //   bookCount: nonBookedMusicians,

        // }
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
