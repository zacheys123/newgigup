import connectDb from "@/lib/connectDb";
import Gigs from "@/models/gigs";

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
    return NextResponse.json({
      gigstatus: "false",
      message: "All fields should be filled.",
    });
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
