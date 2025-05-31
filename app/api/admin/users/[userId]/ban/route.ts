// app/api/admin/users/[userId]/ban/route.ts
import connectDb from "@/lib/connectDb";
import User from "@/models/user";
import { getAuth } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";

export async function POST(
  req: NextRequest,
  { params }: { params: { userId: string } }
) {
  try {
    const { userId } = params;
    const { action, reason, duration } = await req.json();

    // Verify admin
    const { userId: clerkId } = getAuth(req);
    if (!clerkId) return new NextResponse("Unauthorized", { status: 401 });

    await connectDb();

    const adminUser = await User.findOne({ clerkId });
    if (!adminUser?.isAdmin) {
      return new NextResponse("Unauthorized", { status: 403 });
    }

    // Calculate ban expiration if temporary ban
    let banExpiresAt = null;
    if (action === "ban" && duration) {
      const now = new Date();
      now.setDate(now.getDate() + parseInt(duration));
      banExpiresAt = now;
    }

    // Handle both ban/unban
    const updateData =
      action === "ban"
        ? {
            isBanned: true,
            banReason: reason || "No reason provided",
            bannedAt: new Date(),
            banExpiresAt,
            banReference: `BAN-${Date.now()}-${Math.random()
              .toString(36)
              .substring(2, 8)}`,
          }
        : {
            isBanned: false,
            banReason: null,
            bannedAt: null,
            banExpiresAt: null,
            banReference: null,
          };

    const updatedUser = await User.findByIdAndUpdate(userId, updateData, {
      new: true,
    });

    if (!updatedUser) {
      return new NextResponse("User not found", { status: 404 });
    }

    // Prepare response data
    const responseData = {
      ...updatedUser.toObject(),
      // Include admin info for logging/notification purposes
      adminAction: {
        adminId: adminUser._id,
        adminName: adminUser.firstname,
        action,
        timestamp: new Date(),
      },
    };

    return NextResponse.json(responseData);
  } catch (error) {
    console.error("[ADMIN_BAN_ACTION]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
