import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  transpilePackages: ['three'],
  // Empty turbopack config to silence the warning
  // Next.js 16 uses Turbopack by default and Three.js works without special config
  turbopack: {},
};

export default nextConfig;
