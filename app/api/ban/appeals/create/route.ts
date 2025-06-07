// app/api/appeals/route.ts
import { submitAppeal } from "@/lib/appeal";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const appealData = await request.json();
  const response = await submitAppeal(appealData);
  return NextResponse.json(response);
}
