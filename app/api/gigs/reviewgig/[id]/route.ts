import connectDb from "@/lib/connectDb";
import Gigs from "@/models/gigs";
import User from "@/models/user";
import { NextRequest, NextResponse } from "next/server";
import moment from "moment";
import { getAuth } from "@clerk/nextjs/server";
// // import { sendPushNotification } from "@/lib/firebase/firebaseAdmin";

// const socket = ioClient(process.env.NEXT_PUBLIC_PORT); // Connect to the server

export async function PUT(req: NextRequest) {
  const id = req.nextUrl.pathname.split("/").pop(); // Extract the `id` from the URL path

  const { userId } = getAuth(req);
  const { comment, rating, postedBy, postedTo } = await req.json();

  console.log("Rating from front End", rating);
  console.log("Comment from front End", comment);
  console.log("postedBy from front End", postedBy);
  console.log("postedTo from front End", postedTo);
  console.log("GigId from front End", id);

  if (!userId) {
    return NextResponse.redirect(new URL("/sign-in", req.url));
  } // Get the start and end of the current day
  if (!rating) {
    return NextResponse.json({
      gigstatus: false,
      message: "Rating  is required",
    });
  }
  if (!comment) {
    return NextResponse.json({
      gigstatus: false,
      message: "A written review  is needed.",
    });
  }
  if (!rating && !comment) {
    return NextResponse.json({
      gigstatus: false,
      message: "Rating and Comment are required",
    });
  } else {
    try {
      await connectDb();

      // Find the event and ensure it's not already booked
      const newGig = await Gigs.findById({ _id: id });

      if (newGig?.isPending === true && newGig?.isTaken === true) {
        return NextResponse.json({
          gigstatus: "false",
          message: "Cannot Review this Gig ",
        });
      }

      const booker = await User.findById({ _id: newGig?.bookedBy?._id });
      const poster = await User.findById({ _id: newGig?.postedBy?._id });
      await booker?.updateOne(
        {
          $push: {
            allreviews: {
              postedBy,
              rating,
              comment,
              gigId: id,
              createdAt: moment().toISOString(),
              updatedAt: moment().toISOString(),
            },
          },
        },
        { new: true }
      );
      await poster?.updateOne(
        {
          $push: {
            myreviews: {
              postedTo,
              rating,
              comment,
              gigId: id,
              // updatedAt
              createdAt: moment().toISOString(),
              updatedAt: moment().toISOString(),
            },
          },
        },
        { new: true }
      );

      return NextResponse.json({
        gigstatus: true,
        message: "Reviewed Gig successfully",
      });
    } catch (error) {
      console.log(error);
    }
  }
}
