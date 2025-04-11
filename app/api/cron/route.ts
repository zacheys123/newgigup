import { NextResponse } from "next/server";
import connectDb from "@/lib/connectDb";
import User from "@/models/user";

export async function POST(req: Request) {
  // Secure the endpoint with a secret key
  const secret = req.headers.get("x-cron-secret");
  if (secret !== process.env.CRON_SECRET) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  try {
    await connectDb();

    // Reset monthlyGigsPosted for all users
    const result = await User.updateMany(
      {},
      { $set: { monthlyGigsPosted: 0 } }
    );

    return NextResponse.json({
      success: true,
      message: `Reset monthly gigs count for ${result.modifiedCount} users`,
    });
  } catch (error) {
    console.error("Error resetting monthly gigs count:", error);
    return NextResponse.json(
      { success: false, message: "Failed to reset monthly gigs count" },
      { status: 500 }
    );
  }
}
