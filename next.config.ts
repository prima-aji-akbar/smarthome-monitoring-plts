import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async rewrites() {
    return [
      {
        source: '/dashboard',
        destination: '/views/dashboard',
      },
      {
        source: '/event-log',
        destination: '/views/event-log',
      },
      {
        source: '/logout',
        destination: '/views/logout',
      },
    ]
  },
};

export default nextConfig;
