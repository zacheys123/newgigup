import connectDb from "@/lib/connectDb";
import User from "@/models/user";
import { getAuth } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";

export async function PUT(req: NextRequest) {
  const { following } = await req.json();

  const id = req.nextUrl.pathname.split("/").pop(); // Extract the `id` from the URL path
  console.log("all id", id);
  const { userId } = getAuth(req);
  if (!userId) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }
  try {
    await connectDb();

    const newUser = await User.findByIdAndUpdate(following, {
      $pull: { followings: id },
    });

    return NextResponse.json({ result: newUser, status: 200 });
  } catch (error) {
    console.log(error);
    return NextResponse.json({ message: error, status: 500 });
  }
}
