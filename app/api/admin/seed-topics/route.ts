// app/api/admin/seed-topics/route.ts
import { NextRequest, NextResponse } from "next/server";
import connectDb from "@/lib/connectDb";
import { Topic } from "@/models/topics";

import { isAdmin } from "@/lib/actions/isAdmin";
import { getAuth } from "@clerk/nextjs/server";
import { getAllTopics } from "@/services/topicService";

// app/api/admin/topics/route.ts

export async function GET() {
  const topics = await getAllTopics();
  return NextResponse.json(topics);
}

export async function POST(req: NextRequest) {
  const { userId: clerkId } = getAuth(req);

  await isAdmin(clerkId || "");

  try {
    if (process.env.NODE_ENV === "production" && !isAdmin) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    await connectDb();

    const count = await Topic.countDocuments();
    if (count > 0) {
      return NextResponse.json(
        { message: "Topics already exist" },
        { status: 400 }
      );
    }

    // ✅ Import topics.json directly
    const { topics } = await import("@/app/(game)/game/topics.json");

    await Topic.insertMany(topics);

    return NextResponse.json(
      { message: "Seeded successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Seeding error:", error);
    return NextResponse.json(
      { message: "Error seeding topics" },
      { status: 500 }
    );
  }
}
