import { NextRequest, NextResponse } from "next/server";
import { getAuth } from "@clerk/nextjs/server";
import connectDb from "@/lib/connectDb";
import User from "@/models/user";

export async function GET(req: NextRequest) {
  try {
    // Connect to DB with error handling
    await connectDb().catch((err) => {
      console.error("Database connection error:", err);
      throw new Error("Database connection failed");
    });

    // Get auth with detailed logging
    const auth = getAuth(req);
    console.log("Auth object:", JSON.stringify(auth, null, 2));

    if (!auth.userId) {
      console.warn("Unauthorized access attempt");
      return NextResponse.json(
        { error: "Unauthorized - Missing userId" },
        { status: 401 }
      );
    }

    // Find user with projection for security
    const dbUser = await User.findOne(
      { clerkId: auth.userId },
      { isAdmin: 1, adminRole: 1 }
    ).lean();

    if (!dbUser?.isAdmin) {
      console.warn(`Forbidden access attempt by user ${auth.userId}`);
      return NextResponse.json(
        { error: "Forbidden - Admin access required" },
        { status: 403 }
      );
    }

    return NextResponse.json(
      { role: dbUser.adminRole },
      {
        headers: {
          "Cache-Control": "max-age=3600",
          "CDN-Cache-Control": "public, max-age=3600",
        },
      }
    );
  } catch (error) {
    console.error("Full error stack:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
