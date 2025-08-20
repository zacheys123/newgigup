import connectDb from "@/lib/connectDb";
import Posts from "@/models/posts";
import User from "@/models/user";
import { getAuth } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";


export async function GET(req:NextRequest) {
  const{userId}= getAuth(req)
    try {
    const responseHeaders = new Headers();
    responseHeaders.set("Cache-Control", "no-cache, no-store, must-revalidate");
    responseHeaders.set("Pragma", "no-cache");
    responseHeaders.set("Expires", "0");

    await connectDb(); // Connect to MongoDB

    const posts = await Posts.find().populate({path:"postedBy",model:User})

console.log(posts.filter(u=>u.postedBy?.clerkId.includes(userId)).length)
    return NextResponse.json({
      posts,
      userPostsCount: posts.filter(u=>u.postedBy?.clerkId.includes(userId)).length,
    })
  } catch (error) {
    console.error("Failed to fetch posts:", error);
    return NextResponse.json(
      { error: "Failed to fetch posts" },
      { status: 500 }
    );
  }
}
