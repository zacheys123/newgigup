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
  onboardingComplete: boolean; //
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

    await connectDb();

    await User.findOneAndUpdate(
      { clerkId: userId },

      {
        firstname: transformedUser.firstName,
        lastname: transformedUser.lastName,
        picture: transformedUser.imageUrl,
        email: transformedUser.emailAddresses[0]?.emailAddress,
        username: transformedUser.username,
        phone: transformedUser.phoneNumbers[0]?.phoneNumber,
        verification: transformedUser.emailAddresses[0]?.verification?.status,
        isClient: body.isClient,
        isMusician: body.isMusician,
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
      },
      { upsert: true, new: true }
    );

    return NextResponse.json({
      success: true,
      redirectUrl: "/dashboard", // Force dashboard redirect
    });
  } catch (error) {
    console.error("Error processing request:", error);

    return NextResponse.json({
      userstatus: "error",
      message: error instanceof Error ? error.message : String(error),
    });
  }
}
