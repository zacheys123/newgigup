import connectDb from "@/lib/connectDb";
import Gig from "@/models/gigs";
import User from "@/models/user";

import { NextRequest, NextResponse } from "next/server";

// Define interfaces for the request data
interface Rate {
  regular: string;
  function: string;
  corporate: string;
  concert: string;
}

interface UpdateUserRequest {
  firstname: string;
  lastname: string;
  email: string;
  username: string;
  videoUrl?: string;
  title?: string;
  city: string;
  instrument?: string;
  experience?: string;
  age?: string;
  month?: string;
  year?: string;
  address?: string;
  phone?: string;
  organization?: string;
  myhandles?: string[];
  genre?: string[];
  djGenre?: string[];
  djEquipment?: string[];
  mcType?: string;
  mcLanguages?: string[];
  talentbio?: string;
  clienthandles?: string[];
  isMusician: boolean;
  isClient: boolean;
  rate: Rate;
}

interface ErrorResponse {
  updateStatus: false;
  message: string;
}

interface SuccessResponse {
  updateStatus: true;
  message: string;
}

export async function PUT(
  req: NextRequest
): Promise<NextResponse<ErrorResponse | SuccessResponse>> {
  const id = req.nextUrl.pathname.split("/").pop();
  if (!id) {
    return NextResponse.json({
      updateStatus: false,
      message: "User ID is required",
    });
  }

  try {
    const requestData = (await req.json()) as UpdateUserRequest;
    const {
      firstname,
      lastname,
      email,
      username,
      videoUrl,
      title,
      city,
      instrument,
      experience,
      age,
      month,
      year,
      address,
      phone,
      organization,
      myhandles,
      genre,
      djGenre,
      djEquipment,
      mcType,
      mcLanguages,
      talentbio,
      clienthandles,
      isMusician,
      isClient,
      rate,
    } = requestData;

    // Validation checks
    if (isMusician) {
      if (!age) {
        return NextResponse.json({
          updateStatus: false,
          message: "Date is required",
        });
      }
      if (!month) {
        return NextResponse.json({
          updateStatus: false,
          message: "Month is required",
        });
      }
      if (!year) {
        return NextResponse.json({
          updateStatus: false,
          message: "Year is required",
        });
      }
    }

    if (!city) {
      return NextResponse.json({
        updateStatus: false,
        message: "City is required",
      });
    }

    if (!rate) {
      return NextResponse.json({
        updateStatus: false,
        message: "Your Job Rate is required",
      });
    }

    await connectDb();
    if (isClient === true) {
      // Update gigs
      await Gig.updateMany(
        {
          bookCount: id,
          bookedBy: { $ne: id },
        },
        { $pull: { bookCount: id } }
      );
    }
    // Update user
    const updateData = {
      firstname,
      lastname,
      email,
      username,
      instrument: isClient ? "" : instrument,
      experience: isClient ? "" : experience,
      date: isClient ? "" : age,
      month: isClient ? "" : month,
      year: isClient ? "" : year,
      city,
      address,
      phone,
      organization: isMusician ? "" : organization,
      musicianhandles: isClient ? "" : myhandles,
      handles: isClient ? clienthandles : "",
      musiciangenres: isClient ? "" : genre,
      djGenre: isClient ? "" : djGenre,
      djEquipment: isClient ? "" : djEquipment,
      mcType: isClient ? "" : mcType,
      mcLanguages: isClient ? "" : mcLanguages,
      talentbio,
      isMusician,
      isClient,
      rate: {
        regular: rate.regular,
        function: rate.function,
        corporate: rate.corporate,
        concert: rate.concert,
      },
      ...(videoUrl && title && !isClient
        ? {
            $push: {
              videosProfile: {
                url: videoUrl,
                title,
                createdAt: new Date(),
              },
            },
          }
        : {}),
    };

    const user = await User.findByIdAndUpdate({ _id: id }, updateData, {
      new: true,
    }).lean();

    if (!user) {
      return NextResponse.json({
        updateStatus: false,
        message: "User not found",
      });
    }

    return NextResponse.json({
      updateStatus: true,
      message: "Update successful",
    });
  } catch (error) {
    console.error(error);
    const errorMessage =
      error instanceof Error ? error.message : "Unknown error occurred";
    return NextResponse.json({
      updateStatus: false,
      message: errorMessage,
    });
  }
}
