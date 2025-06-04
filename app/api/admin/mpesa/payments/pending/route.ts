import { NextResponse } from "next/server";
import connectDb from "@/lib/connectDb";
import { PendingPayment } from "@/models/pendingPayment";

export async function GET() {
  try {
    await connectDb();
    const pendingPayments = await PendingPayment.find({ status: "pending" })
      .sort({ createdAt: -1 })
      .lean();
    return NextResponse.json({ pendingPayments });
  } catch (error) {
    console.error("Failed to fetch pending payments:", error);
    return NextResponse.json(
      { error: "Failed to fetch payments" },
      { status: 500 }
    );
  }
}
