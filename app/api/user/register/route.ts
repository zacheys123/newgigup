import connectDb from "@/lib/connectDb";
import User from "@/models/user";
import { getAuth } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";

interface UserEmail {
  emailAddress: string;
  verification?: {
    status: string;
  };
}

interface UserPhone {
  phoneNumber: string;
}

interface UserInput {
  firstName?: string;
  lastName?: string;
  imageUrl?: string;
  username?: string;
  emailAddresses: UserEmail[];
  phoneNumbers: UserPhone[];
}

export async function POST(req: NextRequest): Promise<Response> {
  try {
    const { userId } = getAuth(req); // Use getAuth for server-side authentication
    const body = await req.json(); // Parse JSON body
    const { user } = body as { user: UserInput }; // Use defined type for the user object

    if (!userId) {
      return NextResponse.json({
        userstatus: "error",
        message: "User ID not found",
      });
    }

    await connectDb();

    const existingUser = await User.findOne({
      $or: [
        { clerkId: userId },
        { email: user.emailAddresses[0]?.emailAddress },
      ],
    });

    const updateUser = await User.findOneAndUpdate(
      {
        $or: [
          { clerkId: userId },
          { email: user.emailAddresses[0]?.emailAddress },
        ],
      },
      {
        $set: {
          firstname: user.firstName,
          lastname: user.lastName,
          picture: existingUser?.picture || user.imageUrl,
          email: user.emailAddresses[0]?.emailAddress,
          username: user.username,
          phone: user.phoneNumbers[0]?.phoneNumber,
          verification: user.emailAddresses[0]?.verification?.status,
        },
      },
      { new: true }
    );

    if (userId && existingUser) {
      return NextResponse.json({
        userstatus: false,
        message: "User already exists",
        results: updateUser,
      });
    } else {
      const newUser = new User({
        clerkId: userId,
        firstname: user.firstName,
        lastname: user.lastName,
        picture: existingUser?.picture || user.imageUrl,
        email: user.emailAddresses[0]?.emailAddress,
        username: user.username,
        phone: user.phoneNumbers[0]?.phoneNumber,
        verification: user.emailAddresses[0]?.verification?.status,
      });

      const mainUser = await newUser.save();

      return NextResponse.json({
        userstatus: true,
        message: "Success",
        results: mainUser,
      });
    }
  } catch (error) {
    console.error("Error processing request:", error);

    return NextResponse.json({
      userstatus: "error",
      message: error instanceof Error ? error.message : String(error),
    });
  }
}
