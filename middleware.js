import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";

// Create a route matcher for public routes like sign-in and sign-up
const isPublicRoute = createRouteMatcher([
  "/sign-in(.*)",
  "/sign-up(.*)",
  "/(.*)",
  "/roles/:userId(.*)",
]);

export default clerkMiddleware(async (auth, request) => {
  // Check if the route is public
  if (!isPublicRoute(request)) {
    // If the route is not public, protect it with Clerk authentication
    await auth.protect();
  }

  // Redirect authenticated users from auth pages to the dashboard
  if (auth.userId && isPublicRoute(request)) {
    return Response.redirect(new URL("/dashboard", request.url));
  }

  // If the user is not authenticated and trying to access protected routes, redirect to sign-in
  if (!auth.userId && !isPublicRoute(request)) {
    return Response.redirect(new URL("/sign-in", request.url));
  }
});

// Define the matcher for API routes and all other routes except static and internal Next.js files
export const config = {
  matcher: [
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    "/(api|trpc)(.*)", // Always run for API routes
  ],
};
