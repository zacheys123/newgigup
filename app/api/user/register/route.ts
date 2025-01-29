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
    const { transformedUser } = body as { transformedUser: UserInput }; // Use defined type for the user object

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
        { email: transformedUser.emailAddresses[0]?.emailAddress },
      ],
    });
    let updateUser;
    if (transformedUser && userId && existingUser) {
      updateUser = await User.findOneAndUpdate(
        {
          $or: [
            { clerkId: userId },
            { email: transformedUser.emailAddresses[0]?.emailAddress },
          ],
        },
        {
          $set: {
            firstname: transformedUser.firstName,
            lastname: transformedUser.lastName,
            picture: existingUser?.picture || transformedUser.imageUrl,
            email: transformedUser.emailAddresses[0]?.emailAddress,
            username: transformedUser.username,
            phone: transformedUser.phoneNumbers[0]?.phoneNumber,
            verification:
              transformedUser.emailAddresses[0]?.verification?.status,
            isClient: body.isClient,
            isMusician: body.isMusician,
          },
        },
        { new: true }
      );
    }
    if (transformedUser && userId && existingUser) {
      return NextResponse.json({
        userstatus: false,
        message: "User already exists",
        results: updateUser,
      });
    } else {
      const newUser = new User({
        clerkId: userId,
        firstname: transformedUser.firstName,
        lastname: transformedUser.lastName,
        picture: existingUser?.picture || transformedUser.imageUrl,
        email: transformedUser.emailAddresses[0]?.emailAddress,
        username: transformedUser.username,
        phone: transformedUser.phoneNumbers[0]?.phoneNumber,
        verification: transformedUser.emailAddresses[0]?.verification?.status,
        isClient: body.isClient,
        isMusician: body.isMusician,
      });

      const mainUser = await newUser.save();

      return NextResponse.json({
        userstatus: true,
        message: body.isClient
          ? `Welcome to gigUp ${mainUser?.firstname}`
          : body.isMusician
          ? `Welcome to gigUp ${mainUser?.firstname}`
          : "",
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
