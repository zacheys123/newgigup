import { clerkMiddleware } from "@clerk/nextjs/server";

export default clerkMiddleware();

export const config = {
  publicRoutes: [
    "/",
    "/api/user/getuser/:id",
    "/api/user/getAllusers/:id",
    "/api/posts/getPosts",
    "/api/comments/getComments",
    "/api/comments/getComment/:id",
    "/api/reply/getReplies",
    "/api/gigs/getpub/:id",
    "/api/gigs/getcreated/:id",
    "/api/gigs/allgigs",
    "/api/gigs/getgig/:id",
    "/api/chat/createchat",
    "/api/chat/sendmessage",
    "/api/online",
    "/api/chat/fetchchats/:userid/:id",
    "/api/chat/getuserchat/:id",
    "/api/posts/getusersposts",
    "/api/user/getAllmyusers",
    "/api/updatePending",
  ],
  matcher: [
    // Skip Next.js internals and all static files, unless found in search params
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    // Always run for API routes
    "/(api|trpc)(.*)",
  ],
};
