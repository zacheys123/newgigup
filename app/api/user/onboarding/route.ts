import User from "@/models/user";
import { getAuth } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";

// app/api/user/onboarding/route.ts
export async function POST(req: NextRequest) {
  const { userId } = getAuth(req);
  await User.updateOne({ clerkId: userId }, { $set: { firstLogin: false } });
  return NextResponse.json({ success: true });
}
