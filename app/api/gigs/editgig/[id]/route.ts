import connectDb from "@/lib/connectDb";
import Gigs from "@/models/gigs";
import User from "@/models/user";
import { getAuth } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";

type Info = {
  title: string;
  description: string;
  phoneNo: string;
  price: number;
  category: string;
  bandCategory: string[];
  location: string;
  date: string;
  to: string;
  from: string;
  postedBy: string;
  bussinesscat: string;
  secret: string;
  font: string;
  fontColor: string;
  backgroundColor: string;
  logo: string;
  otherTimeline: string;
  gigtimeline: string;
  day: string;
  mcType: string;
  mcLanguages: string;
  djGenre: string;
  djEquipment: string;
  vocalistGenre: string[];
  pricerange: string;
  currency: string;
  isPending: boolean;
  scheduleDate: Date;
};
class GigValidator {
  private data: Partial<Info>;
  private businessCategory: string;
  private gigTimeline: string;

  constructor(data: Partial<Info>) {
    this.data = data;
    this.businessCategory = this.data.bussinesscat || "";
    this.gigTimeline = this.data.gigtimeline || "";
  }

  validateRequiredFields(): NextResponse | null {
    const requiredFields = [
      { field: "logo", message: "Logo is required" },
      { field: "title", message: "Title is required" },
      { field: "description", message: "Description is required" },
      { field: "phoneNo", message: "Phone number is required" },
      { field: "price", message: "Price is required" },
      { field: "location", message: "Location is required" },
      { field: "to", message: "To date is required" },
      { field: "from", message: "From date is required" },
      { field: "bussinesscat", message: "Business category is required" },
      { field: "secret", message: "Secret is required" },
      { field: "gigtimeline", message: "Gig timeline is required" },
      { field: "currency", message: "Currency is required" },
      { field: "pricerange", message: "Price Range is required" },
    ];

    for (const { field, message } of requiredFields) {
      if (!this.data[field as keyof Info]) {
        return this.createErrorResponse(message);
      }
    }

    return null;
  }

  validateConditionalFields(): NextResponse | null {
    // Validate day field based on gig timeline
    if (
      (this.gigTimeline === "weekly" || this.gigTimeline === "other") &&
      !this.data.day
    ) {
      return this.createErrorResponse("Day is required");
    }

    // Validate business category specific fields
    switch (this.businessCategory) {
      case "vocalist":
        if (!this.data.vocalistGenre || this.data.vocalistGenre.length === 0) {
          return this.createErrorResponse("Vocalist Genre is required");
        }
        break;
      case "mc":
        if (!this.data.mcType || !this.data.mcLanguages) {
          return this.createErrorResponse("Emcee data is required");
        }
        break;
      case "dj":
        if (!this.data.djGenre || !this.data.djEquipment) {
          return this.createErrorResponse("DJ data is required");
        }
        break;
    }

    return null;
  }

  validateCategoryExclusivity(): NextResponse | null {
    if (
      this.data.category &&
      this.data.bandCategory &&
      this.data.bandCategory.length > 0
    ) {
      return this.createErrorResponse(
        "Cannot submit both individual and band category, choose one",
        400
      );
    }
    return null;
  }

  private createErrorResponse(
    message: string,
    status: number = 200
  ): NextResponse {
    return NextResponse.json({ gigstatus: "false", message }, { status });
  }
}
export async function PUT(req: NextRequest) {
  const searchUrl = req.nextUrl.pathname.split("/").pop(); // Extract the `id` from the URL path

  const { userId } = getAuth(req);
  if (!userId) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  try {
    const requestData = await req.json();

    // Validate required fields first
    const validator = new GigValidator(requestData);
    const requiredValidation = validator.validateRequiredFields();
    if (requiredValidation) return requiredValidation;

    const conditionalValidation = validator.validateConditionalFields();
    if (conditionalValidation) return conditionalValidation;

    const categoryValidation = validator.validateCategoryExclusivity();
    if (categoryValidation) return categoryValidation;

    // Now destructure after validation
    const {
      title,
      description,
      phoneNo,
      price,
      category,
      bandCategory = [],
      location,
      date,
      to,
      from,
      postedBy,
      bussinesscat,
      secret,
      font,
      fontColor,
      backgroundColor,
      logo,
      otherTimeline,
      gigtimeline,
      day,
      mcType,
      mcLanguages,
      djGenre,
      djEquipment,
      vocalistGenre = [],
      pricerange,
      currency,
      isPending = false,
      scheduleDate,
    }: Info = requestData;

    await connectDb();

    // Find the existing gig
    const existingGig = await Gigs.findOne({
      $or: [{ _id: searchUrl }, { secret: secret }],
    }).populate({
      path: "postedBy",
      model: User,
    });

    if (!existingGig) {
      return NextResponse.json(
        { gigstatus: "false", message: "Gig not found." },
        { status: 404 }
      );
    }

    if (existingGig.postedBy?.clerkId !== userId) {
      return NextResponse.json(
        { gigstatus: "false", message: "Unauthorized to update this gig." },
        { status: 403 }
      );
    }

    // Prepare update object
    const updateData = {
      title,
      description,
      phone: phoneNo, // Note: phone in model vs phoneNo in type
      price,
      category: bandCategory?.length > 0 ? "" : category,
      bandCategory: category ? "" : bandCategory,
      location,
      date,
      time: { to, from },
      secret,
      postedBy,
      bussinesscat,
      font,
      fontColor,
      backgroundColor,
      logo,
      otherTimeline,
      gigtimeline,
      day,
      mcType,
      mcLanguages,
      djGenre,
      djEquipment,
      vocalistGenre,
      pricerange,
      currency,
      isPending,
      scheduleDate,
    };

    // Update the gig
    const updatedGig = await Gigs.findOneAndUpdate({ secret }, updateData, {
      new: true,
    });

    return NextResponse.json(
      { gigstatus: "true", message: "Updated Gig successfully", updatedGig },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error updating gig:", error);
    return NextResponse.json(
      {
        errorstatus: "error",
        message: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
