// app/api/admin/register/route.ts
import { NextRequest, NextResponse } from "next/server";
import { getAuth } from "@clerk/nextjs/server";
import User from "@/models/user";
import connectDb from "@/lib/connectDb"; // Make sure you have this

interface Body {
  transformedUser: {
    firstName: string;
    lastName: string;
    emailAddresses: [{ emailAddress: string }];
    imageUrl: string;
    username: string;
  };
  tier: string;
  adminCity: string;
  adminRole: string;
}
export async function POST(req: NextRequest) {
  try {
    await connectDb(); // Ensure database connection

    const { userId } = getAuth(req);
    const { transformedUser, tier, adminCity, adminRole } =
      (await req.json()) as Body;
    const adminEmail = transformedUser?.emailAddresses[0]?.emailAddress;

    console.log(adminRole, adminCity, adminEmail, tier);
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
      username: transformedUser?.username,
      isAdmin: true,
      adminRole: adminRole
        ? adminRole
        : process.env.DEFAULT_ADMIN_ROLE || "content",
      adminPermissions: ["view-dashboard", "manage-users"],
      isClient: false, // Ensure admin isn't a client
      isMusician: false, // Ensure admin isn't a musician
      adminCity,
      firstLogin: false,
      onboardingComplete: true,
      firstname: transformedUser?.firstName,
      lastname: transformedUser?.lastName,
      email: transformedUser?.emailAddresses[0].emailAddress,
      picture: transformedUser?.imageUrl,
      tier,
    };

    await User.findOneAndUpdate({ clerkId: userId }, updateData, {
      upsert: true,
      new: true,
    });
    return NextResponse.json({
      success: true,
      message: `${adminEmail} upgraded to admin successfully`,
    });
  } catch (error: unknown) {
    console.log(error);

    // Type guard to check if it's a MongoDB duplicate key error
    if (error instanceof Error && "code" in error && error.code === 11000) {
      return NextResponse.json(
        { error: "Username already exists" },
        { status: 400 }
      );
    }

    throw error;
  }
}
