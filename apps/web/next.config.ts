import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  transpilePackages: ["@artist-os/core", "@artist-os/db", "@artist-os/infrastructure", "@artist-os/ai"]
};

export default nextConfig;
