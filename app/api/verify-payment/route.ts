import { NextResponse } from "next/server";
import { mpesaService } from "@/services/mpesa.service";

export async function POST(req: Request) {
  const { checkoutRequestId } = await req.json();

  try {
    const verification = await mpesaService.verifyTransaction(
      checkoutRequestId
    );

    if (verification.ResultCode === "0") {
      return NextResponse.json({ success: true });
    } else if (verification.ResultCode === "1032") {
      // Transaction still in progress
      return NextResponse.json({ success: false, retry: true });
    } else {
      // Transaction failed
      return NextResponse.json({ success: false, retry: false });
    }
  } catch (error) {
    console.error("Verification error:", error);
    return NextResponse.json({ success: false, error }, { status: 500 });
  }
}
