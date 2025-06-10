import connectDb from "@/lib/connectDb";
import User from "@/models/user";
import { NextRequest, NextResponse } from "next/server";

interface UserQuery {
  $or?: { [key: string]: { $regex: string; $options: string } }[];
  isMusician?: boolean;
  isClient?: boolean;
  isAdmin?: boolean;
}

export async function GET(req: NextRequest) {
  await connectDb();

  const { searchParams } = new URL(req.url);
  const query = searchParams.get("query") || "";
  const role = searchParams.get("role") || "all";
  const page = parseInt(searchParams.get("page") || "1", 10);
  const limit = 5;
  const skip = (page - 1) * limit;

  const filter: UserQuery = {};

  if (query) {
    filter.$or = [
      { firstname: { $regex: query, $options: "i" } },
      { email: { $regex: query, $options: "i" } },
    ];
  }

  if (role === "admin") {
    filter.isAdmin = true;
  } else if (role === "client") {
    filter.isClient = true;
  } else if (role === "musician") {
    filter.isMusician = true;
  }

  const users = await User.find(filter).skip(skip).limit(limit).lean();
  const totalUsers = await User.countDocuments(filter);
  const totalPages = Math.ceil(totalUsers / limit);

  return NextResponse.json({ users, totalUsers, totalPages });
}
