import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  experimental: {
    agentFeedback: true,
  },
  // Review-build flag (lib/content/status.ts), fixed at BUILD time for all
  // code — pages and proxy.ts alike — so a review build always shows its
  // drafts consistently however the server is started, and a normal build
  // can never expose them. Not sensitive: it is "true" or empty.
  env: {
    XENTRA_SHOW_DRAFTS: process.env.XENTRA_SHOW_DRAFTS === "true" ? "true" : "",
  },
  cacheComponents: true,
  partialPrefetching: true,
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
