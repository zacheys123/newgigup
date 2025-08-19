import connectDb from "@/lib/connectDb";
import User from "@/models/user";
import { getAuth } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";
interface UserEmail {
  emailAddress: string;
  verification?: {
    status: string;
  };
}

interface UserPhone {
  phoneNumber: string;
}

interface UserInput {
  id: string;
  firstName?: string;
  lastName?: string;
  imageUrl?: string;
  username?: string;
  emailAddresses: UserEmail[];
  phoneNumbers: UserPhone[];
  city: string;
  instrument: string;
  experience: string;
  roleType: string;
  djGenre: string;
  djEquipment: string;
  mcType: string;
  mcLanguages: string;
  djExperience: string;
  talentbio: string;
  vocalistGenre: string;
  tier: string; // Default to free tier
  nextBillingDate: Date;
  monthlyGigsPosted: number; //
  monthlyMessages: number; //
  monthlyGigsBooked: number; //
  gigsBookedThisWeek: [{ count: number; weekStart: Date }];
  lastBookingDate?: Date; // To track weekly reset
  firstLogin: boolean; // Add this flag
  totalSpent: number;
  isClient: boolean;
  isMusician: boolean;
  earnings: number; //
  organization: string; //
  onboardingComplete: boolean; //  isAdmin: boolean;
  isAdmin: boolean;
  adminRole?: "super" | "content" | "support" | "analytics";
  adminPermissions?: string[];
  lastAdminAction?: Date;
  adminNotes?: string;
}

export async function POST(req: NextRequest) {
  try {
    const { userId } = getAuth(req); // Use getAuth for server-side authentication
    const body = await req.json(); // Parse JSON body
    const { transformedUser } = body as { transformedUser: UserInput }; // Use defined type for the user object

    if (!userId) {
      return NextResponse.json({
        userstatus: "error",
        message: "User ID not found",
      });
    }

    const userEmail = transformedUser.emailAddresses[0]?.emailAddress;


    const currentUser = await User.findOne({ clerkId: userId });
    if (currentUser) {
      return NextResponse.json({
        userstatus: "error",
        message: "User already exists",
      });
    }
    if (!userEmail) {
      return NextResponse.json({
        userstatus: "error",
        message: "Email address is required",
      });
    }
    // Check if the email is already registered
    const existingUser = await User.findOne({ email: userEmail });
    if (existingUser) {
      return NextResponse.json({
        userstatus: "error",
        message: "Email address already registered",
      });
    }
    // Check if the user is an admin based on a whitelist
    if (!transformedUser.emailAddresses[0]?.verification?.status) {
      return NextResponse.json({
        userstatus: "error",
        message: "Email address is not verified",
      });
    }
    
    const adminWhitelist = process.env.ADMIN_WHITELIST?.split(",") || [];
    const isAdmin = adminWhitelist.includes(userEmail);

    console.log(body)
    const userData = {
      firstname: transformedUser.firstName,
      lastname: transformedUser.lastName,
      picture: transformedUser.imageUrl,
      email: userEmail,
      username: transformedUser.username,
      phone: transformedUser.phoneNumbers[0]?.phoneNumber,
      verification: transformedUser.emailAddresses[0]?.verification?.status,
      isClient: isAdmin ? false : body.isClient, // Admins shouldn't be clients/musicians
      isMusician: isAdmin ? false : body.isMusician,
      city: body.city,
      instrument: body.instrument,
      experience: body.experience,
      roleType: body.roleType,
      djGenre: body.djGenre,
      djEquipment: body.djEquipment,
      mcType: body.mcType,
      mcLanguages: body.mcLanguages,
      talentbio: body.talentbio,
      vocalistGenre: body.vocalistGenre,
      tier: body.tier,
      nextBillingDate: body.nextBillingDate,
      monthlyGigsPosted: body.monthlyGigsPosted,
      gigsBookedThisWeek: body.gigsBookedThisWeek, // Track weekly bookings
      lastBookingDate: body.lastBookingDate, // To track weekly reset
      monthlyMessages: body.monthlyMessages,
      monthlyGigsBooked: body.monthlyGigsBooked,
      firstLogin: body.firstLogin,
      totalSpent: body.totalSpent,
      earnings: body.earnings, //
      organization: body.organization, //
      onboardingComplete: body.onboardingComplete, //
    };
    await connectDb();
    await User.findOneAndUpdate({ clerkId: userId }, userData, {
      upsert: true,
      new: true,
    });

    return NextResponse.json({
      success: true,
      redirectUrl: isAdmin ? "/admin/dashboard" : "/dashboard",
      message:
        "Successfully Registered,Welcome to gigUp" + transformedUser?.firstName,
    });
  } catch (error) {
    console.error("Error processing request:", error);
    return NextResponse.json({
      userstatus: "error",
      message: error instanceof Error ? error.message : String(error),
    });
  }
}
