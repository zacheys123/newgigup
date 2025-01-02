import User from "@/models/user";
import { NextResponse } from "next/server";
import connectDb from "@/lib/connectDb";
import { NextRequest } from "next/server";

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  console.log(params);
  try {
    await connectDb();
    const { id,
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
  myreviews} = await User.findOne({ clerkId: params.id });

    return NextResponse.json({ id,
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
