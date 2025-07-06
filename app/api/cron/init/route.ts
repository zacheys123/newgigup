// app/api/cron/init/route.ts
import { startSubscriptionRenewalCron } from "@/services/renewal.services";
import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";
export const revalidate = 0;

const forceRun = "true"; // Add to .env.local

export async function GET() {
  // For v3.0.2+
  if (!forceRun && process.env.NODE_ENV !== "production") {
    return NextResponse.json({
      status: "dev-skip",
      message: "Cron jobs disabled in development",
    });
  }

  try {
    const cronController = startSubscriptionRenewalCron();
    const nextRun = cronController.getNextRun();

    if (!nextRun) {
      throw new Error("Could not determine next run time");
    }

    return NextResponse.json({
      status: "success",
      nextRun: nextRun.toISOString(),
      timezone: "Africa/Nairobi",
    });
  } catch (error) {
    return NextResponse.json(
      {
        status: "error",
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
