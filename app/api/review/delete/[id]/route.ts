import connectDb from "@/lib/connectDb";
import User from "@/models/user";
import { getAuth } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";

export async function DELETE(req: NextRequest) {
  const reviewId = req.nextUrl.pathname.split("/").pop(); // Extract the `id` from the URL path
  const { userId } = getAuth(req);
  if (!userId) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }
  try {
    // Connect to the database
    await connectDb();

    // Find the user who has a review with the given reviewId
    const user = await User.findOne({
      myreviews: { $elemMatch: { _id: reviewId } },
    });

    if (!user) {
      return NextResponse.json(
        { error: "Review not found or user not associated with this review" },
        { status: 404 }
      );
    }

    // Remove the review from the myreviews array
    user.myreviews = user.myreviews.filter(
      (review) => review._id.toString() !== reviewId
    );
    await user.save();

    return NextResponse.json({ message: "Review deleted successfully" });
  } catch (error) {
    console.error("Error deleting review:", error);
    return NextResponse.json(
      { error: "An error occurred while deleting the review" },
      { status: 500 }
    );
  }
}
