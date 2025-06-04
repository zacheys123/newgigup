import { NextRequest, NextResponse } from "next/server";
import { mpesaService } from "@/services/mpesa.service";
import { getAuth } from "@clerk/nextjs/server";
import User from "@/models/user";
import connectDb from "@/lib/connectDb";
import { updateUserToPro } from "@/lib/subscription/updateUsertoPro";
// import { sendConfirmationEmail } from "@/lib/subscription/sendConfirmationEmail";

export async function POST(req: NextRequest) {
  const { checkoutRequestId } = await req.json();

  try {
    await connectDb();

    const verification = await mpesaService.verifyTransaction(
      checkoutRequestId
    );

    if (verification.success) {
      // Successful payment
      const { userId: clerkId } = getAuth(req);
      const user = await User.findOne({ clerkId }).select(
        "email username nextBillingDate"
      );

      if (!user) {
        throw new Error("User not found");
      }

      await updateUserToPro(clerkId as string);

      // Optionally send confirmation email here if you want

      return NextResponse.json({ success: true });
    }

    // If not success, handle specific M-Pesa codes from data if available
    const resultCode = verification.data?.ResultCode;

    if (resultCode === "1032") {
      // Possibly retryable state
      return NextResponse.json({
        success: false,
        retry: true,
        message: verification.message,
      });
    }

    return NextResponse.json({
      success: false,
      errorCode: resultCode || "UNKNOWN",
      errorMessage: verification.message || "Payment verification failed",
    });
  } catch (error: unknown) {
    console.error("Verification error:", error);
    const errorMessage =
      error instanceof Error ? error.message : "Verification failed";

    return NextResponse.json(
      { success: false, error: errorMessage },
      { status: 500 }
    );
  }
}
