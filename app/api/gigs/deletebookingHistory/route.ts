// app/api/bookings/delete/route.ts
import { NextRequest, NextResponse } from "next/server";
import connectDb from "@/lib/connectDb";
import { Types } from "mongoose";
import Gig from "@/models/gigs";
import User from "@/models/user";
import { getAuth } from "@clerk/nextjs/server";

export async function POST(req: NextRequest) {
  try {
    await connectDb();

    // Validate user authentication
    const { userId } = getAuth(req);
    if (!userId) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const { ids } = await req.json();

    if (!ids || !Array.isArray(ids)) {
      return NextResponse.json(
        { message: "Invalid request body" },
        { status: 400 }
      );
    }

    // Validate all IDs
    const validIds = ids.filter((id) => Types.ObjectId.isValid(id));
    if (validIds.length === 0) {
      return NextResponse.json(
        { message: "No valid IDs provided" },
        { status: 400 }
      );
    }

    // Perform deletion in a transaction for atomicity
    const session = await Gig.startSession();
    session.startTransaction();

    try {
      // Update gigs to remove references
      const gigUpdateResult = await Gig.updateMany(
        { "bookingHistory._id": { $in: validIds } },
        { $pull: { bookingHistory: { _id: { $in: validIds } } } },
        { session }
      );

      // Update users to remove references
      const userUpdateResult = await User.updateMany(
        { "bookingHistory._id": { $in: validIds } },
        { $pull: { bookingHistory: { _id: { $in: validIds } } } },
        { session }
      );

      await session.commitTransaction();

      return NextResponse.json({
        message: `${validIds.length} bookings deleted successfully`,
        deletedCount: validIds.length,
        gigsModified: gigUpdateResult.modifiedCount,
        usersModified: userUpdateResult.modifiedCount,
      });
    } catch (error) {
      await session.abortTransaction();
      throw error;
    } finally {
      session.endSession();
    }
  } catch (error) {
    console.error("Error deleting bookings:", error);
    return NextResponse.json(
      {
        message: "Error deleting bookings",
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
