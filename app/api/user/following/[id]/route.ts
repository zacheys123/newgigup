import connectDb from "@/lib/connectDb";
import User from "@/models/user";
import { getAuth } from "@clerk/nextjs/server";
import mongoose from "mongoose";
import { NextRequest, NextResponse } from "next/server";

export async function PUT(req: NextRequest) {
  const { following } = await req.json();

  const id = req.nextUrl.pathname.split("/").pop(); // Extract the `id` from the URL path
  const { userId } = getAuth(req);
  if (!userId) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }
  if (
    !id ||
    !mongoose.Types.ObjectId.isValid(id) ||
    !following ||
    !mongoose.Types.ObjectId.isValid(following)
  ) {
    return NextResponse.json(
      { message: "Invalid user ID(s)" },
      { status: 400 }
    );
  }
  const objectId = new mongoose.Types.ObjectId(id);
  const followingId = new mongoose.Types.ObjectId(following);

  try {
    await connectDb();
    const existing = await User.findById(followingId);
    if (existing?.followings.includes(objectId)) {
      return NextResponse.json({ result: existing, status: 403 });
    }
    const newUser = await User.findByIdAndUpdate(following, {
      $push: { followings: id },
    });

    return NextResponse.json({ result: newUser, status: 200 });
  } catch (error) {
    console.log(error);
    return NextResponse.json({ message: error, status: 500 });
  }
}
