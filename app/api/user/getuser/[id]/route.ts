import User from "@/models/user";
import { NextResponse } from "next/server";
import connectDb from "@/lib/connectDb";
import { NextRequest } from "next/server";

export async function GET(req: NextRequest, ) {
    const  id  = req.nextUrl.pathname.split("/").pop(); // Extract the `id` from the URL path
  console.log("all id",id );

  try {
    await connectDb();
    const { _id,
  name,
  email,
  clerkI, // Required and unique
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
  usernam, // Required, unique, and lowercase
  followers,  // Array of User IDs
  followings , // Array of User IDs
  videos,
  allreviews,
  myreviews} = await User.findOne({ clerkId: id });

    return NextResponse.json({ _id,
  name,
  email,
  clerkI, // Required and unique
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
  usernam, // Required, unique, and lowercase
  followers,  // Array of User IDs
  followings , // Array of User IDs
  videos,
  allreviews,
  myreviews  , status: 200 });
  } catch (error) {
    return NextResponse.json({ message: (error as Error).message, status: 500 });
  }
}
