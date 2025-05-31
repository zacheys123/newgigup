// middleware.ts
import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";

const isPublicRoute = createRouteMatcher([
  "/",
  "/sign-in(.*)",
  "/sign-up(.*)",
  "/banned",
  "/unauthorized",
]);

const isAdminRoute = createRouteMatcher(["/admin(.*)", "/api/admin(.*)"]);

export default clerkMiddleware(async (auth, request) => {
  // Public routes
  if (isPublicRoute(request)) {
    // Redirect authenticated users away from auth pages
    if (auth.userId && request.nextUrl.pathname.startsWith("/sign-")) {
      return Response.redirect(new URL("/", request.url));
    }
    return;
  }

  // Protect all non-public routes
  await auth.protect();

  // Check banned status from Clerk metadata (no DB required)
  const { isBanned } = auth().sessionClaims?.metadata || {};
  if (isBanned && request.nextUrl.pathname !== "/banned") {
    return Response.redirect(new URL("/banned", request.url));
  }

  // Admin route checks
  if (isAdminRoute(request)) {
    const sessionClaims = auth().sessionClaims;
    if (sessionClaims?.metadata?.role === "admin") {
      return Response.redirect(new URL("/admin/dashboard", request.url));
    }
  }
});

export const config = {
  matcher: ["/((?!.*\\..*|_next).*)", "/", "/(api|trpc)(.*)"],
};
