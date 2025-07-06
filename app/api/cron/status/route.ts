// app/api/cron/status/route.ts
import { NextResponse } from "next/server";
import cron from "node-cron";

export const dynamic = "force-dynamic"; // Disable all caching
export const revalidate = 0;
// app/api/cron/status/route.ts
export const config = {
  api: {
    bodyParser: false,
    externalResolver: true,
  },
  // Completely bypass middleware
  matcher: false,
};
export async function GET() {
  try {
    // Create clean response object
    const response = {
      success: true as const,
      timestamp: new Date().toISOString(),
      cronJobs: [] as Array<{
        scheduled: string | null;
        running: boolean;
      }>,
    };

    // Safely check cron jobs
    const jobs = cron.getTasks();
    if (jobs instanceof Map) {
      for (const [id, task] of jobs) {
        console.log(id);
        response.cronJobs.push({
          scheduled: task.nextDate?.()?.toString() ?? null,
          running: task.running ?? false,
        });
      }
    }

    return new NextResponse(JSON.stringify(response), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        "X-Cron-Status": "active",
      },
    });
  } catch (error) {
    return new NextResponse(
      JSON.stringify({
        success: false,
        error: error instanceof Error ? error.message : "Unknown error",
      }),
      {
        status: 500,
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
  }
}
