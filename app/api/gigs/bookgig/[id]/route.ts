import connectDb from "@/lib/connectDb";

import Gigs from "@/models/gigs";
import User from "@/models/user";
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
    const newGig = await Gigs.findById(id).populate({
      path: "postedBy",
      model: User,
    });

    if (newGig?.bookCount > 10 || newGig?.postedBy?.equals(userid)) {
      return NextResponse.json({
        gigstatus: "false",
        message: "Cannot Book this Gig,already booked? ",
      });
    }
    // update viewCount
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
    // update the bookCount by adding ur id to the array of users that clicked on book gig
    if (!newGig?.bookCount.includes(userid)) {
      await newGig.updateOne(
        {
          $push: {
            bookCount: userid,
          },
        },
        { new: true }
      );
    }
    // updating a users bookedby field in gig collection data
    await newGig.updateOne(
      {
        $set: {
          // isPending: true,
          bookedBy: userid,
        },
      },
      { new: true }
    );
    // get the details of the person tha posted the gig
    const postedByid = newGig?.postedBy?._id;
    const updateUsersBookedByfield = await User.findByIdAndUpdate(postedByid, {
      $push: {
        usersbookgig: newGig?._id,
      },
    });

    return NextResponse.json({
      gigstatus: true,
      message:
        "Booked the gig successfully, wait for confirmationfrom client...",
      data: updateUsersBookedByfield,
    });

    // await newGig.updateOne(
    //   {
    //     $set: {
    //       isPending: true,
    //       bookedBy: userid,
    //     },
    //   },
    //   { new: true }
    // );

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
  } catch (error) {
    console.log(error);
  }
}
