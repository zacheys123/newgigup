import connectDb from "@/lib/connectDb";
import Gigs from "@/models/gigs";
import { getAuth } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";

// import { sendPushNotification } from "@/lib/firebase/firebaseAdmin";

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
    await newGig.updateOne(
      {
        $set: {
          isPending: false,
          bookedBy: null,
        },
        $pull: {
          viewCount: userid,
        },
      },
      { new: true }
    );

    // Notify Socket.io server directly
    // socket.emit("book-gig", {
    //   _id: currentgig?._id,
    //   title: currentgig?.title,
    //   bookedBy: userid,
    // });
    return NextResponse.json({
      gigstatus: true,
      message: "Canceled Gig successfully",
    });
  } catch (error) {
    console.log(error);
  }
}
