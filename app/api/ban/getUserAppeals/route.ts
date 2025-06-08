// app/api/users/[userId]/appeals/route.ts
import connectDb from "@/lib/connectDb";
import Appeal from "@/models/appeal";
import { getAuth } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
  request: NextRequest,

) {
  try {
         const myUserId = req.nextUrl.pathname.split("/").pop(); // Extract the `id` from the URL path

    // Authentication check
    const { userId: clerkId } = getAuth(request);
    if (!clerkId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await connectDb();

    const appeals = await Appeal.find({ userId:myUserId })
      .sort({ createdAt: -1 })
      .lean();

    return NextResponse.json(appeals);
  } catch (error) {
    console.error("Error fetching user appeals:", error);
    return NextResponse.json(
      { error: "Failed to fetch appeals" },
      { status: 500 }
    );
  }
}
