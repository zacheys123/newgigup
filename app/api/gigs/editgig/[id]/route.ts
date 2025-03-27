import connectDb from "@/lib/connectDb";
import Gigs from "@/models/gigs";
import User from "@/models/user";
import { getAuth } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";

type Info = {
  title: string;
  description: string;
  phoneNo: string;
  price: number;
  category: string;
  bandCategory: string[];
  location: string;
  date: string;
  to: string;
  from: string;
  postedBy: string;
  bussinesscat: string;
  secret: string;
  font: string;
  fontColor: string;
  backgroundColor: string;
  logo: string;

  otherTimeline: string;
  gigTimeline: string;
  day: string;
};

export async function PUT(req: NextRequest) {
  try {
    const {
      title,
      description,
      phoneNo,
      price,
      category,
      bandCategory,
      location,
      date,
      to,
      from,
      postedBy,
      bussinesscat,
      secret,
      font,
      fontColor,
      backgroundColor,
      logo,
      otherTimeline,
      gigTimeline,
      day,
    }: Info = await req.json();

    if (!logo) {
      return NextResponse.json({
        gigstatus: "false",
        message: "logo is required",
      });
    }
    if (!title) {
      return NextResponse.json({
        gigstatus: "false",
        message: "Title is required",
      });
    }
    if (!description) {
      return NextResponse.json({
        gigstatus: "false",
        message: "Description is required",
      });
    }
    if (!phoneNo) {
      return NextResponse.json({
        gigstatus: "false",
        message: "Phone number is required",
      });
    }
    if (!price) {
      return NextResponse.json({
        gigstatus: "false",
        message: "Price is required",
      });
    }
    if (!location) {
      return NextResponse.json({
        gigstatus: "false",
        message: "Location is required",
      });
    }
    if (!to) {
      return NextResponse.json({
        gigstatus: "false",
        message: "To date is required",
      });
    }

    if (!from) {
      return NextResponse.json({
        gigstatus: "false",
        message: "From date is required",
      });
    }
    if (!bussinesscat) {
      return NextResponse.json({
        gigstatus: "false",
        message: "Business category is required",
      });
    }
    if (!secret) {
      return NextResponse.json({
        gigstatus: "false",
        message: "Secret is required",
      });
    }
    if (!gigTimeline) {
      return NextResponse.json({
        gigstatus: "false",
        message: "Gig timeline is required",
      });
    }
    if (!day) {
      return NextResponse.json({
        gigstatus: "false",
        message: "Day is required",
      });
    }
    if (!fontColor || !backgroundColor) {
      return NextResponse.json({
        gigstatus: "false",
        message: "Font, font color, background color and logo are required",
      });
    }

    const { userId } = getAuth(req);
    if (!userId) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    await connectDb();

    // Find existing gig by secret and ensure user is the owner
    const existingGig = await Gigs.findOne({ secret }).populate({
      path: "postedBy",
      model: User,
    });

    if (!existingGig) {
      return NextResponse.json(
        { gigstatus: "false", message: "Gig not found." },
        { status: 404 }
      );
    }

    if (existingGig.postedBy?.clerkId !== userId) {
      return NextResponse.json(
        { gigstatus: "false", message: "Unauthorized to update this gig." },
        { status: 403 }
      );
    }

    // Ensure only one of category or bandCategory is used
    if (category && bandCategory.length > 0) {
      return NextResponse.json(
        {
          gigstatus: "false",
          message:
            "Cannot submit both individual and band category, choose one",
        },
        { status: 400 }
      );
    }

    // Update the gig
    const updatedGig = await Gigs.findOneAndUpdate(
      { secret },
      {
        title,
        description,
        phoneNo,
        price,
        category: bandCategory.length > 0 ? "" : category,
        bandCategory: category ? [] : bandCategory,
        location,
        date,
        time: { to, from },
        bussinesscat,
        font,
        fontColor,
        backgroundColor,
        logo,
        postedBy,
        otherTimeline,
        gigTimeline,
        day,
      },
      { new: true }
    );

    return NextResponse.json(
      { gigstatus: "true", message: "Updated Gig successfully", updatedGig },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error updating gig:", error);
    return NextResponse.json(
      {
        errorstatus: "error",
        message: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
