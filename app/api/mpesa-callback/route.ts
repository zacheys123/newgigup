// app/api/mpesa-callback/route.ts
import connectDb from "@/lib/connectDb";
import User from "@/models/user";
import { NextResponse } from "next/server";

// Define TypeScript interfaces for the M-Pesa callback data
interface MpesaCallbackMetadataItem {
  Name: string;
  Value: string | number;
}

interface MpesaCallbackBody {
  stkCallback: {
    ResultCode: number;
    CallbackMetadata: {
      Item: MpesaCallbackMetadataItem[];
    };
  };
}

interface MpesaCallbackData {
  Body: MpesaCallbackBody;
}

export async function POST(request: Request) {
  try {
    await connectDb();

    const callbackData: MpesaCallbackData = await request.json();

    // Verify successful payment
    if (callbackData.Body.stkCallback.ResultCode === 0) {
      const metadata = callbackData.Body.stkCallback.CallbackMetadata.Item;

      // Extract account reference (contains clerkId)
      const accountReferenceItem = metadata.find(
        (item: MpesaCallbackMetadataItem) => item.Name === "AccountReference"
      );

      if (!accountReferenceItem) {
        throw new Error("AccountReference not found in callback metadata");
      }

      const clerkId = accountReferenceItem.Value.toString().replace("sub_", "");

      // Calculate next billing date
      const nextBillingDate = new Date();
      nextBillingDate.setMonth(nextBillingDate.getMonth() + 1);

      // Update user subscription
      await User.findOneAndUpdate(
        { clerkId },
        {
          tier: "pro",
          nextBillingDate,
        }
      );

      return NextResponse.json({ success: true });
    }

    return NextResponse.json({ success: false });
  } catch (error) {
    console.error("Callback processing error:", error);
    return NextResponse.json(
      { success: false, error: "Callback processing failed" },
      { status: 500 }
    );
  }
}
