import connectDb from "@/lib/connectDb";
import Gigs from "@/models/gigs";
import User from "@/models/user";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    await connectDb();
    const gigs = await Gigs.find()
      .populate({
        path: "postedBy",
        model: User,
      })
      .populate({
        path: "bookedBy",
        model: User,
      })
      .collation({ locale: "en", strength: 2 })
      .exec();

    return NextResponse.json({ gigs });
  } catch (error) {
    console.log(error);
    return NextResponse.json({ message: error }, { status: 500 });
  }
}
