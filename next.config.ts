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

const pwaConfig = {
  dest: "public",
  register: true,
  skipWaiting: true,
  disable: process.env.NODE_ENV === "development",
  // Optional: Add runtimeCaching if needed
  runtimeCaching: [
    {
      urlPattern: /^https?.*/,
      handler: "NetworkFirst",
      options: {
        cacheName: "offlineCache",
        expiration: {
          maxEntries: 200,
        },
      },
    },
  ],
};

export default withPWA({
  ...nextConfig,
  ...pwaConfig, // Spread the PWA config at the top level
});
