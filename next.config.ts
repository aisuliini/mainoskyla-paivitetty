import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'jkbmxppwoiidkoltraez.supabase.co',
      },
    ],
  },
};

export default nextConfig;
