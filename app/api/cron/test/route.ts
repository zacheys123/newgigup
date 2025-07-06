// app/api/cron/test/route.ts
import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json(
    {
      status: "working",
      time: new Date().toISOString(),
    },
    {
      headers: {
        "Content-Type": "application/json",
        "Cache-Control": "no-store",
      },
    }
  );
}
