import User from "@/models/user";
import { getAuth } from "@clerk/nextjs/server";
import { NextRequest } from "next/server";

export async function GET(req: NextRequest) {
  const { userId: clerkId } = getAuth(req);

  if (!clerkId) {
    return new Response(JSON.stringify({ error: "Unauthorized" }), {
      status: 401,
    });
  }

  // Fetch from your database
  const user = await User.findOne({ clerkId }).select("theme");

  return new Response(
    JSON.stringify({
      theme: user?.theme || "system",
    })
  );
}

export async function PUT(req: NextRequest) {
  const { userId } = getAuth(req);
  const { theme, id } = await req.json();

  if (!userId) {
    return new Response(JSON.stringify({ error: "Unauthorized" }), {
      status: 401,
    });
  }

  await User.findOneAndUpdate(id, {
    $set: {
      theme,
    },
  });

  return new Response(JSON.stringify({ success: true }));
}
