// app/api/admin/register/route.ts
import { NextRequest, NextResponse } from "next/server";
import { getAuth } from "@clerk/nextjs/server";
import User from "@/models/user";
import connectDb from "@/lib/connectDb"; // Make sure you have this

export async function POST(req: NextRequest) {
  try {
    await connectDb(); // Ensure database connection

    const { userId } = getAuth(req);
    const { transformedUser, city, adminRole } = await req.json();
    const adminEmail = transformedUser?.emailAddresses[0]?.emailAddress;

    console.log(adminRole, city, adminEmail);
    // Validate requesting user
    const requestingUser = await User.findOne({ clerkId: userId });
    if (requestingUser?.isAdmin) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    // Validate email against whitelist
    const adminWhitelist =
      process.env.ADMIN_EMAILS?.split(",").map((e) => e.trim()) || [];
    if (!adminWhitelist.includes(adminEmail)) {
      return NextResponse.json(
        { error: "Email not authorized for admin access" },
        { status: 403 }
      );
    }

    // Update user with admin privileges
    const updateData = {
      isAdmin: true,
      adminRole: adminRole
        ? adminRole
        : process.env.DEFAULT_ADMIN_ROLE || "content",
      adminPermissions: ["view-dashboard", "manage-users"],
      isClient: false, // Ensure admin isn't a client
      isMusician: false, // Ensure admin isn't a musician
      city,
      firstLogin: false,
      onboardingComplete: true,
      firstname: transformedUser?.firstname,
      lastname: transformedUser?.lastname,
      email: transformedUser?.emailAddresses[0].emailAddress,
      picture: transformedUser?.imageUrl,
    };

    await User.findOneAndUpdate({ clerkId: userId }, updateData, {
      upsert: true,
      new: true,
    });
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
