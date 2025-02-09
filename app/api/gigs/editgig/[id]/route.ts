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
    }: Info = await req.json();

    if (
      !title ||
      !description ||
      !phoneNo ||
      !price ||
      !location ||
      !to ||
      !from ||
      !bussinesscat ||
      !secret
    ) {
      return NextResponse.json(
        { gigstatus: "false", message: "All fields should be filled." },
        { status: 400 }
      );
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
