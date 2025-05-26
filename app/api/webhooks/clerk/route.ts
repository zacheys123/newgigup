// app/api/webhooks/clerk/route.ts
import { Webhook } from "svix";
import { type WebhookEvent } from "@clerk/nextjs/server";
import connectDb from "@/lib/connectDb";
import User from "@/models/user";

export async function POST(req: Request) {
  const WEBHOOK_SECRET = process.env.CLERK_WEBHOOK_SECRET;

  if (!WEBHOOK_SECRET) {
    throw new Error("CLERK_WEBHOOK_SECRET is missing");
  }

  // Get headers asynchronously
  const headers = await req.headers;
  const svix_id = headers.get("svix-id");
  const svix_timestamp = headers.get("svix-timestamp");
  const svix_signature = headers.get("svix-signature");

  if (!svix_id || !svix_timestamp || !svix_signature) {
    return new Response("Error occurred -- no svix headers", {
      status: 400,
    });
  }

  const payload = await req.json();
  const body = JSON.stringify(payload);

  const wh = new Webhook(WEBHOOK_SECRET);

  let evt: WebhookEvent;

  try {
    evt = wh.verify(body, {
      "svix-id": svix_id,
      "svix-timestamp": svix_timestamp,
      "svix-signature": svix_signature,
    }) as WebhookEvent;
  } catch (err) {
    console.error("Error verifying webhook:", err);
    return new Response("Error occurred", {
      status: 400,
    });
  }

  const { id } = evt.data;
  const eventType = evt.type;

  await connectDb();

  // Handle admin users
  if (eventType === "user.created" || eventType === "user.updated") {
    const email = evt.data.email_addresses.find(
      (email) => email.id === evt.data.primary_email_address_id
    )?.email_address;

    // List of admin emails (store in environment variables in production)
    const adminEmails = process.env.ADMIN_EMAILS?.split(",") || [];

    const isAdmin = email ? adminEmails.includes(email) : false;

    await User.findOneAndUpdate(
      { clerkId: id },
      {
        $set: {
          isAdmin,
          ...(isAdmin && { adminRole: "super" }),
        },
      },
      { upsert: true, new: true }
    );
  }

  return new Response("", { status: 200 });
}
