import connectDb from "@/lib/connectDb";
import User from "@/models/user";
import { NextRequest, NextResponse } from "next/server";

export async function PUT(req: NextRequest) {
  const id = req.nextUrl.pathname.split("/").pop(); // Extract the `id` from the URL path

  const formData = await req.json();

  console.log(formData);
  try {
    await connectDb();
    const user = await User.findByIdAndUpdate(
      { _id: id },
      {
        $set: {
          city: formData.location,
          bio: formData?.bio,
          handles: formData?.handles,
          organization: formData?.organization,
        },
      }
    );
    return NextResponse.json({
      updateStatus: true,
      message: "Update successfull",
      userData: user,
    });
  } catch (error) {
    console.log(error);
    return NextResponse.json({
      updateStatus: false,
      message: error,
    });
  }
}
