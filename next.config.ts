import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    domains: [
      "img.clerk.com",
      // "images.unsplash.com",
      // "avatars.githubusercontent.com",
      // "www.gravatar.com",
      // "gravatar.eu",
      // "gravatar.com",
      // "gravatar.us",
      // "gravatar.net",
      // "cdn.discordapp.com",
      // "cdn.discordcdn.com",
      // "i.stack.imgur.com",
      "res.cloudinary.com",
      // "i.imgur.com",
      "lh3.googleusercontent.com",
    ],
  },
};

export default nextConfig;
