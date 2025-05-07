import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "chordeus.fr",
      },
    ],
  },
};

export default nextConfig;
