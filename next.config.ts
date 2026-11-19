import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: {
    // Tailwind output is small: inlining it removes a render-blocking request,
    // which matters most for first-time visitors on mobile connections.
    inlineCss: true,
  },
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
};

export default nextConfig;
