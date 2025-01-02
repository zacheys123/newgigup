import connectDb from "@/lib/connectDb";

import Gigs from "@/models/gigs";
import User from "@/models/user";
import { NextResponse } from "next/server";
import axios from "axios";
import { auth } from "@clerk/nextjs";
import ioClient from "socket.io-client"; // Import Socket.io client
// import { sendFCMNotification } from "@/utils/notifications";
import moment from "moment";
// import { sendPushNotification } from "@/lib/firebase/firebaseAdmin";

const socket = ioClient(process.env.NEXT_PUBLIC_PORT); // Connect to the server

export async function PUT(req, { params }) {
  const { userId } = auth();
  const { comment, rating } = await req.json();

  console.log("Rating from front End", rating);
  console.log("Comment from front End", comment);
  let id = params.id;
  if (!userId) {
    return NextResponse.redirect(new URL("/sign-in", req.url));
  } // Get the start and end of the current day
  if (!rating) {
    return NextResponse.json({
      gigstatus: "false",
      message: "Rating  is required",
    });
  }
  if (!comment) {
    return NextResponse.json({
      gigstatus: "false",
      message: "  You have to Comment",
    });
  }
  if (!rating && !comment) {
    return NextResponse.json({
      gigstatus: "false",
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
      await booker.updateOne(
        {
          $push: {
            allreviews: {
              rating: rating,
              comment: comment,

              createdAt: moment().toISOString(),
              updatedAt: moment().toISOString(),
            },
          },
        },
        { new: true }
      );
      await poster.updateOne(
        {
          $push: {
            myreviews: {
              rating: rating,
              comment: comment,
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
        gigstatus: "true",
        message: "Reviewed Gig successfully",
        results: {
          review: {
            rating: rating,
            comment: comment,
            gigId: id,

            createdAt: moment().toISOString(),
            updatedAt: moment().toISOString(),
          },
          booker,
          poster,
        },
      });
    } catch (error) {
      console.log(error);
    }
  }
}
