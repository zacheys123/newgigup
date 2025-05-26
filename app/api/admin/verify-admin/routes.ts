// app/api/admin/verify-admin/route.ts
import { NextRequest, NextResponse } from "next/server";
import { getAuth } from "@clerk/nextjs/server";
import connectDb from "@/lib/connectDb";
import User from "@/models/user";

export async function GET(req: NextRequest) {
  try {
    await connectDb();
    const { userId } = getAuth(req);

    if (!userId) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const dbUser = await User.findOne({ clerkId: userId });

    if (!dbUser?.isAdmin) {
      return NextResponse.json({ message: "Forbidden" }, { status: 403 });
    }

    return NextResponse.json({
      isAdmin: dbUser?.isAdmin,
      adminRole: dbUser?.adminRole,
    });
  } catch (error) {
    console.error("Admin verification error:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}
