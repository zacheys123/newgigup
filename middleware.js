// middleware.ts
import { clerkMiddleware } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

// 1. Define EXCEPTIONS first (public routes)
const publicRoutes = [
  "/",
  "/sign-in(.*)",
  "/sign-up(.*)",
  "/banned",
  "/unauthorized",
  "/api/stkcallback", // MPesa callback
  "/api/cron(.*)", // All cron jobs
  "/api/public(.*)", // Any other public APIs
];

// 2. Define ADMIN routes
const adminRoutes = ["/admin(.*)", "/api/admin(.*)"];

export default clerkMiddleware(async (auth, request) => {
  const path = request.nextUrl.pathname;

  // 3. Skip middleware for public routes
  if (publicRoutes.some((route) => new RegExp(route).test(path))) {
    // Special handling for auth pages
    if (auth.userId && path.startsWith("/sign-")) {
      return Response.redirect(new URL("/", request.url));
    }
    return NextResponse.next();
  }

  // 4. PROTECT ALL OTHER ROUTES (including all other APIs)
  await auth.protect();

  // 5. Additional checks
  const { isBanned } = auth().sessionClaims?.metadata || {};
  if (isBanned && path !== "/banned") {
    return Response.redirect(new URL("/banned", request.url));
  }

  // 6. Admin route checks
  if (adminRoutes.some((route) => new RegExp(route).test(path))) {
    if (auth().sessionClaims?.metadata?.role !== "admin") {
      return new NextResponse("Unauthorized", { status: 401 });
    }
  }
});

// 7. Matcher config (simplified)
export const config = {
  matcher: ["/((?!_next|static|favicon.ico).*)"], // Catch ALL routes except Next.js internals
};
