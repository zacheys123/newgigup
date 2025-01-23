import User from "@/models/user";
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
    const {
      _id,
      name,
      email,
      clerkId, // Required and unique
      picture,
      firstname,
      lastname,
      city,
      date,
      month,
      year,
      address,
      instrument,
      experience,
      phone,
      verification,
      username, // Required, unique, and lowercase
      followers, // Array of User IDs
      followings, // Array of User IDs
      allreviews,
      myreviews,
    } = await User.findOne(query);

    console.log(firstname);
    return NextResponse.json({
      _id,
      name,
      email,
      clerkId, // Required and unique
      picture,
      firstname,
      lastname,
      city,
      date,
      month,
      year,
      address,
      instrument,
      experience,
      phone,
      verification,
      username, // Required, unique, and lowercase
      followers, // Array of User IDs
      followings, // Array of User IDs

      allreviews,
      myreviews,
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
