// app/api/appeals/route.ts

import connectDb from "@/lib/connectDb";
import Appeal from "@/models/appeal";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    await connectDb();
    const appeals = await Appeal.find()
      .populate("user", "username email")
      .sort({ createdAt: -1 });
    return NextResponse.json(appeals);
  } catch (error) {
    console.error("Error fetching appeals:", error);
    return NextResponse.json(
      { error: "Failed to fetch appeals" },
      { status: 500 }
    );
  }
}

export async function PUT(req: Request) {
  try {
    const { appealId, status } = await req.json();

    if (!appealId || !status) {
      return NextResponse.json(
        { error: "Appeal ID and status are required" },
        { status: 400 }
      );
    }

    await connectDb();
    const updatedAppeal = await Appeal.findByIdAndUpdate(
      appealId,
      { status },
      { new: true }
    ).populate("user", "username email");

    if (!updatedAppeal) {
      return NextResponse.json({ error: "Appeal not found" }, { status: 404 });
    }

    return NextResponse.json(updatedAppeal);
  } catch (error) {
    console.error("Error updating appeal:", error);
    return NextResponse.json(
      { error: "Failed to update appeal" },
      { status: 500 }
    );
  }
}
