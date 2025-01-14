import connectDb from "@/lib/connectDb";
import User from "@/models/user";
import { UserProps } from "@/types/userinterfaces";
import { NextRequest, NextResponse } from "next/server";
import { getAuth } from "@clerk/nextjs/server";
export async function GET(req: NextRequest) {
  const { userId } = getAuth(req);
  if (!userId) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  try {
    await connectDb();
    const AllOtherUsersNotLoggedIn = await User.find();
    const users = AllOtherUsersNotLoggedIn?.filter(
      (user: UserProps) => user.clerkId !== userId
    );
    return NextResponse.json({ users });
  } catch (error) {
    console.log(error);
    return NextResponse.json({ message: error }, { status: 500 });
  }
}
