import { NextResponse } from "next/server";
import connectDb from "@/lib/connectDb";
import { PendingPayment } from "@/models/pendingPayment";

export async function GET() {
  try {
    await connectDb();
    const failedPayments = await PendingPayment.find({ status: "failed" })
      .sort({ createdAt: -1 })
      .lean();
    return NextResponse.json({ failedPayments });
  } catch (error) {
    console.error("Failed to fetch failed payments:", error);
    return NextResponse.json(
      { error: "Failed to fetch payments" },
      { status: 500 }
    );
  }
}
