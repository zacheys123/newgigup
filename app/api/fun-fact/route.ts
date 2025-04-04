import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

export async function GET() {
  const filePath = path.join(process.cwd(), "public", "funFacts.json");
  const fileData = fs.readFileSync(filePath, "utf8");
  const funFacts = JSON.parse(fileData);

  return NextResponse.json(funFacts);
}
