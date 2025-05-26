// app/api/admin/register/route.ts
import { NextRequest, NextResponse } from "next/server";
import { getAuth } from "@clerk/nextjs/server";
import User from "@/models/user";
import connectDb from "@/lib/connectDb"; // Make sure you have this

export async function POST(req: NextRequest) {
  try {
    await connectDb(); // Ensure database connection

    const { userId } = getAuth(req);
    const { adminEmail, city, role } = await req.json();

    // Validate requesting user
    const requestingUser = await User.findOne({ clerkId: userId });
    if (!requestingUser?.isAdmin || requestingUser.adminRole !== "super") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    // Validate email against whitelist
    const adminWhitelist =
      process.env.ADMIN_WHITELIST?.split(",").map((e) => e.trim()) || [];
    if (!adminWhitelist.includes(adminEmail)) {
      return NextResponse.json(
        { error: "Email not authorized for admin access" },
        { status: 403 }
      );
    }

    // Find and upgrade user
    const userToUpgrade = await User.findOne({ email: adminEmail });
    if (!userToUpgrade) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Update user with admin privileges
    const updateData = {
      isAdmin: true,
      adminRole: role ? role : process.env.DEFAULT_ADMIN_ROLE || "content",
      adminPermissions: ["view-dashboard", "manage-users"],
      isClient: false, // Ensure admin isn't a client
      isMusician: false, // Ensure admin isn't a musician
      city,
    };

    await User.findByIdAndUpdate(userToUpgrade._id, updateData);

    return NextResponse.json({
      success: true,
      message: `${adminEmail} upgraded to admin successfully`,
    });
  } catch (error) {
    console.error("Admin registration error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
