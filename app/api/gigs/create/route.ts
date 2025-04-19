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
  gigtimeline: string;
  day: string;
  mcType: string;
  mcLanguages: string;
  djGenre: string;
  djEquipment: string;
  vocalistGenre: string[];
  pricerange: string;
  currency: string;
  isPending: boolean;
  scheduleDate: Date;
};

export async function POST(req: NextRequest) {
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
    gigtimeline,
    day,
    mcType,
    mcLanguages,
    djGenre,
    djEquipment,
    vocalistGenre,
    pricerange,
    currency,
    isPending,
    scheduleDate,
  }: Info = await req.json();

  console.log(otherTimeline);
  console.log(day);
  console.log(currency);

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
  if (!currency) {
    return NextResponse.json({
      gigstatus: "false",
      message: "Currency is required",
    });
  }
  if (!pricerange) {
    return NextResponse.json({
      gigstatus: "false",
      message: "Price Range is required",
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
  if (!gigtimeline) {
    return NextResponse.json({
      gigstatus: "false",
      message: "Gig timeline is required",
    });
  }
  if (!day) {
    if (gigtimeline === "weekly" || gigtimeline === "other") {
      return NextResponse.json({
        gigstatus: "false",
        message: "Day is required",
      });
    }
  }
  if (bussinesscat === "vocalist") {
    if (vocalistGenre?.length === 0 || vocalistGenre === undefined) {
      return NextResponse.json({
        gigstatus: "false",
        message: "Vocalist Genre is required",
      });
    }
  }

  if (bussinesscat === "mc") {
    if (mcType === "" || mcLanguages === "") {
      return NextResponse.json({
        gigstatus: "false",
        message: "Emcee data is required",
      });
    }
  }
  if (bussinesscat === "dj") {
    if (djGenre === "" || djEquipment === "") {
      return NextResponse.json({
        gigstatus: "false",
        message: "DJ data is required",
      });
    }
  }

  const { userId } = getAuth(req);
  if (!userId) {
    return NextResponse.json(
      { message: "Unauthorized", gigstatus: "false" },
      { status: 401 }
    );
  }
  try {
    await connectDb();
    const existingSecret = await Gigs.findOne({
      secret: secret,
    });

    if (
      bandCategory &&
      category &&
      bandCategory.length > 0 &&
      category.length > 0
    ) {
      return NextResponse.json({
        gigstatus: "false",
        message: "Cannot submit both individual and other category, choose one",
      });
    }

    if (existingSecret) {
      return NextResponse.json({
        gigstatus: "false",
        message: "Secret is not secure or it already exists",
      });
    }

    await Gigs.create({
      title,
      description,
      phone: phoneNo,
      price,
      category: bandCategory && bandCategory.length > 0 ? "" : category,
      location,
      date,
      time: {
        to,
        from,
      },
      secret,
      postedBy,
      bussinesscat,
      bandCategory: category && category.length > 0 ? "" : bandCategory,
      font,
      fontColor,
      backgroundColor,
      logo,
      otherTimeline,
      gigtimeline,
      day,
      mcType,
      mcLanguages,
      djGenre,
      djEquipment,
      vocalistGenre,
      pricerange,
      currency,
      isPending,
      scheduleDate,
    });

    await User.findByIdAndUpdate(postedBy, {
      $inc: { monthlyGigsPosted: 1 }, // This will increment the field by 1
    });
    return NextResponse.json({
      gigstatus: "true",
      message: "Created Gig successfully",
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json({
      errorstatus: "error",
      message: error instanceof Error ? error.message : "Unknown error",
    });
  }
}
