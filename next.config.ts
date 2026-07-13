import type { NextConfig } from "next";
import { execSync } from "child_process";

const securityHeaders = [
  { key: "X-Frame-Options", value: "SAMEORIGIN" },
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=(self)" },
  { key: "Strict-Transport-Security", value: "max-age=63072000; includeSubDomains; preload" },
  { key: "X-DNS-Prefetch-Control", value: "on" },
];

const nextConfig: NextConfig = {
  output: "standalone",
  poweredByHeader: false,
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "images.unsplash.com" },
      { protocol: "https", hostname: "plus.unsplash.com" },
      { protocol: "https", hostname: "fopcwaffkdolqwuzjkzy.supabase.co" },
    ],
  },
  experimental: {
    serverActions: {
      allowedOrigins: ["localhost:3000", "hay-home.com", "www.hay-home.com"],
    },
  },
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          ...securityHeaders,
          { key: "Cache-Control", value: "no-store, no-cache, must-revalidate" },
          { key: "Pragma", value: "no-cache" },
          { key: "Expires", value: "0" },
          { key: "Vary", value: "*" },
          { key: "Surrogate-Control", value: "no-store" },
        ],
      },
      {
        source: "/_next/static/:path*",
        headers: [
          { key: "Cache-Control", value: "public, max-age=31536000, immutable" },
        ],
      },
    ];
  },
};

export default nextConfig;

export function generateBuildId(): string {
  const ts = Date.now().toString(36);
  try {
    const hash = execSync("git rev-parse --short HEAD").toString().trim();
    return `${ts}-${hash}`;
  } catch {
    return ts;
  }
}
