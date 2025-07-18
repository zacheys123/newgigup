import type { NextConfig } from "next";
import withPWA from "@ducanh2912/next-pwa";

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

export default withPWA({
  ...nextConfig,
  dest: "public", // Correct placement - top level
  register: true, // Correct placement - top level

  disable: process.env.NODE_ENV === "development",
});
