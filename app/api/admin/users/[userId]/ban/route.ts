import connectDb from "@/lib/connectDb";
import User from "@/models/user";
import { getAuth } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const userId = req.nextUrl.pathname.split("/").pop(); // Extract the `id` from the URL path

    const body = await req.json();
    const { action, reason, duration } = body;

    // Validate action
    if (!["ban", "unban"].includes(action)) {
      return new NextResponse("Invalid action. Must be 'ban' or 'unban'.", {
        status: 400,
      });
    }

    // Validate ban inputs
    if (action === "ban") {
      if (!reason || typeof reason !== "string" || reason.trim() === "") {
        return new NextResponse("Ban reason is required.", { status: 400 });
      }
      if (
        duration === undefined ||
        isNaN(parseInt(duration)) ||
        parseInt(duration) <= 0
      ) {
        return new NextResponse(
          "Invalid duration. Must be a positive number.",
          {
            status: 400,
          }
        );
      }
    }

    // Auth check
    const { userId: clerkId } = getAuth(req);
    if (!clerkId) return new NextResponse("Unauthorized", { status: 401 });

    await connectDb();

    const adminUser = await User.findOne({ clerkId });
    if (!adminUser?.isAdmin) {
      return new NextResponse("Unauthorized", { status: 403 });
    }

    // Compute ban expiration date
    let banExpiresAt = null;
    if (action === "ban") {
      const now = new Date();
      now.setDate(now.getDate() + parseInt(duration));
      banExpiresAt = now;
    }

    const updateData =
      action === "ban"
        ? {
            isBanned: true,
            banReason: reason.trim(),
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

    const responseData = {
      ...updatedUser.toObject(),
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
