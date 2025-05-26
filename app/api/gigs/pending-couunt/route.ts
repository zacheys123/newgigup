// src/app/api/gigs/pending-count/route.ts
import connectDb from "@/lib/connectDb";
import Gigs from "@/models/gigs";
import User from "@/models/user";
import { UserProps } from "@/types/userinterfaces";
// import User from "@/models/user";
// import { UserProps } from "@/types/userinterfaces";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const userId = searchParams.get("userId");

  if (!userId) {
    return new Response(
      JSON.stringify({ success: false, message: "User ID is required" }),
      {
        status: 400,
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
  }

  try {
    await connectDb();

    const gigs = await Gigs.find().populate({ path: "bookCount", model: User });
    const count = gigs.filter((gig) =>
      gig?.bookCount.some(
        (bookedUser: UserProps) => bookedUser?.clerkId === userId
      )
    )?.length;
    // More efficient query
    // const count = await Gigs.countDocuments({
    //   "bookCount.clerkId": userId,
    //   isTaken: false,
    // });

    return new Response(
      JSON.stringify({
        success: true,
        count,
      }),
      {
        status: 200,
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
  } catch (error) {
    console.error("Error:", error);
    return new Response(
      JSON.stringify({
        success: false,
        message: "Server error",
        error: error instanceof Error ? error.message : "Unknown error",
      }),
      {
        status: 500,
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
  }
}
