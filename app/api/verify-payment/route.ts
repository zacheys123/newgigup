import { mpesaService } from "@/services/mpesa.service";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const { checkoutRequestId } = await req.json();
  console.log("Verifying payment with checkoutRequestId:", checkoutRequestId);

  try {
    const verification = await mpesaService.verifyTransaction(
      checkoutRequestId
    );
    console.log("Verification response:", verification);

    if (verification.ResultCode === "0") {
      return NextResponse.json({ success: true });
    } else if (verification.ResultCode === "1032") {
      return NextResponse.json({ success: false, retry: true });
    } else {
      console.log("Transaction failed with code:", verification.ResultCode);
      return NextResponse.json({
        success: false,
        retry: false,
        errorCode: verification.ResultCode,
        errorMessage: verification.ResultDesc,
      });
    }
  } catch (error) {
    console.error("Verification error:", error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : String(error),
        stack: error instanceof Error ? error.stack : undefined,
      },
      { status: 500 }
    );
  }
}
