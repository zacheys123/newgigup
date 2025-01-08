import connectDb from "@/lib/connectDb";

import Gigs from "@/models/gigs";
import { getAuth } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";

// import ioClient from "socket.io-client"; // Import Socket.io client
// // import { sendFCMNotification } from "@/utils/notifications";
// import moment from "moment";
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
    // Find the event and ensure it's not already booked
    const newGig = await Gigs.findById(id);

    if (newGig?.isPending === true || newGig?.postedBy?.equals(userid)) {
      return NextResponse.json({
        gigstatus: "false",
        message: "Cannot Book this Gig,already booked? ",
      });
    }
    if (!newGig?.viewCount.includes(userid)) {
      await newGig.updateOne(
        {
          $push: {
            viewCount: userid,
          },
        },
        { new: true }
      );
    }
    await newGig.updateOne(
      {
        $set: {
          isPending: true,
          bookedBy: userid,
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
    // Notify event owner (optional)

    // if (gigCreator && gigCreator.fcmToken) {
    //   const payload = {
    //     notification: {
    //       title: "Gig Booked!",
    //       body: `Your gig "${currentgig?.title}" was booked!`,
    //     },
    //   };

    //   await sendPushNotification(gigCreator.fcmToken, payload);
    // }
    // const creatorId = currentgig.postedBy._id;
    // await sendFCMNotification(
    //   creatorId,
    //   "Your gig was booked!",
    //   `Gig "${currentgig.title}" has been booked.`
    // );
    return NextResponse.json({
      gigstatus: true,
      message: "Booked the gig successfully",
    });
  } catch (error) {
    console.log(error);
  }
}
