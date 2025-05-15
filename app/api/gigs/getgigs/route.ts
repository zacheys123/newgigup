import connectDb from "@/lib/connectDb";
import Gigs from "@/models/gigs";
import User from "@/models/user";
import { getAuth } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const { userId } = getAuth(req);
  if (!userId) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }
  try {
    await connectDb();
    const gigs = await Gigs.find()
      .populate({
        path: "postedBy bookCount bookedBy",
        model: User,
      })

      .collation({ locale: "en", strength: 2 })
      .sort({ createdAt: -1 }) // Sort by createdAt in descending order

      .exec();
    console.log(gigs);
    return NextResponse.json({ gigs });
  } catch (error) {
    console.log(error);
    return NextResponse.json({ message: error }, { status: 500 });
  }
}
