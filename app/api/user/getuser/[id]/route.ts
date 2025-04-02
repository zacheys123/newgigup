import User, { IUser } from "@/models/user";
import { NextResponse } from "next/server";
import connectDb from "@/lib/connectDb";
import { NextRequest } from "next/server";
import { getAuth } from "@clerk/nextjs/server";
import mongoose from "mongoose";

export async function GET(req: NextRequest) {
  const searchUrl = req.nextUrl.pathname.split("/").pop(); // Extract the `id` from the URL path
  const { userId } = getAuth(req);
  if (!userId) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }
  // Check if a string is a valid ObjectId
  function isValidObjectId(id: string): boolean {
    return mongoose.Types.ObjectId.isValid(id);
  }
  try {
    await connectDb();
    const query = {
      $or: [
        { clerkId: searchUrl },
        { username: searchUrl },
        ...(isValidObjectId(searchUrl || "") ? [{ _id: searchUrl }] : []),
      ],
    };
    const user = (await User.findOne(query).populate({
      path: "refferences followers followings",
      model: User,
    })) as IUser | null;

    return NextResponse.json({
      user,
    });
  } catch (error) {
    console.error("Error fetching user:", error);
    return NextResponse.json({
      message: "An error occurred while fetching the user.",
      error: (error as Error).message,
      status: 500,
    });
  }
}
