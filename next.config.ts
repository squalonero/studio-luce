import type { NextConfig } from "next";

/**
 * The app runs as a Cloudflare Worker through vinext.
 * `output: "export"` is intentionally absent: that mode writes static files
 * and does not produce the Worker bundle.
 * The default image optimizer needs a server this project does not configure,
 * so images stay unoptimized.
 */
const nextConfig: NextConfig = {
  images: {
    unoptimized: true,
  },
};

export default nextConfig;
