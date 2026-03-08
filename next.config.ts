import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: {
    allowedDevOrigins: ["192.168.122.83", "localhost:3000"],
  },
};

export default nextConfig;
