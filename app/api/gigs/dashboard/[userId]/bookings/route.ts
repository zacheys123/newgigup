// app/api/dashboard/[userId]/bookings/route.ts
import connectDb from "@/lib/connectDb";
import Gig from "@/models/gigs";
import { GigFilter } from "@/types/giginterface";
import { getAuth } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  try {
    const { userId } = getAuth(request);
    if (!userId) return new NextResponse("Unauthorized", { status: 401 });

    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "6");
    const skip = (page - 1) * limit;

    await connectDb();

    const search = searchParams.get("search") || "";
    const location = searchParams.get("location") || "";
    const category = searchParams.get("category") || "";

    const finddata = {
      "bookCount.clerkId": userId,
      isTaken: true,
    };
    const query: GigFilter = {};
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: "i" } },
        { description: { $regex: search, $options: "i" } },
      ];
    }

    if (location) query.location = location;
    if (category) query.category = category;

    const [bookedGigs, total, locations, categories] = await Promise.all([
      Gig.find(finddata).sort({ createdAt: -1 }).skip(skip).limit(limit),
      Gig.countDocuments(query),
      Gig.distinct("location", { "bookCount.clerkId": userId }),
      Gig.distinct("category", { "bookCount.clerkId": userId }),
    ]);
    return NextResponse.json({
      data: bookedGigs,
      total,
      page,
      totalPages: Math.ceil(total / limit),
      filters: { locations, categories },
    });
  } catch (error) {
    console.error(error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
