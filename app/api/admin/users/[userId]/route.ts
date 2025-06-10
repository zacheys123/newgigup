// app/api/admin/users/[userId]/route.ts
import { NextRequest, NextResponse } from "next/server";

import connectDb from "@/lib/connectDb";
import User from "@/models/user";
import { getAuth } from "@clerk/nextjs/server";

async function adminMiddleware(userId: string) {
  await connectDb();

  if (!userId) return false;

  const user = await User.findOne({ clerkId: userId });
  const admin = user?.isAdmin;

  if (!admin) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  return admin;
}

// app/api/admin/users/[userId]/route.ts

export async function GET(req: NextRequest) {
  await connectDb();
  const userId = req.nextUrl.pathname.split("/").pop(); // Extract the `id` from the URL path

  try {
    const user = await User.findById(userId).lean();
    if (!user)
      return NextResponse.json({ error: "User not found" }, { status: 404 });

    return NextResponse.json(user);
  } catch (err) {
    console.log(err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  const { userId } = getAuth(req);
  const res = await adminMiddleware(userId as string);
  if (res instanceof NextResponse) return res;

  await connectDb();

  try {
    const myUserId = req.nextUrl.pathname.split("/").pop(); // Extract the `id` from the URL path

    const body = await req.json();
    const user = await User.findByIdAndUpdate(myUserId, body, {
      new: true,
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    return NextResponse.json(user);
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      { error: "Failed to update user" },
      { status: 500 }
    );
  }
}
