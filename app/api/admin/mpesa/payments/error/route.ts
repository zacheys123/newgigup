import connectDb from "@/lib/connectDb";
import { PendingPayment } from "@/models/pendingPayment";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    await connectDb();
    const errorPayments = await PendingPayment.find({ status: "error" }).sort({
      createdAt: -1,
    });

    return NextResponse.json({ errorPayments });
  } catch (error) {
    console.error("[M-PESA_SUCCESS_FETCH_ERROR]", error);
    return NextResponse.json(
      { error: "Failed to fetch successful payments" },
      { status: 500 }
    );
  }
}
