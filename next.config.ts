import type { NextConfig } from "next";

/**
 * Cloudflare Pages serves static files only.
 * `output: "export"` makes `next build` write that site to `out/`.
 * Request-time rendering, Server Actions, middleware, and the default
 * image optimizer need a server, so they are not part of this setup.
 */
const nextConfig: NextConfig = {
  output: "export",
  images: {
    unoptimized: true,
  },
};

export default nextConfig;
