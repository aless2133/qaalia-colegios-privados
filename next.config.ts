import withSerwistInit from "@serwist/next";
import type { NextConfig } from "next";

const withSerwist = withSerwistInit({
  swSrc: "src/app/sw.ts",
  swDest: "public/sw.js",
  cacheOnNavigation: true,
  reloadOnOnline: false, 
  disable: process.env.NODE_ENV === "development",
});

const nextConfig: NextConfig = {
  allowedDevOrigins: ["species-drudge-nerd.ngrok-free.dev"],
  transpilePackages: ['react-onesignal'],

  experimental: {
    serverActions: {
      allowedOrigins: [
        "localhost:3000",
        "species-drudge-nerd.ngrok-free.dev"
      ]
    }
  },
  
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '*.supabase.co',
      },
    ],
  },
};

export default withSerwist(nextConfig);