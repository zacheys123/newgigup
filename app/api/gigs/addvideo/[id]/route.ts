import connectDb from "@/lib/connectDb";
import User from "@/models/user";
import { NextRequest, NextResponse } from "next/server";
// import { sendPushNotification } from "@/lib/firebase/firebaseAdmin";
// const socket = ioClient(process.env.NEXT_PUBLIC_PORT); // Connect to the server

export async function PUT(req: NextRequest) {
  const id = req.nextUrl.pathname.split("/").pop(); // Extract the `id` from the URL path

  const { title, description, media, postedBy } = await req.json();

  console.log("Rating from front End", title);
  console.log("Comment from front End", description);

  // if (!userId) {
  //   return NextResponse.redirect(new URL("/sign-in", req.url));
  // } // Get the start and end of the current day
  if (!title) {
    return NextResponse.json({
      gigstatus: false,
      message: "Title  is required",
    });
  }
  if (!description) {
    return NextResponse.json({
      gigstatus: false,
      message: "A descrption  is needed.",
    });
  }
  if (!title && !description) {
    return NextResponse.json({
      gigstatus: false,
      message: "Title and Description are required",
    });
  } else {
    try {
      await connectDb();

      // Find the event and ensure it's not already booked
      const updatedUser = await User.findById({ _id: postedBy });

      if (!updatedUser) {
        return NextResponse.json({
          gigstatus: "false",
          message: "Cannot find user ",
        });
      }

      await updatedUser.updateOne(
        {
          $push: {
            videos: {
              title: title,
              description: description,
              gigId: id,
              source: media,
            },
          },
        },
        { new: true }
      );

      return NextResponse.json({
        gigstatus: true,
        message: "Posted Video successfully",
      });
    } catch (error) {
      console.log(error);
    }
  }
}
