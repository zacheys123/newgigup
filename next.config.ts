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
        "images.clerk.dev",
      "res.cloudinary.com",
      // "i.imgur.com",
      "lh3.googleusercontent.com",
    ],
  },
};

const pwaConfig = {
  dest: "public",
  register: true,
  skipWaiting: true,
  disable: process.env.NODE_ENV === "development",
  // Optional: Add runtimeCaching if needed
  runtimeCaching: [
    {
      urlPattern: /\.(?:png|jpg|jpeg|svg)$/,
      handler: "CacheFirst",
      options: {
        cacheName: "offlineCache",
        expiration: {
          maxEntries: 200,
          maxAgeSeconds: 30 * 24 * 60 * 60, // 30 days
        },
      },
    },
  ],
};

export default withPWA({
  ...nextConfig,
  pwa:pwaConfig, // Spread the PWA config at the top level
});
