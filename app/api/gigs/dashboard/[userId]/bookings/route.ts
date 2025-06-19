// app/api/gigs/dashboard/[userId]/bookings/route.ts
import { NextRequest, NextResponse } from "next/server";
import connectDb from "@/lib/connectDb";
import Gigs from "@/models/gigs";
import User from "@/models/user";
import { getAuth } from "@clerk/nextjs/server";
import { Types } from "mongoose";

export async function GET(request: NextRequest) {
  const { userId: clerkUserId } = getAuth(request);

  if (!clerkUserId) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  try {
    await connectDb();

    // Find user and ensure we have valid ObjectId
    const existingUser = await User.findOne({ clerkId: clerkUserId });
    if (!existingUser) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }
    const mongoUserId = new Types.ObjectId(existingUser._id.toString());
    //  existingUser._id as Types.ObjectId;
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "6");
    const search = searchParams.get("search");
    const location = searchParams.get("location");
    const category = searchParams.get("category");

    // Build the query object with proper typing
    const query: {
      bookedBy: Types.ObjectId;
      isTaken: boolean;
      $or?: Array<{
        title?: { $regex: string; $options: string };
        description?: { $regex: string; $options: string };
      }>;
      location?: string;
      category?: string;
    } = {
      bookedBy: mongoUserId,
      isTaken: true,
    };

    if (search) {
      query.$or = [
        { title: { $regex: search, $options: "i" } },
        { description: { $regex: search, $options: "i" } },
      ];
    }

    if (location) query.location = location;
    if (category) query.category = category;

    // Get booked gigs with pagination
    const [bookedGigs, total] = await Promise.all([
      Gigs.find(query)
        .populate("postedBy", "firstname lastname email picture")
        .skip((page - 1) * limit)
        .limit(limit)
        .lean(),
      Gigs.countDocuments(query),
    ]);

    // Get available filters - use mongoUserId here too
    const [locations, categories] = await Promise.all([
      Gigs.distinct("location", { bookedBy: mongoUserId }),
      Gigs.distinct("category", { bookedBy: mongoUserId }),
    ]);

    return NextResponse.json({
      data: bookedGigs,
      total,
      filters: {
        locations: locations.filter(Boolean).sort(),
        categories: categories.filter(Boolean).sort(),
      },
    });
  } catch (error) {
    console.error("Error fetching booked gigs:", error);
    return NextResponse.json(
      {
        message: "Error fetching booked gigs",
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
