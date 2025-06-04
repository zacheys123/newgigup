import { NextResponse } from "next/server";
import connectDb from "@/lib/connectDb";
import { PendingPayment } from "@/models/pendingPayment";

export async function POST(request: Request) {
  try {
    await connectDb();
    const { checkoutRequestId, status } = await request.json();

    if (
      !checkoutRequestId ||
      !["success", "failed", "pending"].includes(status)
    ) {
      return NextResponse.json({ error: "Invalid data" }, { status: 400 });
    }

    const payment = await PendingPayment.findOne({ checkoutRequestId });

    if (!payment) {
      return NextResponse.json({ error: "Payment not found" }, { status: 404 });
    }

    payment.status = status;
    await payment.save();

    return NextResponse.json({ message: "Payment status updated" });
  } catch (error) {
    console.error("Failed to update payment:", error);
    return NextResponse.json(
      { error: "Failed to update payment" },
      { status: 500 }
    );
  }
}
