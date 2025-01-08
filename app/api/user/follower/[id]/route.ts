import connectDb from "@/lib/connectDb";
import User from "@/models/user";
import { getAuth } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";

export async function PUT(req: NextRequest) {
  const id = req.nextUrl.pathname.split("/").pop(); // Extract the `id` from the URL path
  console.log("all id", id);
  const { follower } = await req.json();
  console.log("follower", follower);
  const { userId } = getAuth(req);
  if (!userId) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }
  try {
    await connectDb();
    let friend = await User.findById(id);
    if (friend.followers.includes(follower)) {
      return NextResponse.json({ result: friend, status: 403 });
    }

    await friend.updateOne({ $push: { followers: follower } });
    friend = await User.findById(id);
    console.log("YOU HAVE FOLLOWED THIS::::::", friend);
    return NextResponse.json({ result: friend, status: 200 });
  } catch (error) {
    console.log(error);
    return NextResponse.json({ message: error, status: 500 });
  }
}
